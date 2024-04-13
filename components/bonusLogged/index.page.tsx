import cn from 'classnames';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_bonusStatistics } from '@/api/bonus';
import { api_getClaims } from '@/api/wallet';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { useUSDTPrice } from '@/base/hooks/useUSDTPrice';
import { currencyFormat1 } from '@/base/libs/utils';
import {
  changeIsShowBonusDetail,
  changeIsShowQuest,
  changeIsShowRakeBack,
  changeIsShowSpin,
  changeIsShowVipClubModal,
} from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';
import BaseLayout from '@/components/layouts/base.layout';

import CardGeneralBonus from '../cards/cardGeneralBonus';
import CardVipBonus from '../cards/cardVipBonus';

function BonusLoggedPage() {
  const exchangeRate = useExchange();
  const { t, i18n } = useTranslation('');
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const usdtPrice = useUSDTPrice();

  const [totalData, setTotalData] = useState({
    bonusClaimedUsd: 0,
    vipBonusUsd: 0,
    specialBonusUsd: 0,
    generalBonusUsd: 0,
  });
  const [bonusData, setBonusData] = useState({
    general: {
      depositTime: 0,
      dailyCompleteQuest: 0,
      weeklyCompleteQuest: 0,
      availableSpin: 0,
      wagerAmountForDailySpin: 1600,
      levelForSpin: 8,
    },
    vip: {
      levelUp: {
        currentVipXP: 0,
        currentVipName: '',
        nextVipXP: 0,
      },
      weeklyCashBack: {
        bonus: 0,
      },
      monthlyCashBack: {
        bonus: 0,
      },
    },
  });
  const [lockedAmount, setLockedAmount] = useState<number>(0);

  const { localFiat, viewInFiat, isLogin, isShowSpinClaim } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      isLogin: state.auth.isLogin,
      isShowSpinClaim: state.modal.isShowSpinClaim,
    }),
    shallowEqual,
  );

  const dataGeneralBonus = useMemo(
    () => [
      {
        backgroundDark: '',
        backgroundLight: '',
        name: t('bonus:depositBonus'),
        description: '',
        title: '',
        total: '',
        titleValue: '',
        totalValue: '',
        nameButton: '',
        showDeposit: true,
        tooltip: [t('bonus:depositBonusRulesContent')],
        action: () => {},
      },
      {
        backgroundDark: '/img/bg-quest.png',
        backgroundLight: '/img/bg-quest-light.png',
        name: t('bonus:quest'),
        description: t('bonus:questDescription'),
        title: t('bonus:questTitle'),
        total: t('bonus:questTotal'),
        titleValue: `${bonusData.general.dailyCompleteQuest}/4`,
        totalValue: `${bonusData.general.weeklyCompleteQuest}/1`,
        nameButton: t('bonus:questButton'),
        showDeposit: false,
        tooltip: [t('bonus:questToolTip')],
        action: () => {
          dispatch(changeIsShowQuest(true));
        },
      },
      {
        backgroundDark: '/img/bg-lucky-spin.png',
        backgroundLight: '/img/bg-lucky-spin-light.png',
        name: t('bonus:spin'),
        description: `${t('bonus:spinDescription')}`,
        descriptionValue: `${bonusData.general.availableSpin}`,
        title: t('bonus:spinTitle'),
        total: t('bonus:spinTotal'),
        titleValue: `${currencyFormat1(bonusData.general.wagerAmountForDailySpin, 2)}`,
        totalValue: `${t('bonus:spinTotalDescription')} VIP ${bonusData.general.levelForSpin}`,
        nameButton: t('bonus:spinButton'),
        showDeposit: false,
        tooltip: [t('bonus:luckySpinToolTip1'), t('bonus:luckySpinToolTip2')],
        action: () => {
          dispatch(changeIsShowSpin(true));
        },
      },
      {
        backgroundDark: '/img/bg-rakeback.png',
        backgroundLight: '/img/bg-rakeback-light.png',
        name: t('bonus:BNZRakeback'),
        description: t('bonus:BNZDescription'),
        title: t('bonus:BNZTitle'),
        total: t('bonus:BNZTotal'),
        titleValue: '5.00 USDT',
        totalValue: `${
          viewInFiat
            ? currencyFormat1((lockedAmount / usdtPrice) * exchangeRate, 2, localFiat?.name)
            : currencyFormat1(lockedAmount, 2, '', false)
        } USDT`,
        nameButton: t('bonus:unlockRakeBack'),
        showDeposit: false,
        action: () => {
          dispatch(changeIsShowRakeBack(true));
        },
        tooltip: [t('bonus:rakebackTooltip1'), t('bonus:rakebackTooltip2')],
      },
    ],
    [i18n.language, lockedAmount, bonusData],
  );
  const dataCardVipBonus = useMemo(
    () => [
      {
        backgroundDark: '/img/bg-weekly-cashback.png',
        backgroundLight: '/img/bg-weekly-cashback-light.png',
        name: t('bonus:weekCashback'),
        description: t('bonus:receiveEveryFriday'),
        wagerRequired: t('bonus:wagerRequired'),
        currentTier: '',
        rechargeRate: '',
        readyToClaim: '',
        lastWeeklyBonus: t('bonus:lastWeeklyBonus'),
        wagerValue: currencyFormat1(1000, 2),
        tierValue: '',
        rechargeRateValue: '',
        readyToClaimValue: '',
        lastWeekBonusValue: '-',
        showHour: false,
        showDescription: true,
        tooltip: [t('bonus:weeklyCashBackTooltip1'), t('bonus:weeklyCashBackTooltip2')],
      },
      {
        backgroundDark: '/img/bg-weekly-cashback2.png',
        backgroundLight: '/img/bg-weekly-cashback2-light.png',
        name: t('bonus:monthlyCashback'),
        description: t('bonus:weekCashbackDescription'),
        wagerRequired: t('bonus:wagerRequired'),
        currentTier: '',
        rechargeRate: '',
        readyToClaim: '',
        lastWeeklyBonus: t('bonus:lastMonthlyBonus'),
        wagerValue: currencyFormat1(10000, 2),
        tierValue: '',
        rechargeRateValue: '',
        readyToClaimValue: '',
        lastWeekBonusValue: '-',
        showHour: false,
        showDescription: true,
        tooltip: [t('bonus:monthlyCashBackTooltip1'), t('bonus:monthlyCashBackTooltip2')],
      },
    ],
    [i18n.language, viewInFiat, localFiat],
  );

  const getBonusStatistics = async () => {
    try {
      const _res = await api_bonusStatistics();
      const tempTotalData = {
        bonusClaimedUsd: Number(_res.data?.totalBonusClaimedUsd || 0),
        vipBonusUsd: Number(_res.data?.totalVipBonusUsd || 0),
        specialBonusUsd: Number(_res.data?.totalSpecialBonusUsd || 0),
        generalBonusUsd: Number(_res.data?.totalGeneralBonusUsd || 0),
      };
      setTotalData(tempTotalData);
      const tempBonusData = {
        general: {
          depositTime: Number(_res.data?.generalBonus?.deposit?.depositTimes || 0),
          availableSpin: Number(_res.data?.generalBonus?.spin?.availableCount || 0),
          levelForSpin: Number(_res.data?.generalBonus?.spin?.reachVipLevel || 0),
          wagerAmountForDailySpin: Number(_res.data?.generalBonus?.spin?.requiredWagerAmountUsd || 0),
          dailyCompleteQuest: Number(_res.data?.generalBonus?.quest?.dailyCompleteCount || 0),
          weeklyCompleteQuest: Number(_res.data?.generalBonus?.quest?.weeklyCompleteCount || 0),
        },
        vip: {
          levelUp: {
            currentVipXP: Number(_res.data?.vipBonus?.levelUpRewards?.currentVipXp || 0),
            currentVipName: _res.data?.vipBonus?.levelUpRewards?.currentVipName || '',
            nextVipXP: Number(_res.data?.vipBonus?.levelUpRewards?.nextVipXp || 0),
          },
          weeklyCashBack: {
            bonus: Number(_res.data?.vipBonus?.weeklyCashBack?.bonusUsd || 0),
          },
          monthlyCashBack: {
            bonus: Number(_res.data?.vipBonus?.monthlyCashBack?.bonusUsd || 0),
          },
        },
      };
      setBonusData(tempBonusData);
      const claimRes = await api_getClaims();
      const tempUnlockedAmount = Number(claimRes.data?.unlockedAmount ?? 0);
      setLockedAmount(tempUnlockedAmount);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLogin) {
      getBonusStatistics();
    }
  }, [isLogin, isShowSpinClaim]);
  const onRedeemClick = () => {
    toast.error("The code doesn't exist", {
      toastId: 'redeemCodeEmpty',
      containerId: TOAST_ENUM.COMMON,
      icon: true,
      autoClose: 3000,
      hideProgressBar: false,
    });
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="mb-[50px]">
        <div className="flex max-sm:flex-wrap items-center justify-between">
          <div className="text-[16px] md:text-[24px] dark:text-white text-color-light-text-primary font-semibold my-[16px] md:my-0">
            {t('bonus:bonus')}
          </div>
          <div className="flex h-[48px] w-full justify-end">
            <input
              className="focus:outline-none dark:bg-color-table-header-text-secondary/30 bg-white text-[12px] sm:text-[14px] rounded-l-large placeholder:text-color-text-primary min-w-[100px] flex-1 md:w-[265px] sm:max-w-[265px] pl-[15px]"
              placeholder={String(t('bonus:redeemBonusCodeHere'))}
              type="text"
            />
            <div
              onClick={onRedeemClick}
              role="button"
              className={cn(
                'active:scale-105 scale-100 transition-all',
                'hover:opacity-[0.9] bg-gradient-btn-play text-[12px] sm:text-[14px] text-white font-medium rounded-r-large ',
                'px-2 sm:px-4 justify-center flex items-center',
              )}
            >
              {t('bonus:redeemBonusCode')}
            </div>
          </div>
        </div>
        <div
          className={cn(
            'dark:bg-color-card-body-default bg-white rounded-[5px] max-[923px]', // Color & Border-radius
            'w-full gap-4 flex flex-col lg:flex-row lg:justify-between', // Layout
            'mt-[24px] px-[16px] py-[20px]', // Margin & Padding
          )}
        >
          <div
            className={cn(
              'flex justify-center items-center gap-[18px] max-[414px] pr-0 pb-[20px] lg:pr-[40px] lg:pb-0',
              'border-solid border-b-[1px] border-b-gray-300 dark:border-b-gray-700 lg:border-r-[1px] lg:border-r-gray-300 dark:lg:border-r-gray-700 lg:border-b-0',
            )}
          >
            <Image src={'/img/gold-coin.png'} width={93} height={76} alt="" className="pl-4" />
            <div className="flex flex-col items-center">
              <div className="text-[14px] dark:text-white text-color-light-text-primary min-w-[155px]">
                {t('bonus:totalBonusClaimed')}
              </div>
              <div className={`font-bold text-color-primary text-[24px]`}>
                {viewInFiat
                  ? currencyFormat1(totalData.bonusClaimedUsd * exchangeRate, 2, localFiat?.name)
                  : currencyFormat1(totalData.bonusClaimedUsd, 2)}
              </div>
            </div>
          </div>
          <div className="sm:px-10 md:px-0 xl:px-10 grid gap-4 grid-cols-2 lg:grid-cols-4 lg:gap-[40px] items-center">
            {/* VIP Bonus */}
            <div className="min-w-[155px]">
              <div className="text-[14px] text-color-text-primary">{t('bonus:totalVIPBonus')}</div>
              <div className="text-[16px] dark:text-white text-color-light-text-primary font-bold">
                {viewInFiat
                  ? currencyFormat1(totalData.vipBonusUsd * exchangeRate, 2, localFiat?.name)
                  : currencyFormat1(totalData.vipBonusUsd, 2)}
              </div>
            </div>
            {/* Special Bonus */}
            <div className="min-w-[155px]">
              <div className="text-[14px] text-color-text-primary">{t('bonus:totalSpecialBonus')}</div>
              <div className="text-[16px] dark:text-white text-color-light-text-primary font-bold">
                {viewInFiat
                  ? currencyFormat1(totalData.specialBonusUsd * exchangeRate, 2, localFiat?.name)
                  : currencyFormat1(totalData.specialBonusUsd, 2)}
              </div>
            </div>
            {/* General Bonus */}
            <div className="min-w-[155px]">
              <div className="text-[14px] text-color-text-primary">{t('bonus:totalGeneralBonus')}</div>
              <div className="text-[16px] dark:text-white text-color-light-text-primary font-bold">
                {viewInFiat
                  ? currencyFormat1(totalData.generalBonusUsd * exchangeRate, 2, localFiat?.name)
                  : currencyFormat1(totalData.generalBonusUsd, 2)}
              </div>
            </div>
            {/* Claim & Details Button */}
            <div
              onClick={() => dispatch(changeIsShowBonusDetail(true))}
              role="button"
              className="hover:opacity-[0.9] dark:bg-color-active-primary bg-color-light-bg-primary rounded-large dark:text-color-text-primary text-black text-[14px] font-medium px-[24px] py-[12px] h-[48px] text-center max-[923px]:min-w-[114px] max-[923px]:text-center"
            >
              {t('bonus:details')}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex items-center gap-[10px] mb-[16px]">
            <div className="text-[16px] md:text-[20px] dark:text-white text-color-light-text-primary font-medium">
              {t('bonus:generalBonus')} & VIP{' '}
              <span className="text-[16px] md:text-[20px] font-medium dark:text-white text-color-light-text-primary">
                {t('bonus:Bonus')}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 max-[1227px]:grid-cols-2 max-[883px]:grid-cols-1 gap-[24px]">
            <div className="rounded-[5px] relative dark:bg-[#1C1E22] bg-white h-full min-h-[250px]">
              <div className="absolute top-5 bottom-5 left-[18px] right-[18px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-[10px]">
                    <div className="text-[16px] dark:text-white text-color-light-text-primary font-bold">
                      {t('bonus:levelUpRewards')}
                    </div>
                  </div>
                  <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px] mt-[5px]">
                    {t('bonus:levelUpRewardsDescription')}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <div>
                      <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px]">
                        {t('bonus:currentVIP')}
                      </div>
                      <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px]">
                        {t('bonus:xPNextLevel')}
                      </div>
                      <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px]">
                        {t('bonus:readyToClaim')}
                      </div>
                    </div>
                    <div>
                      <div className="dark:text-[#fff] text-color-light-text-primary font-semibold text-[14px] text-right">
                        {bonusData.vip.levelUp.currentVipName}
                      </div>
                      <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px] text-right flex">
                        <span className="font-bold dark:text-white">{bonusData.vip.levelUp.currentVipXP}</span>
                        <span>/</span>
                        <span>{bonusData.vip.levelUp.nextVipXP}</span>
                      </div>
                      <div className="dark:text-color-text-primary text-color-light-text-primary text-[14px] text-right">
                        {totalData.bonusClaimedUsd === 0
                          ? '-'
                          : viewInFiat
                          ? currencyFormat1(totalData.bonusClaimedUsd * exchangeRate, 2, localFiat?.name)
                          : currencyFormat1(totalData.bonusClaimedUsd, 2)}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  role="button"
                  onClick={() => dispatch(changeIsShowVipClubModal(true))}
                  className="dark:bg-[#2D3035] bg-color-light-bg-primary flex gap-[10px] items-center justify-center rounded-[5px] h-[38px]"
                >
                  <div className="text-color-primary font-medium text-[14px]">{t('bonus:viewVIPClub')}</div>
                </div>
              </div>
            </div>
            {dataGeneralBonus.map((item, index) => (
              <CardGeneralBonus
                key={index}
                background={theme === 'dark' ? item.backgroundDark : item.backgroundLight}
                name={item.name}
                description={item.description}
                descriptionValue={item?.descriptionValue || ''}
                title={item.title}
                total={item.total}
                titleValue={item.titleValue}
                totalValue={item.totalValue}
                nameButton={item.nameButton}
                showDeposit={item.showDeposit}
                tooltip={item.tooltip || []}
                onClick={item.action}
              />
            ))}
            {dataCardVipBonus.map((item, index) => (
              <CardVipBonus
                key={index}
                background={theme === 'dark' ? item.backgroundDark : item.backgroundLight}
                name={item.name}
                description={item.description}
                wagerRequired={item.wagerRequired}
                currentTier={item.currentTier}
                rechargeRate={item.rechargeRate}
                readyToClaim={item.readyToClaim}
                lastWeeklyBonus={item.lastWeeklyBonus}
                wagerValue={String(item.wagerValue)}
                tierValue={item.tierValue}
                rechargeRateValue={item.rechargeRateValue}
                readyToClaimValue={item.readyToClaimValue}
                lastWeekBonusValue={item.lastWeekBonusValue}
                showHour={item.showHour}
                showDescription={item.showDescription}
                tooltip={item.tooltip}
              />
            ))}
          </div>
        </div>
        <div className="mt-5">
          <div className="text-[16px] md:text-[20px] dark:text-white text-color-light-text-primary font-medium mb-[18px]">
            {t('bonus:specialBonus')}
          </div>
          <div className="dark:bg-color-card-body-default bg-white rounded-[5px] w-full h-[250px] flex flex-col items-center justify-center gap-[12px]">
            <Image
              src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
              width={90}
              height={90}
              alt=""
            />
            <div className="dark:text-[#53575C] text-color-text-primary text-[13px]">{t('bonus:noData')}</div>
          </div>
        </div>
      </div>
    </>
  );
}

BonusLoggedPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default BonusLoggedPage;
