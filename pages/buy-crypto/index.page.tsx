import { ReactElement, useEffect, useRef, useState } from 'react';

import api from '@/api/api';
import { LIST_MOONPAY_COIN } from '@/base/constants/common';
import { MoonpayCurrencyType, MoonpayDepositAddress, MoonpayFiatType } from '@/base/types/common';
import BuyCryptoComponent from '@/components/buyCrypto/buyCrypto';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';
import Head from 'next/head';
import styles from './index.module.scss';

const BuyCrypto = () => {
  const [fiatMoonpay, setFiatMoonpay] = useState<MoonpayFiatType>();
  const [valueFiat, setValueFiat] = useState<number>();
  const [activeCoin, setActiveCoin] = useState<MoonpayDepositAddress>(LIST_MOONPAY_COIN[0]);
  const activeCoinInformationRef = useRef<MoonpayCurrencyType>();

  const handleLimitFiat = async () => {
    try {
      const moonpayObject = {
        baseCurrencyCode: String(fiatMoonpay?.code).toLowerCase(),
        areFeesIncluded: 'true',
      };
      const params = new URLSearchParams(moonpayObject).toString();

      const res = await api.get(
        `https://api.moonpay.com/v3/currencies/${activeCoin?.moonpaySymbol}/limits?apiKey=pk_live_R5Lf25uBfNZyKwccAZpzcxuL3ZdJ3Hc&${params}`,
      );
      activeCoinInformationRef.current = res.data.baseCurrency;
    } catch (error) {
    } finally {
    }
  };

  const handleConvertFiat = async () => {
    try {
      const moonpayObject = {
        baseCurrencyCode: String(fiatMoonpay?.code).toLowerCase(),
        baseCurrencyAmount: String(Number(valueFiat ?? 0)),
        lockAmount: 'true',
        fixed: 'true',
        areFeesIncluded: 'true',
        regionalPricing: 'true',
      };
      const params = new URLSearchParams(moonpayObject).toString();
      await api.get(
        `https://api.moonpay.com/v3/currencies/${activeCoin?.moonpaySymbol}/buy_quote?apiKey=pk_live_R5Lf25uBfNZyKwccAZpzcxuL3ZdJ3Hc&${params}`,
      );
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    if (activeCoin?.moonpaySymbol && fiatMoonpay?.code) {
      handleLimitFiat();
    }
  }, [fiatMoonpay, activeCoin]);

  useEffect(() => {
    if (activeCoin?.moonpaySymbol && valueFiat) {
      handleConvertFiat();
    }
  }, [valueFiat, activeCoin]);

  return (
    <div className={`h-1/3 xl:max-w-[52%] px-[12px] py-[24px] sm:p-0 ${styles.cardContent}`}>
      <Head>
        <title>Buy Crypto - Bonenza</title>
      </Head>
      <BuyCryptoComponent />
    </div>
  );
};

const BuyCryptoAuth = withAuth(BuyCrypto);

BuyCryptoAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default BuyCryptoAuth;
