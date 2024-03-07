import Head from 'next/head';
import { ReactElement, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { api_swap } from '@/api/wallet';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import getErrorMessage from '@/base/libs/utils/notificationToast';
import { getBalance } from '@/base/redux/reducers/wallet.reducer';
import { useAppDispatch } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';
import SelectCurrencySwap, {
  SelectCurrencySwapFormRef,
  SwapFormType,
} from '@/components/selectCurrencySwap/selectCurrencySwap';

import styles from './index.module.scss';

const SwapPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formDataRef = useRef<SelectCurrencySwapFormRef>(null);

  const { t } = useTranslation('');
  const dispatch = useAppDispatch();

  const emitData = () => formDataRef.current?.emitData?.();

  const onSubmit = async (data: SwapFormType) => {
    try {
      setIsLoading(true);
      if (Number(data.amountFrom) === 0) {
        toast.error(t('swap:inValidSwapAmount'), { containerId: TOAST_ENUM.COMMON });
        return;
      }
      if (data.symbolTo === data.symbolFrom) {
        toast.error(t('swap:duplicateSwapAddress'), { containerId: TOAST_ENUM.COMMON });
        return;
      }
      await api_swap(String(data.symbolFrom), String(data.symbolTo), Number(data.amountFrom));
      dispatch(getBalance());

      toast.success(String(t('swap:swapSuccessfully')), { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      const message = error.response?.data?.message ?? '';
      const status = error.response?.data?.statusCode ?? '';
      const errData = getErrorMessage('wallet', 'swap', status, message, '');
      toast.error(String(t(errData.message, errData.data)), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Swap - Bonenza</title>
      </Head>
      <div className={`${styles.cardContent}`}>
        {isLoading && <Loader />}
        <div className={`lg:max-w-[75%] ${styles.contentHeader}`}>
          <div>
            <div>
              <div className="flex flex-col items-start gap-[15px] w-full text-start">
                <SelectCurrencySwap onSubmit={onSubmit} ref={formDataRef} />
              </div>

              <div className="mt-[40px] w-full text-white text-start flex items-center justify-center gap-[10px]">
                <button
                  type="submit"
                  className="bg-gradient-btn-play rounded-default py-[10px] px-[20px] min-w-[140px] hover:opacity-[0.9]"
                  onClick={emitData}
                >
                  {t('swap:swapNow')}
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
