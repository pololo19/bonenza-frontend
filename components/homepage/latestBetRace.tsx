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
    <div className="overflow-hidden rounded-[10px] shadow-bs-latest">
      <div className="text-m_default md:text-default w-fit px-6 flex mx-8 gap-3 sm:gap-6 lg:gap-10 xl:gap-16 border border-solid border-transparent border-b-[#64748B33] box-content">
        <div
          role="button"
          onClick={() => setOpenTab(1)}
          className={cn('font-semibold pt-7 pb-5 border-b border-solid hover:border-b-[#64748B] -mb-[1px]', {
            'dark:text-color-primary border-b-color-primary': openTab === 1,
            'dark:text-color-table-header-text-secondary border-transparent': openTab !== 1,
          })}
        >
          {t('homePage:latestBets')}
        </div>
        <div
          role="button"
          onClick={() => setOpenTab(2)}
          className={cn('font-semibold pt-7 pb-5 border-b border-solid hover:border-b-[#64748B] -mb-[1px]', {
            'dark:text-color-primary border-b-color-primary': openTab === 2,
            'dark:text-color-table-header-text-secondary border-transparent': openTab !== 2,
          })}
        >
          {t('homePage:highRollers')}
        </div>
        <div
          role="button"
          onClick={() => setOpenTab(3)}
          className={cn('font-semibold pt-7 pb-5 border-b border-solid hover:border-b-[#64748B] -mb-[1px]', {
            'dark:text-color-primary border-b-color-primary': openTab === 3,
            'dark:text-color-table-header-text-secondary border-transparent': openTab !== 3,
          })}
        >
          {t('homePage:wagerContest')}
        </div>
      </div>
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
