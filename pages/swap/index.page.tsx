import Head from 'next/head';
import { ReactElement, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_swap } from '@/api/wallet';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { getErrorMessage } from '@/base/libs/utils/notificationToast';
import { getBalance } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';
import SelectCurrencySwap, {
  SelectCurrencySwapFormRef,
  SwapFormType,
} from '@/components/selectCurrencySwap/selectCurrencySwap';

import styles from './index.module.scss';
import ReactLoading from 'react-loading';

const SwapPage = () => {
  const { symbols } = useSelector(
    (state: AppState) => ({
      symbols: state.wallet.symbols,
    }),
    shallowEqual,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwapAvailable, setIsSwapAvailable] = useState<boolean>(true);
  const formDataRef = useRef<SelectCurrencySwapFormRef>(null);

  const { t } = useTranslation('');
  const dispatch = useAppDispatch();

  const emitData = () => formDataRef.current?.emitData?.();

  const onSubmit = async (data: SwapFormType) => {
    try {
      setIsLoading(true);
      // disable dron for swap
      const dron = symbols.find((symbol) => symbol.name.toLowerCase() === 'dron');
      if (dron?.id === data.symbolFrom || dron?.id === data.symbolTo) {
        toast.error(t('errors:swap:disabledToken'), { containerId: TOAST_ENUM.COMMON, toastId: 'swap-error' });
        return;
      }
      if (Number(data.amountFrom) === 0) {
        toast.error(t('swap:inValidSwapAmount'), { containerId: TOAST_ENUM.COMMON, toastId: 'swap-error' });
        return;
      }
      if (data.symbolTo === data.symbolFrom) {
        toast.error(t('swap:duplicateSwapAddress'), { containerId: TOAST_ENUM.COMMON, toastId: 'swap-error' });
        return;
      }

      await api_swap(String(data.symbolFrom), String(data.symbolTo), Number(data.amountFrom));
      dispatch(getBalance());

      toast.success(String(t('swap:swapSuccessfully')), { containerId: TOAST_ENUM.COMMON, toastId: 'swap-success' });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMessage(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON, toastId: 'swap-error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`${styles.cardContent}`}>
        <div className={`lg:max-w-[75%] ${styles.contentHeader}`}>
          <div>
            <div>
              <div className="flex flex-col items-start gap-[15px] w-full text-start">
                <SelectCurrencySwap onSubmit={onSubmit} ref={formDataRef} setSwapAvailable={setIsSwapAvailable} />
              </div>

              <div className="mt-[40px] w-full text-white text-start flex items-center justify-center gap-[10px]">
                <button
                  type="submit"
                  className="flex justify-center items-center bg-gradient-btn-play rounded-large h-[45px] min-w-[150px] hover:opacity-[0.9] disabled:opacity-60 disabled:text-gray-300"
                  onClick={emitData}
                  disabled={!isSwapAvailable}
                >
                  {isLoading ? (
                    <ReactLoading type="bubbles" color="#FFF" delay={50} className="!w-10 !h-10" />
                  ) : (
                    t('swap:swapNow')
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const SwapPageAuth = withAuth(SwapPage);

SwapPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default SwapPageAuth;
