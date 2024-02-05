import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowLeft2 } from 'iconsax-react';
import Image from 'next/image';
import { ElementType, useEffect, useMemo, useState } from 'react';

import api from '@/api/api';
import { api_vipLevelSystem } from '@/api/vip';
import { useTranslation } from '@/base/config/i18next';
import { CookieKey } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { RankDetail } from '@/base/types/common';
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
      const res = await api_vipLevelSystem();
      const tempRankDatas = res?.data.levelUpDetails.map((item: any) => ({
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
      setRankList(tempRankDatas);
      if (tempRankDatas.length > 0) {
        setLevelCurrent(tempRankDatas[0]);
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

  const getColorBg = (rank: string) => {
    let className = '';
    switch (!!rank) {
      case rank.includes('Bronze'):
        className = 'bronze';
        break;
      case rank.includes('Silver'):
        className = 'silver';
        break;
      case rank.includes('Gold'):
        className = 'gold';
        break;
      case rank.includes('Platinum'):
        className = 'platinum';
        break;
      default:
        className = 'diamond';
        break;
    }
    return className;
  };

  const vipColumns = useMemo(() => {
    const wagerColumnsDefault: ColumnDef<RankDetail>[] = [
      {
        accessorKey: 'level',
        header: () => <div className="text-left pr-6 text-[14px] font-normal">{t('vipClub:level')}</div>,
        cell: ({ row }) => (
          <div className="dark:text-color-text-primary text-color-light-text-primary truncate flex items-center gap-2 sm:px-2 p-[5px]">
            <Image height={18} width={16} src={`/img/${getLinkImage(row?.original?.rank)}.png`} alt="" />
            <span className="dark:text-color-text-primary text-color-light-text-primary text-[14px]">
              {row?.original?.type} {row?.original?.level}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'xp',
        header: () => (
          <div className="text-center dark:text-color-text-primary text-color-light-text-primary pl-6 text-[14px] font-normal">
            {t('vipClub:requiredXP')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-[14px] text-center dark:text-color-text-primary text-color-light-text-primary truncate sm:px-2 p-[5px]">
            {row?.original?.xp}
          </div>
        ),
      },
      {
        accessorKey: 'levelUpBonus',
        header: () => (
          <div className="text-right dark:text-color-text-primary text-color-light-text-primary text-[14px] font-normal">
            {t('vipClub:levelUpBonus')} (USDT)
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-[14px] dark:text-white text-[#000] truncate text-right sm:px-2 p-[5px]">
            {row.original.levelUpBonus}
          </div>
        ),
      },
    ];
    return wagerColumnsDefault;
  }, [t]);

  useEffect(() => {
    getRankList();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
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
          {rankList.map((item, index) => (
            <div key={index}>
              <Disclosure defaultOpen={item.name === levelCurrent.name}>
                {({ open }) => (
                  <div className="w-full dark:bg-color-card-bg-primary bg-color-light-bg-primary">
                    <Disclosure.Button className="py-2 w-full flex h-[40px] justify-between">
                      <div className="font-semibold text-[14px] flex gap-2 items-center">
                        <div className={cn(styles[getColorBg(String(item.name))], styles.rank)}></div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{item.name}</span>
                          <span className="font-semibold">{`${item.startLevelDes}-${item.endLevelDes}`}</span>
                        </div>
                      </div>
                      <div className="pr-3">
                        <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
                      </div>
                    </Disclosure.Button>
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100 w-full"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100 w-full"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel className={'flex flex-col gap-[20px] w-full'}>
                        <div>
                          <RankingTableComponent
                            containerClassName="w-full dark:bg-color-card-bg-primary bg-white"
                            data={item.levels}
                            columns={vipColumns}
                          />
                        </div>
                      </Disclosure.Panel>
                    </Transition>
                  </div>
                )}
              </Disclosure>
            </div>
          ))}
        </div>
      </CommonModal>
    </>
  );
}
