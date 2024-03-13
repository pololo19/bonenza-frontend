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
    <div className="overflow-hidden rounded-[20px] border-solid border-[1px] border-color-table-header-text-primary">
      <div className="text-m_default sm:text-default md:text-title flex py-[30px] justify-around">
        <div
          role="button"
          onClick={() => setOpenTab(1)}
          className={cn('font-bold', {
            'dark:text-color-primary': openTab === 1,
            'dark:text-color-table-header-text-secondary': openTab !== 1,
          })}
        >
          {t('homePage:latestBets')}
        </div>
        <div
          role="button"
          onClick={() => setOpenTab(2)}
          className={cn('font-bold', {
            'dark:text-color-primary': openTab === 2,
            'dark:text-color-table-header-text-secondary': openTab !== 2,
          })}
        >
          {t('homePage:highRollers')}
        </div>
        <div
          role="button"
          onClick={() => setOpenTab(3)}
          className={cn('font-bold', {
            'dark:text-color-primary': openTab === 3,
            'dark:text-color-table-header-text-secondary': openTab !== 3,
          })}
        >
          {t('homePage:wagerContest')}
        </div>
      </div>
      <div className="bg-color-table-header-text-primary h-[1px] mx-[10px] md:mx-[45px]" />
      <div className="w-full h-full rounded-[5px] relative">
        <div className="md:px-[20px] sm:px-[10px] sm:py-[10px] px-[5px] py-[5px] z-[2] w-full">
          <div className="md:text-[13px] text-[12px] max-[430px]:text-[10px] text-[#939699]">
            {openTab === 1 && <LatestBetsTableComponent />}
            {openTab === 2 && <HighRollerTableComponent />}
            {openTab === 3 && <WagerContestComponent />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestBetRace;
