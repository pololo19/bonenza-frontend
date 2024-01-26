import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { googleLogout } from '@react-oauth/google';
import cn from 'classnames';
import { Copy, InfoCircle } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { OtpInput } from 'reactjs-otp-input';
import * as yup from 'yup';

import { api_changePassword, api_getSetLogin, api_setLoginPassword } from '@/api/auth';
import { api_confirmQRCode, api_disable2FA, api_generateQRCode } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER, TOAST_ENUM } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo, copyClipBoard } from '@/base/libs/utils';
import { logoutState, saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { changeAuthenticationType, changeIsShowAuthenticationModal } from '@/base/redux/reducers/modal.reducer';
import { logoutWallet } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import InputPassword from '@/components/input/typing/InputPassword';
import SettingLayout from '@/components/layouts/setting.layout';
import ModalEnterCodeSecurity from '@/components/modal/confirmChangeSecurity/confrimChangeSecurity';

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
  const [secret, setSecret] = useState<string>('');
  const [passwordBody, setPasswordBody] = useState<ForgotPasswordForm>({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { email, tfa } = useSelector(
    (state: AppState) => ({
      email: state.auth.user.email,
      tfa: state.auth.user.tfa,
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

  const handleChange = (otp: string) => setOtp(otp);

  const handleLogout = () => {
    CookiesStorage.logout();
    googleLogout();
    dispatch(logoutState());
    dispatch(logoutWallet());
    router.replace(ROUTER.Home);
  };

  const getLoginPassword = async () => {
    setIsLoading(true);
    try {
      const res = await api_getSetLogin();
      setIsSetLogin(res?.data?.setLogin);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const setLoginPassword = async () => {
    setIsLoading(true);
    try {
      const res = api_setLoginPassword(password);
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
      const res = await api_generateQRCode();
      setQrCode(res.data.qrCodeUrl);
      setSecret(res.data.secretKey);
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
      const res = await api_confirmQRCode(otp, passwordLogin);
      toast.success('success', { containerId: TOAST_ENUM.COMMON });

      dispatch(
        saveUserInfo({
          ...convertUserInfo(res.data),
        }),
      );

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
    if (tfa) {
      disableTwoFactor();
    } else {
      confirmQrCode();
    }
  };

  const disableTwoFactor = async () => {
    setIsLoading(true);
    try {
      const res = await api_disable2FA(otp, passwordLogin);
      toast.success('success', { containerId: TOAST_ENUM.COMMON });

      dispatch(
        saveUserInfo({
          ...convertUserInfo(res.data),
        }),
      );

      setOtp('');
      setPasswordLogin('');
    } catch (error: any) {
      const messError = error?.response?.data?.message;
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
    if (tfa && !passwordBody.codeOtp) {
      setOpenModalCode(true);
      return;
    }
    setIsLoading(true);
    try {
      const res = await api_changePassword(
        passwordBody.oldPassword,
        passwordBody.newPassword,
        passwordBody.confirmNewPassword,
        passwordBody.codeOtp,
      );
      handleLogout();
      setOpenModalCode(false);
      toast.success(t('setting:done'), { containerId: TOAST_ENUM.COMMON });
      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
      dispatch(changeIsShowAuthenticationModal(true));
    } catch (error: any) {
      const messError = error?.response?.data?.msg;
      toast.error(messError, { containerId: TOAST_ENUM.COMMON });
      handleChangePassword('', 'codeOtp');
      if (tfa) setOpenModalCode(true);
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

  console.log(otp, '-----237');
  return (
    <>
      {isLoading && <Loader />}
      <div className="xl:px-[60px] lg:px-[40px] md:px-[20px] px-2 md:mt-0 sm:mt-[30px] mt-0 flex min-[991px]:flex-row flex-col lg:gap-[40px] md:gap-[20px] gap-[10px]">
        {isSetLogin && (
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
                        <label className="dark:text-color-text-primary text-[#31373d] text-[12px]">
                          {t('setting:oldPassword')}
                        </label>
                        <InputPassword
                          customClass="rounded-[3px] w-full dark:!bg-color-input-primary !text-[14px] placeholder:text-[14px] placeholder:text-[#777777]"
                          name="oldPassword"
                          placeholder={`${t('setting:oldPassword')}`}
                          value={passwordBody?.oldPassword}
                          onChange={(e) => handleChangePassword(e.target.value, 'oldPassword')}
                          control={control}
                        />
                      </div>
                      <div className="flex flex-col items-start gap-[10px]">
                        <label className="dark:text-color-text-primary text-[#31373d] text-[12px]">
                          {t('setting:newPassword')}
                        </label>
                        <InputPassword
                          customClass="rounded-[3px] w-full dark:!bg-color-input-primary !text-[14px] placeholder:text-[14px] placeholder:text-[#777777]"
                          name="newPassword"
                          placeholder={`${t('setting:newPassword')}`}
                          value={passwordBody?.newPassword}
                          onChange={(e) => handleChangePassword(e.target.value, 'newPassword')}
                          control={control}
                        />
                      </div>
                      <div className="flex flex-col items-start gap-[10px]">
                        <label className="dark:text-color-text-primary text-[#31373d] text-[12px]">
                          {t('setting:confirmNewPassword')}
                        </label>
                        <InputPassword
                          customClass="rounded-[3px] w-full dark:!bg-color-input-primary !text-[14px] placeholder:text-[14px] placeholder:text-[#777777]"
                          name="confirmNewPassword"
                          placeholder={`${t('setting:confirmNewPassword')}`}
                          value={passwordBody?.confirmNewPassword}
                          onChange={(e) => handleChangePassword(e.target.value, 'confirmNewPassword')}
                          control={control}
                        />
                      </div>
                      <div className="text-start text-[12px] text-color-primary flex gap-[5px]">
                        <InfoCircle size={16} /> {t('setting:reLoginWillBeRequiredAfterChangingThePassword')}
                      </div>
                      <div
                        onClick={handleSubmitPassword}
                        role="button"
                        className="bg-gradient-btn-default hover:opacity-[0.9] rounded-[3px] text-white text-[14px] px-[30px] py-[10px] m-auto"
                      >
                        {t('setting:saveChanges')}
                      </div>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
          </form>
        )}

        {!isSetLogin && (
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
                          customClass="rounded-[3px] w-full dark:!bg-color-input-primary !text-[14px] placeholder:text-[14px] placeholder:text-[#777777]"
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
                        className="bg-gradient-btn-default hover:opacity-[0.9] rounded-[3px] text-white text-[14px] px-[30px] py-[10px] m-auto"
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
                    {tfa ? (
                      <>
                        <div className="text-start text-[12px] dark:text-color-text-primary text-[#31373d]">
                          <p>{t('setting:disableTwoFactor')}</p>
                          <p className="mt-3">{t('setting:loginPassword')}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-start text-[12px] dark:text-color-text-primary text-[#31373d]">
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
                        <div className="text-start text-[12px] dark:text-color-text-primary text-[#31373d] flex gap-[5px]">
                          {t('setting:scanTheQRCode')}
                        </div>
                        <div className="flex justify-center">
                          <Image height={100} width={100} src={qrCode} alt="" />
                        </div>
                        <div className="flex flex-col items-start gap-[10px]">
                          <label className="dark:text-color-text-primary text-[#31373d] text-[12px]">
                            {t('setting:yourSecretKey')}
                          </label>
                          <div className="dark:bg-color-input-primary bg-[#f5f6fa] rounded-[3px] flex items-center px-[10px] py-[10px] gap-[18px] text-[14px] w-full">
                            <input
                              value={secret}
                              className={cn(
                                'w-full dark:bg-color-input-primary bg-[#f5f6fa] focus:outline-none text-[12px] dark:text-white text-black',
                              )}
                            />
                            <Copy onClick={() => copyClipBoard(String(secret))} className="text-color-text-primary" />
                          </div>
                        </div>
                        <div className="text-start text-[12px] dark:text-color-text-primary text-[#31373d] flex gap-[5px]">
                          {t('setting:writeDownThisCode')}
                        </div>
                        <div className="flex justify-center dark:text-color-text-primary text-[#31373d] text-[12px]">
                          {t('setting:2FAVerificationRequired')}
                        </div>
                        <div className="flex justify-center">
                          <OtpInput
                            value={otp}
                            onChange={handleChange}
                            numInputs={6}
                            inputStyle={
                              'dark:!bg-color-input-primary bg-[#f5f6fa] dark:!text-white !text-black !w-[32px] !h-[32px] !rounded-[3px] focus:!outline-none'
                            }
                            containerStyle={'gap-[4px]'}
                          />
                        </div>
                      </>
                    )}
                    <InputPassword
                      customClass="rounded-[3px] w-full !text-[14px] placeholder:text-[14px] placeholder:text-[#777777]"
                      name="password"
                      placeholder="Login Password"
                      value={passwordLogin}
                      onChange={(e) => setPasswordLogin(e.target.value)}
                      control={LoginPasswordControl}
                    />
                    {tfa && (
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
                              'dark:bg-color-input-primary bg-[#f5f6fa] dark:text-white text-black !w-[32px] h-[32px] rounded-[3px] focus:outline-none'
                            }
                            containerStyle={'gap-[4px]'}
                          />
                        </div>
                      </div>
                    )}
                    <div
                      onClick={handleSubmitTwoFactor}
                      role="button"
                      className="bg-gradient-btn-default hover:opacity-[0.9] rounded-[3px] text-white text-[14px] px-[30px] py-[10px] m-auto"
                    >
                      {tfa ? t('setting:disable') : t('setting:enable')}
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
