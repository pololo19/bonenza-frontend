import { useState } from 'react';

import { useTranslation } from '@/base/config/i18next';

import HighRollerTableComponent from '../gameTable/highRollerTable';
import LatestBetsTableComponent from '../gameTable/latestBetsTable';
import WagerContestComponent from '../gameTable/wagerContest';

const LatestBetRace = () => {
  const [openTab, setOpenTab] = useState(1);
  const { t } = useTranslation('');

  return (
    <>
      <ul className="flex justify-center md:w-fit rounded-full md:text-[13px] text-[11px] font-semibold">
        <div
          role="button"
          onClick={() => setOpenTab(1)}
          className={`${
            openTab === 1
              ? 'dark:text-white dark:bg-color-primary text-[#000] bg-white text-[600]'
              : 'dark:hover:text-white dark:bg-color-tbl-primary bg-[#f0f1f5] hover:bg-[#f0f1f5] hover:text-black text-[#31373D] dark:text-[rgba(255,255,255,0.5)]'
          } inline-block md:px-6 sm:px-4 px-2 py-[15px] max-md:grow max-md:text-center`}
        >
          {t('homePage:latestBets')}
        </div>
        <div
          role="button"
          onClick={() => setOpenTab(2)}
          className={`${
            openTab === 2
              ? 'dark:text-white dark:bg-color-primary text-[#000] bg-white text-[600]'
              : 'dark:hover:text-white dark:bg-color-tbl-primary bg-[#f0f1f5] hover:bg-[#f0f1f5] hover:text-black text-[#31373D] dark:text-[rgba(255,255,255,0.5)]'
          } inline-block md:px-6 px-4 py-[15px] max-md:grow max-md:text-center`}
        >
          {t('homePage:highRollers')}
        </div>
        <div
          role="button"
          onClick={() => setOpenTab(3)}
          className={`${
            openTab === 3
              ? 'dark:text-white dark:bg-color-primary text-[#000] bg-white text-[600]'
              : 'dark:hover:text-white dark:bg-color-tbl-primary bg-[#f0f1f5] hover:bg-[#f0f1f5] hover:text-black text-[#31373D] dark:text-[rgba(255,255,255,0.5)]'
          } inline-block md:px-6 px-4 py-[15px] max-md:grow max-md:text-center`}
        >
          {t('homePage:wagerContest')}
        </div>
      </ul>
      <div className="w-full h-full rounded-[5px] dark:bg-color-tbl-primary bg-white relative mt-[15px]">
        <div className="md:px-[20px] sm:px-[10px] sm:py-[10px] px-[5px] py-[5px] z-[2] w-full">
          <div className="md:text-[13px] text-[12px] max-[430px]:text-[10px] text-[#939699]">
            {openTab === 1 && <LatestBetsTableComponent />}
            {openTab === 2 && <HighRollerTableComponent />}
            {openTab === 3 && <WagerContestComponent />}
          </div>
        </div>
      </div>
    </>
  );
};

export default LatestBetRace;
