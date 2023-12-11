import { ArrowRight } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import React, { ReactElement, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { changeAuthenticationType, changeIsShowAuthenticationModal } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';
import BonusLoggedPage from '@/components/bonusLogged/index.page';
import BaseLayout from '@/components/layouts/base.layout';
import styles from '@/styles/dashboard/index.module.scss';

function BonusPage() {
  const { t } = useTranslation('');
  const { isLogin, user } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
      user: state.auth.user,
    }),
    shallowEqual,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = CookiesStorage.getAccessToken();
    if (accessToken) {
      dispatch(
        saveUserInfo({
          ...user,
        }),
      );
    }
  }, []);

  return (
    <>
      <Head>
        <title>Bonus - Bonenza</title>
      </Head>
      <div className="w-full pt-3 sm:pt-5">
        {!isLogin && (
          <div>
            <div className="dark:bg-[url('/img/banner-bonus-mobile.png')] bg-[url('/img/banner-bonus-mobile-light-mode.png')] sm:dark:bg-[url('/img/banner-bonus.png')] sm:bg-[url('/img/banner-bonus-light-mode.png')] bg-cover bg-no-repeat pt-[40px] pb-[30px] max-h-[683px] sm:max-h-unset">
              <div className="flex flex-col items-start lg:items-baseline ml-[10px] sm:ml-[30px] lg:ml-[106px] max-[576px]:mt-[57%] max-[414px]:mt-[60%] mt-[50%] sm:mt-0">
                <div
                  className={`${styles.textGradient} font-bold text-[30px] sm:text-[36px] lg:text-[48px] bg-primary text-center w-full sm:w-unset sm:text-left`}
                >
                  {t('bonus:unlockEndlessBenefit')}
                </div>
                <div className="text-[#939699] text-[16px] text-center w-full sm:w-unset sm:text-left">
                  {t('bonus:joinNowAndEmbark')}
                </div>
                <div className="flex sm:hidden justify-center my-[10px] w-full">
                  <div
                    role="button"
                    className="bg-btn-sign-in rounded-large bg-primary py-[10px] px-5 font-bold text-white"
                  >
                    {t('bonus:joinNow')}
                  </div>
                </div>
                <div className="flex items-center sm:mt-[12px]">
                  <Image width={50} height={50} src="/img/gift-bonus.png" className="w-[50px] h-[50px]" alt="" />
                  <div>
                    <div className="text-[14px] dark:text-white text-[#141414] font-bold uppercase">
                      {t('bonus:levelUpBonus')}
                    </div>
                    <div className="text-[13px] text-[#939699]">{t('bonus:reachNewHeight')}</div>
                  </div>
                </div>
                <div className="flex items-center mt-[12px]">
                  <Image width={50} height={50} src="/img/coin-bonus.png" className="w-[50px] h-[50px]" alt="" />
                  <div>
                    <div className="text-[14px] dark:text-white text-[#141414] font-bold uppercase">
                      {t('bonus:recharge')}
                    </div>
                    <div className="text-[13px] text-[#939699]">{t('bonus:scheduleYourRecharge')}</div>
                  </div>
                </div>
                <div className="flex items-center mt-[12px]">
                  <Image width={50} height={50} src="/img/hourglass-bonus.png" className="w-[50px] h-[50px]" alt="" />
                  <div>
                    <div className="text-[14px] dark:text-white text-[#141414] font-bold uppercase">
                      {t('bonus:weeklyCashback')}
                    </div>
                    <div className="text-[13px] text-[#939699]">{t('bonus:powerUpWith')}</div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex justify-center mt-5">
                <div
                  role="button"
                  onClick={() => {
                    dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                    dispatch(changeIsShowAuthenticationModal(true));
                  }}
                  className="bg-btn-sign-in rounded-[5px] bg-primary py-[10px] px-5 font-bold text-white"
                >
                  {t('bonus:joinNow')}
                </div>
              </div>
            </div>
            <div className="flex justify-around flex-col items-center lg:items-baseline gap-[15px] md:gap-0 md:flex-row md:items-center mt-[40px]">
              <div className="flex items-center gap-[15px]">
                <div className="text-white text-[16px] font-bold bg-primary px-[10px] py-[6px] rounded-[50%]">01</div>
                <div className="dark:text-white text-[#43484E] text-[16px] font-bold">
                  {t('bonus:signUpAndMakeDeposit')}
                </div>
              </div>
              <div className="flex items-center gap-[15px]">
                <div className="text-white text-[16px] font-bold bg-primary px-[10px] py-[6px] rounded-[50%]">02</div>
                <div className="dark:text-white text-[#43484E] text-[16px] font-bold">{t('bonus:playYourGame')}</div>
              </div>
              <div className="flex items-center gap-[15px]">
                <div className="text-white text-[16px] font-bold bg-primary px-[10px] py-[6px] rounded-[50%]">03</div>
                <div className="dark:text-white text-[#43484E] text-[16px] font-bold">{t('bonus:increaseYourVip')}</div>
              </div>
            </div>
            <div className="mt-[60px] flex flex-col gap-[20px]">
              <div className="flex flex-col md:flex-row items-center">
                <Image width={100} height={100} src="/img/special-deposit.png" className="w-fit md:w-[50%]" alt="" />
                <div className="flex md:block flex-col items-center">
                  <div className="text-[24px] text-center md:text-left dark:text-white text-[#141414] font-bold uppercase">
                    {t('bonus:discoverBonenza')}
                  </div>
                  <div className="mt-5 text-center md:text-left md:mt-[40px] text-[#939699] text-[16px]">
                    {t('bonus:weAreUnique')}
                  </div>
                  <div
                    role="button"
                    onClick={() => {
                      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                      dispatch(changeIsShowAuthenticationModal(true));
                    }}
                    className="text-[14px] hover:opacity-[0.9] text-white font-bold bg-[#F39717] rounded-[5px] py-[13px] px-[22px] max-w-[285px] mt-5 md:mt-[40px] text-center"
                  >
                    {t('bonus:claimYourDepositBonus')}
                  </div>
                </div>
              </div>
              <div className="flex flex-col-reverse md:flex-row items-center">
                <div className="flex flex-col items-center md:items-end gap-[40px]">
                  <div className="text-[24px] dark:text-white text-[#141414] font-bold text-center md:text-right">
                    {t('bonus:withOurLevelUpBonus')}
                  </div>
                  <div className="text-[#939699] text-[16px] text-center md:text-right">
                    {t('bonus:empowerYourFinances')}
                  </div>
                  <div
                    role="button"
                    onClick={() => {
                      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                      dispatch(changeIsShowAuthenticationModal(true));
                    }}
                    className="text-[14px] hover:opacity-[0.9] text-white font-bold bg-[#FD6E0B] rounded-[5px] py-[13px] px-[22px] max-w-[282px] text-center"
                  >
                    {t('bonus:unlockLevel')}
                  </div>
                </div>
                <Image width={100} height={100} src="/img/promotion-bonus.png" className="w-fit md:w-[50%]" alt="" />
              </div>
              <div className="flex flex-col md:flex-row items-center">
                <Image width={100} height={100} src="/img/potential-of-BCD.png" className="w-fit md:w-[50%]" alt="" />
                <div className="flex md:block flex-col items-center">
                  <div className="text-[24px] text-center md:text-left dark:text-white text-[#141414] font-bold">
                    {t('bonus:maximizeThePotential')}
                  </div>
                  <div className="mt-5 text-center md:text-left md:mt-[40px] text-[#939699] text-[16px]">
                    {t('bonus:earnLocked')}
                  </div>
                  <div
                    role="button"
                    onClick={() => {
                      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                      dispatch(changeIsShowAuthenticationModal(true));
                    }}
                    className="text-[14px] hover:opacity-[0.9] text-white font-bold bg-[#F61B4F] rounded-[5px] py-[13px] px-[22px] max-w-[302px] mt-5 md:mt-[40px] text-center"
                  >
                    {t('bonus:howToUnlock')}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[37px]">
              <div className="text-center mb-[40px]">
                <div
                  className="font-semibold dark:text-white text-[#141414] text-lg"
                  dangerouslySetInnerHTML={{ __html: t('bonus:getALotOfFreePerks') }}
                ></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px]">
                <div className="bg-gradient-to-l from-[#F61B4F]/50">
                  <div className="bg-[#F61B4F]/20 rounded-br-[25px] text-[#F61B4F] text-[14px] font-bold max-w-[160px] h-[40px] flex items-center justify-center">
                    {t('bonus:everyDayAndWeek')}
                  </div>
                  <div className="flex items-center mx-5 gap-5 pb-5">
                    <div>
                      <div className="text-[14px] dark:text-white text-[#141414] font-bold uppercase">
                        {t('bonus:questHub')}
                      </div>
                      <div className="text-[#939699] text-[12px] mt-[10px]">{t('bonus:conquerDaily')}</div>
                    </div>
                    <Image width={100} height={100} src="/img/darts.png" className="w-[50%]" alt="" />
                  </div>
                </div>
                <div className="bg-gradient-to-l from-[#0DFDE4]/50">
                  <div className="dark:bg-[#0C6760]/20 bg-[#15F1E5]/20 rounded-br-[25px] text-[#15F1E5] text-[14px] font-bold max-w-[160px] h-[40px] flex items-center justify-center">
                    {t('bonus:everyDayAndWeek')}
                  </div>
                  <div className="flex items-center mx-5 gap-5 pb-5 pt-5 lg:pt-0">
                    <div>
                      <div className="text-[14px] dark:text-white text-[#141414] font-bold uppercase">
                        {t('bonus:freeLuckySpins')}
                      </div>
                      <div className="text-[#939699] text-[12px] mt-[10px]">{t('bonus:spinAndWin')}</div>
                    </div>
                    <Image width={100} height={100} src="/img/spin-lucky.png" className="w-[50%]" alt="" />
                  </div>
                </div>
                <div className="bg-gradient-to-l from-[#F39717]/50">
                  <div className="bg-[#FFB400]/20 rounded-br-[25px] text-[#FFB400] text-[14px] font-bold max-w-[160px] h-[40px] flex items-center justify-center">
                    {t('bonus:everyDayAndWeek')}
                  </div>
                  <div className="flex items-center mx-5 gap-5 pb-5">
                    <div>
                      <div className="text-[14px] dark:text-white text-[#141414] font-bold uppercase">
                        {t('bonus:freeRollCompetition')}
                      </div>
                      <div className="text-[#939699] text-[12px] mt-[10px]">{t('bonus:theEarlier')}</div>
                    </div>
                    <Image width={100} height={100} src="/img/egg-free.png" className="w-[50%]" alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[40px] sm:mt-0">
              <div className="dark:bg-[url('/img/banner-galaxy-mobile.png')] bg-[url('/img/banner-galaxy-mobile-light-mode.png')] sm:dark:bg-[url('/img/banner-galaxy.png')] sm:bg-[url('/img/banner-galaxy-light-mode.png')] bg-no-repeat bg-cover px-[10px] sm:px-5 md:px-[60px] sm:pt-[146px] pb-5 sm:pb-[40px] flex flex-col gap-5 sm:gap-[106px]">
                <div className="flex justify-center lg:justify-end sm:justify-start mt-[60%] sm:mt-0 text-center sm:text-left">
                  <div className="max-w-[490px]">
                    <div className="font-bold text-[18px] sm:text-[24px] dark:text-white text-[#141414]">
                      {t('bonus:introducingOurVeryOwn')} <span className="text-[#E7A427]">{t('bonus:recharge')}</span>{' '}
                      {t('bonus:cashback')}
                    </div>
                    <div className="text-[12px] sm:text-[16px] text-[#939699] mt-5 sm:mt-[40px]">
                      {t('bonus:immerseYourself')}
                    </div>
                    <div className="flex items-center gap-[7px] mt-5 sm:mt-[40px] justify-center sm:justify-start">
                      <div className="text-[13px] text-[#0DFDE4]">{t('bonus:joinBonenzaToday')}</div>
                      <ArrowRight className="text-[#0DFDE4] w-[14px] h-[14px]" />
                    </div>
                  </div>
                </div>
                <div className="dark:bg-[#272934]/80 bg-[#EAECF3]/80 rounded-[15px] flex flex-col lg:flex-row py-[30px] px-[10px] sm:px-5 md:px-[42px] gap-[10px] sm:gap-0">
                  <div className="flex items-center gap-[24px]">
                    <Image width={100} height={100} src="/img/treasure.png" className="w-[21%]" alt="" />
                    <div>
                      <div className="text-[14px] dark:text-white text-[#141414] font-bold">
                        {t('bonus:rechargeActivation')}
                      </div>
                      <div className="text-[#939699] text-[12px] mt-[10px]">
                        {t('bonus:journeyTowardsRechargeActivation')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-[24px]">
                    <Image width={100} height={100} src="/img/star.png" className="w-[21%]" alt="" />
                    <div>
                      <div className="text-[14px] dark:text-white text-[#141414] font-bold">
                        {t('bonus:rechargeAtYourPace')}
                      </div>
                      <div className="text-[#939699] text-[12px] mt-[10px]">{t('bonus:claimBonuses')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-[24px]">
                    <Image width={100} height={100} src="/img/coin-bonus.png" className="w-[21%]" alt="" />
                    <div>
                      <div className="text-[14px] dark:text-white text-[#141414] font-bold">
                        {t('bonus:rechargeRewardTiers')}
                      </div>
                      <div className="text-[#939699] text-[12px] mt-[10px]">{t('bonus:snowballYourRewards')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[25px]">
              <div className="text-center mb-[40px]">
                <div
                  className="font-semibold dark:text-white text-[#141414] text-lg"
                  dangerouslySetInnerHTML={{ __html: t('bonus:weHaveMoreBenefit') }}
                ></div>
              </div>
              <div className="flex justify-between gap-5 xl:gap-0 flex-col items-center sm:flex-row sm:items-baseline">
                <div className="flex flex-col items-center max-w-[284px]">
                  <Image src="/img/coco.png" width={139} height={139} className="object-cover" alt="" />
                  <div className="text-[14px] font-bold dark:text-white text-[#141414] mt-[30px] text-center">
                    {t('bonus:catchCocoForSurprisingRewards')}
                  </div>
                  <div className="text-[12px] text-[#939699] mt-[10px] text-center">{t('bonus:catchTheFleeting')}</div>
                </div>
                <div className="flex flex-col items-center max-w-[284px]">
                  <Image src="/img/lotto.png" width={139} height={139} className="object-cover" alt="" />
                  <div className="text-[14px] font-bold dark:text-white text-[#141414] mt-[30px] text-center uppercase">
                    {t('bonus:winWithBonenzaLottery')}
                  </div>
                  <div className="text-[12px] text-[#939699] mt-[10px] text-center">
                    {t('bonus:experienceProvablyFair')}
                  </div>
                </div>
                <div className="flex flex-col items-center max-w-[284px]">
                  <Image src="/img/golden-bag.png" width={139} height={139} className="object-cover" alt="" />
                  <div className="text-[14px] font-bold dark:text-white text-[#141414] mt-[30px] text-center">
                    {t('bonus:waitForCoinDrop')}
                  </div>
                  <div className="text-[12px] text-[#939699] mt-[10px] text-center">
                    {t('bonus:engageChatAndSeize')}
                  </div>
                </div>
              </div>
            </div>
            <div className="dark:bg-[#2C2D32] bg-white flex flex-col mt-[60px] items-center py-[50px] px-5 mb-[60px] sm:mb-5">
              <div className="dark:text-white text-[#141414] text-[14px] sm:text-[24px] font-bold text-center">
                {t('bonus:weAreProud')}
              </div>
              <div className="flex justify-center mt-[30px]">
                <div
                  role="button"
                  onClick={() => {
                    dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                    dispatch(changeIsShowAuthenticationModal(true));
                  }}
                  className="bg-btn-sign-in rounded-[5px] bg-primary py-[10px] px-5 font-bold text-white"
                >
                  {t('bonus:signUpNow')}
                </div>
              </div>
            </div>
          </div>
        )}
        {isLogin && <BonusLoggedPage />}
      </div>
    </>
  );
}

BonusPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default BonusPage;
