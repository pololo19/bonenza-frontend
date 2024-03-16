import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowLeft2 } from 'iconsax-react';
import Image from 'next/image';
import { ElementType, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_getVipProgress, api_vipLevelSystem } from '@/api/vip';
import { useTranslation } from '@/base/config/i18next';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';
import RankingTableComponent from '@/components/table/rankingTable';

import CommonModal from '../commonModal/commonModal';
import styles from './index.module.scss';

type ModalVipLevelProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

type levelDataType = {
  rank: string;
  level: number;
  name: string;
  xp: number;
  levelUpBonus: number;
};

type rankUpType = {
  name: string;
  startLevel: number;
  endLevel: number;
  startLevelDes: string;
  endLevelDes: string;
  levels: levelDataType[];
};

export default function ModalVipLevel({ show, onClose }: ModalVipLevelProps) {
  const { t } = useTranslation('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rankList, setRankList] = useState<rankUpType[]>([]);
  const { isLogin } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );
  const [levelCurrent, setLevelCurrent] = useState<rankUpType>({
    name: '',
    startLevel: 0,
    endLevel: 0,
    startLevelDes: '',
    endLevelDes: '',
    levels: [],
  });

  const getRankList = async () => {
    try {
      setIsLoading(true);
      const [_resVipProgress] = await Promise.all([api_getVipProgress(), api_vipLevelSystem()]);
      const _res = await api_vipLevelSystem();
      const tempRankDatas:rankUpType[] = _res?.data.levelUpDetails.map((item: any) => ({
        name: item.medalName ?? '',
        startLevel: Number(item.startLevelNum ?? 0),
        endLevel: Number(item.endLevelNum ?? 0),
        startLevelDes: item.startLevel ?? '',
        endLevelDes: item.endLevel ?? '',
        levels: item.levels.map((level: any) => ({
          rank: item.medalName ?? '',
          level: level.level,
          name: level.name,
          xp: level.requiredXp,
          levelUpBonus: level.levelUpBonus,
        })),
      }));
      const currentLevel = Number(_resVipProgress.data?.currentVipLevel || 0);
      setRankList(tempRankDatas);
      if (tempRankDatas.length > 0) {
        const userRank = tempRankDatas.find((item) => currentLevel >= item.startLevel && currentLevel <= item.endLevel);
        setLevelCurrent(userRank ?? tempRankDatas[0]);
      }
    } catch (error) {
      setRankList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLinkImage = (rank?: string) => {
    return rank?.split(' ')[0];
  };

  const dataMedal = [
    { img: '/img/bronze-medal.png', name: 'Bronze' },
    { img: '/img/silver-medal.png', name: 'Silver' },
    { img: '/img/gold-medal.png', name: 'Gold' },
    { img: '/img/platinum1-medal.png', name: 'Platinum I' },
    { img: '/img/platinum2-medal.png', name: 'Platinum II' },
    { img: '/img/diamond1-medal.png', name: 'Diamond I' },
    { img: '/img/diamond2-medal.png', name: 'Diamond II' },
    { img: '/img/diamond3-medal.png', name: 'Diamond III' },
  ];

  const vipColumns = useMemo(() => {
    const wagerColumnsDefault: ColumnDef<levelDataType>[] = [
      {
        accessorKey: 'level',
        
        header: () => <div className="text-left pl-2 text-[12px] sm:text-[14px] font-normal">{t('vipClub:level')}</div>,
        cell: ({ row }) => (
          <div className="dark:text-color-text-primary text-color-light-text-primary truncate flex items-center gap-2 sm:px-2 p-[5px]">
            <Image height={18} width={16} src={dataMedal.find((item) => item.name === row?.original?.rank)?.img || "/img/bronze-medal.png"} alt="" />
            <div className="dark:text-color-text-primary text-color-light-text-primary text-[12px] sm:text-[14px] pl-2 min-w-[80px]">
              {row?.original?.name}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'xp',
        header: () => (
          <div className="text-center dark:text-color-text-primary text-color-light-text-primary text-[12px] sm:text-[14px] font-normal">
            {t('vipClub:requiredXP')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-[12px] sm:text-[14px] text-center dark:text-color-text-primary text-color-light-text-primary truncate sm:px-2 p-[5px]">
            {row?.original?.xp}
          </div>
        ),
      },
      {
        accessorKey: 'levelUpBonus',
        header: () => (
          <div className="text-right dark:text-color-text-primary text-color-light-text-primary text-[12px] sm:text-[14px] font-normal pr-2">
            {t('vipClub:levelUpBonus')} (USDT)
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-[12px] sm:text-[14px] dark:text-white text-[#000] truncate text-right sm:px-2 p-[5px] pr-2">
            {row.original.levelUpBonus}
          </div>
        ),
      },
    ];
    return wagerColumnsDefault;
  }, [t]);

  useEffect(() => {
    if (isLogin && show) {
      getRankList();
    }
  }, [isLogin, show]);

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="rounded"
        header={
          <div className="relative px-[20px] py-[18px] bg-white dark:bg-color-header-primary">
            <div>
              <div className="text-black dark:text-white md:text-[18px] text-[16px] font-bold flex items-center gap-[10px] cursor-pointer">
                <ArrowLeft2
                  className="w-[16px] dark:text-color-text-primary text-color-light-text-primary stroke-4"
                  onClick={onClose}
                />
                <div className="text-[16px]">{t('vipClub:VIPLevelSystem')}</div>
              </div>
            </div>
          </div>
        }
      >
        <div className="flex max-sm:flex-1 flex-col gap-3 overflow-y-auto px-[20px] pt-[10px] pb-[30px] bg-white dark:bg-color-header-primary">
          {isLoading && <Loader />}
          <div className={`flex justify-center gap-1 overflow-x-auto scrollbar min-h-[100px]`}>
            {rankList.map((item, index) => (
              <div
                className={cn(
                  'relative flex flex-col justify-between items-center w-[87px] min-w-fit cursor-pointer border-none pb-[15px] px-[10px] bg-transparent',
                  styles.rank_text,
                )}
                key={index}
                onClick={() => setLevelCurrent(item)}
              >
                <Image
                  src={dataMedal.find((medal) => medal.name === item.name)?.img || '/img/vip.png'}
                  width={50}
                  height={50}
                  alt=""
                  className={cn({
                    'w-[35px] h-[35px] md:w-[50px] md:h-[50px]': true,
                    'opacity-100': levelCurrent.startLevel === item.startLevel,
                    'opacity-30': levelCurrent.startLevel !== item.startLevel,
                  })}
                  onError={(e) => {
                    e.currentTarget.src = '/img/vip.png';
                  }}
                />
                {levelCurrent.startLevel === item.startLevel && (
                  <Image
                    src="/img/selected-medal.png"
                    width={50}
                    height={50}
                    alt=""
                    className="absolute left-0 right-0 -bottom-0 w-full h-full"
                  />
                )}
                <div className="text-white text-[12px] font-semibold">{item.name}</div>
              </div>
            ))}
          </div>
          <RankingTableComponent
            containerClassName="w-full pt-0"
            data={levelCurrent.levels}
            columns={vipColumns}
          />
        </div>
      </CommonModal>
    </>
  );
}
