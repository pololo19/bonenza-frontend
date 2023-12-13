import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { api_validateToken } from '@/api/auth';
import Loader from '@/base/components/common/preloader/loader';
import { ROUTER } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo } from '@/base/libs/utils';
import { logoutState, saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { changeCryptoArray, changeFiatArray } from '@/base/redux/reducers/common.reducer';
import { changeIsShowAuthenticationModal } from '@/base/redux/reducers/modal.reducer';
import { getWalletInfo } from '@/base/redux/reducers/wallet.reducer';
import { useAppDispatch } from '@/base/redux/store';

type WithAuthComponent<P> = React.FunctionComponent<P> & {
  getLayout?: (page: React.ReactElement) => React.ReactElement;
};

function withAuth<P extends Record<string, unknown>>(WrappedComponent: any): WithAuthComponent<P> {
  const Authorization = (props: P) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();

    const redirectToLogin = () => {
      router.replace(ROUTER.Home);
    };

    const handlerMeError = () => {
      dispatch(logoutState());
      dispatch(changeFiatArray([]));
      dispatch(changeCryptoArray([]));
      CookiesStorage.logout();
      return new Promise((resolve) => {
        if (router.pathname !== ROUTER.Home) {
          redirectToLogin();
        }
        resolve(true);
      });
    };

    const checkIsAuthenticated = async () => {
      try {
        const accessToken = CookiesStorage.getAccessToken();
        if (!accessToken) {
          if (router.pathname !== ROUTER.Home) {
            dispatch(changeIsShowAuthenticationModal(true));
            redirectToLogin();
          }
          return;
        }

        const result = await api_validateToken(accessToken);
        dispatch(saveUserInfo({ ...convertUserInfo(result.data) }));
        dispatch(getWalletInfo());

        setIsLoading(false);
        return;
      } catch (err) {
        await handlerMeError();
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      checkIsAuthenticated();
    }, []);

    return isLoading ? <Loader /> : <WrappedComponent {...props} />;
  };

  return Authorization;
}

export default withAuth;
