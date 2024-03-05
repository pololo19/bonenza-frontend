import cn from 'classnames';
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
      <ul className="flex justify-center md:w-fit rounded-full sm:text-default text-[12px] font-semibold">
        <div
          role="button"
          onClick={() => setOpenTab(1)}
          className={cn('inline-block md:px-6 sm:px-4 px-2 py-[15px] max-md:grow max-md:text-center font-bold', {
            'dark:text-white dark:bg-color-active-primary bg-color-light-active-primary text-black': openTab === 1,
            'dark:hover:text-white dark:bg-color-btn-secondary bg-white hover:bg-color-light-hover-primary hover:text-black text-color-light-text-primary dark:text-color-text-primary':
              openTab !== 1,
          })}
        >
          {t('homePage:latestBets')}
        </div>
        <div
          role="button"
          onClick={() => setOpenTab(2)}
          className={cn('inline-block md:px-6 sm:px-4 px-2 py-[15px] max-md:grow max-md:text-center font-bold', {
            'dark:text-white dark:bg-color-active-primary bg-color-light-active-primary text-black': openTab === 2,
            'dark:hover:text-white dark:bg-color-btn-secondary bg-white hover:bg-color-light-hover-primary hover:text-black text-color-light-text-primary dark:text-color-text-primary':
              openTab !== 2,
          })}
        >
          {t('homePage:highRollers')}
        </div>
        <div
          role="button"
          onClick={() => setOpenTab(3)}
          className={cn('inline-block md:px-6 sm:px-4 px-2 py-[15px] max-md:grow max-md:text-center font-bold', {
            'dark:text-white dark:bg-color-active-primary bg-color-light-active-primary text-black': openTab === 3,
            'dark:hover:text-white dark:bg-color-btn-secondary bg-white hover:bg-color-light-hover-primary hover:text-black text-color-light-text-primary dark:text-color-text-primary':
              openTab !== 3,
          })}
        >
          {t('homePage:wagerContest')}
        </div>
      </ul>
      <div className="w-full h-full rounded-[5px] dark:bg-color-table-bg-primary bg-color-light-table-bg-primary relative mt-[15px]">
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
