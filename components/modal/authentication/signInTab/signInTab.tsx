import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { api_get2FAStatus, api_login, api_sendVerifyQRCode } from '@/api/auth';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { COUNTRY_CALLING_CODES } from '@/base/constants/countryCallingCode';
import { convertUserInfo } from '@/base/libs/utils';
import getErrorMessage from '@/base/libs/utils/notificationToast';
import { changeAuthenticationType, changeIsShowAuthenticationModal } from '@/base/redux/reducers/modal.reducer';
import { initWalletInfo } from '@/base/redux/reducers/wallet.reducer';
import { useAppDispatch } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import InputEmailPhone from '@/components/input/typing/InputEmailPhone';
import InputPassAuthentication from '@/components/input/typing/InputPassAuthentication';
import InputText from '@/components/input/typing/InputText';
import { CookiesStorage } from '@/libs/storage/cookie';
import { saveUserInfo, saveVerifyInfo, setIsForgetPassword } from '@/redux/reducers/auth.reducer';
import { LoginRequest } from '@/types/requestTypes';

type SignInTabProps = {
  setIsLoginTwoFactor: (isTowFactor: boolean) => void;
  isLoginTwoFactor?: boolean;
  setForgotKey: (isForgot: boolean) => void;
  forgotKey?: boolean;
  email?: string;
};

type VerificationCodeOtpForm = {
  codeOtp: string;
};

