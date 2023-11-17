import { useTranslation } from '@/base/config/i18next';
import SelectCurrencySwap, {
  SelectCurrencySwapFormRef,
  SwapFormType,
} from '@/components/selectCurrencySwap/selectCurrencySwap';
import { ReactElement, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import api from '@/api/api';
import { CookieKey, TOAST_ENUM } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { updateCoin } from '@/base/libs/utils';
import { changeActiveFiat, changeCryptoArray, changeDepositCryptoArray } from '@/base/redux/reducers/common.reducer';
import { CurrencyEnum, DepositAddress } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import DepositLayout from '@/components/layouts/deposit.layout';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import styles from './index.module.scss';

const SwapPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formDataRef = useRef<SelectCurrencySwapFormRef>(null);

  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const emitData = () => formDataRef.current?.emitData?.();

  const handleGetCrypto = async () => {
    try {
      const responseCrypto = await api.get('deposit/get-all-deposit');
      const listCrypto = responseCrypto.data.data.depositAddress.map((crypto: DepositAddress) => {
        return {
          amount: Number(crypto?.balance),
          currency: crypto?.symbol,
          currencyAlias: crypto?.network,
          id: crypto?.id,
          maxDepositAmount: undefined,
          minDepositAmount: undefined,
          type: CurrencyEnum.CRYPTO,
        };
      });

      const activeF = listCrypto.find(
        (item: any) => item?.currency === CookiesStorage.getCookieData(CookieKey.activeFiat),
      );
      dispatch(changeCryptoArray(listCrypto));
      dispatch(
        changeDepositCryptoArray(
          responseCrypto.data.data.depositAddress.map((crypto: DepositAddress) => updateCoin(crypto)),
        ),
      );
      activeF && dispatch(changeActiveFiat(activeF));
    } catch (error) {
    } finally {
    }
  };

  const onSubmit = async (data: SwapFormType) => {
    try {
      setIsLoading(true);
      await api.post('exchange/swap', {
        fromTokenAddress: data.symbolFrom,
        toTokenAddress: data.symbolTo,
        amount: data.amountFrom,
        networkFromTokenAddress: data.networkFrom,
        networkToTokenAddress: data.networkTo,
      });
      await handleGetCrypto();
      toast.error(String(t('swap:swapSuccessfully')), { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      const mess: string = error?.response?.data?.msg;
      if (mess.includes("Your wallet doesn't have enough coin to swap"))
        toast.error(String(t('swap:notEnoughAmount')), { containerId: TOAST_ENUM.COMMON });
      else toast.error(String(t('swap:swapFailed')), { containerId: TOAST_ENUM.COMMON });
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
        <div className={`h-1/3 lg:max-w-[75%] px-[12px] py-[24px] sm:p-0 ${styles.contentHeader}`}>
          <div>
            <div>
              <div className="mt-[20px] flex flex-col items-start gap-[15px] w-full text-[#31373d] dark:text-[#C2C2C2] rounded-[16px] text-start">
                <SelectCurrencySwap onSubmit={onSubmit} ref={formDataRef} />
              </div>

              <div className="mt-[40px] w-full text-white text-start flex items-center justify-center gap-[10px]">
                <button
                  type="submit"
                  className="bg-[#F61B4F] rounded-[5px] py-[10px] px-[20px] min-w-[140px] hover:opacity-[0.9]"
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

SwapPage.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default SwapPage;
