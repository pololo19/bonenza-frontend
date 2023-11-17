/* eslint-disable @next/next/no-img-element */
import { Disclosure, Transition } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { googleLogout } from '@react-oauth/google';
import cn from 'classnames';
import { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { OtpInput } from 'reactjs-otp-input';
import * as yup from 'yup';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER, TOAST_ENUM } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { logoutState } from '@/base/redux/reducers/auth.reducer';
import { changeCryptoArray, changeFiatArray } from '@/base/redux/reducers/common.reducer';
import { changeAuthenticationType, changeIsShowAuthenticationModal } from '@/base/redux/reducers/modal.reducer';
import { AuthenticationModeEnum } from '@/base/types/common';
import { RootState } from '@/base/types/root-state';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import InputPassword from '@/components/input/typing/InputPassword';
import SettingLayout from '@/components/layouts/setting.layout';
import ModalEnterCodeSecurity from '@/components/modal/confirmChangeSecurity/confrimChangeSecurity';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { useWeb3React } from '@web3-react/core';
import { Copy, InfoCircle } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

type ForgotPasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  codeOtp?: string;
};

type LoginPassword = {
  password: string;
};

const SettingSecurity = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSetLogin, setIsSetLogin] = useState<boolean>(false);
  const [openModalCode, setOpenModalCode] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordLogin, setPasswordLogin] = useState<string>('');
  const [otp, setOtp] = useState('');
  const [qrCode, setQrCode] = useState<string>('');
  const [isTwoFactor, setIsTwoFactor] = useState<boolean>(true);
  const [secret, setSecret] = useState<string>('');
  const [passwordBody, setPasswordBody] = useState<ForgotPasswordForm>({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const { t } = useTranslation('');
  const { deactivate } = useWeb3React();
  const dispatch = useDispatch();
  const router = useRouter();

  const { email } = useSelector(
    (state: RootState) => ({
      email: state.auth.email,
    }),
    shallowEqual,
  );

  const schema = yup.object().shape({
    email: yup.string().required(String(t('deposit:currencyRequired'))),
  });

  const loginPasswordControl = yup.object().shape({
    password: yup.string().required(String(t('deposit:currencyRequired'))),
  });

  const { control } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(schema),
  });

  const { control: LoginPasswordControl } = useForm<LoginPassword>({
    resolver: yupResolver(loginPasswordControl),
  });

  useEffect(() => {
    getLoginPassword();
    getQrCode();
  }, []);

  useEffect(() => {
    getTwoFactorAuthStatus();
  }, [email]);

  const handleChange = (otp: string) => setOtp(otp);

  const handleLogout = () => {
    CookiesStorage.logout();
    googleLogout();
    deactivate();
    dispatch(logoutState());
    dispatch(changeFiatArray([]));
    dispatch(changeCryptoArray([]));
    router.replace(ROUTER.Home);
  };

  const getLoginPassword = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('auth/get-set-login');
      setIsSetLogin(res?.data?.setLogin);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const setLoginPassword = async () => {
    setIsLoading(true);
    try {
      await api.put('auth/set-login-password', { loginPassword: password });
      toast.success(t('setting:done'), { containerId: TOAST_ENUM.COMMON });
      setIsSetLogin(true);
      setPassword('');
    } catch (error: any) {
      const messError = error?.response?.data?.msg;
      toast.error(messError, { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  const getQrCode = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/user-setting/qr-code');
      setQrCode(res.data?.qrcode);
      setSecret(res.data?.secret);
    } catch (error: any) {
      const messError = error?.response?.data?.msg;
      toast.error(messError, { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmQrCode = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/user-setting/confirm-qr-code', {
        codeOtp: otp,
        password: passwordLogin,
      });
      toast.success(res?.data?.msg, { containerId: TOAST_ENUM.COMMON });
      setIsTwoFactor(true);
      setOtp('');
      setPasswordLogin('');
    } catch (error: any) {
      const messError = error?.response?.data?.msg;
      toast.error(messError, { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTwoFactor = () => {
    if (isTwoFactor) {
      disableTwoFactor();
    } else {
      confirmQrCode();
    }
  };

  const getTwoFactorAuthStatus = async () => {
    if (!email) return;
    setIsLoading(true);
    try {
      const res = await api.get('/auth/get-two-factor-auth-status', {
        params: {
          email: email,
        },
      });
      setIsTwoFactor(res.data?.twoFactorAuthStatus);
    } catch (error: any) {
      const messError = error?.response?.data?.msg;
      toast.error(messError, { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  const disableTwoFactor = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/user-setting/disable-two-factor-authentication', {
        codeOtp: otp,
        password: passwordLogin,
      });
      toast.success(res?.data?.msg, { containerId: TOAST_ENUM.COMMON });
      setIsTwoFactor(false);
      setOtp('');
      setPasswordLogin('');
    } catch (error: any) {
      const messError = error?.response?.data?.msg;
      toast.error(messError, { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (passwordBody.codeOtp?.length === 6) {
      handleSubmitPassword();
    }
  }, [passwordBody.codeOtp]);

  const handleSubmitPassword = async () => {
    if (isTwoFactor && !passwordBody.codeOtp) {
      setOpenModalCode(true);
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.put('auth/change-password', passwordBody);
      handleLogout();
      setOpenModalCode(false);
      toast.success(res?.data?.msg, { containerId: TOAST_ENUM.COMMON });
      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
      dispatch(changeIsShowAuthenticationModal(true));
    } catch (error: any) {
      const messError = error?.response?.data?.msg;
      toast.error(messError, { containerId: TOAST_ENUM.COMMON });
      handleChangePassword('', 'codeOtp');
      if (isTwoFactor) setOpenModalCode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = (value: string, key: string) => {
    setPasswordBody((pre) => ({
      ...pre,
      [key]: value,
    }));
  };

  const copy = (text: string) => {
    toast.success('Copied', { containerId: TOAST_ENUM.COMMON });
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="xl:px-[60px] lg:px-[40px] md:px-[20px] md:mt-0 mt-[30px] flex min-[991px]:flex-row flex-col lg:gap-[40px] md:gap-[20px] gap-[10px]">
        {isSetLogin ? (
          <form className="flex-1 flex flex-col items-start gap-[12px] w-full">
            <Disclosure defaultOpen={true}>
              {({ open }) => (
                <div className="w-full">
                  <Disclosure.Button className="py-2 w-full flex justify-between sm:pointer-events-none pointer-events-auto">
                    <div className="font-semibold text-[14px] mb-2">{t('setting:changePassword')}</div>
                    <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 sm:hidden block`} />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100 w-full"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100 w-full"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className={'flex flex-col gap-[20px] w-full'}>
                      <div className="flex flex-col items-start gap-[10px]">
                        <label className="dark:text-[#C2C2C2] text-[#31373d] text-[12px]">
                          {t('setting:oldPassword')}
                        </label>
                        <InputPassword
                          customClass="rounded-[5px] w-full !text-[14px] placeholder:text-[14px] placeholder:text-[#777777]"
                          name="oldPassword"
                          placeholder={`${t('setting:oldPassword')}`}
                          value={passwordBody?.oldPassword}
                          onChange={(e) => handleChangePassword(e.target.value, 'oldPassword')}
                          control={control}
                        />
                      </div>
                      <div className="flex flex-col items-start gap-[10px]">
                        <label className="dark:text-[#C2C2C2] text-[#31373d] text-[12px]">
                          {t('setting:newPassword')}
                        </label>
                        <InputPassword
                          customClass="rounded-[5px] w-full !text-[14px] placeholder:text-[14px] placeholder:text-[#777777]"
                          name="newPassword"
                          placeholder={`${t('setting:newPassword')}`}
                          value={passwordBody?.newPassword}
                          onChange={(e) => handleChangePassword(e.target.value, 'newPassword')}
                          control={control}
                        />
                      </div>
                      <div className="flex flex-col items-start gap-[10px]">
                        <label className="dark:text-[#C2C2C2] text-[#31373d] text-[12px]">
                          {t('setting:confirmNewPassword')}
                        </label>
                        <InputPassword
                          customClass="rounded-[5px] w-full !text-[14px] placeholder:text-[14px] placeholder:text-[#777777]"
                          name="confirmNewPassword"
                          placeholder={`${t('setting:confirmNewPassword')}`}
                          value={passwordBody?.confirmNewPassword}
                          onChange={(e) => handleChangePassword(e.target.value, 'confirmNewPassword')}
                          control={control}
                        />
                      </div>
                      <div className="text-start text-[12px] text-[#0DFDE4] flex gap-[5px]">
                        <InfoCircle size={16} /> {t('setting:reLoginWillBeRequiredAfterChangingThePassword')}
                      </div>
                      <div
                        onClick={handleSubmitPassword}
                        role="button"
                        className="bg-[#F61B4F] hover:opacity-[0.9] rounded-[5px] text-white text-[14px] px-[30px] py-[10px] m-auto"
                      >
                        {t('setting:saveChanges')}
                      </div>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
          </form>
        ) : (
          <form className="flex-1 flex flex-col items-start gap-[12px] w-full">
            <Disclosure defaultOpen={true}>
              {({ open }) => (
                <div className="w-full">
                  <Disclosure.Button className="py-2 w-full flex justify-between sm:pointer-events-none pointer-events-auto">
                    <div className="font-semibold text-[14px]">{t('setting:setLoginPassword')}</div>
                    <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 sm:hidden block`} />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100 w-full"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100 w-full"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className={'flex flex-col gap-[20px] w-full'}>
                      <div className="flex flex-col items-start gap-[10px] mt-2">
                        <InputPassword
                          customClass="rounded-[5px] w-full !text-[14px] placeholder:text-[14px] placeholder:text-[#777777]"
                          name="oldPassword"
                          placeholder={`${t('setting:passwordPlaceholder')}`}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          control={control}
                        />
                      </div>
                      <div
                        onClick={setLoginPassword}
                        role="button"
                        className="bg-[#F61B4F] hover:opacity-[0.9] rounded-[5px] text-white text-[14px] px-[30px] py-[10px] m-auto"
                      >
                        {t('setting:confirm')}
                      </div>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
          </form>
        )}

        <div className="bg-[#3D4049] w-[1px]"></div>

        <form className="flex-1 flex flex-col items-start gap-[12px] w-full">
          <Disclosure defaultOpen={true}>
            {({ open }) => (
              <div className="w-full">
                <Disclosure.Button className="py-2 w-full flex justify-between sm:pointer-events-none pointer-events-auto">
                  <div className="font-semibold text-[14px]">{t('setting:twoFactorAuthentication')}</div>
                  <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 sm:hidden block`} />
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100 w-full"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100 w-full"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className={'flex flex-col gap-[20px] w-full'}>
                    {isTwoFactor ? (
                      <>
                        <div className="text-start text-[12px] dark:text-[#C2C2C2] text-[#31373d]">
                          <p>{t('setting:disableTwoFactor')}</p>
                          <p className="mt-3">{t('setting:loginPassword')}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-start text-[12px] dark:text-[#C2C2C2] text-[#31373d]">
                          {t('setting:downloadAndInstall')} &nbsp;
                          <a
                            className="!underline"
                            href="https://support.google.com/accounts/answer/1066447?hl=en&rd=1"
                            target="_blank"
                          >
                            {t('setting:googleAuthenticator')}
                          </a>
                          &nbsp;
                          {t('setting:enableTwoFactor')}
                        </div>
                        <div className="text-start text-[12px] dark:text-[#C2C2C2] text-[#31373d] flex gap-[5px]">
                          {t('setting:scanTheQRCode')}
                        </div>
                        <div className="flex justify-center">
                          <Image height={100} width={100} src={qrCode} alt="" />
                        </div>
                        <div className="flex flex-col items-start gap-[10px]">
                          <label className="dark:text-[#C2C2C2] text-[#31373d] text-[12px]">
                            {t('setting:yourSecretKey')}
                          </label>
                          <div className="dark:bg-[#292C33] bg-[#f5f6fa] rounded-[10px] flex items-center px-[10px] py-[10px] gap-[18px] text-[14px] w-full">
                            <input
                              value={secret}
                              className={cn(
                                'w-full dark:bg-[#292C33] bg-[#f5f6fa] focus:outline-none text-[12px] dark:text-white text-black w-full',
                              )}
                            />
                            <Copy onClick={() => copy(String(secret))} className="text-[#FD6E0B]" />
                          </div>
                        </div>
                        <div className="text-start text-[12px] dark:text-[#C2C2C2] text-[#31373d] flex gap-[5px]">
                          {t('setting:writeDownThisCode')}
                        </div>
                        <div className="flex justify-center dark:text-[#C2C2C2] text-[#31373d] text-[12px]">
                          {t('setting:yourSecretKey')}
                        </div>
                        <div className="flex justify-center">
                          <OtpInput
                            value={otp}
                            onChange={handleChange}
                            numInputs={6}
                            inputStyle={
                              'dark:bg-[#222328] bg-[#f5f6fa] dark:text-white text-black !w-[32px] h-[32px] rounded-[5px] focus:outline-none'
                            }
                            containerStyle={'gap-[4px]'}
                          />
                        </div>
                      </>
                    )}
                    <InputPassword
                      customClass="rounded-[5px] w-full !text-[14px] placeholder:text-[14px] placeholder:text-[#777777]"
                      name="password"
                      placeholder="Login Password"
                      value={passwordLogin}
                      onChange={(e) => setPasswordLogin(e.target.value)}
                      control={LoginPasswordControl}
                    />
                    {isTwoFactor && (
                      <div>
                        <p className="mb-2 dark:text-[#98a7b5] text-[#31373d] text-[12px]">
                          {t('setting:verificationCode')}
                        </p>
                        <div className="flex justify-center">
                          <OtpInput
                            value={otp}
                            onChange={handleChange}
                            numInputs={6}
                            inputStyle={
                              'dark:bg-[#222328] bg-[#f5f6fa] dark:text-white text-black !w-[32px] h-[32px] rounded-[5px] focus:outline-none'
                            }
                            containerStyle={'gap-[4px]'}
                          />
                        </div>
                      </div>
                    )}
                    <div
                      onClick={handleSubmitTwoFactor}
                      role="button"
                      className="bg-[#F61B4F] hover:opacity-[0.9] rounded-[5px] text-white text-[14px] px-[30px] py-[10px] m-auto"
                    >
                      {isTwoFactor ? t('setting:disable') : t('setting:enable')}
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>
        </form>
      </div>
      {openModalCode && (
        <ModalEnterCodeSecurity
          value={passwordBody}
          onChange={handleChangePassword}
          show={openModalCode}
          email={email}
          onClose={() => {
            setOpenModalCode(false);
            handleChangePassword('', 'codeOtp');
          }}
        />
      )}
    </>
  );
};

const SettingSecurityAuth = withAuth(SettingSecurity);

SettingSecurityAuth.getLayout = function getLayout(page: ReactElement) {
  return <SettingLayout>{page}</SettingLayout>;
};

export default SettingSecurityAuth;
