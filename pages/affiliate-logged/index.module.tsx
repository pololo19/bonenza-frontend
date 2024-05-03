import 'swiper/css';
import 'swiper/css/grid';

import { ReactElement, useState } from 'react';
import { Cup, DocumentDownload, Element, Star, UserOctagon } from 'iconsax-react';
import BaseLayout from '@/components/layouts/base.layout';
import cn from 'classnames';
import { useTranslation } from '@/base/config/i18next';
import DashboardComponent from '@/components/affiliate/dashboard';
import RewardsComponent from '@/components/affiliate/rewards';
import ReferralCodeFriendComponent from '@/components/affiliate/referralcode';
import DownloadComponents from '@/components/affiliate/download';
import RateAndRulesComponent from '@/components/affiliate/rate';

export enum AffiliateTabEnum {
  DASHBOARD = 'DASHBOARD',
  REWARDS = 'REWARDS',
  REFERAL_CODE_AND_FRIENDS = 'REFERAL_CODE_AND_FRIENDS',
  RATES_AND_RULES = 'RATE_AND_RULES',
  DOWNLOAD_BANNER = 'DOWNLOAD_BANNER',
}

function AffiliateLoggedPage() {
  const { t, i18n } = useTranslation('');
  const [affiliateTab, setAffiliateTab] = useState<AffiliateTabEnum>(AffiliateTabEnum.DASHBOARD);

  return (
    <div>
      <div className="text-title font-semibold my-4">{t('sidebar:affiliate')}</div>
      <div className="flex">
        <div
          onClick={() => setAffiliateTab(AffiliateTabEnum.DASHBOARD)}
          className={cn(
            'flex items-center justify-center gap-2 py-[10px] px-[20px] text-color-text-primary border-l border-solid border-color-primary',
            {
              'bg-gradient-to-b from-[#00BAE600] to-[#006880] dark:!text-white !text-black':
                affiliateTab === AffiliateTabEnum.DASHBOARD,
            },
          )}
          role="button"
        >
          <Element variant="Bulk" />
          <div className="sm:text-default text-m_default font-semibold">{t('affiliate:dashboard')}</div>
        </div>
        <div
          onClick={() => setAffiliateTab(AffiliateTabEnum.REWARDS)}
          className={cn(
            'flex items-center justify-center gap-2 py-[10px] px-[20px] text-color-text-primary border-l border-solid border-color-primary',
            {
              'bg-gradient-to-b from-[#00BAE600] to-[#006880] dark:!text-white !text-black':
                affiliateTab === AffiliateTabEnum.REWARDS,
            },
          )}
          role="button"
        >
          <Cup variant="Bulk" />
          <div className="sm:text-default text-m_default font-semibold">{t('affiliate:myReward')}</div>
        </div>
        <div
          onClick={() => setAffiliateTab(AffiliateTabEnum.REFERAL_CODE_AND_FRIENDS)}
          className={cn(
            'flex items-center justify-center gap-2 py-[10px] px-[20px] text-color-text-primary border-l border-solid border-color-primary',
            {
              'bg-gradient-to-b from-[#00BAE600] to-[#006880] dark:!text-white !text-black':
                affiliateTab === AffiliateTabEnum.REFERAL_CODE_AND_FRIENDS,
            },
          )}
          role="button"
        >
          <UserOctagon variant="Bulk" />
          <div className="sm:text-default text-m_default font-semibold">{t('affiliate:referralCodeAndFriends')}</div>
        </div>
        {/* <div
          onClick={() => setAffiliateTab(AffiliateTabEnum.RATES_AND_RULES)}
          className={cn(
            'flex items-center justify-center gap-2 py-[10px] px-[20px] text-color-text-primary border-l border-solid border-color-primary',
            {
              'bg-gradient-to-b from-[#00BAE600] to-[#006880] dark:!text-white !text-black':
                affiliateTab === AffiliateTabEnum.RATES_AND_RULES,
            },
          )}
          role="button"
        >
          <Star variant="Bulk" />
          <div className="sm:text-default text-m_default font-semibold">{t('affiliate:rateAndRules')}</div>
        </div> */}
        <div
          onClick={() => setAffiliateTab(AffiliateTabEnum.DOWNLOAD_BANNER)}
          className={cn(
            'flex items-center justify-center gap-2 py-[10px] px-[20px] text-color-text-primary border-l border-r border-solid border-color-primary',
            {
              'bg-gradient-to-b from-[#00BAE600] to-[#006880] dark:!text-white !text-black':
                affiliateTab === AffiliateTabEnum.DOWNLOAD_BANNER,
            },
          )}
          role="button"
        >
          <DocumentDownload variant="Bulk" />
          <div className="sm:text-default text-m_default font-semibold">{t('affiliate:downloadBanners')}</div>
        </div>
      </div>
      {affiliateTab === AffiliateTabEnum.DASHBOARD && <DashboardComponent />}
      {affiliateTab === AffiliateTabEnum.REWARDS && <RewardsComponent />}
      {affiliateTab === AffiliateTabEnum.REFERAL_CODE_AND_FRIENDS && <ReferralCodeFriendComponent />}
      {/* {affiliateTab === AffiliateTabEnum.RATES_AND_RULES && <RateAndRulesComponent />} */}
      {affiliateTab === AffiliateTabEnum.DOWNLOAD_BANNER && <DownloadComponents />}
    </div>
  );
}

AffiliateLoggedPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default AffiliateLoggedPage;
