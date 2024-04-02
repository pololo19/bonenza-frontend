import 'swiper/css';
import 'swiper/css/grid';

import { Disclosure, Transition } from '@headlessui/react';
import { Add, ArrowRight, ArrowRight2, Minus, SmsTracking } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_affiliate } from '@/api/bonus';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { copyClipBoard, currencyFormat1 } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';
import CheckMarkIcon from '@/components/icons/CheckMarkIcon';
import BaseLayout from '@/components/layouts/base.layout';
import CommissionReward from '@/components/modal/affiliate/commissionRewards/commissionRewards';
import ReferralRewardRules from '@/components/modal/affiliate/referralRewardRules/referralRewardRules';
import ModalReferralTerm from '@/components/modal/affiliate/referralTerm';
import ModalShareReferralCode from '@/components/modal/affiliate/shareReferralCode';

import styles from '../affiliate/index.module.scss';

type ReferralType = 'commission' | 'reward';

type ReferralActivityType = {
  type: ReferralType;
  currency: string;
  amount: number;
};

type LiveRewardDataType = {
  userName: string;
  symbolLogo: string;
  amountUsd: number;
};

const fiatDecimals = 8;

function AffiliateLoggedPage() {
  const exchange = useExchange();
  const { t, i18n } = useTranslation('');
  const { theme } = useTheme();
  const questions = useMemo(
    () => [
      {
        id: 1,
        title: t('affiliate:howDoesTheReferralSystemWork'),
        content: t('affiliate:whenYouShareYour'),
      },
      {
        id: 2,
        title: t('affiliate:howMuchCanI'),
        content: t('affiliate:questionDescription2'),
      },
      {
        id: 3,
        title: t('affiliate:whatIsUSD'),
        content: t('affiliate:questionDescription3'),
      },
      {
        id: 4,
        title: t('affiliate:areThereAny'),
        content: t('affiliate:questionDescription4'),
      },
      {
        id: 5,
        title: t('affiliate:iHaveBig'),
        content: t('affiliate:questionDescription5'),
      },
      {
        id: 6,
        title: t('affiliate:howManyAffiliate'),
        content: t('affiliate:questionDescription6'),
      },
      {
        id: 7,
        title: t('affiliate:canISee'),
        content: t('affiliate:questionDescription7'),
      },
      {
        id: 8,
        title: t('affiliate:CanISendTip'),
        content: t('affiliate:questionDescription8'),
      },
    ],
    [i18n],
  );

  const [isLoading, setIsLoading] = useState(false);
  const [showReferralShare, setShowReferralShare] = useState(false);
  const [showReferralTerm, setShowReferralTerm] = useState(false);
  const [referralData, setReferralData] = useState({
    totalReward: 0,
    totalFriends: 0,
    referralReward: 0,
    commissionReward: 0,
    totalRewardsSentToDate: 0,
  });
  const [showDetailCommissionsRewards, setShowDetailCommissionsRewards] = useState(false);
  const [showReferralRewardRules, setShowReferralRewardRules] = useState(false);
  const [liveRewardData, setLiveRewardData] = useState<LiveRewardDataType[]>([]);
  const [rewardActivitiesData, setRewardActivitiesData] = useState<ReferralActivityType[]>();

  const { gameSocket } = useSelector(
    (state: AppState) => ({
      gameSocket: state.socket.gameSocket,
    }),
    shallowEqual,
  );

  const getReferralData = async () => {
    try {
      setIsLoading(true);
      const _res = await api_affiliate();
      const tempReferralData = {
        totalReward: Number(_res.data?.totalRewardEarnedUsd || 0),
        totalFriends: Number(_res.data?.totalFriendsReferred || 0),
        referralReward: Number(_res.data?.totalReferralRewardsUsd || 0),
        commissionReward: Number(_res.data?.totalCommissionRewardsUsd || 0),
        totalRewardsSentToDate: Number(_res.data?.totalRewardsSentToDate || 0),
      };
      const tempRewardsActivities: ReferralActivityType[] =
        _res.data?.rewardsActivities?.map((item: any) => ({
          type: item.type ?? 'commission',
          currency: 'USD',
          amount: Number(item.amountUsd || 0),
        })) ?? [];
      setRewardActivitiesData(tempRewardsActivities);
      setReferralData(tempReferralData);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const { referralCode, localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      referralCode: state.auth.user.referralCode,
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  useEffect(() => {
    getReferralData();
  }, []);

  useEffect(() => {
    if (gameSocket) {
      gameSocket.on(`rewards`, (reward: any) => {
        const data = JSON.parse(reward);
        const tempReward: LiveRewardDataType = {
          userName: data.user_name ?? '',
          symbolLogo: data.symbol_logo ?? '',
          amountUsd: Number(data.amount_usd || 0),
        };
        setLiveRewardData((prev) => [tempReward, ...prev]);
      });
    }
  }, [gameSocket]);

  return (
    <div className="">
      {isLoading && <Loader />}
      {showReferralShare && (
        <ModalShareReferralCode show={showReferralShare} onClose={() => setShowReferralShare(false)} />
      )}
      {showReferralTerm && <ModalReferralTerm show={showReferralTerm} onClose={() => setShowReferralTerm(false)} />}
      <Head>
        <title>Affiliate - Bonenza</title>
      </Head>
      <div className="flex flex-col mt-[20px]">
        <div className="w-full flex flex-col-reverse lg:flex-row pb-[23px] lg:justify-center">
          <div className="flex flex-col mr-[0px] w-full  dark:bg-color-card-bg-secondary bg-white rounded-[5px] px-[16px] lg:mr-[21px]">
            <div className="justify-between w-full dark:bg-color-panel-bg bg-color-light-panel-bg rounded-[10px]  mt-[18px] ">
              <div className="flex px-[15px] py-[10px]  w-full">
                <div className="flex items-center border-r-2 border-solid dark:border-color-border-primary border-color-light-border-primary w-1/2">
                  <Image
                    className="mr-[23px] hidden sm:block"
                    height={50}
                    width={50}
                    src="/img/page/wallet.png"
                    alt=""
                  />
                  <div className="flex flex-col items-center">
                    <div className="text-[16px] mb-[15px] font-normal dark:text-white text-black uppercase">
                      {t('affiliate:totalRewardEarned')}
                    </div>
                    <div
                      className={`leading-[22px] text-[22px] font-bold w-full text-color-secondary ${styles.textBanner}`}
                    >
                      {viewInFiat ? (
                        <>
                          {currencyFormat1(referralData.totalReward * exchange, fiatDecimals, localFiat?.name || 'USD')}
                        </>
                      ) : (
                        <>{currencyFormat1(referralData.totalReward, fiatDecimals)}</>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center pl-[15px]  w-1/2">
                  <Image
                    className="mr-[23px] hidden sm:block"
                    height={50}
                    width={50}
                    src={theme === 'dark' ? '/img/page/iphone.png' : '/img/page/iphone-light.png'}
                    alt=""
                  />
                  <div className="flex flex-col items-center">
                    <div className="text-[16px] mb-[15px] font-normal dark:text-white text-black uppercase">
                      {t('affiliate:totalFriendsReferred')}
                    </div>
                    <div className={`leading-[22px] text-[22px] font-bold w-full text-black dark:text-white`}>
                      {referralData.totalFriends ?? 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between w-full mt-[17px] mb-[16px] gap-4">
              <div className="w-full lg:w-1/2 dark:bg-color-card-body-primary bg-color-light-bg-primary rounded-[5px]">
                <div
                  className="flex justify-between dark:bg-color-card-header-primary bg-[#EAECF3] rounded-[5px] p-[18px] uppercase"
                  role="button"
                >
                  <div className="text-[16px] font-normal dark:text-[#FFFFFF] text-[#141414]">
                    {t('affiliate:referralReward')}
                  </div>
                  <div
                    className="text-color-primary text-[16px] flex items-center"
                    onClick={() => setShowReferralRewardRules(true)}
                  >
                    <p className="mr-[7px]">{t('affiliate:details')}</p>
                    <ArrowRight size="15" />
                  </div>
                </div>
                <div
                  className={`text-[22px] mt-[23px] font-bold text-center text-color-secondary ${styles.textBanner}`}
                >
                  {viewInFiat ? (
                    <>
                      {currencyFormat1(referralData.referralReward * exchange, fiatDecimals, localFiat?.name || 'USD')}
                    </>
                  ) : (
                    <>{currencyFormat1(referralData.referralReward, fiatDecimals)}</>
                  )}
                </div>
                <div className="px-[18px] pb-[14px] mt-[28px]">
                  <Link
                    target="_blank"
                    href={ROUTER.AdminRewards}
                    className="block dark:bg-color-active-primary bg-[#0DFDE4]/20 text-center py-[9px] rounded-[5px] text-[16px] font-bold text-color-primary w-full"
                  >
                    {t('affiliate:withdraw')}
                  </Link>
                </div>
              </div>
              <div
                className=" w-full lg:w-1/2 dark:bg-color-card-body-primary bg-color-light-bg-primary rounded-[5px]"
                role="button"
              >
                <div className="flex justify-between dark:bg-color-card-header-primary bg-[#EAECF3] rounded-[5px] p-[18px]">
                  <div className="text-[16px] font-normal dark:text-[#FFFFFF] text-[#141414] uppercase">
                    {t('affiliate:commissionReward')}
                  </div>
                  <button
                    className="text-color-primary text-[16px] flex items-center uppercase"
                    onClick={() => setShowDetailCommissionsRewards(true)}
                  >
                    <p className="mr-[7px]">{t('affiliate:details')}</p>
                    <ArrowRight size="15" />
                  </button>
                </div>
                <div className={`text-[22px] mt-[23px] font-bold text-center text-color-primary ${styles.textBanner}`}>
                  {viewInFiat ? (
                    <>
                      {currencyFormat1(
                        referralData.commissionReward * exchange,
                        fiatDecimals,
                        localFiat?.name || 'USD',
                      )}
                    </>
                  ) : (
                    <>{currencyFormat1(referralData.commissionReward, fiatDecimals)}</>
                  )}
                </div>
                <div className="px-[18px] pb-[14px] mt-[28px]">
                  <Link
                    target="_blank"
                    href={ROUTER.AdminCommissions}
                    className="block dark:bg-color-active-primary bg-[#0DFDE4]/20 text-center py-[9px] rounded-[5px] font-bold text-[16px] text-color-primary w-full"
                  >
                    {t('affiliate:withdraw')}
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex justify-between w-full ">
              <div className="w-full dark:bg-color-card-body-primary bg-color-light-bg-primary rounded-[10px]">
                <div className="flex justify-between dark:bg-color-card-header-primary bg-[#EAECF3] rounded-[5px] p-[18px]">
                  <div className="text-[16px] font-normal dark:text-[#FFFFFF] text-[#141414] uppercase">
                    {t('affiliate:rewardsActivities')}
                  </div>
                </div>
                {!rewardActivitiesData?.length && (
                  <div className="flex flex-col items-center gap-[15px] text-[#53575C] text-[14px] py-4">
                    <Image
                      src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
                      alt="noData"
                      width={150}
                      height={150}
                    />
                    {t('table:noData')}
                  </div>
                )}
                {!!rewardActivitiesData?.length &&
                  rewardActivitiesData?.map((item: any, key: any) => {
                    return (
                      <div className="flex justify-between items-center px-10 py-5" key={key}>
                        <div className="dark:text-gray-200 text-gray-700">
                          {item?.type === 'commission'
                            ? t('affiliate:commissionReward')
                            : t('affiliate:referralRewards')}{' '}
                          <span className="ml-1">USDT</span>
                        </div>
                        <div className="text-[18px] text-color-secondary font-bold">
                          {viewInFiat ? (
                            <>{currencyFormat1(item.amount * exchange, 8, localFiat?.name || 'USD')}</>
                          ) : (
                            <>{currencyFormat1(item.amount, 8)}</>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="flex justify-between w-full my-[18px] ">
              <Link target="_blank" href={ROUTER.AdminFriends} className="w-full bg-color-panel-bg rounded-[5px]">
                <div className="bg-gradient-btn-play txt-center py-[17px] rounded-[5px] font-bold w-full flex justify-center items-center">
                  <Image height={18} width={18} src="/img/page/category.png" className="opacity-30" alt="" />
                  <div className="ml-[10px] mr-[10px] text-[14px] text-[#FFFFFF]">{t('affiliate:goToDashboard')}</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex flex-col w-full items-center lg:max-w-[450px] dark:bg-color-card-bg-secondary bg-white rounded-[10px] justify-between">
            <div className="flex flex-col">
              <div className="justify-between w-full bg-color-panel-bg rounded-[10px]  mb-[18px] ">
                <div className="flex w-full relative">
                  <Image className="w-full" height={300} width={400} src="/img/page/maskGroup.png" alt="" />
                  <div className="absolute top-[50%] -translate-y-[50%] left-[40px]">
                    <div className="text-[#FFFFFF] text-[16px] sm:text-[24px] font-bold flex mb-[9px] uppercase">
                      {t('affiliate:inviteAFriendToGet')}
                    </div>
                    <div className="flex mb-[9px] gap-[10px]">
                      <div className="text-[#F39717] text-[16px] font-bold">
                        {viewInFiat ? (
                          <>{currencyFormat1(1000 * exchange, 2, localFiat?.name || 'USD')}</>
                        ) : (
                          <>{currencyFormat1(1000, 2)}</>
                        )}
                      </div>
                      <div className="text-[#FFFFFF] text-[16px] font-normal uppercase">
                        {t('affiliate:referralReward')}
                      </div>
                    </div>
                    <div className="flex gap-[10px]">
                      <div className="text-[#F39717] text-[16px] font-bold">25%</div>
                      <div className="text-[#FFFFFF] text-[16px] font-normal uppercase">
                        {t('affiliate:commissionReward')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full  mt-[24px]  px-[16px]">
                <div className="w-full  rounded-[5px] mr-[15px] mb-[17px]">
                  <div className="text-[16px] font-normal text-black dark:text-[#C2C2C2] mb-[3px]">
                    {t('affiliate:referralCode')}
                  </div>
                  <div className="flex">
                    <div className="dark:bg-color-card-input-primary bg-color-light-bg-primary py-[10px] text-[#43484E] w-full pl-[17px] rounded-l-[5px] dark:text-[#FFFFFF] text-[16px] font-normal ">
                      {referralCode}
                    </div>
                    <div
                      className="bg-color-card-button-primary p-[12px] rounded-[2px]"
                      role="button"
                      onClick={() => copyClipBoard(String(referralCode))}
                    >
                      <Image height={20} width={20} src="/img/page/simcard.png" alt="" />
                    </div>
                  </div>
                </div>
                <div className="w-full rounded-[5px] mr-[15px] mb-[17px]">
                  <div className="text-[16px] font-normal text-black dark:text-[#C2C2C2] mb-[3px]">
                    {t('affiliate:referralLink')}
                  </div>
                  <div className="flex">
                    <div className="dark:bg-color-card-input-primary bg-color-light-bg-primary py-[10px] w-full pl-[17px] rounded-l-[5px] text-gray-500 dark:text-[#FFFFF] text-[16px] font-normal ">
                      {ROUTER.REFERRAL_CODE(String(referralCode))}
                    </div>
                    <div
                      className="bg-color-card-button-primary p-[12px] rounded-[2px]"
                      role="button"
                      onClick={() => copyClipBoard(ROUTER.REFERRAL_CODE(String(referralCode)))}
                    >
                      <Image height={20} width={20} src="/img/page/simcard.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between w-full mt-[22px]  px-[16px]">
                {/* <div className="bg-gradient-btn-play text-center py-[15px] rounded-[5px] w-full flex justify-center items-center mr-[14px]">
                  <div className="ml-[10px] mr-[10px] text-[11px] md:text-[12px] text-[#FFFFFF] font-bold">
                    {t('affiliate:createAnotherCode')}
                  </div>
                </div> */}
                <div
                  className="dark:bg-color-card-button-primary bg-[#EAECF3] text-center py-[15px] rounded-[5px] w-full flex justify-center items-center"
                  role="button"
                  onClick={() => setShowReferralShare(true)}
                >
                  <div className="ml-[10px] mr-[10px] text-[16px] md:text-[16px] text-[#43484E] dark:text-[#FFFFFF] font-bold">
                    {t('affiliate:shareViaSocialMedia')}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full pb-[17px]">
              <div
                className="flex w-full  lg:mt-[82px] mt-[14px] items-center justify-center lg:justify-end px-[14px]"
                role="button"
                onClick={() => {
                  setShowReferralTerm(true);
                }}
              >
                <div className="text-[11px] text-[#C2C2C2] font-normal mr-[5px] text-right">
                  {t('affiliate:referralTermsConditions')}
                </div>
                <ArrowRight2 size={11} />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex mb-[20px] text-black dark:text-white">
            <div className="mr-[10px]">
              <Image height={20} width={20} src="/img/Live-Stream.png" className="w-full h-full" alt="" />
            </div>
            <div className="dark:text-white text-[#141414]">{t('affiliate:liveRewards')}</div>
          </div>
          <div className="flex w-full lg:flex-row flex-col gap-[30px] py-[20px] justify-start items-center rounded-[15px] bg-white dark:bg-color-card-bg-secondary mb-[40px] ">
            <div className="w-[80%] items-center border-b-[1px] dark:border-[#2b3139] border-[#EAECF3] border-r-1 lg:w-1/2 flex-col flex lg:flex-row  border-solid lg:border-b-[0px] lg:border-r-[1px]">
              <div className="mr-[41px] ml-[12px]">
                <Image height={70} width={77} src="/img/Rewards.png" className="min-w-[77px]" alt="" />
              </div>
              <div className="w-full mr-[0px] sm:mr-[20px] text-center my-auto">
                <h5 className="mb-[10px] text-[16px] sm:text-[16px] dark:text-[#BCB7B1] text-[#43484E]">
                  {t('affiliate:totalRewards')}
                </h5>
                <div className="w-full flex justify-center">
                  <div className="w-full dark:bg-color-panel-bg bg-color-light-bg-primary rounded-[5px] xl:w-[342px] py-3 flex justify-center items-center">
                    <span className={`font-bold text-[16px] text-color-secondary  ${styles.textBanner}`}>
                      {viewInFiat ? (
                        <>
                          {currencyFormat1(
                            referralData.totalRewardsSentToDate * exchange,
                            fiatDecimals,
                            localFiat?.name || 'USD',
                          )}
                        </>
                      ) : (
                        <>{currencyFormat1(referralData.totalRewardsSentToDate, fiatDecimals)}</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[80%] lg:w-1/2 flex flex-wrap justify-between gap-2 lg:pr-4 max-h-[65px] h-full overflow-y-auto">
              {!liveRewardData?.length && (
                <div className="flex flex-col justify-center items-center gap-[15px] text-[#53575C] text-[14px] w-full">
                  <Image
                    src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
                    alt="noData"
                    width={50}
                    height={50}
                  />
                </div>
              )}
              {!!liveRewardData.length &&
                liveRewardData.map((reward, index) => {
                  return (
                    <div className="flex mb-[5px] lg:mb-[10px] items-center w-[45%]" key={index}>
                      <div className="mr-[5px]">
                        <Image height={16} width={16} src={reward.symbolLogo} className="w-[16px] h-[16px]" alt="" />
                      </div>
                      <div className="text-default dark:text-color-text-primary text-[#43484E] gap-[5px]">
                        <span className="dark:text-white text-color-light-text-primary mr-[5px]">{`${reward.userName}`}</span>
                        {`${t('affiliate:got')}`}{' '}
                        <span className="text-color-primary">
                          {currencyFormat1(reward.amountUsd, fiatDecimals, '', false)}
                        </span>{' '}
                        {t('affiliate:rewards')}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="w-full pl-[14px] dark:bg-[#1D1E22] bg-white rounded-[5px] flex lg:flex-row flex-col items-center justify-center mb-[60px] lg:pl-[52px] py-[35px] pr-[14px]">
          <div className="mr-[0px] lg:mr-[54px] ">
            <div className="inline-block flex-col items-center lg:flex-row gap-[5px] lg:hidden">
              <div className="mr-[3px] text-[20px] lg:text-[28px] dark:text-white text-[#141414]">
                {t('affiliate:learnMoreAboutOur')}
              </div>
              <div className={`font-bold text-[20px] lg:text-[28px] bg-color-primary ${styles.textBanner}`}>
                {t('affiliate:affiliateProgram')}
              </div>
            </div>
            <Image className="m-auto min-w-[210px]" width={210} height={198} alt="" src="/img/loudspeaker.png" />
          </div>
          <div className="w-full">
            <div className="hidden lg:flex  gap-[5px]">
              <div className="mr-[3px] text-[24px] dark:text-white text-[#141414] font-bold lg:text-[24px]">
                {t('affiliate:learnMoreAboutOur')}
              </div>
              <div className={`font-bold text-[24px] lg:text-[24px] text-color-primary ${styles.textBanner}`}>
                {t('affiliate:affiliateProgram')}
              </div>
            </div>
            <div>
              <div className="flex mb-[9px] gap-[10px]">
                <CheckMarkIcon className="w-[16px] h-[14px] text-color-primary" />
                <div className="w-full text-[16px] text-color-text-primary font-normal md:w-[593px] ">
                  {t('affiliate:ifYouHaveA')}
                </div>
              </div>
            </div>
            <div>
              <div className="flex mb-[12px] gap-[10px]">
                <CheckMarkIcon className="w-[14px] h-[14px] text-color-primary" />
                <div className="w-ful text-[16px] text-color-text-primary font-normal md:w-[593px]">
                  {t('affiliate:ifYouCanInvite')}
                </div>
              </div>
            </div>
            <div className="text-[16px] mb-[7px] dark:text-white text-[#141414]">{t('affiliate:forMoreDetails')}</div>
            <Link
              className="w-full flex justify-between lg:w-[350px] h-[41px] rounded-[5px] dark:bg-color-panel-bg bg-color-light-bg-primary items-center"
              href="mailto:business@bonenza.com"
            >
              <div className="text-[16px] text-gray-500 ml-[16px]">business@bonenza.com</div>
              <div className="flex mr-[10px]">
                <div className="text-[16px] font-bold text-color-primary mr-[10px]">{t('affiliate:sendNow')}</div>
                <div>
                  <SmsTracking className="w-[18px] h-[18px] text-color-primary" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-[95%] h-full md:w-[1067px] pt-[16px] pb-[47px] md:px-[20px] px-[20px]">
          <div className="text-center text-3xl mb-[26px]">
            <h1 className="text-[16px] lg:text-[36px] pt-42 dark:text-white text-[#141414] font-semibold">
              {t('affiliate:frequentlyAskedQuestions')}
            </h1>
          </div>
          {questions.map((item) => (
            <div key={item.id}>
              <div className="h-[1px] bg-[#EAECF3] dark:bg-[#2B3139] mb-[16px]"></div>
              <Disclosure>
                {({ open }) => (
                  <div className="w-full">
                    <Disclosure.Button className="mb-[20px] w-full flex justify-between">
                      <div className="font-semibold text-[14px] sm:text-[16px] dark:text-white text-black">
                        {item.title}
                      </div>
                      <div
                        className={`${
                          open
                            ? 'bg-color-primary text-white'
                            : 'dark:bg-[#ffffff33] bg-[#f5f6fa] dark:text-[#98A7B5] text-[#31373d]'
                        } w-[30px] h-[30px] rounded-full flex items-center justify-center`}
                      >
                        {open ? <Minus size="24" /> : <Add size="24" />}
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
                        <div className="flex justify-between dark:text-[#98A7B5] text-[#31373d] text-[12px] sm:text-[14px] mb-[20px]">
                          {item.content}
                        </div>
                      </Disclosure.Panel>
                    </Transition>
                  </div>
                )}
              </Disclosure>
            </div>
          ))}
        </div>
      </div>
      <CommissionReward show={showDetailCommissionsRewards} onClose={() => setShowDetailCommissionsRewards(false)} />
      <ReferralRewardRules show={showReferralRewardRules} onClose={() => setShowReferralRewardRules(false)} />
    </div>
  );
}

AffiliateLoggedPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default AffiliateLoggedPage;
