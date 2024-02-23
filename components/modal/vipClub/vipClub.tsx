import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { InfoCircle } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ElementType, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { api_getVipProgress, api_vipLevelSystem } from '@/api/vip';
import { useTranslation } from '@/base/config/i18next';
import { CookieKey } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { changeIsShowVipClubModal, changeIsShowVipLevelModal } from '@/base/redux/reducers/modal.reducer';
import Loader from '@/components/common/preloader/loader';

import CommonModal from '../commonModal/commonModal';
import styles from './index.module.scss';

type ModalVipClubProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

type bonusType = 'level_up' | 'monthly_cashback' | 'weekly_cashback';

type bonusDataType = {
  bonusType: bonusType;
  levelUpTotalPrizeAmountUsd: number;
  weeklyCashbackPercentage: null | number;
  monthlyCashbackPercentage: null | number;
};

type rankDataType = {
  name: string;
  startLevel: number;
  startLevelDes: string;
  endLevel: number;
  endLevelDes: string;
  bonuses: bonusDataType[];
};

export default function ModalVipClub({ show, onClose }: ModalVipClubProps) {
  const { t } = useTranslation('');
  const router = useRouter();
  const dispatch = useDispatch();
  const [vipData, setVipData] = useState({
    xp: 0,
    level: 0,
    name: '',
    remainingXp: 0,
    nextLevel: 0,
    nextName: '',
    nextXp: 0,
    nextLevelBonus: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRank, setSelectedRank] = useState<rankDataType>({
    name: '',
    startLevel: 0,
    startLevelDes: '',
    endLevel: 0,
    endLevelDes: '',
    bonuses: [],
  });
  const [rankList, setRankList] = useState<rankDataType[]>([]);
  const [currentRank, setCurrentRank] = useState<string>('');
  const dataMedal = [
    { img: '/img/bronze-medal.png', name: 'Bronze' },
    { img: '/img/silver-medal.png', name: 'Silver' },
    { img: '/img/gold-medal.png', name: 'Gold' },
    { img: '/img/platinum-medal.png', name: 'Platinum I' },
    { img: '/img/platinum-medal.png', name: 'Platinum II' },
    { img: '/img/diamond-medal.png', name: 'Diamond I' },
    { img: '/img/diamond-medal.png', name: 'Diamond II' },
    { img: '/img/diamond-medal.png', name: 'Diamond III' },
  ];

  const onOpenModalVipLevel = (level: number) => {
    CookiesStorage.setCookieData(CookieKey.level, String(level));
    dispatch(changeIsShowVipClubModal(false));
    dispatch(changeIsShowVipLevelModal(true));
  };

  const getVipData = async () => {
    try {
      setIsLoading(true);
      const [_resVipProgress, _resVipLevels] = await Promise.all([api_getVipProgress(), api_vipLevelSystem()]);
      const tempRankData: rankDataType[] = _resVipLevels.data?.levelSystem?.map((item: any) => ({
        name: item.medalName ?? '',
        startLevel: Number(item.startLevelNum ?? 0),
        startLevelDes: item.startLevel ?? '',
        endLevel: Number(item.endLevelNum ?? 0),
        endLevelDes: item.endLevel ?? '',
        bonuses: item.bonuses.map((bonus: any) => ({
          bonusType: bonus.bonusType ?? 'level_up',
          levelUpTotalPrizeAmountUsd: Number(bonus.levelUpTotalPrizeAmountUsd ?? 0),
          weeklyCashbackPercentage: Number(bonus.weeklyCashbackPercentage ?? 0),
          monthlyCashbackPercentage: Number(bonus.monthlyCashbackPercentage ?? 0),
        })),
      }));
      const currentLevel = _resVipProgress.data?.currentVipLevel ?? 1;

      setVipData({
        xp: _resVipProgress.data?.currentXp ?? 0,
        level: _resVipProgress.data?.currentVipLevel ?? 1,
        name: _resVipProgress.data?.currentVipName ?? '',
        remainingXp: _resVipProgress.data?.remainingXp ?? 0,
        nextLevel: _resVipProgress.data?.nextVipLevel ?? 0,
        nextName: _resVipProgress.data?.nextVipName ?? '',
        nextXp: _resVipProgress.data?.nextVipXp ?? 0,
        nextLevelBonus: Number(_resVipProgress.data?.nextLevelBonus ?? 0),
      });
      if (tempRankData.length > 0) {
        const userRank = tempRankData.find((item) => currentLevel >= item.startLevel && currentLevel <= item.endLevel);
        // if (userRank) {
        setSelectedRank(userRank ?? tempRankData[0]);
        setCurrentRank(userRank?.name.split(' ').at(0) || 'zero');
        // }
      }

      setRankList(tempRankData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
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

  // const selectLevel = (rank: string) => {
  //   const levelSelect = VIP_LEVEL_DATA.find((level) => level.rank === rank);
  //   setLevelData(levelSelect);
  // };

  const navigationVipPage = () => {
    dispatch(changeIsShowVipClubModal(false));
    router.push('/vip');
  };

  const percent = useMemo(() => {
    return Math.ceil((vipData.xp / (vipData.xp + vipData.remainingXp)) * 100);
  }, [vipData]);

  useEffect(() => {
    getVipData();
  }, []);

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="rounded"
        header={
          <div className="relative sm:px-[30px] px-[20px] sm:py-[30px] py-[25px] bg-white dark:bg-color-header-primary">
            <div className="absolute left-0 top-0 h-full w-full flex items-center justify-center">
              <Image src="/img/ribbon.png" width={353} height={48} alt="" />
            </div>
            <div className="relative text-[16px] text-black dark:text-white font-[600] text-center uppercase">
              {t('vipClub:vipClub')}
            </div>
          </div>
        }
      >
        <>
          <div className="flex flex-col gap-[30px] overflow-y-auto px-[20px] pt-[10px] pb-[40px] bg-color-light-bg-primary dark:bg-color-modal-bg-primary">
            <div className="dark:text-color-text-primary text-black text-[13px] text-center bg-white dark:bg-[#17191b] px-5 py-4">
              {t('vipClub:levelUpToGetExclusiveAccess')}{' '}
              <span
                role="button"
                onClick={() => onOpenModalVipLevel(vipData.level)}
                className="text-color-primary hover:opacity-[0.9] hover:underline"
              >
                {t('vipClub:viewLevelUpDetails')}
              </span>
            </div>
            <div className="md:flex justify-between gap-[25px]">
              <div
                className={cn(
                  'flex rounded-[8px] gap-[28px] pl-[28px] pb-5 pr-[30px] md:max-w-[440px] w-full mb-5 md:mb-0',
                  'bg-gradient-to-l ',
                  'border-solid border-2 border-transparent',
                  {
                    'from-[#47566A] border-[#47566A] border-l-0 dark:to-[#6F7F93] to-color-light-bg-primary':
                      currentRank === 'zero',
                    'from-[#e09a6a] border-[#e09a6a] border-l-0 dark:to-[#705F4B] to-color-light-bg-primary':
                      currentRank === 'Bronze',
                    'from-[#e1e1e1] border-[#e1e1e1] border-l-0 dark:to-[#BD9548] to-color-light-bg-primary':
                      currentRank === 'Silver',
                    'from-[#ffc329] border-[#ffc329] border-l-0 dark:to-[#E7C171] to-color-light-bg-primary':
                      currentRank === 'Gold',
                    'from-[#9d63f6] border-[#9d63f6] border-l-0 dark:to-[#8051B5] to-color-light-bg-primary':
                      currentRank === 'Platinum',
                    'from-[#dd80b3] border-[#dd80b3] border-l-0 dark:to-[#B56691] to-color-light-bg-primary':
                      currentRank === 'Diamond',
                  },
                )}
              >
                <div className="relative">
                  <Image
                    src={`/img/${currentRank === 'zero' ? '' : currentRank}.png`}
                    width={120}
                    height={138}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = '/img/vip.png';
                    }}
                  />
                  <div className="absolute flex justify-center left-0 top-0 w-full h-full">
                    <Image src="/img/light.svg" width={108} height={138} alt="" />
                  </div>
                  <div className="absolute h-full w-full left-0 top-0 flex items-center justify-center gap-1">
                    <div className="flex flex-col gap-0 justify-center text-center">
                      <div className="p-0 text-[12px] font-semibold mt-4">
                        {rankList.map((rank) =>
                          rank.startLevel - 1 < vipData.level && rank.endLevel + 1 > vipData.level ? rank.name : '',
                        )}
                      </div>
                      <div>
                        <span className="text-[18px] mr-[2px]">VIP</span>
                        <span className="text-[24px] font-semibold">{vipData.level}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-[12px] pt-[24px]">
                  <div className="text-[20px] text-white font-semibold">{t('vipClub:yourVipProgress')}</div>
                  <div className="flex items-center gap-[10px]">
                    <div className="text-[14px] text-white">{vipData.xp} XP</div>
                    <InfoCircle size={20} className="text-color-primary" data-tooltip-id={'your-vip-tooltip'} />
                    <Tooltip id={'your-vip-tooltip'} place="bottom" className="z-[10] !bg-white dark:!bg-black">
                      <div className="dark:text-color-text-primary text-color-light-text-primary">
                        <p>{t('vipClub:yourTip1')}</p>
                        <p>{t('vipClub:yourTip2')}</p>
                      </div>
                    </Tooltip>
                  </div>
                  <div className="bg-white rounded-[5px] h-[14px] relative overflow-hidden">
                    <div
                      className={cn('absolute top-0 h-full left-0', {
                        'bg-[#47566A]': currentRank === 'zero',
                        'bg-[#e48241]': currentRank === 'Bronze',
                        'bg-[#e1e1e1]': currentRank === 'Silver',
                        'bg-[#ffc329]': currentRank === 'Gold',
                        'bg-[#9d63f6]': currentRank === 'Platinum',
                        'bg-[#dd80b3]': currentRank === 'Diamond',
                      })}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <div className="text-[14px] text-white">
                    {vipData.remainingXp} XP {t('vipClub:until')} {vipData.nextName}
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-color-panel-bg-primary rounded-[8px] relative flex-1 w-full">
                <div
                  className={cn(
                    'text-[12px] text-white w-fit px-[14px] bg-contain bg-no-repeat text-center !h-[24px] p-[4px] top-[10px]',
                    styles.rank,
                    'dark:after:!border-r-color-panel-bg-primary after:!border-r-white',
                    {
                      'bg-[#47566A]': currentRank === 'zero',
                      'bg-[#e09a6a]': currentRank === 'Bronze',
                      'bg-[#e1e1e1] text-black': currentRank === 'Silver',
                      'bg-[#ffc329]': currentRank === 'Gold',
                      'bg-[#9d63f6]': currentRank === 'Platinum',
                      'bg-[#dd80b3]': currentRank === 'Diamond',
                    },
                  )}
                >
                  {t('vipClub:vipHost')}
                </div>
                <InfoCircle
                  size={20}
                  className="text-color-primary absolute top-[9px] right-[10px]"
                  data-tooltip-id={'vip-host-tooltip'}
                />
                <Tooltip id={'vip-host-tooltip'} place="bottom" className="!bg-white dark:!bg-black">
                  <div className="dark:text-color-text-primary text-color-light-text-primary max-w-[380px]">
                    <p>{t('vipClub:vipHotToolTip')}</p>
                  </div>
                </Tooltip>
                <div className="flex flex-col gap-[10px] items-center mt-5 px-[30px] pb-5 md:pb-0">
                  <div>
                    <Image src={'/img/img-vip-host.png'} width={107} height={30} alt="" />
                  </div>
                  <div className="text-color-text-primary text-[14px]">{t('vipClub:unlockYourExclusiveVip')}</div>
                  <div className="text-[14px] text-color-text-primary">
                    {t('vipClub:hostAt')} <span className="dark:text-white text-black font-bold">VIP 38</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 dark:bg-color-card-bg-primary bg-white">
              <div className="dark:text-color-text-primary text-black text-[14px] text-center mb-4 bg-white dark:bg-color-card-bg-primary">
                {t('vipClub:discoverTheUltimateGamingExperience')}
              </div>
              <div className={`flex justify-between gap-1 overflow-x-auto scrollbar`}>
                {rankList.map((item, index) => (
                  <div
                    className={cn(
                      'flex flex-col items-center w-[87px] dark:hover:bg-color-hover-primary min-w-fit cursor-pointer border-none pt-[18px] pb-[15px] px-[15px] bg-transparent',
                      {
                        'dark:!bg-color-header-secondary !bg-color-light-bg-primary': item.name === selectedRank.name,
                      },
                      styles.rank_text,
                    )}
                    key={index}
                    onClick={() => setSelectedRank(item)}
                  >
                    <div className="relative">
                      <Image
                        src={dataMedal.find((medal) => medal.name === item.name)?.img || '/img/bronze-medal.png'}
                        width={40}
                        height={40}
                        alt=""
                        className={cn({
                          'opacity-100': selectedRank.startLevel === item.startLevel,
                          'opacity-30': selectedRank.startLevel !== item.startLevel,
                        })}
                        onError={(e) => {
                          e.currentTarget.src = '/img/bronze-medal.png';
                        }}
                      />
                      {vipData.level >= item.startLevel && vipData.level <= item.endLevel && (
                        <div className="absolute w-5 h-5 -right-1 -top-1 bg-green-700 rounded-full text-white">
                          <CheckIcon width={14} height={10} className="stroke-[5] my-[5px] mx-[3px]" />
                        </div>
                      )}
                    </div>
                    <div
                      className={cn(`text-[12px] font-semibold mt-[8px]`, {
                        'text-[#e09a6a]':
                          item.name === selectedRank.name &&
                          (item.name.split(' ').at(0) || '').toLowerCase() === 'bronze',
                        'dark:text-[#e1e1e1] text-black':
                          item.name === selectedRank.name &&
                          (item.name.split(' ').at(0) || '').toLowerCase() === 'silver',
                        'text-[#ffc329]':
                          item.name === selectedRank.name &&
                          (item.name.split(' ').at(0) || '').toLowerCase() === 'gold',
                        'text-[#9d63f6]':
                          item.name === selectedRank.name &&
                          (item.name.split(' ').at(0) || '').toLowerCase() === 'platinum',
                        'text-[#dd80b3]':
                          item.name === selectedRank.name &&
                          (item.name.split(' ').at(0) || '').toLowerCase() === 'diamond',
                      })}
                    >
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
              <div className="py-4 px-[10px] bg-color-light-bg-primary dark:bg-color-card-body-primary min-h-[17.5rem]">
                {isLoading && <Loader />}
                {!isLoading && (
                  <>
                    <div className="flex gap-[10px] items-center">
                      <div className="text-[13px] h-[24px] dark:text-black text-white bg-contain bg-no-repeat text-center">
                        <div
                          className={cn(
                            styles[getColorBg(String(selectedRank.name))],
                            styles.rank,
                            'flex items-center !h-[24px] pr-3 pl-[6px] dark:after:!border-r-color-card-body-primary after:!border-r-color-light-bg-primary',
                            {
                              'text-black': (selectedRank.name.split(' ').at(0) || '').toLowerCase() === 'silver',
                            },
                          )}
                        >
                          {selectedRank.name}
                        </div>
                      </div>
                      <div className="dark:text-color-text-primary text-color-light-text-primary text-[13px]">{`${selectedRank.startLevelDes}-${selectedRank.endLevelDes}`}</div>
                    </div>
                    <div className="mt-[18px] grid sm:grid-cols-2 grid-cols-1 gap-4">
                      {selectedRank.bonuses.map((bonus) => {
                        const type = bonus.bonusType;

                        return (
                          <>
                            {type === 'level_up' && (
                              <div
                                className="bg-color-light-bg-primary dark:bg-[#24262B] flex gap-[16px] p-3 dark:border-color-border-primary border-color-light-border-primary border border-solid items-center rounded-[4px]"
                                role="button"
                              >
                                <div className="rounded-full w-[70px] h-[70px] flex items-center justify-center flex-none bg-[#2D3035] border border-solid dark:border-color-border-primary border-color-light-border-primary">
                                  <Image src={'/img/lock.png'} width={62} height={62} alt="" />
                                </div>
                                <div className="flex flex-col gap-[6px]">
                                  <div className="text-[14px] text-black dark:text-white font-bold ">
                                    {t('vipClub:levelUpBonus')}
                                  </div>
                                  <div className="text-color-text-primary text-[12px]">
                                    {t('vipClub:totalPrize')}:{' '}
                                    <span className="text-[#efc94c] font-semibold">
                                      {bonus.levelUpTotalPrizeAmountUsd} USDT
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                            {type === 'weekly_cashback' && (
                              <div
                                className="bg-color-light-bg-primary dark:bg-[#24262B] flex gap-[16px] p-3 dark:border-color-border-primary border-color-light-border-primary border border-solid items-center rounded-[4px]"
                                role="button"
                              >
                                <div className="rounded-full w-[70px] h-[70px] flex items-center justify-center flex-none bg-[#2D3035] border border-solid dark:border-color-border-primary border-color-light-border-primary">
                                  <Image src={'/img/lock.png'} width={62} height={62} alt="" />
                                </div>
                                <div className="flex flex-col gap-[6px]">
                                  <div className="text-[14px] text-black dark:text-white font-bold ">
                                    {t('vipClub:weeklyCashback')}
                                  </div>
                                  <div
                                    className="text-color-text-primary text-[12px]"
                                    dangerouslySetInnerHTML={{
                                      __html: t('vipClub:weeklyCashbackContent', {
                                        weeklyCashback: `Wager*1%*${bonus.weeklyCashbackPercentage}%`,
                                      }),
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )}
                            {type === 'monthly_cashback' && (
                              <div
                                className="bg-color-light-bg-primary dark:bg-[#24262B] flex gap-[16px] p-3 dark:border-color-border-primary border-color-light-border-primary border border-solid items-center rounded-[4px]"
                                role="button"
                              >
                                <div className="rounded-full w-[70px] h-[70px] flex items-center justify-center flex-none bg-[#2D3035] border border-solid dark:border-color-border-primary border-color-light-border-primary">
                                  <Image src={'/img/lock.png'} width={62} height={62} alt="" />
                                </div>
                                <div className="flex flex-col gap-[6px]">
                                  <div className="text-[14px] text-black dark:text-white font-bold ">
                                    {t('vipClub:monthlyCashback')}
                                  </div>
                                  <div
                                    className="text-color-text-primary text-[12px]"
                                    dangerouslySetInnerHTML={{
                                      __html: t('vipClub:monthlyCashbackContent', {
                                        monthlyCashback: `Wager*1%*${bonus.monthlyCashbackPercentage}%`,
                                      }),
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div
              onClick={navigationVipPage}
              className="flex justify-center w-full items-center cursor-pointer text-[14px] text-color-primary font-semibold dark:border-color-border-primary border-color-light-border-primary border border-solid p-[10px]"
            >
              {t('vipClub:learnMore')}
            </div>
          </div>
        </>
      </CommonModal>
    </>
  );
}
