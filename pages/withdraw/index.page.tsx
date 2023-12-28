import Router from 'next/router';
import { ReactElement, useEffect } from 'react';

import { ROUTER } from '@/base/constants/common';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';

const WithdrawPage = () => {
  useEffect(() => {
    Router.push(ROUTER.WithdrawCrypto);
  }, []);

  return <></>;
};

const WithdrawPageAuth = withAuth(WithdrawPage);

WithdrawPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default WithdrawPageAuth;
