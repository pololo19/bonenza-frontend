import { ReactElement, useEffect } from 'react';
import { CookieKey, ROUTER } from '@/base/constants/common';
import BaseLayout from '@/components/layouts/base.layout';
import { useRouter } from 'next/router';
import { CookiesStorage } from '../../libs/storage/cookie';

function ReferralCodePage() {
  const router = useRouter();
  const { query } = useRouter();
  const { referralCode } = query;

  useEffect(() => {
    if (referralCode) {
      console.log('referralCode', referralCode);
      CookiesStorage.setCookieData(CookieKey.referralCode, String(referralCode));
    }
    router.push(ROUTER.Home);
  }, [referralCode]);

  return <></>;
}

ReferralCodePage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default ReferralCodePage;
