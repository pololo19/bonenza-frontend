import cn from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import { ReactElement } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import DepositCryptoComponent from '@/components/deposit/crypto/depositCrypto';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';

import styles from './index.module.scss';

const DepositCryptoPage = () => {
  const { t } = useTranslation('');

  return (
    <div className={`${styles.cardContent}`}>
      <Head>
        <title>Deposit Crypto - Bonenza</title>
      </Head>
      <div className={`h-1/3 px-[12px] py-[24px] sm:p-0 ${styles.contentHeader}`}>
        {/* Header Tabs */}
        <div className="flex mb-[20px] sm:w-auto w-full">
          <Link
            href={ROUTER.DepositCrypto}
            className={cn(
              'bg-gradient-to-t from-color-primary/20 border-color-primary sm:max-w-[161px] flex-1 flex hover:opacity-[0.9] items-center justify-center border-b-2 border-solid pb-[10px]',
            )}
            role="button"
          >
            <div className="text-[16px] dark:text-white text-black font-[700]">{t('deposit:crypto')}</div>
          </Link>
          <Link
            href={ROUTER.DepositFiat}
            className={cn(
              'flex-1 flex items-center hover:opacity-[0.9] sm:max-w-[161px] justify-center border-b-2 border-solid dark:border-[#272C33] border-[#ccc] pb-[10px]',
            )}
            role="button"
          >
            <div className="text-[16px] dark:text-white text-black font-[700]">{t('deposit:fiat')}</div>
          </Link>
        </div>

        <DepositCryptoComponent />
      </div>
    </div>
  );
};

const DepositCryptoPageAuth = withAuth(DepositCryptoPage);

DepositCryptoPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default DepositCryptoPageAuth;
