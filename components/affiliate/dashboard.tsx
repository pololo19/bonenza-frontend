import 'swiper/css';
import 'swiper/css/grid';

import { Disclosure, Transition } from '@headlessui/react';
import {
  Add,
  ArrowDown,
  ArrowDown2,
  ArrowRight,
  ArrowRight2,
  ArrowUp,
  ArrowUp2,
  Minus,
  SmsTracking,
} from 'iconsax-react';
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

import styles from '@/pages/affiliate/index.module.scss';

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

function DashboardComponent() {
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
  const [showReferralTerm, setShowReferralTerm] = useState(false);
  const [referralData, setReferralData] = useState({
    totalReward: 0,
    totalFriends: 0,
    referralReward: 0,
    commissionReward: 0,
    totalRewardsSentToDate: 0,
  });
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

  const linkReferral = useMemo(() => {
    return ROUTER.REFERRAL_CODE(String(referralCode));
  }, [referralCode]);

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
      {showReferralTerm && <ModalReferralTerm show={showReferralTerm} onClose={() => setShowReferralTerm(false)} />}
      <Head>
        <title>Affiliate - Bonenza</title>
      </Head>
      <div className="flex flex-col mt-[20px]">
        <div className="w-full flex flex-col lg:flex-row pb-[23px] lg:justify-center gap-4">
          <div className="flex flex-col w-full items-center dark:bg-gradient-card-default bg-white rounded-default overflow-hidden justify-start gap-8">
            <div className="flex flex-col w-full px-6 py-8 gap-8">
              <div className="text-white text-title sm:text-m_title font-bold flex uppercase">
                {t('affiliate:inviteAFriendToGet')}
              </div>
              <div className="flex flex-col md:flex-row text-default">
                <div className="flex gap-[10px] pb-4 md:pr-4 md:pb-0">
                  <div className="text-[#FFCD6E] font-bold">
                    {viewInFiat ? (
                      <>{currencyFormat1(1000 * exchange, 2, localFiat?.name || 'USD')}</>
                    ) : (
                      <>{currencyFormat1(1000, 2)}</>
                    )}
                  </div>
                  <div className="text-[#FFFFFF] font-light">{t('affiliate:referralReward')}</div>
                </div>
                <div className="flex gap-[10px] pt-4 md:pl-4 md:pt-0 border-t md:border-t-0 md:border-l border-solid border-color-primary">
                  <div className="text-[#FFCD6E] font-bold ">25%</div>
                  <div className="text-[#FFFFFF] font-light ">{t('affiliate:commissionReward')}</div>
                </div>
              </div>
              <div className="text-white text-m_default">{t('affiliate:inviteDescription')}</div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <div className="text-m_default sm:text-default font-normal text-black dark:text-white mb-[3px]">
                    {t('affiliate:referralCode')}
                  </div>
                  <div className="flex rounded-[7px] overflow-hidden">
                    <div className="dark:bg-[#181818] bg-color-light-bg-primary py-[15px] text-[#43484E] w-full pl-[17px] rounded-l-[5px] dark:text-[#FFFFFF] text-m_default sm:text-default font-normal ">
                      {referralCode}
                    </div>
                    <div
                      className="bg-[#181818] p-2 sm:p-[17px]"
                      role="button"
                      onClick={() => copyClipBoard(String(referralCode))}
                    >
                      <Image height={20} width={20} src="/img/page/simcard.png" alt="" />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="text-m_default sm:text-default font-normal text-black dark:text-white mb-[3px]">
                    {t('affiliate:referralLink')}
                  </div>
                  <div className="flex rounded-[7px] overflow-hidden">
                    <div className="dark:bg-[#181818] bg-color-light-bg-primary py-[15px] w-full pl-[17px] rounded-l-[5px] text-gray-500 dark:text-[#FFFFF] text-m_default sm:text-default font-normal ">
                      {ROUTER.REFERRAL_CODE(String(referralCode))}
                    </div>
                    <div
                      className="bg-[#181818] p-2 sm:p-[17px] rounded-[2px]"
                      role="button"
                      onClick={() => copyClipBoard(ROUTER.REFERRAL_CODE(String(referralCode)))}
                    >
                      <Image height={20} width={20} src="/img/page/simcard.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row justify-start items-center gap-4">
                <div className="text-default text-[#43484E] dark:text-[#FFFFFF] font-normal">
                  {t('affiliate:shareViaSocialMedia')}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 md:gap-x-2 md:gap-y-4">
                  <Link
                    href={`http://www.facebook.com/sharer/sharer.php?u=${linkReferral}&title=referralCode&text=referralCode`}
                    target="_blank"
                  >
                    <Image role="button" alt="" src={'/img/share-fb.png'} width={24} height={24} className="w-8 h-8" />
                  </Link>
                  <Link
                    href={`https://twitter.com/intent/tweet?url=${linkReferral}&title=rreferralCode&text=referralCode`}
                    target="_blank"
                  >
                    <Image role="button" alt="" src={'/img/share-tw.png'} width={24} height={24} className="w-8 h-8" />
                  </Link>
                  <Link
                    href={`https://t.me/share?url=${linkReferral}&title=rreferralCode&text=referralCode`}
                    target="_blank"
                  >
                    <Image role="button" alt="" src={'/img/share-tl.png'} width={24} height={24} className="w-8 h-8" />
                  </Link>
                  <Link
                    href={`http://vk.com/share.php?url=${linkReferral}&title=rreferralCode&text=referralCode`}
                    target="_blank"
                  >
                    <Image role="button" alt="" src={'/img/share-vk.png'} width={24} height={24} className="w-8 h-8" />
                  </Link>
                  <Link
                    href={`https://lineit.line.me/share/ui?url=${linkReferral}&title=referralCode&text=referralCode`}
                    target="_blank"
                  >
                    <Image
                      role="button"
                      alt=""
                      src={'/img/share-line.png'}
                      width={24}
                      height={24}
                      className="w-8 h-8"
                    />
                  </Link>
                  <Link
                    href={`https://web.skype.com/share?url=${linkReferral}&title=referralCode&text=referralCode`}
                    target="_blank"
                  >
                    <Image role="button" alt="" src={'/img/share-sk.png'} width={24} height={24} className="w-8 h-8" />
                  </Link>
                  <Link
                    href={`https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&amp;st.shareUrl=url=${linkReferral}&title=referralCode&text=referralCode`}
                    target="_blank"
                  >
                    <Image role="button" alt="" src={'/img/share-ok.png'} width={24} height={24} className="w-8 h-8" />
                  </Link>
                  <Link
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${linkReferral}&title=referralCode&text=referralCode`}
                    target="_blank"
                  >
                    <Image role="button" alt="" src={'/img/share-in.png'} width={24} height={24} className="w-8 h-8" />
                  </Link>
                  <Link
                    href={`https://api.whatsapp.com/send?url=${linkReferral}&title=referralCode&text=referralCode`}
                    target="_blank"
                  >
                    <Image role="button" alt="" src={'/img/share-ws.png'} width={24} height={24} className="w-8 h-8" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:min-w-[360px] flex flex-col rounded-default overflow-hidden gap-4">
            <div className="rounded-default w-full grid grid-cols-2 py-10 bg-gradient-card-default">
              <div className="min-w-[150px] flex flex-col justify-center items-center">
                <Image
                  className="object-cover h-[80px] w-[80px]"
                  height={50}
                  width={50}
                  src="/img/affiliate/rewards.png"
                  alt=""
                />
                <div className="text-m_default sm:text-default mb-[15px] font-normal dark:text-white text-black">
                  {t('affiliate:totalRewardEarned')}
                </div>
                <div
                  className={`text-center leading-[14px] text-default md:leading-[20px] md:text-[20px] font-bold w-full text-color-text-green ${styles.textBanner}`}
                >
                  {viewInFiat ? (
                    <>{currencyFormat1(referralData.totalReward * exchange, fiatDecimals, localFiat?.name || 'USD')}</>
                  ) : (
                    <>{currencyFormat1(referralData.totalReward, fiatDecimals)}</>
                  )}
                </div>
              </div>
              <div className="min-w-[150px] flex flex-col justify-center items-center border-l border-solid border-color-primary">
                <Image className="w-[80px] h-[80px]" height={50} width={50} src="/img/affiliate/friends.png" alt="" />
                <div className="flex flex-col items-center">
                  <div className="text-m_default sm:text-default mb-[15px] font-normal dark:text-white text-black">
                    {t('affiliate:totalFriendsReferred')}
                  </div>
                  <div
                    className={`text-center leading-[14px] text-default md:leading-[20px] md:text-[20px] font-bold w-full text-color-text-green ${styles.textBanner}`}
                  >
                    {referralData.totalFriends ?? 0}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between w-full gap-4">
              <div className="w-full lg:w-1/2 dark:bg-gradient-card-default bg-color-light-bg-primary rounded-default py-10">
                <div className="min-w-[150px] text-center text-m_default sm:text-default font-normal dark:text-[#FFFFFF] text-[#141414]">
                  {t('affiliate:referralReward')}
                </div>
                <div
                  className={`text-title sm:text-[22px] mt-[24px] font-bold text-center text-color-text-green ${styles.textBanner}`}
                >
                  {viewInFiat ? (
                    <>
                      {currencyFormat1(referralData.referralReward * exchange, fiatDecimals, localFiat?.name || 'USD')}
                    </>
                  ) : (
                    <>{currencyFormat1(referralData.referralReward, fiatDecimals)}</>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-1/2 dark:bg-gradient-card-default bg-color-light-bg-primary rounded-default py-10">
                <div className="min-w-[150px] text-center text-m_default sm:text-default font-normal dark:text-[#FFFFFF] text-[#141414]">
                  {t('affiliate:commissionReward')}
                </div>
                <div
                  className={`text-title sm:text-[22px] mt-[24px] font-bold text-center text-color-text-green ${styles.textBanner}`}
                >
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
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="text-m_default sm:text-[16px] font-semibold dark:text-[#FFFFFF] text-[#141414]">
            {t('affiliate:rewardsActivities')}
          </div>
          <div className="w-full dark:bg-[#1D2738] bg-color-light-bg-primary rounded-[10px]">
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
                    <div className="dark:text-gray-200 text-gray-700 text-m_default sm:text-default">
                      {item?.type === 'commission' ? t('affiliate:commissionReward') : t('affiliate:referralRewards')}{' '}
                      <span className="ml-1">USDT</span>
                    </div>
                    <div className="text-m_default sm:text-[16px] text-color-text-green font-bold">
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
        <div className="w-full relative mt-6">
          <div className="absolute top-0 left-5 py-1 px-4 flex justify-center items-center text-black dark:text-white bg-[#31373D] rounded-[5px]">
            <div className="bg-color-text-green rounded-full w-3 h-3 mr-[10px]" />
            <div className="text-default sm:text-[16px] font-semibold dark:text-white text-[#141414]">
              {t('affiliate:liveRewards')}
            </div>
          </div>
          <div className="flex w-full lg:flex-row flex-col gap-[30px] py-[20px] justify-start items-center rounded-default bg-white dark:bg-gradient-card-default mb-[40px] ">
            <div className="w-[80%] items-center border-b-[1px] dark:border-[#2b3139] border-[#EAECF3] border-r-1 lg:w-1/2 flex-col flex lg:flex-row  border-solid lg:border-b-[0px] lg:border-r-[1px]">
              <div className="mt-3 sm:mt-0 w-full mr-[0px] sm:mr-[20px] text-center my-auto">
                <h5 className="mb-[10px] text-m_default sm:text-default dark:text-[#BCB7B1] text-[#43484E]">
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

        <div className="w-full pl-[14px] dark:bg-gradient-card-default bg-white rounded-default flex lg:flex-row flex-col items-center justify-center mb-[60px] lg:pl-[52px] py-[35px] pr-[14px]">
          <div className="mr-[0px] lg:mr-[54px] ">
            <div className="inline-block flex-col items-center lg:flex-row gap-[5px] lg:hidden">
              <div className="text-center mr-[3px] text-[16px] lg:text-m_title dark:text-white text-[#141414]">
                {t('affiliate:learnMoreAboutOur')}
              </div>
              <div
                className={`text-center font-bold text-[16px] lg:text-m_title text-color-primary ${styles.textBanner}`}
              >
                {t('affiliate:affiliateProgram')}
              </div>
            </div>
            <Image className="m-auto min-w-[310px]" width={210} height={198} alt="" src="/img/loudspeaker.png" />
          </div>
          <div className="w-full">
            <div className="hidden lg:flex  gap-[5px]">
              <div className="mr-[3px] text-[16px] lg:text-m_title dark:text-white text-[#141414] font-bold">
                {t('affiliate:learnMoreAboutOur')}
              </div>
              <div className={`font-bold text-[16px] lg:text-m_title text-color-primary ${styles.textBanner}`}>
                {t('affiliate:affiliateProgram')}
              </div>
            </div>
            <div>
              <div className="flex mb-[9px] gap-[10px]">
                <CheckMarkIcon className="w-[16px] h-[14px] text-color-primary" />
                <div className="w-full text-m_default sm:text-default text-color-text-primary font-normal md:w-[593px] ">
                  {t('affiliate:ifYouHaveA')}
                </div>
              </div>
            </div>
            <div>
              <div className="flex mb-[12px] gap-[10px]">
                <CheckMarkIcon className="w-[16px] h-[14px] text-color-primary" />
                <div className="w-full text-m_default sm:text-default text-color-text-primary font-normal md:w-[593px]">
                  {t('affiliate:ifYouCanInvite')}
                </div>
              </div>
            </div>
            <div className="text-m_default sm:text-default mb-[7px] dark:text-white text-[#141414]">
              {t('affiliate:forMoreDetails')}
            </div>
            <Link
              className="w-full flex justify-between lg:w-[350px] h-[41px] rounded-[5px] dark:bg-[#181818] bg-color-light-bg-primary items-center "
              href="mailto:business@bonenza.com"
            >
              <div className="text-m_default sm:text-default text-gray-500 ml-[16px]">business@bonenza.com</div>
              <div className="flex mr-[10px]">
                <div className="text-m_default sm:text-default font-bold text-color-primary mr-[10px]">
                  {t('affiliate:sendNow')}
                </div>
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
          <div className="text-center mb-[26px]">
            <h1 className="text-[16px] sm:text-m_title pt-42 dark:text-white text-[#141414] font-semibold">
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
                      <div className="text-left font-normal text-m_default sm:text-default dark:text-white text-black w-full">
                        {item.title}
                      </div>
                      <div
                        className={`text-white w-[30px] h-[30px] rounded-full flex items-center justify-center transition-all ${
                          open ? 'rotate-180' : 'rotate-0'
                        }`}
                      >
                        <ArrowDown2 size="20" />
                      </div>
                    </Disclosure.Button>
                    <div
                      className={`flex flex-col gap-[20px] w-full transition-all duration-300 overflow-hidden ${
                        open ? 'max-h-[600px]' : 'max-h-0'
                      }`}
                    >
                      <div className="flex justify-between dark:text-[#98A7B5] text-[#31373d] text-[12px] sm:text-[14px] mb-[20px]">
                        {item.content}
                      </div>
                    </div>
                  </div>
                )}
              </Disclosure>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardComponent;
