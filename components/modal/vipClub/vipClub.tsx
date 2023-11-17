import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { ElementType, useEffect, useState, useMemo } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import { useTranslation } from '@/base/config/i18next';
import { InfoCircle } from 'iconsax-react';
import CommonModal from '../commonModal/commonModal';
import { changeIsShowVipClubModal, changeIsShowVipLevelModal } from '@/base/redux/reducers/modal.reducer';
import api from '@/api/api';
import { Tooltip } from 'react-tooltip';
import { CookieKey, VIP_LEVEL_DATA } from '@/base/constants/common';
import styles from './index.module.scss';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import Loader from '@/components/common/preloader/loader';

type ModalVipClubProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalVipClub({ show, onClose }: ModalVipClubProps) {
  const { t } = useTranslation('');
  const router = useRouter();
  const dispatch = useDispatch();
  const [vipData, setVipData] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [levelData, setLevelData] = useState<any>(VIP_LEVEL_DATA[0]);
  const [rankList, setRankList] = useState<any[]>([]);

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

  const getVipListByRank = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('user-profile/get-vip');
      const levelCurrent = VIP_LEVEL_DATA.find((level) => level.rank === res?.data?.vipCurrent?.rank);
      if (levelCurrent) {
        setLevelData(levelCurrent);
      }
      setVipData(res?.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getRankList = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('vip/get-rank-list');
      setRankList(res?.data.data);
    } catch (error) {
      setRankList([]);
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

  const selectLevel = (rank: string) => {
    const levelSelect = VIP_LEVEL_DATA.find((level) => level.rank === rank);
    setLevelData(levelSelect);
  };

  const navigationVipPage = () => {
    dispatch(changeIsShowVipClubModal(false));
    router.push('/vip');
  };

  const getTotalPrice = (id: number) => {
    const rank = rankList.find((item) => item.id === id);
    return rank?.totalLevelUpBonus;
  };

  const percent = useMemo(() => {
    return Math.ceil((vipData.totalXp / (vipData.totalXp + vipData.xpNextLevel)) * 100);
  }, [vipData]);

  useEffect(() => {
    getVipListByRank();
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
          <div className="relative sm:px-[30px] px-[20px] sm:py-[30px] py-[25px] bg-white dark:bg-[#17191b]">
            <div className="absolute left-0 top-0 h-full w-full flex items-center justify-center">
              <Image src="/img/ribbon.png" width={353} height={48} alt="" />
            </div>
            <div className="relative text-[16px] text-black dark:text-white font-[600] text-center uppercase">
              {t('vipClub:vipClub')}
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-[30px] overflow-y-auto px-[20px] pt-[10px] pb-[40px] bg-[#f6f7fa] dark:bg-[#24262B]">
          <div className="text-[#939699] text-[13px] text-center bg-white dark:bg-[#17191b] px-5 py-4">
            {t('vipClub:levelUpToGetExclusiveAccess')}{' '}
            <span
              role="button"
              onClick={() => onOpenModalVipLevel(vipData?.vipCurrent?.level)}
              className="text-[#0DFDE4] hover:opacity-[0.9] hover:underline"
            >
              {t('vipClub:viewLevelUpDetails')}
            </span>
          </div>
          <div className="md:flex justify-between gap-[25px]">
            <div className="flex bg-[#47566A] rounded-[8px] gap-[28px] pl-[28px] pb-5 pr-[30px] md:max-w-[440px] w-full mb-5 md:mb-0">
              <div className="relative">
                <Image
                  src={`/img/${vipData?.vipCurrent?.medal}.png`}
                  onError={(e) => {
                    e.currentTarget.src = `/img/vip.png`;
                  }}
                  width={120}
                  height={138}
                  alt=""
                />
                <div className="absolute flex justify-center left-0 top-0 w-full h-full">
                  <Image src="/img/light.svg" width={108} height={138} alt="" />
                </div>
                <div className="absolute h-full w-full left-0 top-0 flex items-center justify-center gap-1">
                  <span className="text-[14px]">{vipData?.vipCurrent?.type}</span>
                  <span className="text-[20px] font-semibold">{vipData?.vipCurrent?.level}</span>
                </div>
              </div>
              <div className="flex flex-col gap-[12px] pt-[24px]">
                <div className="text-[20px] text-white font-semibold">{t('vipClub:yourVipProgress')}</div>
                <div className="flex items-center gap-[10px]">
                  <div className="text-[14px] text-white">{vipData?.totalXp} XP</div>
                  <InfoCircle size={20} className="text-[#0DFDE4]" data-tooltip-id={'your-vip-tooltip'} />
                  <Tooltip id={'your-vip-tooltip'} place="bottom" className="z-[10]">
                    <div className="dark:text-[#98a7b5] text-[#31373d]">
                      <p>{t('vipClub:yourTip1')}</p>
                      <p>{t('vipClub:yourTip2')}</p>
                    </div>
                  </Tooltip>
                </div>
                <div className="bg-white rounded-[10px] h-[14px] relative overflow-hidden">
                  <div className="absolute top-0 h-full bg-[#8098b6] left-0" style={{ width: `${percent}%` }}></div>
                </div>
                <div className="text-[14px] text-white">
                  {vipData?.xpNextLevel} XP {t('vipClub:until')} {vipData.nextLevel}
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#12181F] rounded-[8px] relative flex-1 w-full">
              <div className="bg-[url('/img/bg-vip-host.png')] text-[10px] text-white w-[90px] bg-contain bg-no-repeat text-center h-[24px] p-[4px]">
                {t('vipClub:vipHost')}
              </div>
              <InfoCircle
                size={20}
                className="text-[#0DFDE4] absolute top-[9px] right-[10px]"
                data-tooltip-id={'vip-host-tooltip'}
              />
              <Tooltip id={'vip-host-tooltip'} place="bottom">
                <div className="dark:text-[#98a7b5] text-[#31373d] max-w-[380px]">
                  <p>{t('vipClub:vipHotToolTip')}</p>
                </div>
              </Tooltip>
              <div className="flex flex-col gap-[10px] items-center mt-5 px-[30px] pb-5 md:pb-0">
                <div>
                  <Image src={'/img/img-vip-host.png'} width={107} height={30} alt="" />
                </div>
                <div className="text-[#939699] text-[14px]">{t('vipClub:unlockYourExclusiveVip')}</div>
                <div className="text-[14px] text-[#939699]">
                  {t('vipClub:hostAt')} <span className="text-white font-bold">VIP 38</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 dark:bg-[#17191b]">
            <div className="text-[#939699] text-[14px] text-center mb-4 bg-white dark:bg-[#17191b]">
              {t('vipClub:discoverTheUltimateGamingExperience')}
            </div>
            <div className={`flex justify-between gap-1 overflow-x-auto scrollbar`}>
              {dataMedal.map((item, index) => (
                <div
                  className={`${
                    item.name === levelData?.rank ? 'dark:bg-[#24262B]' : ''
                  } flex flex-col items-center w-[87px] dark:hover:bg-[#24262B] min-w-fit cursor-pointer border-none pt-[18px] pb-[15px] bg-white dark:bg-[#17191b]`}
                  key={index}
                  onClick={() => selectLevel(item.name)}
                >
                  <Image src={item.img} width={40} height={40} alt="" />
                  <div
                    className={`text-[12px] mt-[8px] ${item.name === 'Bronze' ? 'text-[#E09A6A]' : 'text-[#939699]'}`}
                  >
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
            <div className="py-4 px-[10px] bg-white dark:bg-[#24262B] min-h-[17.5rem]">
              <div className="flex gap-[10px] items-center">
                <div className="text-[13px] h-[24px] text-black bg-contain bg-no-repeat text-center">
                  <div
                    className={cn(
                      styles[getColorBg(String(levelData?.rank))],
                      styles.rank,
                      'pr-3 pl-[6px] font-semibold',
                    )}
                  >
                    {levelData?.rank}
                  </div>
                </div>
                <div className="dark:text-[#939699] text-[#31373d] text-[13px]">{levelData?.level}</div>
                <div className="dark:text-[#939699] text-[#31373d] text-[13px]">{levelData?.description}</div>
              </div>
              <div className="mt-[18px] grid sm:grid-cols-2 grid-cols-1 gap-4">
                <div
                  className="bg-[#F6F7FA] dark:bg-[#24262B] flex gap-[16px] p-3 border-[#42454966] border border-solid items-center rounded-[4px]"
                  role="button"
                >
                  <div className="rounded-full w-[70px] h-[70px] flex items-center justify-center flex-none bg-[#2D3035] border border-solid border-[#42454966]">
                    <Image src={'/img/lock.png'} width={62} height={62} alt="" />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <div className="text-[14px] text-black dark:text-white font-bold ">{t('vipClub:levelUpBonus')}</div>
                    <div className="text-[#939699] text-[12px]">
                      {t('vipClub:totalPrize')}:{' '}
                      <span className="text-[#efc94c] font-semibold">{getTotalPrice(Number(levelData?.id))} USDT</span>
                    </div>
                  </div>
                </div>
                {levelData?.id == 2 && (
                  <div
                    className="bg-[#F6F7FA] dark:bg-[#24262B] flex gap-[16px] p-3 border-[#42454966] border border-solid items-center rounded-[4px]"
                    role="button"
                  >
                    <div className="rounded-full w-[70px] h-[70px] flex items-center justify-center flex-none bg-[#2D3035] border border-solid border-[#42454966]">
                      <Image src={'/img/lock.png'} width={62} height={62} alt="" />
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <div className="text-[14px] text-black dark:text-white font-bold ">{t('vipClub:Tips')}</div>
                      <div className="text-[#939699] text-[12px]">{t('vipClub:tipContent')}</div>
                    </div>
                  </div>
                )}
                {levelData?.id == 1 && (
                  <>
                    <div
                      className="bg-[#F6F7FA] dark:bg-[#24262B] flex gap-[16px] p-3 border-[#42454966] border border-solid items-center rounded-[4px]"
                      role="button"
                    >
                      <div className="rounded-full w-[70px] h-[70px] flex items-center justify-center flex-none bg-[#2D3035] border border-solid border-[#42454966]">
                        <Image src={'/img/lock.png'} width={62} height={62} alt="" />
                      </div>
                      <div className="flex flex-col gap-[6px]">
                        <div className="text-[14px] text-black dark:text-white font-bold ">{t('vipClub:raining')}</div>
                        <div className="text-[#939699] text-[12px]">{t('vipClub:rainAlgorithmRewards')}</div>
                      </div>
                    </div>
                    <div
                      className="bg-[#F6F7FA] dark:bg-[#24262B] flex gap-[16px] p-3 border-[#42454966] border border-solid items-center rounded-[4px]"
                      role="button"
                    >
                      <div className="rounded-full w-[70px] h-[70px] flex items-center justify-center flex-none bg-[#2D3035] border border-solid border-[#42454966]">
                        <Image src={'/img/lock.png'} width={62} height={62} alt="" />
                      </div>
                      <div className="flex flex-col gap-[6px]">
                        <div className="text-[14px] text-black dark:text-white font-bold ">
                          {t('vipClub:coinDrops')}
                        </div>
                        <div className="text-[#939699] text-[12px]">{t('vipClub:createACoinDrop')}</div>
                      </div>
                    </div>
                  </>
                )}
                {levelData?.id != 1 && levelData?.id != 2 && (
                  <>
                    <div
                      className="bg-[#F6F7FA] dark:bg-[#24262B] flex gap-[16px] p-3 border-[#42454966] border border-solid items-center rounded-[4px]"
                      role="button"
                    >
                      <div className="rounded-full w-[70px] h-[70px] flex items-center justify-center flex-none bg-[#2D3035] border border-solid border-[#42454966]">
                        <Image src={'/img/lock.png'} width={62} height={62} alt="" />
                      </div>
                      <div className="flex flex-col gap-[6px]">
                        <div className="text-[14px] text-black dark:text-white font-bold ">{t('vipClub:Recharge')}</div>
                        <div
                          className="text-[#939699] text-[12px]"
                          dangerouslySetInnerHTML={{
                            __html: t('vipClub:rechargeContent', {
                              recharge: levelData?.recharge,
                            }),
                          }}
                        ></div>
                      </div>
                    </div>
                    <div
                      className="bg-[#F6F7FA] dark:bg-[#24262B] flex gap-[16px] p-3 border-[#42454966] border border-solid items-center rounded-[4px]"
                      role="button"
                    >
                      <div className="rounded-full w-[70px] h-[70px] flex items-center justify-center flex-none bg-[#2D3035] border border-solid border-[#42454966]">
                        <Image src={'/img/lock.png'} width={62} height={62} alt="" />
                      </div>
                      <div className="flex flex-col gap-[6px]">
                        <div className="text-[14px] text-black dark:text-white font-bold ">
                          {t('vipClub:weeklyCashback')}
                        </div>
                        <div
                          className="text-[#939699] text-[12px]"
                          dangerouslySetInnerHTML={{
                            __html: t('vipClub:weeklyCashbackContent', {
                              weeklyCashback: levelData?.weeklyCashback,
                            }),
                          }}
                        ></div>
                      </div>
                    </div>
                    <div
                      className="bg-[#F6F7FA] dark:bg-[#24262B] flex gap-[16px] p-3 border-[#42454966] border border-solid items-center rounded-[4px]"
                      role="button"
                    >
                      <div className="rounded-full w-[70px] h-[70px] flex items-center justify-center flex-none bg-[#2D3035] border border-solid border-[#42454966]">
                        <Image src={'/img/lock.png'} width={62} height={62} alt="" />
                      </div>
                      <div className="flex flex-col gap-[6px]">
                        <div className="text-[14px] text-black dark:text-white font-bold ">
                          {t('vipClub:monthlyCashback')}
                        </div>
                        <div
                          className="text-[#939699] text-[12px]"
                          dangerouslySetInnerHTML={{
                            __html: t('vipClub:monthlyCashbackContent', {
                              monthlyCashback: levelData?.monthlyCashback,
                            }),
                          }}
                        ></div>
                      </div>
                    </div>
                    <div
                      className="bg-[#F6F7FA] dark:bg-[#24262B] flex gap-[16px] p-3 border-[#42454966] border border-solid items-center rounded-[4px]"
                      role="button"
                    >
                      <div className="rounded-full w-[70px] h-[70px] flex items-center justify-center flex-none bg-[#2D3035] border border-solid border-[#42454966]">
                        <Image src={'/img/lock.png'} width={62} height={62} alt="" />
                      </div>
                      <div className="flex flex-col gap-[6px]">
                        <div className="text-[14px] text-black dark:text-white font-bold ">
                          {t('vipClub:sportsWeeklyBonus')}
                        </div>
                        <div className="text-[#939699] text-[12px]">{t('vipClub:sportsWeeklyBonusContent')}</div>
                      </div>
                    </div>
                  </>
                )}
                {levelData?.rank.includes('Platinum') && (
                  <>
                    <div
                      className="bg-[#F6F7FA] dark:bg-[#24262B] flex gap-[16px] p-3 border-[#42454966] border border-solid items-center rounded-[4px]"
                      role="button"
                    >
                      <div className="rounded-full w-[70px] h-[70px] flex items-center justify-center flex-none bg-[#2D3035] border border-solid border-[#42454966]">
                        <Image src={'/img/lock.png'} width={62} height={62} alt="" />
                      </div>
                      <div className="flex flex-col gap-[6px]">
                        <div className="text-[14px] text-black dark:text-white font-bold ">{t('vipClub:vipHost')}</div>
                        <div className="text-[#939699] text-[12px]">{t('vipClub:vipHostContent')}</div>
                      </div>
                    </div>
                    <div
                      className="bg-[#F6F7FA] dark:bg-[#24262B] flex gap-[16px] p-3 border-[#42454966] border border-solid items-center rounded-[4px]"
                      role="button"
                    >
                      <div className="rounded-full w-[70px] h-[70px] flex items-center justify-center flex-none bg-[#2D3035] border border-solid border-[#42454966]">
                        <Image src={'/img/lock.png'} width={62} height={62} alt="" />
                      </div>
                      <div className="flex flex-col gap-[6px]">
                        <div className="text-[14px] text-black dark:text-white font-bold ">
                          {t('vipClub:noFeeWithdrawal')}
                        </div>
                        <div className="text-[#939699] text-[12px]">{t('vipClub:noFeeWithdrawalContent')}</div>
                      </div>
                    </div>
                  </>
                )}
                {levelData?.rank.includes('Diamond') && (
                  <>
                    <div
                      className="bg-[#F6F7FA] dark:bg-[#24262B] flex gap-[16px] p-3 border-[#42454966] border border-solid items-center rounded-[4px]"
                      role="button"
                    >
                      <div className="rounded-full w-[70px] h-[70px] flex items-center justify-center flex-none bg-[#2D3035] border border-solid border-[#42454966]">
                        <Image src={'/img/lock.png'} width={62} height={62} alt="" />
                      </div>
                      <div className="flex flex-col gap-[6px]">
                        <div className="text-[14px] text-black dark:text-white font-bold ">
                          {t('vipClub:exclusiveSVIP')}
                        </div>
                        <div className="text-[#939699] text-[12px]">{t('vipClub:exclusiveSVIPContent')}</div>
                      </div>
                    </div>
                    <div
                      className="bg-[#F6F7FA] dark:bg-[#24262B] flex gap-[16px] p-3 border-[#42454966] border border-solid items-center rounded-[4px]"
                      role="button"
                    >
                      <div className="rounded-full w-[70px] h-[70px] flex items-center justify-center flex-none bg-[#2D3035] border border-solid border-[#42454966]">
                        <Image src={'/img/lock.png'} width={62} height={62} alt="" />
                      </div>
                      <div className="flex flex-col gap-[6px]">
                        <div className="text-[14px] text-black dark:text-white font-bold ">
                          {t('vipClub:luxuryGiveaway')}
                        </div>
                        <div className="text-[#939699] text-[12px]">{t('vipClub:luxuryGiveawayContent')}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div
            onClick={navigationVipPage}
            className="flex justify-center w-full items-center cursor-pointer text-[14px] text-[#0DFDE4] font-semibold border-[#ffffff1a] border border-solid p-[10px]"
          >
            {t('vipClub:learnMore')}
          </div>
        </div>
      </CommonModal>
    </>
  );
}
