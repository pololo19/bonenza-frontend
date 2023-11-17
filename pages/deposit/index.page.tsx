/* eslint-disable @next/next/no-img-element */
import Router from 'next/router';
import { ReactElement, useEffect } from 'react';

import { ROUTER } from '@/base/constants/common';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';

const DepositPage = () => {
  useEffect(() => {
    Router.push(ROUTER.DepositCrypto);
  }, []);

  return <></>;
};

const DepositPageAuth = withAuth(DepositPage);

DepositPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default DepositPageAuth;
