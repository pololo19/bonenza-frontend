import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import { ArrowRight2, Lock } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ElementType, useEffect, useMemo, useState } from 'react';
import ReactLoading from 'react-loading';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_getClaims, api_postClaims } from '@/api/wallet';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { useUSDTPrice } from '@/base/hooks/useUSDTPrice';
import { currencyFormat1 } from '@/base/libs/utils';
import { getErrorMesssage1 } from '@/base/libs/utils/notificationToast';
import { getBalance } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';

import CommonModal from '../commonModal/commonModal';

type ModalRakeBackProps = {
  onClose: () => void;
  show: boolean;
  setShowModalRakeBackDetail: () => void;
  setShowModalBonusHistory: () => void;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

const cryptoLen = 4;
const fiatLen = 2;

export default function ModalRakeBack({
  show,
  onClose,
  setShowModalRakeBackDetail,
  setShowModalBonusHistory,
}: ModalRakeBackProps) {
  const dispatch = useAppDispatch();
  const usdtPrice = useUSDTPrice();
  const exchangeRate = useExchange();
  const { t } = useTranslation('');
  const router = useRouter();

  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [lockedAmount, setLockedAmount] = useState({
    balance: 0,
    balanceUsd: 0,
  });
  const [unlockedData, setUnlockedData] = useState({
    amount: 0,
    minimumUnlockAmount: 0,
    minimumUnlockAmountUsd: 0,
    minimumWagerAmountUsd: 0,
  });

  const { viewInFiat, localFiat, isLogin } = useSelector(
    (state: AppState) => ({
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      localFiat: state.wallet.localFiat,
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const requiredWagerAmount = useMemo(() => {
    const requiredAmount = unlockedData.minimumUnlockAmount - unlockedData.amount;
    const requiredWager = requiredAmount / (0.01 * 0.2);
    return requiredWager;
  }, [localFiat, unlockedData, lockedAmount]);

  const handleShowModalDetail = () => {
    setShowModalRakeBackDetail();
    onClose();
  };

  const handleClickModalHistory = () => {
    setShowModalBonusHistory();
    onClose();
  };

  const getClaimData = async () => {
    try {
      const _res = await api_getClaims();
      const tempUnlockedAmount = Number(_res.data?.unlockedAmount ?? 0);
      const tempUnlockMinimumAmount = Number(_res.data?.minimumUnlockAmount ?? 0);
      const tempUnlockMinimumAmountUsd = Number(_res.data?.minimumUnlockAmountUsd ?? 0);
      const tempMinimumWagerAmountUsd = Number(_res.data?.minimumWagerAmountUsd ?? 0);
      const tempLockedAmount = Number(_res.data?.lockedAmount ?? 0);
      const tempLockedAmountUsd = Number(_res.data?.lockedAmountUsd ?? 0);
      setUnlockedData({
        amount: tempUnlockedAmount,
        minimumUnlockAmount: tempUnlockMinimumAmount,
        minimumUnlockAmountUsd: tempUnlockMinimumAmountUsd,
        minimumWagerAmountUsd: tempMinimumWagerAmountUsd,
      });
      setLockedAmount({
        balance: tempLockedAmount,
        balanceUsd: tempLockedAmountUsd,
      });
    } catch (error) {
      setLockedAmount({
        balance: 0,
        balanceUsd: 0,
      });
    } finally {
    }
  };

  const handleCliam = async () => {
    if (isClaiming) return;
    try {
      setIsClaiming(true);
      await api_postClaims(unlockedData.amount);

      await api_getClaims();
      toast.success(t('deposit:claimComplete'), { containerId: TOAST_ENUM.COMMON });
      dispatch(getBalance());
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMesssage1(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsClaiming(false);
    }
  };

  useEffect(() => {
    if (isLogin && show) {
      getClaimData();
    }
  }, [isLogin, show, isClaiming]);

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:max-w-[464px] h-screen sm:h-[720px] sm:max-h-[80vh] sm:my-0"
        header={
          <div className="flex flex-col items-start dark:bg-color-header-primary bg-color-light-bg-primary px-[20px] py-[20px] gap-[20px]">
            <div className="text-[16px] dark:text-white text-black">USDT {t('deposit:rakeback')}</div>
          </div>
        }
      >
        <>
          <div className="dark:text-color-text-primary text-color-light-text-primary flex-col flex gap-[10px] h-[calc(100%-60px)] p-[12px] pt-0 pb-[30px] justify-between overflow-auto">
            <div className="bg-[url('/img/rakeBackBg.png')] min-h-[200px] bg-cover h-[200px] w-full bg-no-repeat relative">
              <div className="flex flex-col items-center justify-center h-full gap-[10px]">
                <div className="flex flex-col items-center justify-center">
                  <Image height={54} width={42} src="/img/coin-rakeBack.png" alt="" />
                  <p className="text-default mt-[2px] text-white font-bold">{t('deposit:unlocked')} USDT</p>
                </div>
                <div className="w-[236px] rounded-[5px] h-[36px] text-color-primary dark:bg-color-bg-primary bg-color-light-modal-bg-primary flex items-center justify-center gap-2">
                  <Image height={18} width={18} src="/img/fiats/USDT.png" alt="" />
                  <p className="text-[16px] font-bold">{currencyFormat1(unlockedData.amount, 2, '', false)}</p>
                </div>
                <div>
                  <div
                    role="button"
                    className={cn(
                      'w-[161px] cursor-pointer h-[38px] bg-color-primary text-white text-[14px] font-bold flex items-center justify-center rounded-default',
                      {
                        'pointer-events-none opacity-60': unlockedData.amount < unlockedData.minimumUnlockAmount,
                      },
                    )}
                    onClick={handleCliam}
                  >
                    {isClaiming ? (
                      <ReactLoading type="bubbles" color="#FFF" delay={50} className="!w-7 !h-7" />
                    ) : (
                      t('deposit:claim')
                    )}
                  </div>
                  <div className="text-[12px] mt-[2px] flex items-center justify-center dark:text-color-text-primary text-color-light-text-primary">
                    <p>{t('deposit:mintoclaim')}:</p> &nbsp;
                    <p className="text-white">
                      {currencyFormat1(unlockedData.minimumUnlockAmount, cryptoLen, '', false)} USDT
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[48px] mt-2 mb-5 px-6 py-[6px] dark:bg-[#24272B] bg-[#f5f6fa] rounded-[5px] flex items-center justify-between">
              <div className="flex items-center gap-1 font-bold dark:text-color-text-primary text-color-light-text-primary">
                <Lock size={12} variant="Bold" /> {t('deposit:locked')} USDT
              </div>
              <div
                className={cn('h-full flex flex-col', {
                  'items-end': viewInFiat,
                  'items-center justify-center': !viewInFiat,
                })}
              >
                <div className="font-bold text-black dark:text-white">
                  {`${currencyFormat1(lockedAmount.balance, cryptoLen, '', false)} USDT`}
                </div>
                {viewInFiat && (
                  <div className="text-[10px] text-right">
                    {currencyFormat1(lockedAmount.balanceUsd * exchangeRate, fiatLen, localFiat?.name ?? 'USD')}
                  </div>
                )}
              </div>
            </div>
            <div className="text-[14px] font-bold text-center">{t('deposit:howClaim')}</div>
            <div className="rounded-[5px] dark:bg-[#24272B] bg-[#f5f6fa] p-4 text-[12px]  mb-4">
              <p className="text-black dark:text-white">{t('deposit:unlockAmount')}</p>
              {requiredWagerAmount > 0 && (
                <p className="mt-[14px]">
                  {t('deposit:youStillNeed')} {`${currencyFormat1(requiredWagerAmount, cryptoLen, '', false)} USDT`}{' '}
                  {t('deposit:unlockable')}{' '}
                  {`${currencyFormat1(unlockedData.minimumUnlockAmount, cryptoLen, '', false)} USDT `}
                  <span
                    className="cursor-pointer text-color-primary hover:underline"
                    onClick={() => handleShowModalDetail()}
                  >
                    {t('deposit:viewDetails')}
                  </span>
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-[28px]">
                <div
                  onClick={() => {
                    onClose();
                    router.push('/casino');
                  }}
                  className="h-[38px] rounded-default cursor-pointer flex items-center flex-1 w-full min-w[192px] bg-gradient-btn-purple px-[16px] justify-center text-white font-bold text-[14px]"
                >
                  {t('deposit:goToCasino')}
                </div>
                {/* Hiding Go To Sports */}
                {/* <div
                  onClick={() => {
                    onClose();
                    router.push('/sports');
                  }}
                  className="h-[38px] cursor-pointer flex items-center flex-1 w-full min-w[192px] bg-gradient-btn-play px-[16px] justify-center text-white font-bold text-[14px]"
                >
                  {t('deposit:goToSports')}
                </div> */}
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
        </>
      </CommonModal>
    </>
  );
}
