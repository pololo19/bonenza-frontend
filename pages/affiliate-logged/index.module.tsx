import 'swiper/css';
import 'swiper/css/grid';

import { Disclosure, Transition } from '@headlessui/react';
import { ArrowRight } from 'iconsax-react';
import { Add, Minus } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ReactElement, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER, TOAST_ENUM } from '@/base/constants/common';
import { currencyFormat, exchangeByLocaleFiat, handleLocaleSymbol } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';
import BaseLayout from '@/components/layouts/base.layout';
import CommissionReward from '@/components/modal/affiliate/commissionRewards/commissionRewards';
import ReferralRewardRules from '@/components/modal/affiliate/referralRewardRules/referralRewardRules';
import ModalReferralTerm from '@/components/modal/affiliate/referralTerm';
import ModalShareReferralCode from '@/components/modal/affiliate/shareReferralCode';

import styles from '../affiliate/index.module.scss';

function AffiliateLoggedPage() {
  const { t } = useTranslation('');
  const { theme } = useTheme();
  const questions = [
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
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [showReferralShare, setShowReferralShare] = useState(false);
  const [showReferralTerm, setShowReferralTerm] = useState(false);
  const [referralData, setReferralData] = useState<any>();
  const [showDetailCommissionsRewards, setShowDetailCommissionsRewards] = useState(false);
  const [showReferralRewardRules, setShowReferralRewardRules] = useState(false);
  const [liveRewardData, setLiveRewardData] = useState<any[]>([]);
  const [rewardActivitiesData, setRewardActivitiesData] = useState<any>();
  const [sumReward, setSumReward] = useState(0);

  const handleGetLiveReward = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/affiliate/get-live-reward-list');
      setLiveRewardData(res.data.data);
      setSumReward(res.data.sumReferralBonus);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetReferralData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/affiliate/get-referral');
      setReferralData(res.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleListRewardActivities = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('affiliate/get-reward-activities');
      setRewardActivitiesData(res.data.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const { referralCode, localeFiat } = useSelector(
    (state: AppState) => ({
      referralCode: state.auth.referralCode,
      localeFiat: state.common.localeFiat,
    }),
    shallowEqual,
  );

  const copy = (text: string) => {
    toast.success('Copied', { containerId: TOAST_ENUM.COMMON });
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    handleGetLiveReward();
    handleGetReferralData();
    handleListRewardActivities();
  }, []);

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
      <div className="flex flex-col items-center">
        <div className="w-full flex flex-col-reverse items-center lg:flex-row  bg-cover bg-no-repeat pb-[23px] lg:justify-center">
          <div className="flex flex-col mr-[0px] w-full items-center lg:w-[670px] dark:bg-[#1D1E22] bg-white rounded-[10px] px-[16px] lg:mr-[21px]">
            <div className="justify-between w-[100%] dark:bg-[#25262B] bg-[#F6F7FA] rounded-[10px]  mt-[18px] ">
              <div className="flex h-[60px] px-[15px] py-[7px]  w-[100%]">
                <div className="flex items-center border-r-2 border-solid dark:border-[#1D1E22] border-[#DADEE6] w-1/2">
                  <Image
                    className="mr-[23px] hidden sm:block"
                    height={50}
                    width={50}
                    src="/img/page/wallet.png"
                    alt=""
                  />
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] mb-[5px] font-normal text-[#939699]">
                      {t('affiliate:totalRewardEarned')}
                    </div>
                    <div
                      className={`ml-[-30px] leading-[20px] text-[22px] font-bold text-center bg-primary ${styles.textBanner}`}
                    >
                      {localeFiat?.currency ? (
                        <>
                          {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                          {currencyFormat(
                            exchangeByLocaleFiat(
                              'USD',
                              String(localeFiat?.currency),
                              Number(referralData?.totalRewardEarned),
                            ),
                            2,
                          )}
                        </>
                      ) : (
                        <>
                          {handleLocaleSymbol('USD')} {currencyFormat(Number(referralData?.totalRewardEarned), 2)}
                        </>
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
                    <div className="text-[10px] mb-[5px] font-normal text-[#939699]">
                      {t('affiliate:totalFriendsReferred')}
                    </div>
                    <div
                      className={`ml-[-30px] leading-[20px] dark:text-white text-[#141414] text-[22px] font-bold text-center`}
                    >
                      {referralData?.totalFriendsReferred ?? 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between w-[100%] mt-[17px] mb-[16px]">
              <div className="w-full lg:w-1/2 dark:bg-[#25262B] bg-[#F6F7FA] rounded-[5px] mr-[15px]">
                <div
                  className="flex justify-between dark:bg-[#2F3339] bg-[#EAECF3] rounded-[5px] p-[18px]"
                  role="button"
                >
                  <div className="text-[12px] font-normal dark:text-[#FFFFFF] text-[#141414]">
                    {t('affiliate:referralReward')}
                  </div>
                  <div
                    className="text-[#0DFDE4] text-[10px] flex items-center"
                    onClick={() => setShowReferralRewardRules(true)}
                  >
                    <p className="mr-[7px]">{t('affiliate:details')}</p>
                    <ArrowRight size="15" color="#0DFDE4" />
                  </div>
                </div>
                <div className={`text-[22px] mt-[23px] font-bold text-center bg-primary ${styles.textBanner}`}>
                  {handleLocaleSymbol(String(localeFiat?.currency ?? 'USD'))}{' '}
                  {currencyFormat(
                    exchangeByLocaleFiat(
                      'USD',
                      String(localeFiat?.currency ?? 'USD'),
                      Number(referralData?.refferralRewards),
                    ),
                    2,
                  )}
                </div>
                <div className="px-[18px] pb-[14px] mt-[28px]">
                  <Link
                    target="_blank"
                    href={ROUTER.AdminRewards}
                    className="block dark:bg-[#205150] bg-[#0DFDE4]/20 text-center py-[9px] rounded-[10px] text-[10px] font-bold text-[#0DFDE4] w-full"
                  >
                    {t('affiliate:withdraw')}
                  </Link>
                </div>
              </div>
              <div className=" w-full lg:w-1/2 dark:bg-[#25262B] bg-[#F6F7FA] rounded-[5px]" role="button">
                <div className="flex justify-between dark:bg-[#2F3339] bg-[#EAECF3] rounded-[5px] p-[18px]">
                  <div className="text-[12px] font-normal dark:text-[#FFFFFF] text-[#141414]">
                    {t('affiliate:commissionReward')}
                  </div>
                  <button
                    className="text-[#0DFDE4] text-[10px] flex items-center"
                    onClick={() => setShowDetailCommissionsRewards(true)}
                  >
                    <p className="mr-[7px]">{t('affiliate:details')}</p>
                    <ArrowRight size="15" color="#0DFDE4" />
                  </button>
                </div>
                <div className={`text-[22px] mt-[23px] font-bold text-center bg-primary ${styles.textBanner}`}>
                  {handleLocaleSymbol(String(localeFiat?.currency ?? 'USD'))}{' '}
                  {currencyFormat(
                    exchangeByLocaleFiat(
                      'USD',
                      String(localeFiat?.currency ?? 'USD'),
                      Number(referralData?.commissionRewards),
                    ),
                    2,
                  )}
                </div>
                <div className="px-[18px] pb-[14px] mt-[28px]">
                  <Link
                    target="_blank"
                    href={ROUTER.AdminRewards}
                    className="block dark:bg-[#205150] bg-[#0DFDE4]/20 text-center py-[9px] rounded-[10px] font-bold text-[10px] text-[#0DFDE4] w-full"
                  >
                    {t('affiliate:withdraw')}
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex justify-between w-[100%] ">
              <div className="w-full dark:bg-[#25262B] bg-[#F6F7FA] rounded-[10px]">
                <div className="flex justify-between dark:bg-[#2F3339] bg-[#EAECF3] rounded-[5px] p-[9px]">
                  <div className="text-[12px] font-normal dark:text-[#FFFFFF] text-[#141414]">
                    {t('affiliate:rewardsActivities')}
                  </div>
                </div>
                {!(rewardActivitiesData?.commissionBonus?.length && rewardActivitiesData?.levelBonus?.length) && (
                  <div className="flex flex-col items-center gap-[15px] text-[#53575C] text-[14px] py-4">
                    <Image
                      src={theme === 'dark' ? '/img/no-data.png' : '/img/no-data-light-mode.png'}
                      alt="noData"
                      width={150}
                      height={150}
                    />
                    {t('table:noData')}
                  </div>
                )}
                {!!rewardActivitiesData?.commissionBonus?.length &&
                  rewardActivitiesData?.commissionBonus?.map((item: any, key: any) => {
                    return (
                      <div className="flex justify-between items-center p-2" key={key}>
                        <div>
                          {t('affiliate:commissionReward')} <span className="ml-1 text-gray-600">{item?.currency}</span>
                        </div>
                        <div className="text-[14px]">
                          {localeFiat?.currency ? (
                            <>
                              {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                              {currencyFormat(
                                exchangeByLocaleFiat(
                                  item?.currency,
                                  String(localeFiat?.currency),
                                  item?.commissionBonus,
                                ),
                                2,
                              )}
                            </>
                          ) : (
                            <>
                              {handleLocaleSymbol(item?.currency)} {currencyFormat(item?.commissionBonus, 2)}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                {!!rewardActivitiesData?.levelBonus?.length &&
                  rewardActivitiesData?.levelBonus?.map((item: any, key: any) => {
                    return (
                      <div className="flex justify-between items-center p-2" key={key}>
                        <div className="text-[14px]">
                          Referral Rewards <span className="ml-1 text-gray-600">{item?.currency}</span>
                        </div>
                        <div className="text-[14px]">
                          {localeFiat?.currency ? (
                            <>
                              {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                              {currencyFormat(
                                exchangeByLocaleFiat(
                                  item?.currency,
                                  String(localeFiat?.currency),
                                  item?.commissionBonus,
                                ),
                                2,
                              )}
                            </>
                          ) : (
                            <>
                              {handleLocaleSymbol(item?.currency)} {currencyFormat(item?.commissionBonus, 2)}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                {/* <div className="flex flex-col justify-center items-center mt-[7px]">
                  <Image
                    height={80}
                    width={80}
                    src={theme === 'dark' ? '/img/page/Group.png' : '/img/no-data-light-mode.png'}
                    alt=""
                  />
                  <div className="px-[18px] pb-[9px] mt-[5px]">
                    <div className="text-[10px] text-[#53575C] font-normal text-center">{t('affiliate:noInfoYet')}</div>
                    <div className="text-[10px] text-[#53575C] font-normal text-center">
                      {t('affiliate:inviteFriends')}
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="flex justify-between w-[100%] my-[18px] ">
              <Link target="_blank" href={ROUTER.AdminReferral} className="w-full bg-[#25262B] rounded-[5px]">
                <div className="bg-[#F61B4F] hover:bg-[red] text-center py-[17px] rounded-[5px] font-bold w-full flex justify-center items-center">
                  <Image height={18} width={18} src="/img/page/category.png" alt="" />
                  <div className="ml-[10px] mr-[10px] text-[14px] text-[#FFFFFF]">{t('affiliate:goToDashboard')}</div>
                  <i className="fi fi-br-angle-right  mt-[2px] text-[12px] font-bold"></i>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex flex-col  w-full items-center lg:w-[372px] dark:bg-[#1D1E22] bg-white rounded-[10px] ">
            <div className="justify-between w-[100%] bg-[#25262B] rounded-[10px]  mb-[18px] ">
              <div className="flex w-[100%] relative">
                <Image className="w-full" height={300} width={400} src="/img/page/maskGroup.png" alt="" />
                <div className="absolute top-[28px] left-[12px]">
                  <div className="text-[#FFFFFF] text-[16px] sm:text-[20px] font-bold flex mb-[9px] uppercase">
                    {t('affiliate:inviteAFriendToGet')}
                  </div>
                  <div className="flex mb-[9px] gap-[10px]">
                    <div className="text-[#F39717] text-[14px] font-bold">
                      {localeFiat?.currency ? (
                        <>
                          {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                          {currencyFormat(exchangeByLocaleFiat('USD', String(localeFiat?.currency), 1000), 2)}
                        </>
                      ) : (
                        <>
                          {handleLocaleSymbol('USD')} {currencyFormat(1000, 2)}
                        </>
                      )}
                    </div>
                    <div className="text-[#FFFFFF] text-[14px] font-normal">{t('affiliate:referralReward')}</div>
                  </div>
                  <div className="flex gap-[10px]">
                    <div className="text-[#F39717] text-[14px] font-bold">25%</div>
                    <div className="text-[#FFFFFF] text-[14px] font-normal">{t('affiliate:commissionReward')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[100%]  mt-[24px]  px-[16px]">
              <div className="w-full  rounded-[5px] mr-[15px] mb-[17px]">
                <div className="text-[12px] font-normal text-black dark:text-[#C2C2C2] mb-[3px]">
                  {t('affiliate:referralCode')}
                </div>
                <div className="flex">
                  <div className="dark:bg-[#202227] bg-[#F6F7FA] py-[10px] text-[#43484E] w-full pl-[17px] rounded-[5px] dark:text-[#FFFFFF] text-[12px] font-normal ">
                    {referralCode}
                  </div>
                  <div
                    className="bg-[#FD6E0B] p-[12px] rounded-[2px]"
                    role="button"
                    onClick={() => copy(String(referralCode))}
                  >
                    <Image height={20} width={20} src="/img/page/simcard.png" alt="" />
                  </div>
                </div>
              </div>
              <div className="w-full  rounded-[5px] mr-[15px] mb-[17px]">
                <div className="text-[12px] font-normal text-black dark:text-[#C2C2C2] mb-[3px]">
                  {t('affiliate:referralLink')}
                </div>
                <div className="flex">
                  <div className="dark:bg-[#202227] bg-[#F6F7FA] py-[10px] w-full pl-[17px] rounded-[5px] text-gray-500 dark:text-[#FFFFF] text-[12px] font-normal ">
                    {ROUTER.REFERRAL_CODE(String(referralCode))}
                  </div>
                  <div
                    className="bg-[#FD6E0B] p-[12px] rounded-[2px]"
                    role="button"
                    onClick={() => copy(ROUTER.REFERRAL_CODE(String(referralCode)))}
                  >
                    <Image height={20} width={20} src="/img/page/simcard.png" alt="" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between w-[100%] mt-[22px]  px-[16px]">
              {/* <div className="bg-[#F39717] text-center py-[15px] rounded-[5px] w-full flex justify-center items-center mr-[14px]">
                <div className="ml-[10px] mr-[10px] text-[11px] md:text-[12px] text-[#FFFFFF] font-bold">
                  {t('affiliate:createAnotherCode')}
                </div>
              </div> */}
              <div
                className="dark:bg-[#272C33] bg-[#EAECF3] text-center py-[15px] rounded-[5px] w-full flex justify-center items-center"
                role="button"
                onClick={() => setShowReferralShare(true)}
              >
                <div className="ml-[10px] mr-[10px] text-[11px] md:text-[12px] text-[#43484E] dark:text-[#FFFFFF] font-bold">
                  {t('affiliate:shareViaSocialMedia')}
                </div>
              </div>
            </div>

            <div className="w-full pb-[17px]">
              <div
                className="flex w-[100%]  lg:mt-[82px] mt-[14px] items-center justify-center lg:justify-end px-[14px]"
                role="button"
                onClick={() => {
                  setShowReferralTerm(true);
                }}
              >
                <div className="text-[11px] text-[#C2C2C2] font-normal mr-[5px] text-right">
                  {t('affiliate:referralTermsConditions')}
                </div>
                <i className="fi fi-br-angle-right  mt-[4px] text-[10px] font-bold"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[1067px]">
          <div className="flex mb-[20px] text-black dark:text-white">
            <div className="mr-[10px]">
              <Image height={20} width={20} src="/img/Live-Stream.png" className="w-full h-full" alt="" />
            </div>
            <div className="dark:text-white text-[#141414]">{t('affiliate:liveRewards')}</div>
          </div>
          <div className="flex w-full lg:flex-row flex-col gap-[30px] py-[20px] justify-start items-center rounded-[15px] bg-white dark:bg-[#1D1E22] mb-[40px] ">
            <div className="w-[80%] items-center border-b-[1px] dark:border-[#2b3139] border-[#EAECF3] border-r-1 lg:w-1/2 flex-col flex lg:flex-row  border-solid lg:border-b-[0px] lg:border-r-[1px]">
              <div className="mr-[41px] ml-[12px]">
                <Image height={70} width={77} src="/img/Rewards.png" className="min-w-[77px]" alt="" />
              </div>
              <div className="mb-[25px] w-full lg:w-[80%] mr-[0px] text-center lg:mr-[56px]">
                <h5 className="mb-[10px] text-[14px] dark:text-white text-[#43484E]">{t('affiliate:totalRewards')}</h5>
                <div className="w-full dark:bg-[#25262B] bg-[#F6F7FA] rounded-[5px] xl:w-[342px] h-[33px] flex justify-center items-center">
                  <span className={`font-bold text-[16px] bg-primary  ${styles.textBanner}`}>
                    {localeFiat?.currency ? (
                      <>
                        {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                        {currencyFormat(exchangeByLocaleFiat('USD', String(localeFiat?.currency), sumReward), 2)}
                      </>
                    ) : (
                      <>
                        {handleLocaleSymbol('USD')} {currencyFormat(sumReward, 2)}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-[80%] lg:w-1/2 flex flex-wrap justify-between gap-2 lg:pr-4 max-h-[65px] h-full overflow-y-auto">
              {!liveRewardData?.length && (
                <div className="flex flex-col justify-center items-center gap-[15px] text-[#53575C] text-[14px] w-full">
                  <Image
                    src={theme === 'dark' ? '/img/no-data.png' : '/img/no-data-light-mode.png'}
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
                        <Image
                          height={16}
                          width={16}
                          src={`/img/fiats/${reward.currency}.png`}
                          className="w-[16px] h-[16px]"
                          alt=""
                        />
                      </div>
                      <div className="text-[12px] dark:text-white text-[#43484E]">
                        {reward.username}
                        {t('affiliate:got')} <span className="text-[#20D4EB]">{reward.referralBonus}</span>{' '}
                        {t('affiliate:rewards')}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="w-full pl-[14px] dark:bg-[#1D1E22] bg-white rounded-[5px] flex lg:flex-row flex-col items-center justify-center mb-[60px] lg:pl-[52px] py-[35px] lg:w-[1067px] pr-[14px]">
          <div className="mr-[0px] lg:mr-[54px] ">
            <div className="inline-block flex-col items-center lg:flex-row gap-[5px] lg:hidden">
              <div className="mr-[3px] text-[14px] lg:text-[24px] dark:text-white text-[#141414]">
                {t('affiliate:learnMoreAboutOur')}
              </div>
              <div className={`font-bold text-[14px] lg:text-[24px] bg-primary ${styles.textBanner}`}>
                {t('affiliate:affiliateProgram')}
              </div>
            </div>
            <Image className="m-auto min-w-[210px]" width={210} height={198} alt="" src="/img/loudspeaker.png" />
          </div>
          <div className="w-full">
            <div className="hidden lg:block  gap-[5px]">
              <div className="mr-[3px] text-[24px] dark:text-white text-[#141414] font-bold lg:text-[24px]">
                {t('affiliate:learnMoreAboutOur')}
              </div>
              <div className={`font-bold text-[24px] lg:text-[24px] bg-primary ${styles.textBanner}`}>
                {t('affiliate:affiliateProgram')}
              </div>
            </div>
            <div>
              <div className="flex mb-[9px]">
                <Image
                  height={14}
                  width={14}
                  src="/img/check-mark.png"
                  className="w-[14px] h-[14px] mr-[10px]"
                  alt=""
                />
                <div className="w-full text-[10px] text-gray-500 font-normal md:w-[593px]">
                  {t('affiliate:ifYouHaveA')}
                </div>
              </div>
            </div>
            <div>
              <div className="flex mb-[12px]">
                <Image
                  height={14}
                  width={14}
                  src="/img/check-mark.png"
                  className="w-[14px] h-[14px] mr-[10px]"
                  alt=""
                />
                <div className="w-ful text-[10px] text-gray-500 font-normal md:w-[593px]">
                  {t('affiliate:ifYouCanInvite')}
                </div>
              </div>
            </div>
            <div className="text-[16px] mb-[7px] dark:text-white text-[#141414]">{t('affiliate:forMoreDetails')}</div>
            <Link
              className="w-full flex justify-between lg:w-[309px] h-[41px] rounded-[5px] dark:bg-[#25262B] bg-[#F6F7FA] items-center"
              href="mailto:business@bonenza.com"
            >
              <div className="text-[10px] text-gray-500 ml-[10px]">business@bonenza</div>
              <div className="flex mr-[10px]">
                <div className="text-[10px] font-bold text-teal-300 mr-[10px]">{t('affiliate:sendNow')}</div>
                <div>
                  <Image height={18} width={18} src="/img/sms-tracking.png" alt="" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="">
        <div className="flex justify-center items-center bg-white dark:bg-[#272A2F]">
          <div className="w-[95%] h-full md:w-[1067px] pt-[16px] pb-[47px] md:px-2">
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
                              ? 'bg-[#f61b4f] text-white'
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
