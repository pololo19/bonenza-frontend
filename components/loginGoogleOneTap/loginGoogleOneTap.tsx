import { CredentialResponse, useGoogleOneTapLogin } from '@react-oauth/google';
import { t } from 'i18next';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { api_loginWithGooglePop } from '@/api/auth';
import { TOAST_ENUM } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo } from '@/base/libs/utils';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { initWalletInfo } from '@/base/redux/reducers/wallet.reducer';
import { useAppDispatch } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';

export default function LoginGoogleOneTap() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const googleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      setIsLoading(true);
      const res = await api_loginWithGooglePop(
        String(credentialResponse.clientId),
        String(credentialResponse.credential),
      );
      const { token, user } = res.data;
      CookiesStorage.setAccessToken(token);
      dispatch(
        saveUserInfo({
          ...convertUserInfo(user),
        }),
      );
      dispatch(initWalletInfo());
      toast.success(t('authentication:loginSuccessfully'), { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      if (error?.response?.data?.msg === 'Email was taken') {
        toast.error(String(t('authentication:emailTaken')), { containerId: TOAST_ENUM.COMMON });
      } else {
        toast.error(String(t('authentication:loginGoogleFailed')), { containerId: TOAST_ENUM.COMMON });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useGoogleOneTapLogin({
    onSuccess: googleLogin,
  });
  return <>{isLoading && <Loader />}</>;
}