export default function SignInTab({
  setIsLoginTwoFactor,
  isLoginTwoFactor,
  setForgotKey,
  forgotKey,
  email,
}: SignInTabProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [codeOtp, setCodeOtp] = useState<string>('');
  const [countryCallingCode, setCountryCallingCode] = useState<(typeof COUNTRY_CALLING_CODES)[number]>();

  const dispatch = useAppDispatch();

  const { t } = useTranslation('');

  const verificationOtpSchema = yup.object().shape({
    codeOtp: yup.string().required(String(t('authentication:codeOtpRequired'))),
  });

  const { control: verificationCodeOtpControl, setValue: setOtpValue } = useForm<VerificationCodeOtpForm>({
    resolver: yupResolver(verificationOtpSchema),
  });

  const schema = yup.object().shape({
    email: yup
      .string()
      .required(String(t('authentication:email&phoneRequired')))
      .trim(),
    password: yup
      .string()
      .required(String(t('authentication:passwordRequired')))
      .trim(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isLoginTwoFactor) {
      setCodeOtp('');
      setOtpValue('codeOtp', '');
    } else {
      setCodeOtp('');
    }
  }, [isLoginTwoFactor]);

  const getTwoFactorAuthStatus = async (formLogin: LoginRequest) => {
    if (!formLogin.email) return false;
    let isTwoFactor = false;
    setIsLoading(true);
    try {
      const res = await api_get2FAStatus(formLogin.email);
      isTwoFactor = res.data;
    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
    return isTwoFactor;
  };

  const onLogin = async (formLogin: LoginRequest) => {
    let checkTwoFactor = false;
    const isPhoneNumber = formLogin.email && formLogin.email.length > 2 && Number.isInteger(Number(formLogin.email));
    // will be implemented with 2fa
    if (!codeOtp && !isPhoneNumber) {
      checkTwoFactor = await getTwoFactorAuthStatus(formLogin);
    }
    if (checkTwoFactor) {
      setIsLoginTwoFactor(true);
      return;
    } else {
      try {
        setIsLoading(true);

        const request = {
          email: !isPhoneNumber ? formLogin.email : '',
          codeOtp: codeOtp,
          password: formLogin.password,
          phone: isPhoneNumber ? `+${String(countryCallingCode?.countryCallingCode) + formLogin.email}` : '',
        };
        const res = await api_login(request);
        const { token, user } = res.data;
        CookiesStorage.setAccessToken(token);
        dispatch(
          saveUserInfo({
            ...convertUserInfo(user),
          }),
        );
        dispatch(initWalletInfo());
        dispatch(changeIsShowAuthenticationModal(false));
      } catch (error: any) {
        const isPhoneNumber =
          formLogin.email && formLogin.email.length > 2 && Number.isInteger(Number(formLogin.email));

        setCodeOtp('');
        setOtpValue('codeOtp', '');
        const message = error.response.data.message;
        const status = error.response.data.statusCode;
        const errData = getErrorMessage('auth', 'signIn', status, message, isPhoneNumber ? 'phone' : 'email');
        toast.error(String(t(errData.message, errData.data)), { containerId: TOAST_ENUM.MODAL });

        // user is not allowed
        if (status == 406) {
          const phone = isPhoneNumber ? String(countryCallingCode?.countryCallingCode) + formLogin.email : '';
          dispatch(changeAuthenticationType(AuthenticationModeEnum.VERIFY));
          dispatch(setIsForgetPassword(false));
          dispatch(
            saveVerifyInfo({
              verifyRequest: isPhoneNumber ? phone : formLogin.email,
              isPhoneVerifyRequested: !!isPhoneNumber,
            }),
          );
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sendQrCodeToEmail = async () => {
    const formData = getValues();
    if (!formData.email) return;
    setIsLoading(true);
    try {
      const res = await api_sendVerifyQRCode(formData.email);
      toast.success(res?.data?.msg, { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      const messError = error?.response?.data?.msg;
      toast.error(messError, { containerId: TOAST_ENUM.COMMON });
      setCodeOtp('');
      setOtpValue('codeOtp', '');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const paste = () => {
    toast.success('Pasted', { containerId: TOAST_ENUM.COMMON });
    navigator.clipboard.readText().then((text) => {
      setCodeOtp(text);
      setOtpValue('codeOtp', text);
    });
  };

  const onClose = () => {
    setForgotKey(false);
    setIsLoginTwoFactor(false);
  };
  return (
    <>
      {isLoading && <Loader />}
      {forgotKey ? (
        <div className="dark:bg-[#25262B] bg-white text-[16px]">
          <div className="flex items-center justify-center h-[140px] dark:text-[#98A7b5] text-[#31373d]">
            {t('setting:2FASentEmail')}
          </div>
          <div className="flex items-center p-10 pt-0 gap-4 mt-[20px]">
            <div
              onClick={onClose}
              role="button"
              className="bg-[#F61B4F] grow hover:opacity-[0.9] rounded-[5px] text-center text-white text-[14px] px-[30px] py-[10px] m-auto"
            >
              {t('setting:cancel')}
            </div>
            <div
              onClick={sendQrCodeToEmail}
              role="button"
              className="bg-[#FD6E0B] grow hover:opacity-[0.9] text-center rounded-[5px] text-white text-[14px] px-[30px] py-[10px] m-auto"
            >
              {t('setting:confirm')}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onLogin)} data-testid="user-detail-form">
          {isLoginTwoFactor ? (
            <>
              <div className="sm:mt-5 mt-3 flex flex-col items-start sm:gap-[20px] gap-[10px]">
                <div className="relative w-full">
                  <InputText
                    customClass="px-[10px] py-[10px] my-[10px] dark:bg-[#12181f] bg-[#f5f6fa] rounded-[5px] w-full !text-[14px] placeholder:text-[14px] placeholder:text-[#777777]"
                    name="codeOtp"
                    onChange={(e) => setCodeOtp(e.target.value)}
                    value={codeOtp}
                    placeholder={String(t('authentication:googleSecurity2FA'))}
                    control={verificationCodeOtpControl}
                  />
                  <div
                    onClick={paste}
                    className="absolute cursor-pointer right-[10px] h-[41px] top-[11px] flex items-center dark:bg-[#12181f] bg-[#f5f6fa]"
                  >
                    <span className="dark:text-white text-black text-[14px] ml-[6px]">{t('authentication:paste')}</span>
                  </div>
                </div>
                <div
                  onClick={() => setForgotKey(true)}
                  className="text-right cursor-pointer w-full mb-4 text-[14px] dark:text-white text-black hover:underline"
                >
                  {t('authentication:lostSecutiry2FAKey')}
                </div>
              </div>
              <button
                type="submit"
                className={`${
                  codeOtp.length < 6 && 'opacity-70 pointer-events-none'
                } bg-primary w-full rounded-[5px] flex justify-between items-center py-[10px] pl-[40px] pr-[17px] sm:mt-5 mt-3`}
              >
                <div />
                <div className="text-[14px] text-white">{t('authentication:submit')}</div>
                <div className="p-[10px] flex items-center justify-center rounded-large bg-white/20">
                  <Image height={14} width={14} src="/img/icon/arrow-right.png" alt="" />
                </div>
              </button>
            </>
          ) : (
            <>
              <div className="sm:mt-5 mt-3 flex flex-col items-start sm:gap-[20px] gap-[10px]">
                <InputEmailPhone
                  onChangeCountryCallingCode={setCountryCallingCode}
                  control={control}
                  customClass="rounded-sm"
                  name="email"
                  placeholder={String(t('authentication:emailOrPhoneNumber'))}
                />
                <InputPassAuthentication
                  control={control}
                  name="password"
                  placeholder={String(t('authentication:password'))}
                  type="password"
                />
              </div>
              <div className="flex justify-end">
                <div
                  role="button"
                  className="text-[13px] text-black dark:text-white sm:mt-[19px] mt-[10px] hover:text-amber-500 max-w-[146px] hover:underline"
                  onClick={() => {
                    dispatch(changeAuthenticationType(AuthenticationModeEnum.FORGOT_PASS));
                  }}
                >
                  {t('authentication:forgotYourPass')}
                </div>
              </div>
              <button
                type="submit"
                className="bg-color-primary w-full rounded-[5px] flex justify-between items-center py-[10px] pl-[40px] pr-[17px] sm:mt-5 mt-3"
              >
                <div />
                <div className="text-[14px] text-white">{t('authentication:continue')}</div>
                <div className="p-[10px] flex items-center justify-center rounded-large bg-white/20">
                  <Image height={14} width={14} src="/img/icon/arrow-right.png" alt="" />
                </div>
              </button>
              <div className="flex">
                <div role="button" className="text-[14px] w-full dark:text-white sm:mt-[19px] mt-[10px] text-center">
                  <span className="text-[#98A7B5]">{t('authentication:newtoBonenza')}&nbsp;&nbsp;</span>
                  <span
                    className="text-[#50c627] hover:text-amber-500 hover:underline"
                    onClick={() => {
                      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
                    }}
                  >
                    {t('authentication:createAccount')}
                  </span>
                </div>
              </div>
            </>
          )}
        </form>
      )}
    </>
  );
}
