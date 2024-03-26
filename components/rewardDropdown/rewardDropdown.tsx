import { Popover, Transition } from '@headlessui/react';
import { ArrowRight2, Gift } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_bonusClaim, api_bonusClaimList } from '@/api/bonus';
import { api_getClaims } from '@/api/wallet';
import { ROUTER, TOAST_ENUM } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { getBalance, setLockedAmount } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';

type BonusType = {
  id: string;
  amount: number;
  amountUsd: number;
  type: string;
  typeName: string;
  allow: boolean;
};

const fiatDecimals = 8;

export default function RewardDropdown() {
  const exchangeRate = useExchange();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [claimingBonus, setClaimingBonus] = useState<string>('');
  const { viewInFiat, localFiat, lockedAmount, isLogin, isShowSpinClaim } = useSelector(
    (state: AppState) => ({
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      localFiat: state.wallet.localFiat,
      lockedAmount: state.wallet.lockedAmount,
      isLogin: state.auth.isLogin,
      isShowSpinClaim: state.modal.isShowSpinClaim,
    }),
    shallowEqual,
  );

  const [bonuses, setBonuses] = useState<BonusType[]>([]);
  const getBonusList = async () => {
    try {
      const _res = await api_bonusClaimList();
      const tempBonuses: BonusType[] = _res.data?.map((item: any) => ({
        id: item.id ?? '',
        amount: Number(item.amount || 0),
        amountUsd: Number(item.amountUsd || 0),
        type: item.type,
        typeName: item?.typeName || '',
        allow: item.allowClaim,
      }));
      setBonuses(tempBonuses);
    } catch (error) {
      setBonuses([]);
    } finally {
    }
  };

  const handleClaim = async (bonus: BonusType) => {
    if (claimingBonus === null || claimingBonus === '') return;
    try {
      setClaimingBonus(bonus.id);
      await api_bonusClaim(bonus.id, bonus.type);

      const _resBonus = await api_getClaims();
      const tempLockedAmount = Number(_resBonus.data?.lockedAmount ?? 0);

      const tempBonuses = [...bonuses];
      const pos = tempBonuses.findIndex((item) => item.id === bonus.id);
      tempBonuses.splice(pos, 1);
      setBonuses(tempBonuses);
      dispatch(getBalance());
      dispatch(setLockedAmount(tempLockedAmount));
      toast.success(t('success:bonusClaimed'), { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      toast.error(error.response.data.error || t('errors:internalServer'), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setClaimingBonus('');
    }
  };

  useEffect(() => {
    if (isLogin) {
      getBonusList();
    }
  }, [isLogin, isShowSpinClaim]);

  const getBonusType = (type: string) => {
    switch (type) {
      case 'level_up':
        return t('bonus:levelUpRewards');
      case 'wager_contest':
        return t('bonus:wagerContestRewards');
      case 'weekly_cashback':
        return t('bonus:weeklyCashBackRewards');
      case 'monthly_cashback':
        return t('bonus:monthlyCashBackRewards');
      default:
        return type;
    }
  };

  return (
    <>
      <>
        {bonuses.filter((item) => item.allow).length > 0 && (
          <Popover className="h-full mr-[10px] relative w-auto rounded-[7px] text-center aspect-square dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary">
            {({ open }) => (
              <>
                <Popover.Button className="h-full">
                  <div className="flex flex-col h-full justify-center dark:text-white text-color-text-primary items-center relative ">
                    <Gift variant="Bold" className="w-[28px] h-[28px] sm:w-[20px] sm:h-[20px]" />
                    <div className="absolute text-white bg-color-primary rounded-full top-0 -right-[calc(50%)] px-[6px] text-[10px]">
                      {bonuses.filter((item) => item.allow).length}
                    </div>
                  </div>
                </Popover.Button>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed sm:hidden block inset-0 bg-black/80 transition-opacity z-[-1]" />
                </Transition.Child>
                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Popover.Panel
                    static
                    className="mr-0 right-0 sm:absolute fixed sm:min-w-[400px] z-10 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none sm:w-auto w-full top-[57px]"
                  >
                    <div className="px-[20px] flex flex-col gap-[10px] relative rounded-md py-[10px] dark:bg-color-menu-secondary bg-white sm:w-auto w-full shadow-gray-700 dark:shadow">
                      <div className="flex justify-between">
                        <div className="dark:text-white text-left text-color-light-text-primary text-[14px]">
                          {t('bonus:bonusReady')}
                        </div>
                        {/* <div className="text-color-secondary text-left  text-[14px]">
                          <div
                            className="w-fit flex items-center justify-end dark:bg-white/20 bg-black/10 px-1 rounded gap-2"
                            onClick={() => dispatch(changeIsShowRakeBack(true))}
                          >
                            <Lock size={12} variant="Bold" /> {currencyFormat1(lockedAmount, 2, '', false)}
                          </div>
                        </div> */}
                      </div>
                      <div className="max-h-[calc(100vh-300px)] overflow-auto flex flex-col gap-[10px]">
                        {bonuses
                          .filter((item) => item.allow)
                          .map((bonus, index) => (
                            <div
                              className="flex w-full justify-between gap-[40px] rounded-[3px] p-[10px] dark:bg-color-menu-primary bg-color-light-bg-primary"
                              key={index}
                            >
                              <div className="flex gap-[10px]">
                                <div className="flex flex-col justify-center items-center">
                                  {bonus.type !== 'wager_contest' && (
                                    <Image
                                      width={30}
                                      height={30}
                                      src="/img/spin_reward.png"
                                      className="w-auth h-fit"
                                      alt=""
                                    />
                                  )}
                                  {bonus.type === 'wager_contest' && (
                                    <Image
                                      width={30}
                                      height={30}
                                      src="/img/wager_contest_reward.png"
                                      className="w-auth h-fit"
                                      alt=""
                                    />
                                  )}
                                  {bonus.type === 'weekly_cashback' && (
                                    <Image
                                      width={30}
                                      height={30}
                                      src="/img/weekly_cashback_reward.png"
                                      className="w-auth h-fit"
                                      alt=""
                                    />
                                  )}
                                  {bonus.type === 'monthly_cashback' && (
                                    <Image
                                      width={30}
                                      height={30}
                                      src="/img/monthly_cashback_reward.png"
                                      className="w-auth h-fit"
                                      alt=""
                                    />
                                  )}
                                  {bonus.type === 'level_up' && (
                                    <Image
                                      width={30}
                                      height={30}
                                      src="/img/levelup_reward.png"
                                      className="w-auth h-fit"
                                      alt=""
                                    />
                                  )}
                                </div>

                                <div className="flex flex-col gap-[5px] justify-center">
                                  <p className="text-[14px] dark:text-white text-color-light-text-primary text-left">
                                    {getBonusType(bonus.typeName)}
                                  </p>
                                  <div className="flex text-[14px] text-color-text-primary gap-[5px] items-center">
                                    {!viewInFiat && (
                                      <Image
                                        width={12}
                                        height={12}
                                        src="/img/fiats/USDT.png"
                                        className="w-[12px] h-[12px]"
                                        alt=""
                                      />
                                    )}
                                    {viewInFiat
                                      ? currencyFormat1(bonus.amountUsd * exchangeRate, fiatDecimals, localFiat?.name)
                                      : currencyFormat1(bonus.amount, fiatDecimals, '', false)}
                                  </div>
                                </div>
                              </div>
                              <div className="py-[2px] flex items-center">
                                <button
                                  className="bg-gradient-btn-play px-[20px] text-white rounded-default disabled:cursor-not-allowed min-h-[40px] min-w-[82px] flex justify-center items-center"
                                  disabled={lockedAmount <= bonus.amount}
                                  onClick={() => handleClaim(bonus)}
                                >
                                  {claimingBonus === bonus.id ? (
                                    <ReactLoading type="bubbles" color="#FFF" delay={50} className="!w-6 !h-6" />
                                  ) : (
                                    <div>{t('deposit:claim')}</div>
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                      <Link href={ROUTER.Bonus}>
                        <div className="flex items-center text-color-primary text-[14px] text-center py-[10px] border-[1px] border-solid dark:border-color-border-primary rounded-large border-color-light-border-primary justify-center">
                          {t('bonus:bonusDashboard')}
                          <ArrowRight2 size={16} />
                        </div>
                      </Link>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        )}
        {bonuses.filter((item) => item.allow).length == 0 && (
          <Link
            className="sm:hidden block dark:hover:bg-color-hover-primary hover:bg-color-light-bg-primary text-gray-400 dark:hover:text-white hover:text-black p-[10px] max-[400px]:px-0 rounded-md"
            href={ROUTER.Bonus}
          >
            <Gift width={18} height={18} variant="Bold" />
          </Link>
        )}
      </>
    </>
  );
}
