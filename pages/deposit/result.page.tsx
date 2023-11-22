import { useTranslation } from '@/base/config/i18next';
import { ReactElement, useEffect, useState } from 'react';

import api from '@/api/api';
import { DATE_TIME_FORMAT_DEFAULT } from '@/base/constants/common';
import { formatDate } from '@/base/libs/utils';
import { formatAmountForDisplay } from '@/base/libs/utils/stripe-helpers';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './index.module.scss';

const ResultDepositPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactionDetail, setTransactionDetail] = useState<any>();

  const { t } = useTranslation('');
  const router = useRouter();

  const handleResultTransaction = async () => {
    try {
      setIsLoading(true);
      const response = await api.post(`stripe/detail-checkout-session`, { id: router.query.session_id });
      setTransactionDetail(response.data);
    } catch (error) {
      setTransactionDetail(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (router.query.session_id) {
      handleResultTransaction();
    }
  }, [router.query.session_id]);

  return (
    <div className={`${styles.cardContent}`}>
      <Head>
        <title>Deposit Result - Bonenza</title>
      </Head>
      {isLoading && <Loader />}

      <div className={`w-full h-1/3 px-3 pt-3 pb-5 md:p-10 ${styles.contentHeader}`}>
        {transactionDetail && (
          <div className="h-full w-full flex flex-col items-center gap-[10px]">
            {transactionDetail?.status === 'complete' ? (
              <>
                <div className="flex flex-col gap-[10px] items-center">
                  <Image width={125} height={125} src={'/img/checked.png'} alt="success" />
                  <div className="text-[20px] font-semibold">{t('deposit:depositSuccessful')}</div>
                </div>
                <div className="bg-[#161D26] p-[20px] w-full flex flex-col gap-[10px]">
                  <div className="flex items-center gap-[10px] justify-between">
                    <div className="text-[#C2C2C2]">{t('deposit:paymentMethod')}</div>
                    <div>
                      <Image height={30} width={30} src={'/img/icon/stripe-logo.png'} alt="" className="rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-[10px] justify-between">
                    <div className="text-[#C2C2C2]">{t('deposit:orderID')}</div>
                    <div>{(transactionDetail?.paymentIntent as any)?.id}</div>
                  </div>
                  <div className="flex items-center gap-[10px] justify-between">
                    <div className="text-[#C2C2C2]">{t('deposit:time')}</div>
                    <div>{formatDate(new Date(transactionDetail?.created * 1000), DATE_TIME_FORMAT_DEFAULT)}</div>
                  </div>
                  <div className="flex items-center gap-[10px] justify-between">
                    <div className="text-[#C2C2C2]">{t('deposit:expiresIn')}</div>
                    <div>{formatDate(new Date(transactionDetail?.expiresAt * 1000), DATE_TIME_FORMAT_DEFAULT)}</div>
                  </div>
                  <div className="flex items-center gap-[10px] justify-between">
                    <div className="text-[#C2C2C2]">{t('deposit:depositAmount')}</div>
                    <div>
                      {formatAmountForDisplay(
                        Number(transactionDetail?.amountTotal),
                        String(transactionDetail?.currency?.toUpperCase()),
                      )}{' '}
                      {transactionDetail?.currency?.toUpperCase()}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-[10px] items-center">
                <Image width={125} height={125} src={'/img/cancel.png'} alt="success" />
                <div className="text-[20px] font-semibold">{t('deposit:depositFailed')}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ResultDepositPageAuth = withAuth(ResultDepositPage);

ResultDepositPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default ResultDepositPageAuth;
