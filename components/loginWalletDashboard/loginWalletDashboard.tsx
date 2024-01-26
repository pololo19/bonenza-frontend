import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { CodeResponse, useGoogleLogin } from '@react-oauth/google';
import Image from 'next/image';
import { ElementType, useEffect, useMemo, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import api from '@/api/api';
import { api_loginWithGoogle } from '@/api/auth';
import { useTranslation } from '@/base/config/i18next';
import { LOGIN_REGISTRATION_METHOD, TOAST_ENUM } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo, getMessageMetamask } from '@/base/libs/utils';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { initWalletInfo } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';

declare let window: any;

type LoginWalletProps = {
  onClose?: () => void;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function LoginWallet({ onClose }: LoginWalletProps) {
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isLogin, wallet, isShowAuthenticationModal } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
      wallet: state.auth.user.wallet,
      isShowAuthenticationModal: state.modal.isShowAuthenticationModal,
    }),
    shallowEqual,
  );

  const googleLogin = async (codeResponse: Omit<CodeResponse, 'error' | 'error_description' | 'error_uri'>) => {
    try {
      setIsLoading(true);
      const res = await api_loginWithGoogle(codeResponse.code);
      const { token, user } = res.data;
      CookiesStorage.setAccessToken(token);
      // if (!resUser.data.data.isDeposit) {
      //   await api.post('deposit/create-deposit-address');
      // }
      dispatch(
        saveUserInfo({
          ...convertUserInfo(user),
        }),
      );
      dispatch(initWalletInfo());
      onClose();
      toast.success(t('authentication:loginSuccessfully'), { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      if (error?.response?.data?.msg === 'Email was taken') {
        toast.error(String(t('authentication:emailTaken')), { containerId: TOAST_ENUM.MODAL });
      } else {
        toast.error(String(t('authentication:loginGoogleFailed')), { containerId: TOAST_ENUM.MODAL });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: googleLogin,
    flow: 'auth-code',
  });

  const handleTelegram = async () => {
    try {
      setIsLoading(true);
      window.Telegram.Login.auth({ bot_id: process.env.TELEGRAM_BOT_ID, request_access: true }, async (data: any) => {
        if (!data) {
          setIsLoading(false);
          return;
        }
        const resToken = await api.post('auth/save-info-login-telegram', data);
        CookiesStorage.setAccessToken(resToken.data.data.accessToken);
        const resUser = await api.get('auth/get-user-info');
        if (!resUser.data.data.isDeposit) {
          await api.post('deposit/create-deposit-address');
        }
        dispatch(
          saveUserInfo({
            ...convertUserInfo(resUser.data.data),
          }),
        );
      });
    } catch (error) {
      toast.error(String(t('authentication:loginTelegramFailed')), { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="text-center text-white text-[14px] font-[600]">
        <div className="flex flex-row items-center justify-center gap-[10px]">
          <div
            className="bg-[#12181F] hover:bg-gray-700 p-0.5 font-semibold rounded-[20px]"
            onClick={() => handleGoogleLogin()}
          >
            <button className="px-2 py-2 w-full text-white">
              <Image height={30} width={30} src={'/img/google.svg'} alt="" className="inline w-[30px]" />
            </button>
          </div>
          <div className="bg-[#12181F] hover:bg-gray-700 p-0.5 font-semibold rounded-[20px]" onClick={handleTelegram}>
            <button className="px-2 py-2 w-full text-white">
              <Image height={30} width={30} src={'/img/telegram.svg'} alt="" className="inline w-[30px]" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
