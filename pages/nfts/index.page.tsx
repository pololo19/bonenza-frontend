import { useTranslation } from '@/base/config/i18next';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';
import Head from 'next/head';
import Image from 'next/image';
import { ReactElement } from 'react';
import styles from './index.module.scss';

const SwapPage = () => {
  const { t } = useTranslation('');
  return (
    <>
      <Head>
        <title>NFTs - Bonenza</title>
      </Head>
      <div className={`${styles.cardContent}`}>
        <div className={`w-full h-1/3 p-3 md:p-10 ${styles.contentHeader} ${styles.width}`}>
          <div>
            <div className="flex flex-row mb-9">
              <div
                className={`basis-1/2 h-16 flex items-center justify-start w-[400px] h-[120px] bg-[#f5f6fa] dark:bg-[#161D26] rounded-lg`}
              >
                <div className="flex justify-evenly items-center ml-[6rem]">
                  <div className={` mr-6 ${styles.borderLeft}`}></div>
                  <div>
                    <div className="mr-[26px] dark:text-white text-black">{t('NFT:total')}</div>
                    <div className="font-vietnam font-semibold text-2xl dark:text-white text-black">
                      {t('NFT:d')} 0.00
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`basis-1/2 h-16 flex items-center justify-start w-[400px] h-[120px] bg-[#f5f6fa] dark:bg-[#161D26] rounded-lg ml-[22px]`}
              >
                <div className="flex justify-evenly items-center ml-[6rem]">
                  <div className={` mr-6 ${styles.borderRight}`}></div>
                  <div>
                    <div className="mr-[26px] dark:text-white text-black">{t('NFT:NFT')}</div>
                    <div className="font-vietnam font-semibold text-2xl dark:text-white text-black">0</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[2px] bg-[#272C33] mb-10"></div>
            <div className="flex justify-center">
              <div className="w-[284px] dark:text-white text-black h-[260px] bg-[#f5f6fa] dark:bg-[#161D26] rounded-lg flex flex-col-reverse justify-center">
                <div>{t('NFT:depositYourFirstNFT')}</div>
                <Image
                  width={60}
                  height={24}
                  src="/img/Add.png"
                  className="w-[60px] h-auto ml-[110px] mb-[21px]"
                  alt=""
                />
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
