import { Dialog, DialogProps, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowRight2, Lock } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ElementType, Fragment, useEffect, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { currencyFormat, exchangeByLocaleFiat, formatLengthNumber, handleLocaleSymbol } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { FiatType } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';

type ModalRakeBackProps = {
  cryptoLocked?: FiatType;
  onClose: () => void;
  show: boolean;
  setShowModalRakeBackDetail: () => void;
  setShowModalBonusHistory: () => void;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalRakeBack({
  show,
  onClose,
  cryptoLocked,
  setShowModalRakeBackDetail,
  setShowModalBonusHistory,
}: ModalRakeBackProps) {
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [unlockedAmount, setUnlockedAmount] = useState<number>(0);

  const { localeFiat, activeFiat } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
      activeFiat: state.common.activeFiat,
    }),
    shallowEqual,
  );

  const getWagerAmount = (): string => {
    let amount = 5.0 / (0.01 * 0.2);
    return activeFiat
      ? `${handleLocaleSymbol(String(localeFiat?.currency))} ${currencyFormat(
          exchangeByLocaleFiat(cryptoLocked?.currency, String(localeFiat?.currency), amount),
          2,
        )}`
      : `$${formatLengthNumber(Number(amount), 4)}`;
  };

  const handleShowModalDetail = () => {
    setShowModalRakeBackDetail();
    onClose();
  };

  const handleClickModalHistory = () => {
    setShowModalBonusHistory();
    onClose();
  };

  const getUnlockAmount = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('deposit/get-unlocked-amount');
      setUnlockedAmount(res.data?.unlockedAmount);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const claimUnlockAmount = async () => {
    try {
      setIsLoading(true);
      const res = await api.post('deposit/claim-unlocked-amount');
      setUnlockedAmount(0);
      toast.success(
        <div>
          {t('deposit:claimComplete')}
          <br /> {res.data.bonus} USDT
        </div>,
        { containerId: TOAST_ENUM.COMMON },
      );
    } catch (error) {
      toast.error(t('deposit:claimFailed'), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUnlockAmount();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <Transition.Root show={show} as={Fragment}>
        <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10">
            <div className="flex min-h-full justify-center p-0 sm:p-4 text-center items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95"
              >
                <Dialog.Panel className="!overflow-hidden dark:text-[#98a7b5] text-[#31373d] dark:bg-[#1e2024] bg-white text-[14px] sm:max-w-[464px] h-screen sm:h-[720px] sm:max-h-[80vh] relative transform rounded-[15px] text-left shadow-xl transition-all my-0 w-full !p-0">
                  <Dialog.Title
                    as="div"
                    className="relative h-[60px] px-[20px] flex justify-between dark:bg-[#17181b] bg-[#f5f6fa] items-center"
                  >
                    <div className="text-[16px] dark:text-white text-black">USDT {t('deposit:rakeback')}</div>
                    <div className="group rounded-md" role="button" onClick={onClose}>
                      <XMarkIcon
                        width={15}
                        className="text-[#9FA5AC] group-hover:text-black dark:group-hover:text-white w-[1.5rem] h-[1.5rem]"
                      />
                    </div>
                  </Dialog.Title>
                  <div className="dark:text-[#98a7b5] text-[#31373d] flex-col flex gap-[10px] h-[calc(100%-60px)] p-[12px] pt-0 pb-[30px] justify-between overflow-auto">
                    <div className="bg-[url('/img/rakeBackBg.png')] min-h-[200px] bg-cover h-[200px] w-full bg-no-repeat relative">
                      <div className="flex flex-col items-center justify-center h-full gap-[10px]">
                        <div className="flex justify-center flex-col items-center">
                          <Image height={54} width={42} src="/img/coin-rakeBack.png" alt="" />
                          <p className="text-[10px] mt-[2px] text-[#98a7b5">{t('deposit:unlocked')} USDT</p>
                        </div>
                        <div className="w-[236px] rounded-[5px] h-[36px] text-[#0DFDE4] bg-[#17181bb3] flex items-center justify-center gap-2">
                          <Image height={18} width={18} src="/img/fiats/USDT.png" alt="" />
                          <p className="text-[16px] font-bold">{currencyFormat(unlockedAmount, 2)}</p>
                        </div>
                        <div>
                          <div
                            onClick={() => claimUnlockAmount()}
                            className={`${
                              unlockedAmount < 5 ? 'pointer-events-none opacity-60' : ''
                            } w-[161px] cursor-pointer h-[38px] bg-[#F39717] text-white text-[14px] font-bold flex items-center justify-center rounded-[5px]`}
                          >
                            {t('deposit:claim')}
                          </div>
                          <div className="text-[10px] mt-[2px] flex items-center justify-center text-[#98a7b5]">
                            <p>{t('deposit:mintoclaim')}:</p> &nbsp;
                            <p className="text-white">5 USDT</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="h-[48px] mt-2 mb-5 px-6 py-[6px] dark:bg-[#24272B] bg-[#f5f6fa] rounded-[5px] flex items-center justify-between">
                      <div className="text-[#939699] flex items-center gap-1">
                        <Lock size={12} variant="Bold" /> {t('deposit:locked')} USDT
                      </div>
                      <div className="h-full">
                        <div className="dark:text-white text-black">
                          {localeFiat
                            ? `${currencyFormat(
                                exchangeByLocaleFiat(cryptoLocked?.currency, 'USDT', cryptoLocked?.amountLocked),
                                2,
                              )}`
                            : `${formatLengthNumber(Number(cryptoLocked?.amountLocked), 4)}`}{' '}
                          USDT
                        </div>
                        <div className="text-[10px]">
                          {localeFiat
                            ? `${handleLocaleSymbol(String(localeFiat?.currency))} ${currencyFormat(
                                exchangeByLocaleFiat(
                                  cryptoLocked?.currency,
                                  String(localeFiat?.currency),
                                  cryptoLocked?.amountLocked,
                                ),
                                2,
                              )}`
                            : `${formatLengthNumber(Number(cryptoLocked?.amountLocked), 4)}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-[14px] font-bold text-center">{t('deposit:howClaim')}</div>
                    <div className="rounded-[5px] dark:bg-[#24272B] bg-[#f5f6fa] p-4 text-[12px]  mb-4">
                      <p className="dark:text-white text-black">{t('deposit:unlockAmount')}</p>
                      <p className="mt-[14px] mb-[28px]">
                        {t('deposit:youStillNeed')} {getWagerAmount()} {t('deposit:unlockable')} 5 USDT.{' '}
                        <span
                          className="text-[#0DFDE4] cursor-pointer hover:underline"
                          onClick={() => handleShowModalDetail()}
                        >
                          {t('deposit:viewDetails')}
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <div
                          onClick={() => router.push('/casino')}
                          className="h-[38px] cursor-pointer flex items-center flex-1 w-full min-w[192px] bg-[#20D4EB] px-[16px] justify-center text-white font-bold text-[14px] rounded-[5px]"
                        >
                          {t('deposit:goToCasino')}
                        </div>
                        <div
                          onClick={() => router.push('/sports')}
                          className="h-[38px] cursor-pointer flex items-center flex-1 w-full min-w[192px] bg-[#F61B4F] px-[16px] justify-center text-white font-bold text-[14px] rounded-[5px]"
                        >
                          {t('deposit:goToSports')}
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-2 dark:bg-[#25262B] cursor-pointer bg-[#f5f6fa] min-w-[131px] max-w-fit m-auto dark:text-white text-black text-[12px] font-bold px-[10px] py-2 rounded-[5px]"
                      onClick={() => handleClickModalHistory()}
                    >
                      USDT {t('deposit:bonusHistory')}
                      <ArrowRight2 size={12} />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
