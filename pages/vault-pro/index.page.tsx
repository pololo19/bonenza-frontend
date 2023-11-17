import { ReactElement, useState } from 'react';
import cn from 'classnames';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';
import styles from './index.module.scss';
import { useTranslation } from '@/base/config/i18next';
import SelectInputFiat from '@/components/selectInputFiat/SelectInputFiat';
import { MoonpayCurrencyType, MoonpayFiatType } from '@/base/types/common';
import Image from 'next/image';

const SwapPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation('');
  const [fiatMoonpay, setFiatMoonpay] = useState<MoonpayFiatType>();
  const [valueFiat, setValueFiat] = useState<number>();
  const [activeCoinInformation, setActiveCoinInformation] = useState<MoonpayCurrencyType>();
  return (
    <>
      <div className={`${styles.cardContent}`}>
        {isLoading && <Loader />}
        <div className={`h-1/3 xl:max-w-[52%] px-[12px] py-[24px] sm:p-0 ${styles.contentHeader} ${styles.width}`}>
          <div>
            <div className="flex flex-row mb-9">
              <div
                className={`basis-1/2 dark:text-white text-black h-16 flex items-center justify-center border-b-2 border-solid border-[#272C33] pb-[20px] pt-[15px] bg-gradient-to-t from-[#F61B4F]/20 border-[#F61B4F] ${styles.btnTransfersIn}`}
              >
                {t('vaultPro:transferIn')}
              </div>
              <div className="basis-1/2 h-16 flex items-center justify-center text-black dark:text-[#C2C2C2] ">
                {t('vaultPro:transferOut')}
              </div>
            </div>
            <div className="flex flex-row mb-9">
              <div className="basis-1/2 dark:text-white text-black flex justify-start">
                {t('vaultPro:annualPercentageRate')}
                <span className="text-base ml-1 text-cyan-300">5%</span>
              </div>
              <div className="basis-1/2 flex flex justify-end text-[#31373d] dark:text-[#C2C2C2]">
                {t('vaultPro:securityRules')}
                <Image height={25} width={25} className="ml-2.5 w-[25px] h-[25px]" src="/img/img-Qs.png" alt="" />
              </div>
            </div>
            <div className="flex flex-row mb-5 text-[#31373d] dark:text-[#C2C2C2]">
              <div className="basis-1/2 flex justify-start">
                {t('vaultPro:walletBalance')}:<span className="text-base ml-1">0</span>
              </div>
            </div>
            <SelectInputFiat
              onChangeMoonpayFiat={setFiatMoonpay}
              onChangeValue={setValueFiat}
              valueFiat={valueFiat}
              activeCoinInformation={activeCoinInformation || undefined}
            />
            <div className="sm:mt-[40px] mt-[20px] w-full text-white text-start flex items-center sm:justify-end justify-center gap-[10px]">
              <button
                type="submit"
                className="bg-[#F61B4F] rounded-[5px] py-[10px] px-[20px] min-w-[200px] hover:opacity-[0.9]"
              >
                {t('vaultPro:transferToVaultPro')}
              </button>
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
