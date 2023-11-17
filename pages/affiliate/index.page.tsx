import { useTranslation } from '@/base/config/i18next';
import BaseLayout from '@/components/layouts/base.layout';
import Image from 'next/image';
import { ReactElement } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { RootState } from '../../types/root-state';

import { useTheme } from 'next-themes';
import Head from 'next/head';
import AffiliateLoggedPage from '../affiliate-logged/index.module';
import styles from './index.module.scss';

function AffiliatePage() {
  const { t } = useTranslation('');
  const { theme } = useTheme();

  const { isLogin } = useSelector(
    (state: RootState) => ({
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  return (
    <>
      <Head>
        <title>Affiliate - Bonenza</title>
      </Head>
      {!isLogin && (
        <>
          <div className="bg-[url('/img/page/banner-affiliate-light-mode.png')] dark:bg-[url('/img/banner-affiliate.png')] bg-[length:100%_100%] bg-no-repeat py-[60px] mb-[40px] mt-[25px]">
            <div className="flex flex-col ml-[56px] max-w-[588px] items-center">
              <h1 className="sm:text-[36px] text-[28px] mb-[10px] dark:text-white text-[#141414] text-center font-bold">
                {t('affiliate:inviteFriendsToEarn')}
              </h1>
              <h5
                className={`sm:text-[30px] text-[20px] mb-[30px] text-center font-bold bg-primary ${styles.textBanner}`}
              >
                ₫23,809,523.80 + 25% {t('affiliate:commission')}
              </h5>
              <div
                role="button"
                className="bg-btn-sign-in rounded-large bg-primary flex items-center justify-center gap-[7px] max-w-[208px] p-[10px] font-bold text-white mb-[10px]"
              >
                <span className="text-[14px]">{t('affiliate:signUpAndEarn')}</span>
                <div className="w-[34px] h-[35px] hidden md:flex items-center justify-center rounded-large bg-white/20">
                  <Image height={14} width={14} src="/img/icon/arrow-right.png" alt="" />
                </div>
              </div>
              <h5 className="text-[16px] text-center dark:text-white text-[#141414]">
                {t('affiliate:referralTermsConditions')}
              </h5>
            </div>
          </div>
          <div className="flex lg:flex-row flex-col gap-[25px]">
            <div className="dark:bg-[url('/img/banner-box.png')] bg-[url('/img/banner-box-light.png')] bg-[length:100%_100%] bg-no-repeat py-[44px] px-[25px] flex items-center gap-[10px]">
              <div className="flex flex-col sm:items-start items-center">
                <div className="text-[22px] mb-[20px] font-bold dark:text-white text-[#141414] lg:max-w-[262px]">
                  {t('affiliate:getYour')}
                  <span className={`bg-gradient-to-r from-amber-500 to-amber-500 font-bold ${styles.textBanner}`}>
                    {' '}
                    ₫25,000,000.00{' '}
                  </span>
                  <span className="font-bold">{t('affiliate:referralRewards')}</span>
                </div>
                <span className={`text-[14px] bg-[#939699] ${styles.textBanner}`}>
                  {t('affiliate:everyFriendYouInvite')}
                </span>
                <div className="max-w-[200px] sm:hidden block">
                  <Image width={200} height={30} src="/img/banner-image-box1.png" className="w-full h-full" alt="" />
                </div>
                <div
                  role="button"
                  className="text-[14px] hover:opacity-[0.9] text-white font-bold bg-[#F61B4F] rounded-[16px] py-[13px] px-[10px] max-w-[194px] mt-5 md:mt-[40px] text-center"
                >
                  {t('affiliate:pleaseSeeTheDetails')}
                </div>
              </div>
              <div className="max-w-[200px] sm:block hidden">
                <Image width={200} height={30} src="/img/banner-image-box1.png" className="w-full h-full" alt="" />
              </div>
            </div>
            <div className="dark:bg-[url('/img/banner-box.png')] bg-[url('/img/banner-box-light.png')] bg-[length:100%_100%] bg-no-repeat py-[44px] px-[25px] flex justify-around items-center gap-[10px]">
              <div className="flex flex-col sm:items-start items-center">
                <div className="text-[22px] mb-[20px] font-bold dark:text-white text-[#141414] lg:max-w-[262px]">
                  {t('affiliate:getYour')}{' '}
                  <span className={`bg-gradient-to-r from-amber-500 to-amber-500  ${styles.textBanner}`}> 25% </span>
                  <span className="font-bold">{t('affiliate:commissionRewards')}</span>
                </div>
                <span className={`text-[14px] bg-[#939699] ${styles.textBanner}`}>{t('affiliate:youWillReceive')}</span>
                <div className="max-w-[200px] sm:hidden block">
                  <Image width={200} height={30} src="/img/banner-image-box1.png" className="w-full h-full" alt="" />
                </div>
                <div
                  role="button"
                  className="text-[14px] hover:opacity-[0.9] text-white font-bold bg-[#F61B4F] rounded-[16px] py-[13px] px-[10px] max-w-[194px] mt-5 md:mt-[40px] text-center"
                >
                  {t('affiliate:pleaseSeeTheDetails')}
                </div>
              </div>
              <div className="max-w-[200px] sm:block hidden">
                <Image width={200} height={30} src="/img/banner-image-box2.png" className="w-full h-full" alt="" />
              </div>
            </div>
          </div>
          <div className="flex mb-[20px] mt-[50px]">
            <div className="mr-[10px]">
              <Image width={24} height={24} src="/img/Live-Stream.png" className="w-full h-auto" alt="" />
            </div>
            <div className="dark:text-white text-[#141414]">{t('affiliate:liveRewards')}</div>
          </div>
          <div className="flex lg:flex-row flex-col gap-[30px] py-[20px] justify-start items-center rounded-[16px] bg-[#FFFFFF] dark:bg-[#1D1E22] mb-[40px]">
            <div className="mr-[18px] ml-[12px]">
              <Image width={24} height={24} src="/img/Rewards.png" className="w-full h-auto" alt="" />
            </div>
            <div className="text-center mr-[40px]">
              <h5 className="mb-[10px] text-[14px] dark:text-white text-[#141414]">{t('affiliate:totalRewards')}</h5>
              <div className="dark:bg-[#25262B] bg-[#F6F7FA] rounded-[16px] w-[420px] h-[60px] flex justify-center items-center ">
                <span className={`font-bold text-[24px] bg-primary  ${styles.textBanner}`}>₫569,949,298,571.42</span>
              </div>
            </div>
            <div>
              <div className="flex mb-[10px]">
                <div className="mr-[5px]">
                  <Image width={24} height={24} src="/img/icon/USDT-logo.svg" className="w-[24px] h-[24px]" alt="" />
                </div>
                <div>
                  <span className="text-[14px] dark:text-white text-[#43484E]"> {t('affiliate:jeoifahq')}</span>
                </div>
              </div>
              <div className="flex">
                <div className="mr-[5px]">
                  <Image width={24} height={24} src="/img/icon/USDT-logo.svg" className="w-[24px] h-[24px]" alt="" />
                </div>
                <div>
                  <span className="text-[14px] dark:text-white text-[#43484E]">{t('affiliate:jeoifahq')}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="dark:bg-[#1D1E22] bg-white rounded-[16px] flex lg:flex-row flex-col items-center justify-center mb-[60px] p-[20px]">
            <div className="mr-[24px]">
              <Image width={210} height={198} alt="" src="/img/loudspeaker.png" />
            </div>
            <div className="w-full">
              <div className="flex gap-[5px]">
                <div className="mr-[3px] text-[20px] lg:text-[24px] dark:text-white text-[#141414] font-bold">
                  {t('affiliate:learnMoreAboutOur')}
                </div>
                <div className={`font-bold text-[20px] lg:text-[24px] bg-primary ${styles.textBanner}`}>
                  {t('affiliate:affiliateProgram')}
                </div>
              </div>
              <div>
                <div className="flex mb-[20px]">
                  <Image
                    width={24}
                    height={24}
                    src="/img/check-mark.png"
                    className="w-[24px] h-[24px] mr-[10px]"
                    alt=""
                  />
                  <div className="text-[15px] text-gray-500">{t('affiliate:ifYouHaveA')}</div>
                </div>
              </div>
              <div>
                <div className="flex mb-[20px]">
                  <Image
                    width={24}
                    height={24}
                    src="/img/check-mark.png"
                    className="w-[24px] h-[24px] mr-[10px]"
                    alt=""
                  />

                  <div className="text-[15px] text-gray-500">{t('affiliate:ifYouCanInvite')}</div>
                </div>
              </div>
              <div className="text-[16px] mb-[20px] dark:text-white text-[#141414]">
                {t('affiliate:forMoreDetails')}
              </div>
              <div className="flex justify-between max-w-[309px] h-[50px] rounded-[5px] dark:bg-[#25262B] bg-[#F6F7FA] items-center p-[10px]">
                <div className="text-[14px] text-gray-500">Business@bonenza</div>
                <div className="flex items-center gap-[10px]">
                  <div className="text-[14px] text-teal-300">{t('affiliate:sendNow')}</div>
                  <div>
                    <Image width={24} height={24} src="/img/sms-tracking.png" className="w-full h-auto" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-center text-3xl mb-[26px]">
              <h1 className="pt-42 dark:text-white text-[#141414] font-semibold">
                {t('affiliate:frequentlyAskedQuestions')}
              </h1>
            </div>
            <div className="flex justify-between mb-[15px]">
              <div className="dark:text-white text-[#43484E]">{t('affiliate:howDoesTheReferralSystemWork')}</div>
              <div>
                <Image width={24} height={24} src="/img/Plus.png" className="w-full h-auto" alt="" />
              </div>
            </div>
            <div className="flex justify-between text-[14px] text-gray-500  mb-[15px]">
              {t('affiliate:whenYouShareYour')}
            </div>
            <div className="h-[1px] bg-[#EAECF3] dark:bg-[#2B3139] mb-[20px]"></div>
            <div className="flex justify-between text-[14px]  mb-[15px] dark:text-white text-[#43484E]">
              <div>{t('affiliate:howMuchCanI')}</div>
              <div>
                <Image
                  width={24}
                  height={24}
                  src={theme === 'dark' ? '/img/Plus-.png' : '/img/Plus-light.png'}
                  className="w-full h-auto"
                  alt=""
                />
              </div>
            </div>

            <div className="h-[1px] bg-[#EAECF3] dark:bg-[#2B3139] mb-[20px]"></div>

            <div className="flex justify-between text-[14px] mb-[15px] dark:text-white text-[#43484E]">
              <div>{t('affiliate:whatIsUSD')}</div>
              <div>
                <Image
                  width={24}
                  height={24}
                  src={theme === 'dark' ? '/img/Plus-.png' : '/img/Plus-light.png'}
                  className="w-full h-auto"
                  alt=""
                />
              </div>
            </div>

            <div className="h-[1px] bg-[#EAECF3] dark:bg-[#2B3139] mb-[20px]"></div>

            <div className="flex justify-between text-[14px] mb-[15px] dark:text-white text-[#43484E]">
              <div>{t('affiliate:areThereAny')}</div>
              <div>
                <Image
                  width={24}
                  height={24}
                  src={theme === 'dark' ? '/img/Plus-.png' : '/img/Plus-light.png'}
                  className="w-full h-auto"
                  alt=""
                />
              </div>
            </div>

            <div className="h-[1px] bg-[#EAECF3] dark:bg-[#2B3139] mb-[20px]"></div>

            <div className="flex justify-between text-[14px] mb-[15px] dark:text-white text-[#43484E]">
              <div>{t('affiliate:iHaveBig')}</div>
              <div>
                <Image
                  width={24}
                  height={24}
                  src={theme === 'dark' ? '/img/Plus-.png' : '/img/Plus-light.png'}
                  className="w-full h-auto"
                  alt=""
                />
              </div>
            </div>

            <div className="h-[1px] bg-[#EAECF3] dark:bg-[#2B3139] mb-[20px]"></div>

            <div className="flex justify-between text-[14px] mb-[15px] dark:text-white text-[#43484E]">
              <div>{t('affiliate:howManyAffiliate')}</div>
              <div>
                <Image
                  width={24}
                  height={24}
                  src={theme === 'dark' ? '/img/Plus-.png' : '/img/Plus-light.png'}
                  className="w-full h-auto"
                  alt=""
                />
              </div>
            </div>

            <div className="h-[1px] bg-[#EAECF3] dark:bg-[#2B3139] mb-[20px]"></div>

            <div className="flex justify-between text-[14px] mb-[15px] dark:text-white text-[#43484E]">
              <div>{t('affiliate:canISee')}</div>
              <div>
                <Image
                  width={24}
                  height={24}
                  src={theme === 'dark' ? '/img/Plus-.png' : '/img/Plus-light.png'}
                  className="w-full h-auto"
                  alt=""
                />
              </div>
            </div>

            <div className="h-[1px] bg-[#EAECF3] dark:bg-[#2B3139] mb-[20px]"></div>

            <div className="flex justify-between text-[14px] mb-[15px] dark:text-white text-[#43484E]">
              <div>{t('affiliate:CanISendTip')}</div>
              <div>
                <Image
                  width={24}
                  height={24}
                  src={theme === 'dark' ? '/img/Plus-.png' : '/img/Plus-light.png'}
                  className="w-full h-auto"
                  alt=""
                />
              </div>
            </div>
            <div className="h-[1px] bg-[#EAECF3] dark:bg-[#2B3139] mb-[20px]"></div>
          </div>
        </>
      )}
      {isLogin && <AffiliateLoggedPage />}
    </>
  );
}

AffiliatePage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default AffiliatePage;
