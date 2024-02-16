import { Popover, Transition } from '@headlessui/react';
import { ArrowRight2, Gift } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_bonusClaim, api_bonusClaimList } from '@/api/bonus';
import { ROUTER, TOAST_ENUM } from '@/base/constants/common';
import { API_BONUS_CLAIM } from '@/base/constants/endpoints';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';

type BonusType = {
  id: string;
  amount: number;
  amountUsd: number;
  type: string;
};

export default function RewardDropdown() {
  const exchangeRate = useExchange();
  const { t } = useTranslation();
  const { viewInFiat, localFiat } = useSelector((state: AppState) => ({
    viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    localFiat: state.wallet.localFiat,
  }));

  const [bonuses, setBonuses] = useState<BonusType[]>([]);
  const getBonusList = async () => {
    try {
      const _res = await api_bonusClaimList();
      const tempBonuses: BonusType[] = _res.data?.map((item: any) => ({
        id: item.id ?? '',
        amount: Number(item.amount || 0),
        amountUsd: Number(item.amountUsd || 0),
        type: item.type,
      }));
      setBonuses(tempBonuses);
    } catch (error) {
      setBonuses([]);
    } finally {
    }
    t;
  };

  const handleClaim = async (bonus: BonusType) => {
    try {
      const _res = await api_bonusClaim(bonus.id, bonus.type);
      const status = _res.data.status;
      toast.success(t('success:bonusClaimed'), { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      toast.error(error.response.data.error || t('errors:internalServer'), { containerId: TOAST_ENUM.COMMON });
    }
  };

  useEffect(() => {
    getBonusList();
  }, []);

  return (
    <>
      <>
        {bonuses.length > 0 && (
          <Popover className="h-full mr-[10px] relative w-auto rounded-[7px] text-center aspect-square">
            {({ open }) => (
              <>
                <Popover.Button className="h-full">
                  <div className="flex flex-col h-full justify-center dark:text-white text-color-text-primary items-center relative">
                    <Gift variant="Bold" className="w-[24px] h-[24px] sm:w-[20px] sm:h-[20px]" />
                    <div className="absolute text-white bg-color-primary rounded-full top-0 -right-[calc(50%)] px-[6px] text-[10px]">
                      {bonuses.length}
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
                    <div className="gap-[10px] px-[20px] flex flex-col relative rounded-md p-[10px] dark:bg-color-menu-secondary bg-white sm:w-auto w-full shadow-gray-700 dark:shadow">
                      <div className="dark:text-white text-left text-color-light-text-primary text-[14px]">
                        {t('bonus:bonusReady')}
                      </div>
                      {bonuses.map((bonus) => (
                        <div className="flex w-full justify-between gap-[40px] rounded-[3px] p-[10px] dark:bg-color-menu-primary bg-color-light-bg-primary">
                          <div className="flex gap-[10px]">
                            <div className="flex flex-col justify-center items-center">
                              <Image width={30} height={30} src="/img/reward.png" className="w-auth h-fit" alt="" />
                            </div>

                            <div className="flex flex-col gap-[5px]">
                              <p className="text-[14px] dark:text-white text-color-light-text-primary">
                                {bonus.type === 'level_up' && t('bonus:levelUpRewards')}
                              </p>
                              <div className="flex text-[12px] text-color-text-primary gap-[5px] items-center">
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
                                  ? currencyFormat1(bonus.amountUsd * exchangeRate, 4, localFiat?.name)
                                  : currencyFormat1(bonus.amount, 4, '', false)}
                              </div>
                            </div>
                          </div>
                          <div className="py-[2px]">
                            <button
                              className="bg-gradient-btn-default px-[30px] h-full text-white rounded-[3px]"
                              onClick={() => handleClaim(bonus)}
                            >
                              {t('deposit:claim')}
                            </button>
                          </div>
                        </div>
                      ))}
                      <Link href={ROUTER.Bonus}>
                        <div className="flex items-center text-color-primary text-[14px] text-center py-[10px] border-[1px] border-solid dark:border-color-border-primary border-color-light-border-primary justify-center">
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
        {bonuses.length == 0 && (
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
