import { CredentialResponse, useGoogleOneTapLogin } from '@react-oauth/google';
import { t } from 'i18next';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { api_loginWithGooglePop } from '@/api/auth';
import { TOAST_ENUM } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo } from '@/base/libs/utils';
import { getErrorMesssage1 } from '@/base/libs/utils/notificationToast';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { changeIsLoading } from '@/base/redux/reducers/common.reducer';
import { initWalletInfo } from '@/base/redux/reducers/wallet.reducer';
import { useAppDispatch } from '@/base/redux/store';

export default function LoginGoogleOneTap() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const googleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      dispatch(changeIsLoading(true));
      const _res = await api_loginWithGooglePop(
        String(credentialResponse.clientId),
        String(credentialResponse.credential),
      );
      const { token, user } = _res.data;
      CookiesStorage.setAccessToken(token);
      dispatch(
        saveUserInfo({
          ...convertUserInfo(user),
        }),
      );
      dispatch(initWalletInfo());
      toast.success(t('authentication:loginSuccessfully'), { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMesssage1(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      dispatch(changeIsLoading(false));
    }
  };

  useGoogleOneTapLogin({
    onSuccess: googleLogin,
  });
  return <></>;
}
