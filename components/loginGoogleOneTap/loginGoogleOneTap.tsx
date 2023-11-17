import { CredentialResponse, useGoogleOneTapLogin } from '@react-oauth/google';

import api from '@/api/api';
import { TOAST_ENUM } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo } from '@/base/libs/utils';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import Loader from '@/components/common/preloader/loader';
import { t } from 'i18next';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export default function LoginGoogleOneTap() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const googleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      setIsLoading(true);
      const resToken = await api.post('auth/save-info-login-google-one-tap', {
        client_id: credentialResponse.clientId,
        token: credentialResponse.credential,
      });
      CookiesStorage.setAccessToken(resToken.data.data.accessToken);
      const resUser = await api.get('auth/get-user-info');
      if (!resUser.data.data.isDeposit) {
        await api.post('deposit/create-deposit-address');
      }
      dispatch(
        saveUserInfo({
          isLogin: true,
          ...convertUserInfo(resUser.data.data),
        }),
      );
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
