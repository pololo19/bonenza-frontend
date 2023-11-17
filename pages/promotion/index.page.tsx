import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import CardPromotion from '@/components/cards/cardPromotion';
import BaseLayout from '@/components/layouts/base.layout';
import styles from '@/styles/dashboard/index.module.scss';
import { ArrowRight, Shop } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
function PromotionPage() {
  const [tab, setTab] = useState(0);
  const dataPromotion = [
    {
      price: '€1,200,000',
      title: 'CASH BOMBS',
      promotionName: 'Join Cash X Share €1,000,000',
    },
    {
      price: '€40,000',
      title: 'CASH X',
      promotionName: 'Join Cash Bombs share#2',
    },
    {
      price: '€40,000',
      title: 'UEFA Champions League Prediction',
      promotionName: 'UEFA Champions League Predi...',
    },
    {
      price: '€200,000',
      title: 'Battle of July',
      promotionName: 'Battle of July €10,000',
    },
    {
      price: '€1 MILLION',
      title: 'Inro the Universe',
      promotionName: 'Into the Universe €200,000',
    },
    {
      price: '€100,000',
      title: 'DROPS & WINS',
      promotionName: 'DROPS & WINS €1 Million',
    },
  ];

  const { t } = useTranslation('');
  const router = useRouter();

  return (
    <>
      <div className="bg-[#161D26] w-full px-[25px] pt-[50px]">
        <div className="flex items-center gap-[10px] text-white">
          <Shop />
          <div className="text-[18px] text-white font-semibold">{t('promotion:promotion')}</div>
        </div>
        <div className="mt-5 bg-[#12181F] py-[40px]">
          <div className="flex justify-between pl-[12px] pr-[12px] sm:pl-[59px] sm:pr-[30px] xl:gap-[30px] flex-col xl:flex-row">
            <div className="xl:max-w-[387px]">
              <div className="text-[24px] sm:text-[36px] max-[414px]:text-[20px] font-bold text-white flex justify-between">
                <div className="uppercase">{t('promotion:greatBonusFor')}</div>
                <div className="flex sm:hidden items-center gap-[7px]">
                  <div className="text-[13px] text-[#0DFDE4]">{t('promotion:details')}</div>
                  <ArrowRight className="text-[#0DFDE4] w-[14px] h-[14px]" />
                </div>
              </div>
              <div
                className={`${styles.textGradient} font-bold text-[24px] sm:text-[36px] max-[414px]:text-[20px] bg-primary uppercase`}
              >
                {t('promotion:everyDeposit')}
              </div>
              <div className="text-[24px] sm:text-[36px] max-[414px]:text-[20px] font-bold text-white uppercase mt-[8px] sm:mt-[30px]">
                {t('promotion:upTo')} <span className={`${styles.textGradient} bg-primary`}>360%</span>
              </div>
              <div className="text-[12px] sm:text-[16px] text-white mt-[8px] sm:mt-[30px]">
                {t('promotion:availableForAllPlayers')}
              </div>
              <div className="text-[24px] sm:text-[16px] max-[414px]:text-[20px] text-white">
                {t('promotion:before')} <span className="text-[#F61B4F]">8/1/2023</span>
              </div>
              <div className="hidden sm:flex items-center gap-[7px]">
                <div className="text-[13px] text-[#0DFDE4]">{t('promotion:details')}</div>
                <ArrowRight className="text-[#0DFDE4] w-[14px] h-[14px]" />
              </div>
              <div></div>
            </div>
            <div className="flex gap-[8px] xl:gap-[24px] justify-between flex-row items-center md:mb-[40px]">
              <div className="bg-[url('/img/bg-first-deposit.png')] flex flex-col gap-[10px] items-center bg-contain bg-no-repeat px-[13px] py-[5px] w-[206px] h-[284px] max-[520px]:bg-[length:100%_75%] relative">
                <div className="text-[16px] font-bold text-white uppercase text-center">
                  180% {t('promotion:bonus')}
                </div>
                <Image width={24} height={24} src="/img/img-first-deposit.png" className="w-full h-auto" alt="" />
                <div className="text-[14px] max-[520px]:text-[12px] text-center font-bold text-white">
                  {t('promotion:firstDeposit')}
                </div>
                <div
                  role="button"
                  className="hidden md:block bg-[#F61B4F] hover:opacity-[0.9] rounded-[5px] text-white text-[14px] text-center w-full h-[44px] py-[13px] absolute bottom-[-25%]"
                  onClick={() => {
                    router.replace(ROUTER.DepositFiat);
                  }}
                >
                  {t('promotion:depositNow')}
                </div>
              </div>
              <div className="bg-[url('/img/bg-second-deposit.png')] flex flex-col gap-[10px] items-center bg-contain bg-no-repeat px-[13px] py-[5px] w-[206px] h-[284px] mt-[45px] max-[520px]:bg-[length:100%_75%] relative">
                <div className="text-[16px] font-bold text-white uppercase text-center">
                  240% {t('promotion:bonus')}
                </div>
                <Image width={24} height={24} src="/img/img-second-deposit.png" className="w-full h-auto" alt="" />
                <div className="text-[14px] max-[520px]:text-[12px] text-center font-bold text-white">
                  {t('promotion:secondDeposit')}
                </div>
                <div
                  role="button"
                  className="block md:hidden bg-[#F61B4F] hover:opacity-[0.9] rounded-[5px] text-white text-[14px] text-center w-full h-[44px] py-[13px] absolute bottom-[-10%] max-[520px]:bottom-0 max-[520px]:w-[162px]"
                  onClick={() => {
                    router.replace(ROUTER.DepositFiat);
                  }}
                >
                  {t('promotion:depositNow')}
                </div>
              </div>
              <div className="bg-[url('/img/bg-third-deposit.png')] flex flex-col gap-[10px] items-center bg-contain bg-no-repeat px-[13px] py-[5px] w-[206px] h-[284px] mt-[45px] max-[520px]:bg-[length:100%_75%]">
                <div className="text-[16px] font-bold text-white uppercase text-center">
                  360% {t('promotion:bonus')}
                </div>
                <Image
                  width={24}
                  height={24}
                  src="/img/img-third-deposit.png"
                  className="w-full h-auto max-w-[80%]"
                  alt=""
                />
                <div className="text-[14px] max-[520px]:text-[12px] text-center font-bold text-white">
                  {t('promotion:thirdDeposit')}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[60px] flex gap-[8px]">
          <div
            onClick={() => setTab(0)}
            role="button"
            className={`w-[180px] hover:opacity-[0.9] h-[44px] rounded-[5px] text-center py-[12px] font-semibold ${
              tab === 0 ? 'bg-[#20D4EB] text-white' : 'bg-[gray] text-[#E4E4E4]'
            }`}
          >
            {t('promotion:latestPromotions')}
          </div>
          <div
            onClick={() => setTab(1)}
            role="button"
            className={`w-[180px] hover:opacity-[0.9] h-[44px] rounded-[5px] text-center py-[12px] font-semibold ${
              tab === 1 ? 'bg-[#20D4EB] text-white' : 'bg-[gray] text-[#E4E4E4]'
            }`}
          >
            {t('promotion:archived')}
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[25px]">
          {dataPromotion.map((item, index) => (
            <CardPromotion key={index} price={item.price} title={item.title} promotionName={item.promotionName} />
          ))}
        </div>
      </div>
    </>
  );
}

PromotionPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default PromotionPage;
