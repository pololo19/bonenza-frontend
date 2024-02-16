import { Disclosure, Transition } from '@headlessui/react';
import { Add, Minus, SmsTracking } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import { ReactElement, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { changeAuthenticationType, changeIsShowAuthenticationModal } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';
import CheckMarkIcon from '@/components/icons/CheckMarkIcon';
import BaseLayout from '@/components/layouts/base.layout';
import CommissionReward from '@/components/modal/affiliate/commissionRewards/commissionRewards';
import ReferralRewardRules from '@/components/modal/affiliate/referralRewardRules/referralRewardRules';

import AffiliateLoggedPage from '../affiliate-logged/index.module';
import styles from './index.module.scss';
import classNames from 'classnames';

function AffiliatePage() {
  const exchange = useExchange();
  const { t, i18n } = useTranslation('');
  const dispatch = useDispatch();

  const [showDetailCommissionsRewards, setShowDetailCommissionsRewards] = useState(false);
  const [showReferralRewardRules, setShowReferralRewardRules] = useState(false);

  const { isLogin, localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

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
  return (
    <>
      <Head>
        <title>Affiliate - Bonenza</title>
      </Head>
      {!isLogin && (
        <>
          <div className={cn(
            "dark:bg-[#1C1E22] bg-[#FFFFFF] bg-[length:100%] lg:bg-[length:auto_100%] bg-no-repeat bg-right mb-[40px] mt-[25px] pt-[50px] lg:pt-[25px] lg:h-[360px]",
            "lg:dark:bg-[url('/img/page/banner-affiliate.png')]",
            "lg:bg-[url('/img/page/banner-affiliate-light-mode.png')]",
            "bg-[url('/img/page/banner-affiliate-back-mobile.png')]",
            )}
          >
            <div className="flex flex-col lg:w-1/2 w-full h-full justify-center items-center">
              <h1 className="italic text-[36px] lg:text-[28px] xl:text-[36px] mb-[10px] dark:text-white text-[#141414] text-center font-bold">
                {t('affiliate:inviteFriendsToEarn')}
              </h1>
              <h5
                className={`text-[30px] lg:text-[20px] xl:text-[30px] mb-[30px] text-center font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#ffd339] to-[#f59e00]`}
              >
                {`${
                  viewInFiat ? currencyFormat1(1000 * exchange, 2, localFiat?.name || 'USD') : currencyFormat1(1000, 2)
                } + 25%`}{' '}
                {t('affiliate:commission')}
              </h5>
              <div
                role="button"
                className="bg-btn-sign-in rounded-[5px] bg-color-primary flex items-center justify-center gap-[7px] max-w-[208px] px-[20px] py-[10px] font-bold text-white mb-[10px]"
                onClick={() => {
                  dispatch(changeIsShowAuthenticationModal(true));
                  dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
                }}
              >
                <span className="text-[14px]">{t('affiliate:signUpAndEarn')}</span>
                <div className="w-[34px] h-[35px] hidden md:flex items-center justify-center rounded-large bg-white/20">
                  <Image height={14} width={14} src="/img/icon/arrow-right.png" alt="" />
                </div>
              </div>
              <h5 className="text-[16px] text-center dark:text-white text-[#141414] mt-3">
                {t('affiliate:referralTermsConditions')}
              </h5>
              <div className={cn(
                "lg:hidden",
                "bg-[url('/img/page/banner-affiliate-mobile.png')] bg-[length:100%_100%]",
                "h-[300px] w-[450px] mt-10",
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="py-7 px-5 dark:bg-[#2D3237] bg-[#D2CDC9] md:bg-[url('/img/banner-image-box1.png')] bg-[center_right_1rem] bg-no-repeat bg-[length:28%_auto] rounded">
              <div className="sm:w-[100%] md:w-[70%]">
                <div className="text-[26px] mb-[16px] font-bold dark:text-white text-[#141414]">
                  {t('affiliate:getYour')}
                  <span className={`bg-gradient-to-b from-amber-500 to-amber-500 font-bold bg-clip-text text-transparent`}>
                    {' '}
                    {viewInFiat
                      ? currencyFormat1(1000 * exchange, 2, localFiat?.name || 'USD')
                      : currencyFormat1(1000, 2)}{' '}
                  </span>
                  <span className="font-bold">{t('affiliate:referralRewards')}</span>
                </div>
                <span className={`text-[16px] dark:text-[#939699] text-[#7C7A77]`}>
                  {t('affiliate:everyFriendYouInvite', {
                    reward: viewInFiat
                      ? currencyFormat1(1000 * exchange, 2, localFiat?.name || 'USD')
                      : currencyFormat1(1000, 2),
                  })}
                </span>
                <div className="md:hidden mt-5">
                  <Image width={200} height={30} src="/img/banner-image-box1.png" className="w-[50%] h-[50%] m-auto" alt="" />
                </div>
                <div
                  role="button"
                  className="sm:w-full md:max-w-[240px] text-[16px] hover:opacity-[0.9] text-white font-bold bg-color-primary rounded-[5px] py-[16px] px-[20px]  mt-4 md:mt-[40px] text-center"
                  onClick={() => setShowReferralRewardRules(true)}
                >
                  {t('affiliate:pleaseSeeTheDetails')}
                </div>
              </div>
            </div>
            <div className="py-7 px-5 dark:bg-[#2D3237] bg-[#D2CDC9] md:bg-[url('/img/banner-image-box2.png')] bg-[center_right_1rem] bg-no-repeat bg-[length:35%_auto] rounded">
              <div className="sm:w-[100%] md:w-[70%]">
                <div className="text-[26px] mb-[16px] font-bold dark:text-white text-[#141414]">
                  {t('affiliate:getYour')}{' '}                  
                  <span className={`bg-gradient-to-b from-amber-500 to-amber-500 font-bold bg-clip-text text-transparent`}> 25% </span>
                  <span className="font-bold">{t('affiliate:commissionRewards')}</span>
                </div>
                <span className="text-[16px] dark:text-[#939699] text-[#7C7A77]">{t('affiliate:youWillReceive')}</span>
                <div className="md:hidden mt-5">
                  <Image width={200} height={30} src="/img/banner-image-box2.png" className="w-[50%] h-[50%] m-auto" alt="" />
                </div>
                <div
                  role="button"
                  className="sm:w-full md:max-w-[240px] text-[16px] hover:opacity-[0.9] text-white font-bold bg-color-primary rounded-[5px] py-[16px] px-[20px]  mt-4 md:mt-[40px] text-center"
                  onClick={() => setShowDetailCommissionsRewards(true)}
                >
                  {t('affiliate:pleaseSeeTheDetails')}
                </div>
              </div>
            </div>
          </div>
          <div className="flex mb-[20px] mt-[50px]">
            <div className="mr-[10px]">
              <Image width={24} height={24} src="/img/Live-Stream.png" className="w-full h-auto" alt="" />
            </div>
            <div className="dark:text-white text-[#141414]">{t('affiliate:liveRewards')}</div>
          </div>
          <div className="flex lg:flex-row flex-col gap-[30px] py-[20px] justify-start items-center rounded-[5px] bg-[#FFFFFF] dark:bg-color-input-primary mb-[40px]">
            <div className="mr-[18px] ml-[12px]">
              <Image width={24} height={24} src="/img/Rewards.png" className="w-full h-auto" alt="" />
            </div>
            <div className="text-center mr-[40px]">
              <h5 className="mb-[10px] text-[14px] dark:text-white text-[#141414]">{t('affiliate:totalRewards')}</h5>
              <div className="dark:bg-color-panel-bg bg-[#F6F7FA] rounded-[5px] w-[420px] h-[60px] flex justify-center items-center ">
                <span className={`font-bold text-[24px] dark:text-white text-[#141414]`}>
                  {viewInFiat ? currencyFormat1(0 * exchange, 2, localFiat?.name || 'USD') : currencyFormat1(0, 2)}
                </span>
              </div>
            </div>
            <div>
              {/* <div className="flex mb-[10px]">
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
              </div> */}
            </div>
          </div>
          <div className="dark:bg-color-input-primary bg-white rounded-[5px] flex lg:flex-row flex-col items-center justify-center mb-[60px] p-[20px]">
            <div className="mr-[24px]">
              <Image width={210} height={198} alt="" src="/img/loudspeaker.png" />
            </div>
            <div className="w-full">
              <div className="flex gap-[5px]">
                <div className="mr-[3px] text-[20px] lg:text-[24px] dark:text-white text-[#141414] font-bold">
                  {t('affiliate:learnMoreAboutOur')}
                </div>
                <div className={`font-bold text-[20px] lg:text-[24px] bg-color-primary ${styles.textBanner}`}>
                  {t('affiliate:affiliateProgram')}
                </div>
              </div>
              <div>
                <div className="flex mb-[20px] gap-[10px]">
                  <CheckMarkIcon className="w-[24px] h-[24px] text-color-primary" />
                  <div className="text-[15px] text-gray-500">{t('affiliate:ifYouHaveA')}</div>
                </div>
              </div>
              <div>
                <div className="flex mb-[20px] gap-[10px]">
                  <CheckMarkIcon className="w-[24px] h-[24px] text-color-primary" />

                  <div className="text-[15px] text-gray-500">{t('affiliate:ifYouCanInvite')}</div>
                </div>
              </div>
              <div className="text-[16px] mb-[20px] dark:text-white text-[#141414]">
                {t('affiliate:forMoreDetails')}
              </div>
              <div className="flex justify-between max-w-[309px] h-[50px] rounded-[5px] dark:bg-color-panel-bg bg-[#F6F7FA] items-center p-[10px]">
                <div className="text-[14px] text-gray-500">Business@bonenza</div>
                <div className="flex items-center gap-[10px]">
                  <div className="text-[14px] text-color-primary">{t('affiliate:sendNow')}</div>
                  <div>
                    <SmsTracking className="w-[24px] h-[24px] text-color-primary" />
                  </div>
                </div>
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
        </>
      )}
      <CommissionReward show={showDetailCommissionsRewards} onClose={() => setShowDetailCommissionsRewards(false)} />
      <ReferralRewardRules show={showReferralRewardRules} onClose={() => setShowReferralRewardRules(false)} />
      {isLogin && <AffiliateLoggedPage />}
    </>
  );
}

AffiliatePage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default AffiliatePage;
