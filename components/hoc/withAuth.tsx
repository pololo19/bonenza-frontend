import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { CookieKey, FIAT_DATA, ROUTER } from '@/base/constants/common';
import Loader from '@/base/components/common/preloader/loader';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { logoutState } from '@/base/redux/reducers/auth.reducer';
import { changeCryptoArray, changeFiatArray, changeLocaleFiat } from '@/base/redux/reducers/common.reducer';
import { changeIsShowAuthenticationModal } from '@/base/redux/reducers/modal.reducer';
import { FiatType } from '@/base/types/common';

type WithAuthComponent<P> = React.FunctionComponent<P> & {
  getLayout?: (page: React.ReactElement) => React.ReactElement;
};

function withAuth<P extends Record<string, unknown>>(WrappedComponent: any): WithAuthComponent<P> {
  const Authorization = (props: P) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

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
        // const resUser = await api.get('auth/get-user-info');
        // if (!resUser.data.data.isDeposit) {
        //   await api.post('deposit/create-deposit-address');
        // }
        // dispatch(
        //   saveUserInfo({
        //     isLogin: true,
        //     token: accessToken,
        //     userName: resUser.data.data.username,
        //     userId: resUser.data.data.id,
        //     email: resUser.data.data.email,
        //     avatar: resUser.data.data.avatar,
        //     uuid: resUser.data.data.uuid,
        //     winCount: resUser.data.data.winCount,
        //     betCount: resUser.data.data.betCount,
        //     totalWager: resUser.data.data.totalWager,
        //   }),
        // );

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
