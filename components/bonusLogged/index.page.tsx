import Image from 'next/image';
import { useTheme } from 'next-themes';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';

import { api_bonusStatistics } from '@/api/bonus';
import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { changeIsShowVipClubModal } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';
import BaseLayout from '@/components/layouts/base.layout';

import CardGeneralBonus from '../cards/cardGeneralBonus';
import CardVipBonus from '../cards/cardVipBonus';
import ModalBonusDetail from '../modal/bonusDetails/bonusDetails';

function BonusLoggedPage() {
  const exchangeRate = useExchange();
  const { t, i18n } = useTranslation('');
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [openModalBonusDetails, setOpenModalBonusDetails] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalData, setTotalData] = useState({
    bonusClaimedUsd: 0,
    vipBonusUsd: 0,
    specialBonusUsd: 0,
    generalBonusUsd: 0,
  });
  const [bonusData, setBonusData] = useState({
    general: {
      depositTime: 0,
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

  const { localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const dataGeneralBonus = useMemo(
    () => [
      {
        backgroundDark: '/img/bg-quest.png',
        backgroundLight: '/img/bg-quest-light.png',
        name: t('bonus:quest'),
        description: t('bonus:questDescription'),
        title: t('bonus:questTitle'),
        total: t('bonus:questTotal'),
        titleValue: '0 / 4',
        totalValue: '0 / 1',
        nameButton: t('bonus:questButton'),
        showDeposit: false,
      },
      {
        backgroundDark: '/img/bg-lucky-spin.png',
        backgroundLight: '/img/bg-lucky-spin-light.png',
        name: t('bonus:spin'),
        description: t('bonus:spinDescription'),
        title: t('bonus:spinTitle'),
        total: t('bonus:spinTotal'),
        titleValue: '1',
        totalValue: viewInFiat ? currencyFormat1(0 * exchangeRate, 2, localFiat?.name) : currencyFormat1(1000, 2),
        nameButton: t('bonus:spinButton'),
        showDeposit: false,
      },
      // {
      //   backgroundDark: '/img/bg-roll.png',
      //   backgroundLight: '/img/bg-roll-light.png',
      //   name: t('bonus:rollCompetition'),
      //   description: t('bonus:rollDescription'),
      //   title: t('bonus:rollTitle'),
      //   total: t('bonus:rollTotal'),
      //   titleValue: '0',
      //   totalValue: '₫ 0.00',
      //   nameButton: '',
      //   showDeposit: false,
      // },
      // {
      //   backgroundDark: '/img/bg-rakeback.png',
      //   backgroundLight: '/img/bg-rakeback-light.png',
      //   name: t('bonus:BNZRakeback'),
      //   description: t('bonus:BNZDescription'),
      //   title: t('bonus:BNZTitle'),
      //   total: t('bonus:BNZTotal'),
      //   titleValue: '5.00 USDT',
      //   totalValue: '0.00 USDT',
      //   nameButton: t('bonus:questButton'),
      //   showDeposit: false,
      // },
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
      },
    ],
    [i18n.language],
  );

  const dataCardVipBonus = useMemo(
    () => [
      // {
      //   backgroundDark: '/img/bg-recharge.png',
      //   backgroundLight: '/img/bg-recharge-light.png',
      //   name: t('bonus:recharge'),
      //   description: '',
      //   wagerRequired: t('bonus:wagerRequired'),
      //   currentTier: t('bonus:currentTier'),
      //   rechargeRate: t('bonus:rechargeRate'),
      //   readyToClaim: t('bonus:readyToClaim'),
      //   lastWeeklyBonus: '',
      //   wagerValue: 1000,
      //   tierValue: '-',
      //   rechargeRateValue: '-',
      //   readyToClaimValue: '-',
      //   lastWeekBonusValue: '',
      //   showHour: true,
      //   showDescription: false,
      // },
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
        wagerValue: viewInFiat ? currencyFormat1(1000 * exchangeRate, 2, localFiat?.name) : currencyFormat1(1000, 2),
        tierValue: '',
        rechargeRateValue: '',
        readyToClaimValue: '',
        lastWeekBonusValue: '-',
        showHour: false,
        showDescription: true,
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
        lastWeeklyBonus: t('bonus:lastWeeklyBonus'),
        wagerValue: viewInFiat ? currencyFormat1(1000 * exchangeRate, 2, localFiat?.name) : currencyFormat1(1000, 2),
        tierValue: '',
        rechargeRateValue: '',
        readyToClaimValue: '',
        lastWeekBonusValue: '-',
        showHour: false,
        showDescription: true,
      },
      // {
      //   backgroundDark: '/img/bg-sports.png',
      //   backgroundLight: '/img/bg-sports-light.png',
      //   name: t('bonus:sportsWeeklyBonus'),
      //   description: t('bonus:receiveEverySaturday'),
      //   wagerRequired: t('bonus:wagerRequired'),
      //   currentTier: '',
      //   rechargeRate: '',
      //   readyToClaim: '',
      //   lastWeeklyBonus: t('bonus:lastWeeklyBonus'),
      //   wagerValue: handleGetValue(500),
      //   tierValue: '',
      //   rechargeRateValue: '',
      //   readyToClaimValue: '',
      //   lastWeekBonusValue: '-',
      //   showHour: false,
      //   showDescription: true,
      // },
    ],
    [i18n.language, viewInFiat, localFiat],
  );

  const getBonusStatistics = async () => {
    try {
      setIsLoading(true);
      const _res = await api_bonusStatistics();
      setTotalData({
        bonusClaimedUsd: Number(_res.data?.totalBonusClaimedUsd || 0),
        vipBonusUsd: Number(_res.data?.totalVipBonusUsd || 0),
        specialBonusUsd: Number(_res.data?.totalSpecialBonusUsd || 0),
        generalBonusUsd: Number(_res.data?.totalGeneralBonusUsd || 0),
      });
      setBonusData({
        general: {
          depositTime: Number(_res.data?.generalBonus?.depositTimes || 0),
        },
        vip: {
          levelUp: {
            currentVipXP: Number(_res.data?.vipBonus?.levelUpRewards?.currentVipXp || 0),
            currentVipName: _res.data?.vipBonus?.currentVipName,
            nextVipXP: Number(_res.data?.vipBonus?.levelUpRewards?.nextVipXp || 0),
          },
          weeklyCashBack: {
            bonus: Number(_res.data?.vipBonus?.weeklyCashBack?.bonusUsd || 0),
          },
          monthlyCashBack: {
            bonus: Number(_res.data?.vipBonus?.monthlyCashBack?.bonusUsd || 0),
          },
        },
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBonusStatistics();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <div className="mb-[50px]">
        <div className="flex max-sm:flex-wrap items-center justify-between">
          <div className="text-[24px] dark:text-white text-color-light-text-primary font-semibold my-[16px] md:my-0">
            {t('bonus:bonus')}
          </div>
          <div className="flex h-[48px] w-full justify-end">
            <input
              className="focus:outline-none dark:bg-color-card-body-default bg-white text-[14px] rounded-[5px] placeholder:text-color-text-primary min-w-[200px] flex-1 md:w-[265px] sm:max-w-[265px] pl-[15px]"
              placeholder={String(t('bonus:redeemBonusCodeHere'))}
              type="text"
            />
            <div
              role="button"
              className="hover:opacity-[0.9] bg-color-primary text-[14px] text-white font-medium rounded-[5px] px-1 min-w-fit w-auto sm:w-[165px] justify-center flex items-center"
            >
              {t('bonus:redeemBonusCode')}
            </div>
          </div>
        </div>
        <div className={cn
          (
            "dark:bg-color-card-body-default bg-white rounded-[5px] max-[923px]", // Color & Border-radius
            "w-full gap-4 flex flex-col lg:flex-row lg:justify-between", // Layout
            "mt-[24px] px-[16px] py-[20px]" // Margin & Padding
          )}
        >
          <div className={cn(
            "flex justify-center items-center gap-[18px] max-[414px] pr-0 pb-[20px] lg:pr-[40px] lg:pb-0",
            "border-solid border-b-[1px] border-b-gray-300 dark:border-b-gray-700 lg:border-r-[1px] lg:border-r-gray-300 dark:lg:border-r-gray-700 lg:border-b-0"
          )}>
            <Image src={'/img/gold-coin.png'} width={93} height={76} alt="" className="pl-4"/>
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
            {totalData.bonusClaimedUsd > 0 ? (
              <div
                // onClick={handleClaimBonus}
                role="button"
                className="hover:opacity-[0.9] dark:bg-color-active-primary bg-color-light-bg-primary rounded-[5px] dark:text-color-text-primary text-black text-[14px] font-medium px-[24px] py-[12px] h-[48px] text-center max-[923px]:min-w-[114px] max-[923px]:text-center"
              >
                {t('bonus:claim')}
              </div>
            ) : (
              <div
                onClick={() => setOpenModalBonusDetails(true)}
                role="button"
                className="hover:opacity-[0.9] dark:bg-color-active-primary bg-color-light-bg-primary rounded-[5px] dark:text-color-text-primary text-black text-[14px] font-medium px-[24px] py-[12px] h-[48px] text-center max-[923px]:min-w-[114px] max-[923px]:text-center"
              >
                {t('bonus:details')}
              </div>
            )}
          </div>
        </div>
        <div className="mt-5">
          <div className="flex items-center gap-[10px] mb-[16px]">
            <div className="text-[20px] dark:text-white text-color-light-text-primary font-medium">
              {t('bonus:generalBonus')}
            </div>
          </div>
          <div className="grid grid-cols-3 max-[1227px]:grid-cols-2 max-[883px]:grid-cols-1 gap-[24px]">
            {dataGeneralBonus.map((item, index) => (
              <CardGeneralBonus
                key={index}
                background={theme === 'dark' ? item.backgroundDark : item.backgroundLight}
                name={item.name}
                description={item.description}
                title={item.title}
                total={item.total}
                titleValue={item.titleValue}
                totalValue={item.totalValue}
                nameButton={item.nameButton}
                showDeposit={item.showDeposit}
              />
            ))}
          </div>
        </div>
        <div className="mt-5 ">
          <div className="text-[20px] font-medium text-[#F39717] mb-[13px]">
            VIP{' '}
            <span className="text-[20px] font-medium dark:text-white text-color-light-text-primary">
              {t('bonus:Bonus')}
            </span>
          </div>
          <div className="grid grid-cols-3 max-[1227px]:grid-cols-2 max-[883px]:grid-cols-1 gap-[24px]">
            <div className="rounded-[5px] relative dark:bg-color-card-body-default bg-white h-full">
              <Image
                src={theme === 'dark' ? '/img/bg-levelup-rewards.png' : '/img/bg-levelup'}
                width={339}
                height={210}
                alt=""
                className="h-full w-full object-cover"
              />
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
                  <div className="flex justify-between w-[60%]">
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
                        {viewInFiat
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
                  <div className="text-[#fd6e08] font-medium text-[14px]">{t('bonus:viewVIPClub')}</div>
                </div>
              </div>
            </div>
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
              />
            ))}
          </div>
        </div>
        <div className="mt-5">
          <div className="text-[20px] dark:text-white text-color-light-text-primary font-medium mb-[18px]">
            {t('bonus:specialBonus')}
          </div>
          <div className="dark:bg-color-card-body-default bg-white rounded-[5px] w-full h-[250px] flex flex-col items-center justify-center gap-[12px]">
            <Image
              src={theme === 'dark' ? '/img/no-data.png' : '/img/no-data-light-mode.png'}
              width={90}
              height={90}
              alt=""
            />
            <div className="dark:text-[#53575C] text-color-text-primary text-[13px]">{t('bonus:noData')}</div>
          </div>
        </div>
      </div>
      {openModalBonusDetails && (
        <ModalBonusDetail show={openModalBonusDetails} onClose={() => setOpenModalBonusDetails(false)} />
      )}
    </>
  );
}

BonusLoggedPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default BonusLoggedPage;
