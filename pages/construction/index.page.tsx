import { useTranslation } from '@/base/config/i18next';
import BaseLayout from '@/components/layouts/base.layout';
import Image from 'next/image';
import { ReactElement } from 'react';

function ConstructionPage() {
  const { t } = useTranslation('');

  return (
    <>
      <div className="bg-[#2c2f33]">
        <div className="bg-[url('/img/bg-construction.png')] pt-[10%] lg:pl-[15%] items-center lg:items-baseline px-5 sm:px-0 flex flex-col gap-[45px] w-full ss:h-[50vh] sm:h-[65vh] md:h-[80vh] lg:h-[110vh] bg-center bg-cover">
          <div className="flex flex-col gap-5 max-w-[491px]">
            <div className="text-[32px] font-semibold text-white">{t('construction:toMakeThingsRight')}</div>
            <div className="text-[16px] text-white">{t('construction:getNotified')}</div>
            <div className="bg-[#161D26] flex justify-between items-center rounded-[16px] h-[64px] pl-[22px] pr-[10px]">
              <input
                type="text"
                placeholder="Your Email"
                className="bg-[#161D26] placeholder:text-[#53575C] placeholder:text-[16px] focus:outline-none text-white"
              />
              <div
                role="button"
                className="bg-[#F61B4F] text-white font-bold text-[14px] text-center rounded-[10px] py-[13px] w-[96px]"
              >
                {t('construction:send')}
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-start">
            <Image width={100} height={100} className="w-[48%] h-auto" src="/img/under-construction.png" alt="" />
          </div>
        </div>
      </div>
    </>
  );
}

ConstructionPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default ConstructionPage;
