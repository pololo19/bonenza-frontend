import React, { ReactElement, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { TOAST_ENUM } from '@/base/constants/common';
import BaseLayout from '@/components/layouts/base.layout';
import { useTranslation } from '@/base/config/i18next';
import CardGeneralBonus from '../cards/cardGeneralBonus';
import CardVipBonus from '../cards/cardVipBonus';
import api from '@/api/api';
import Loader from '@/components/common/preloader/loader';
import { RootState } from '@/base/types/root-state';
import { currencyFormat, exchangeByLocaleFiat, handleLocaleSymbol, isDecimalNumber } from '@/base/libs/utils';
import { changeIsShowVipClubModal } from '@/base/redux/reducers/modal.reducer';
import ModalBonusDetail from '../modal/bonusDetails/bonusDetails';

function BonusLoggedPage() {
  const { t } = useTranslation('');
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bonusData, setBonusData] = useState<any>({});
  const [levelData, setLevelData] = useState<any>({});
  const [openModalBonusDetails, setOpenModalBonusDetails] = useState<boolean>(false);
  const { localeFiat } = useSelector(
    (state: RootState) => ({
      localeFiat: state.common.localeFiat,
    }),
    shallowEqual,
  );

  const handleGetValue = (amount: number) => {
    const exchange = exchangeByLocaleFiat('USD', String(localeFiat?.currency), amount);
    return localeFiat
      ? `${handleLocaleSymbol(String(localeFiat?.currency))} ${currencyFormat(
          exchange,
          isDecimalNumber(exchange) ? 3 : 0,
        )}`
      : `$${currencyFormat(amount, isDecimalNumber(amount) ? 3 : 0)}`;
  };

  const dataGeneralBonus = [
    {
      backgroundDark: '/img/bg-quest.png',
      backgroundLight: '/img/bg-quest-light.png',
      name: t('bonus:quest'),
      description: t('bonus:questDescription'),
      title: t('bonus:questTitle'),
      total: t('bonus:questTotal'),
      titleValue: '0/4',
      totalValue: '0/1',
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
      totalValue: handleGetValue(0),
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
    {
      backgroundDark: '/img/bg-rakeback.png',
      backgroundLight: '/img/bg-rakeback-light.png',
      name: t('bonus:BNZRakeback'),
      description: t('bonus:BNZDescription'),
      title: t('bonus:BNZTitle'),
      total: t('bonus:BNZTotal'),
      titleValue: '5.00 USDT',
      totalValue: '0.00 USDT',
      nameButton: t('bonus:questButton'),
      showDeposit: false,
    },
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
  ];

  const dataCardVipBonus = [
    {
      backgroundDark: '/img/bg-recharge.png',
      backgroundLight: '/img/bg-recharge-light.png',
      name: t('bonus:recharge'),
      description: '',
      wagerRequired: t('bonus:wagerRequired'),
      currentTier: t('bonus:currentTier'),
      rechargeRate: t('bonus:rechargeRate'),
      readyToClaim: t('bonus:readyToClaim'),
      lastWeeklyBonus: '',
      wagerValue: handleGetValue(1000),
      tierValue: '-',
      rechargeRateValue: '-',
      readyToClaimValue: '-',
      lastWeekBonusValue: '',
      showHour: true,
      showDescription: false,
    },
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
      wagerValue: handleGetValue(1000),
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
      wagerValue: handleGetValue(10000),
      tierValue: '',
      rechargeRateValue: '',
      readyToClaimValue: '',
      lastWeekBonusValue: '-',
      showHour: false,
      showDescription: true,
    },
    {
      backgroundDark: '/img/bg-sports.png',
      backgroundLight: '/img/bg-sports-light.png',
      name: t('bonus:sportsWeeklyBonus'),
      description: t('bonus:receiveEverySaturday'),
      wagerRequired: t('bonus:wagerRequired'),
      currentTier: '',
      rechargeRate: '',
      readyToClaim: '',
      lastWeeklyBonus: t('bonus:lastWeeklyBonus'),
      wagerValue: handleGetValue(500),
      tierValue: '',
      rechargeRateValue: '',
      readyToClaimValue: '',
      lastWeekBonusValue: '-',
      showHour: false,
      showDescription: true,
    },
  ];

  const getVipListByRank = async () => {
    try {
      const res = await api.get('user-profile/get-vip');
      setLevelData(res.data);
    } catch (error) {
    } finally {
    }
  };

  const handleGetBonus = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('vip/get-bonus');
      setBonusData(res.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimBonus = async () => {
    try {
      setIsLoading(true);
      await api.post('vip/confirm-bonus-vip');
      toast.success(
        <div>
          {t('bonus:haveReceived', {
            bonus: bonusData?.totalBonusClaim,
          })}
        </div>,
        { containerId: TOAST_ENUM.COMMON },
      );
      handleGetBonus();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getValueBonus = (bonus: number) => {
    return localeFiat
      ? ` ${currencyFormat(exchangeByLocaleFiat('USD', String(localeFiat?.currency), bonus), 2)}`
      : currencyFormat(bonus, 2);
  };

  useEffect(() => {
    handleGetBonus();
    getVipListByRank();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <div className="mb-[50px]">
        <div className="flex max-sm:flex-wrap items-center justify-between">
          <div className="text-[18px] dark:text-white text-[#141414] font-semibold my-[16px] md:my-0">
            {t('bonus:bonus')}
          </div>
          <div className="flex h-[40px]">
            <input
              className="focus:outline-none dark:bg-[#12181F] bg-white text-[13px] rounded-[5px] placeholder:text-[#939699] min-w-[200px] flex-1 md:w-[265px] sm:max-w-[265px] pl-[15px]"
              placeholder={String(t('bonus:redeemBonusCodeHere'))}
              type="text"
            />
            <div
              role="button"
              className="hover:opacity-[0.9] bg-[#20D4EB] text-[13px] text-white font-bold rounded-[5px] px-1 min-w-fit w-auto sm:w-[165px] justify-center flex items-center"
            >
              {t('bonus:redeemBonusCode')}
            </div>
          </div>
        </div>
        <div className="mt-[18px] dark:bg-[#1C1E22] bg-white rounded-[5px] w-full flex items-center justify-between px-[16px] py-[20px] max-[923px]:flex-col">
          <div className="flex items-center gap-[18px] pr-[5%] max-[414px]:w-full">
            <Image src={'/img/gold-coin.png'} width={61} height={51} alt="" />
            <div>
              <div className="text-[12px] dark:text-white text-[#141414]">{t('bonus:totalBonusClaimed')}</div>
              <div className={`font-bold text-[#fd6e08] text-[20px]`}>
                {handleLocaleSymbol(localeFiat?.currency || 'USD')}
                {getValueBonus(bonusData?.totalBonusClaim)}
              </div>
            </div>
          </div>
          <div className="flex gap-[70px] max-[923px]:mt-[30px]">
            <div>
              <div className="text-[12px] text-[#939699]">{t('bonus:totalVIPBonus')}</div>
              <div className="text-[14px] dark:text-white text-[#141414] font-bold">
                {handleLocaleSymbol(localeFiat?.currency || 'USD')}
                {getValueBonus(bonusData?.totalVipBonus)}
              </div>
            </div>
            <div>
              <div className="text-[12px] text-[#939699]">{t('bonus:totalSpecialBonus')}</div>
              <div className="text-[14px] dark:text-white text-[#141414] font-bold">
                {handleLocaleSymbol(localeFiat?.currency || 'USD')}
                {getValueBonus(bonusData?.totalSpecialBonus)}
              </div>
            </div>
          </div>
          <div className="flex gap-[70px] max-[923px]:mt-[13px]">
            <div>
              <div className="text-[12px] text-[#939699]">{t('bonus:totalGeneralBonus')}</div>
              <div className="text-[14px] dark:text-white text-[#141414] font-bold">
                {handleLocaleSymbol(localeFiat?.currency || 'USD')}
                {getValueBonus(bonusData?.totalGeneralBonus)}
              </div>
            </div>
            {bonusData?.totalBonusClaim > 0 ? (
              <div
                onClick={handleClaimBonus}
                role="button"
                className="hover:opacity-[0.9] dark:bg-[#2D3035] bg-[#F6F7FA] rounded-[5px] dark:text-[#0DFDE4] text-black text-[14px] h-[38px] font-bold py-[10px] px-[16px] max-[923px]:min-w-[114px] max-[923px]:text-center"
              >
                {t('bonus:claim')}
              </div>
            ) : (
              <div
                onClick={() => setOpenModalBonusDetails(true)}
                role="button"
                className="hover:opacity-[0.9] dark:bg-[#2D3035] bg-[#F6F7FA] rounded-[5px] dark:text-[#0DFDE4] text-black text-[14px] h-[38px] font-bold py-[10px] px-[16px] max-[923px]:min-w-[114px] max-[923px]:text-center"
              >
                {t('bonus:details')}
              </div>
            )}
          </div>
        </div>
        <div className="mt-5">
          <div className="flex items-center gap-[10px] mb-[16px]">
            <div className="text-[16px] dark:text-white text-[#141414] font-bold">{t('bonus:generalBonus')}</div>
            <div className="bg-[#0DFDE4] text-white text-[14px] w-[20px] h-[20px] rounded-[50%] text-center">1</div>
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
        <div className="mt-5">
          <div className="text-[18px] font-semibold text-[#F39717] mb-[13px]">
            VIP <span className="text-[18px] font-semibold dark:text-white text-[#141414]">{t('bonus:Bonus')}</span>
          </div>
          <div className="grid grid-cols-3 max-[1227px]:grid-cols-2 max-[883px]:grid-cols-1 gap-[24px]">
            <div className="rounded-[5px] relative">
              <Image
                src="/img/bg-levelup-rewards.png"
                width={339}
                height={192}
                alt=""
                className="h-[192px] w-full object-cover"
              />
              <div className="absolute top-5 left-[17px] right-[18px]">
                <div className="flex items-center gap-[10px]">
                  <div className="text-[14px] dark:text-white text-[#141414] font-bold">
                    {t('bonus:levelUpRewards')}
                  </div>
                </div>
                <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px] mt-[5px]">
                  {t('bonus:levelUpRewardsDescription')}
                </div>
                <div className="mt-[10px] flex justify-between w-[60%]">
                  <div>
                    <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px]">{t('bonus:currentVIP')}</div>
                    <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px]">{t('bonus:xPNextLevel')}</div>
                    <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px]">{t('bonus:readyToClaim')}</div>
                  </div>
                  <div>
                    <div className="dark:text-[#fff] text-[#43484E] font-semibold text-[12px] text-right">
                      {levelData?.vipCurrent?.type}
                      {levelData?.vipCurrent?.level}
                    </div>
                    <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px] text-right flex">
                      <span className="font-bold dark:text-white">{levelData?.totalXp}</span>
                      <span>/</span>
                      <span>{levelData?.totalXp + levelData?.xpNextLevel}</span>
                    </div>
                    <div className="dark:text-[#98A7B5] text-[#43484E] text-[12px] text-right">
                      {handleLocaleSymbol(localeFiat?.currency || 'USD')}
                      {getValueBonus(bonusData?.totalBonusClaim)}
                    </div>
                  </div>
                </div>
              </div>
              <div
                role="button"
                onClick={() => dispatch(changeIsShowVipClubModal(true))}
                className="dark:bg-[#2D3035] bg-[#F6F7FA] flex gap-[10px] items-center justify-center rounded-[5px] h-[38px] absolute bottom-[17px] left-[17px] right-[18px]"
              >
                <div className="text-[#fd6e08] font-semibold text-[12px]">{t('bonus:viewVIPClub')}</div>
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
                wagerValue={item.wagerValue}
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
          <div className="text-[16px] dark:text-white text-[#141414] font-bold mb-[18px]">
            {t('bonus:specialBonus')}
          </div>
          <div className="dark:bg-[#1C1E22] bg-white rounded-[5px] w-full h-[250px] flex flex-col items-center justify-center gap-[12px]">
            <Image
              src={theme === 'dark' ? '/img/no-data.png' : '/img/no-data-light-mode.png'}
              width={90}
              height={90}
              alt=""
            />
            <div className="dark:text-[#53575C] text-[#98A7B5] text-[13px]">{t('bonus:noData')}</div>
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
