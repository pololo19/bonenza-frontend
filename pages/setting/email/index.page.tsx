import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import { TickCircle } from 'iconsax-react';
import { useTheme } from 'next-themes';
import { ReactElement, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import InputText from '@/components/input/typing/InputText';
import SettingLayout from '@/components/layouts/setting.layout';

import styles from './index.module.scss';

type VerificationEmailForm = {
  email: string;
};

type VerificationPhoneNumberForm = {
  phoneNumber: string;
};

type confirmCodeForm = {
  code: string;
};

const SettingEmail = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>('');
  const [isphoneNumberVerify, setPhoneNumberVerify] = useState<boolean>(false);
  const [isConfirmCode, setIsConfirmCode] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [emailUser, setEmailUser] = useState<string | undefined>('');
  const [isEmailVerify, setEmailVerify] = useState<boolean>(false);
  const { t } = useTranslation('');
  const { theme } = useTheme();

  const { email, phone } = useSelector(
    (state: AppState) => ({
      phone: state.auth.user.phone,
      email: state.auth.user.email,
    }),
    shallowEqual,
  );

  const verificationEmailSchema = yup.object().shape({
    email: yup.string().required(String(t('deposit:currencyRequired'))),
  });

  const verificationPhoneNumberSchema = yup.object().shape({
    phoneNumber: yup.string().required(String(t('deposit:currencyRequired'))),
  });

  const confirmPhoneNumberSchema = yup.object().shape({
    code: yup.string().required(String(t('deposit:currencyRequired'))),
  });

  const { control: verificationEmailControl, setValue: setEmailValue } = useForm<VerificationEmailForm>({
    resolver: yupResolver(verificationEmailSchema),
  });

  const { control: verificationPhoneNumberControl } = useForm<VerificationPhoneNumberForm>({
    resolver: yupResolver(verificationPhoneNumberSchema),
  });

  const { control: confirmPhoneNumberControl } = useForm<confirmCodeForm>({
    resolver: yupResolver(confirmPhoneNumberSchema),
  });

  useEffect(() => {
    getVerifyPhoneEmail();
  }, []);

  useEffect(() => {
    if (isphoneNumberVerify) {
      setPhoneNumber('+' + phone);
    }
  }, [phone, isphoneNumberVerify]);

  useEffect(() => {
    if (isEmailVerify) {
      setEmailValue('email', String(email));
    }
  }, [email, isEmailVerify]);

  const handleSubmitPhoneNumber = async () => {
    if (isphoneNumberVerify) {
      setPhoneNumber('');
      setPhoneNumberVerify(false);
    } else if (isConfirmCode) {
      confirmPhoneNumber();
    } else {
      sendPhoneNumber();
    }
  };

  const sendPhoneNumber = async () => {
    if (!phoneNumber) {
      return;
    }
    setIsLoading(true);
    try {
      await api.post('user-setting/send-phone-number', {
        phone: phoneNumber?.replace('+', ''),
      });
      setIsConfirmCode(true);
    } catch (error: any) {
      const messError = error?.response?.data?.msg;
      toast.error(messError, { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmPhoneNumber = async () => {
    if (!code) {
      return;
    }
    setIsLoading(true);
    try {
      await api.post('user-setting/confirm-phone-number', {
        code: code,
      });
      setIsConfirmCode(false);
    } catch (error: any) {
      const messError = error?.response?.data?.msg;
      toast.error(messError, { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  const getVerifyPhoneEmail = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('user-setting/get-email-and-phone-verify');
      setPhoneNumberVerify(res.data?.verifyPhone);
      setEmailVerify(res.data?.verifyEmail);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerifyEmail = async () => {
    if (!email) {
      return;
    }
    setIsLoading(true);
    try {
      await api.post('user-setting/send-verify-email', {
        email: emailUser,
      });
      toast.success(t('setting:verificationEmail'), { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      const messError = error?.response?.data?.msg;
      toast.error(messError, { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="xl:px-[80px] lg:px-[40px] md:px-[20px] xl:py-[32px] lg:py-[24px] md:py-[12px] md:mt-0 mt-[30px] flex min-[991px]:flex-row flex-col xl:gap-[80px] lg:gap-[40px] md:gap-[20px] gap-[10px]">
        <form className="flex-1 flex flex-col items-start gap-[12px] w-full">
          <div className="flex-1 sm:flex hidden flex-col items-start gap-[12px] w-full">
            <div className="font-semibold text-[14px]">{t('setting:emailVerification')}</div>
            <div className="text-start text-[10px] text-[#31373d] dark:text-[#C2C2C2]">
              {t('setting:accordingToTheSecurityPolicy')}
            </div>
            <div className="relative w-full">
              <InputText
                customClass="px-[10px] py-[10px] my-[10px] dark:bg-[#292C33] bg-[#f5f6fa] rounded-[5px] w-full !text-[14px] placeholder:text-[14px] placeholder:text-[#777777]"
                name="email"
                placeholder={`${t('setting:emailPlaceholder')}`}
                disabled={isEmailVerify}
                control={verificationEmailControl}
                value={emailUser}
                onChange={(e) => setEmailUser(e.target.value)}
              />
              {isEmailVerify && (
                <div className="absolute right-[10px] h-[calc(100%-20px)] top-[10px] flex items-center dark:bg-[#292C33] bg-[#f5f6fa]">
                  <TickCircle size="16" color="#3BC117" variant="Bold" />
                  <span className="text-[#3BC117] text-[14px] ml-[6px] font-bold">{t('setting:verified')}</span>
                </div>
              )}
            </div>
            {!isEmailVerify && (
              <div
                onClick={sendVerifyEmail}
                role="button"
                className="bg-[#F61B4F] hover:opacity-[0.9] rounded-[5px] text-white text-[14px] px-[30px] py-[10px] m-auto"
              >
                {t('setting:verify')}
              </div>
            )}
          </div>
          <Disclosure>
            {({ open }) => (
              <div className="sm:hidden block w-full">
                <Disclosure.Button className="py-2 w-full flex justify-between">
                  <div className="font-semibold text-[14px]">{t('setting:emailVerification')}</div>
                  <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
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
                    <div className="text-start text-[10px] text-[#31373d] dark:text-[#C2C2C2]">
                      {t('setting:accordingToTheSecurityPolicy')}
                    </div>
                    <div className="relative w-full">
                      <InputText
                        customClass="px-[10px] py-[10px] my-[10px] dark:bg-[#292C33] bg-[#f5f6fa] rounded-[5px] w-full !text-[14px] placeholder:text-[14px] placeholder:text-[#777777]"
                        name="email"
                        disabled={isEmailVerify}
                        placeholder={`${t('setting:emailPlaceholder')}`}
                        control={verificationEmailControl}
                        value={emailUser}
                        onChange={(e) => setEmailUser(e.target.value)}
                      />
                      {isEmailVerify && (
                        <div className="absolute right-[10px] h-[calc(100%-20px)] top-[10px] flex items-center dark:bg-[#292C33] bg-[#f5f6fa]">
                          <TickCircle size="16" color="#3BC117" variant="Bold" />
                          <span className="text-[#3BC117] text-[14px] ml-[6px] font-bold">{t('setting:verified')}</span>
                        </div>
                      )}
                    </div>
                    {!isEmailVerify && (
                      <div
                        onClick={sendVerifyEmail}
                        role="button"
                        className="w-fit bg-[#F61B4F] hover:opacity-[0.9] rounded-[5px] text-white text-[14px] px-[30px] py-[10px] m-auto"
                      >
                        {t('setting:verify')}
                      </div>
                    )}
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>
        </form>
        <div className="bg-[#3D4049] w-[1px]"></div>

        <form className="flex-1 flex flex-col items-start gap-[12px] w-full">
          <div className="flex-1 sm:flex hidden flex-col items-start gap-[12px] w-full">
            <div className="font-semibold text-[14px]">{t('setting:phoneNumber')}</div>
            <div className="text-start text-[10px] text-[#31373d] dark:text-[#C2C2C2]">
              {t('setting:verifyYourPhoneNumber')}
            </div>
            <div className="px-[10px] py-[10px] my-[10px] dark:bg-[#292C33] bg-[#f5f6fa] rounded-[5px] w-full text-[14px] placeholder:text-[14px]">
              <PhoneInput
                className={cn('rounded-[5px] w-full', styles.phoneInput, theme === 'light' && styles.phoneInputLight)}
                name="phoneNumber"
                international
                disabled={isphoneNumberVerify}
                placeholder={`${t('setting:phonePlaceholder')}`}
                control={verificationPhoneNumberControl}
                value={phoneNumber}
                onChange={(val) => setPhoneNumber(val)}
              />
            </div>
            {isConfirmCode && (
              <>
                <div className="text-start text-[10px] text-[#31373d] dark:text-[#C2C2C2]">
                  {t('setting:confirmYourPhoneNumber', { phone: phoneNumber })}
                </div>
                <div className="px-[10px] py-[10px] my-[10px] dark:bg-[#292C33] bg-[#f5f6fa] rounded-[5px] w-full text-[14px] placeholder:text-[14px]">
                  <InputText
                    name="code"
                    control={confirmPhoneNumberControl}
                    customClass="dark:bg-[#292C33] bg-[#f5f6fa] !text-[14px] placeholder:text-[14px] rounded-0"
                    placeholder={`${t('setting:verificationCode')}`}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <div className="text-start text-[10px] text-[#31373d] dark:text-[#C2C2C2]">
                  {t('setting:noVerifyCode')}
                </div>
              </>
            )}
            <div
              onClick={handleSubmitPhoneNumber}
              role="button"
              className="w-fit bg-[#FD6E0B] hover:opacity-[0.9] rounded-[5px] text-white text-[14px] px-[30px] py-[10px] m-auto"
            >
              {isphoneNumberVerify ? t('setting:change') : t('setting:confirm')}
            </div>
          </div>
          <Disclosure>
            {({ open }) => (
              <div className="sm:hidden block w-full">
                <Disclosure.Button className="py-2 w-full flex justify-between">
                  <div className="font-semibold text-[14px]">{t('setting:phoneNumber')}</div>
                  <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
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
                    <div className="text-start text-[10px] text-[#31373d] dark:text-[#C2C2C2]">
                      {t('setting:verifyYourPhoneNumber')}
                    </div>
                    <Controller
                      control={verificationPhoneNumberControl}
                      name={'phoneNumber'}
                      render={({ field }) => {
                        return (
                          <div className="px-[10px] py-[10px] my-[10px] dark:bg-[#292C33] bg-[#f5f6fa] rounded-[5px] w-full text-[14px] placeholder:text-[14px]">
                            <PhoneInput
                              className={cn(
                                'rounded-[5px] w-full',
                                styles.phoneInput,
                                theme === 'light' && styles.phoneInputLight,
                              )}
                              name="phoneNumber"
                              international
                              disabled={isphoneNumberVerify}
                              placeholder={`${t('setting:phonePlaceholder')}`}
                              control={verificationPhoneNumberControl}
                              value={phoneNumber}
                              onChange={(val) => setPhoneNumber(val)}
                            />
                          </div>
                        );
                      }}
                    ></Controller>
                    {isConfirmCode && (
                      <>
                        <div className="text-start text-[10px] text-[#31373d] dark:text-[#C2C2C2]">
                          {t('setting:confirmYourPhoneNumber', { phone: phoneNumber })}
                        </div>
                        <div className="px-[10px] py-[10px] my-[10px] dark:bg-[#292C33] bg-[#f5f6fa] rounded-[5px] w-full text-[14px] placeholder:text-[14px]">
                          <InputText
                            name="code"
                            control={confirmPhoneNumberControl}
                            customClass="dark:bg-[#292C33] bg-[#f5f6fa] !text-[14px] placeholder:text-[14px] rounded-0"
                            placeholder={`${t('setting:verificationCode')}`}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                          />
                        </div>
                        <div className="text-start text-[10px] text-[#31373d] dark:text-[#C2C2C2]">
                          {t('setting:noVerifyCode')}
                        </div>
                      </>
                    )}
                    <div
                      onClick={handleSubmitPhoneNumber}
                      role="button"
                      className="w-fit bg-[#FD6E0B] hover:opacity-[0.9] rounded-[5px] text-white text-[14px] px-[30px] py-[10px] m-auto"
                    >
                      {isphoneNumberVerify ? t('setting:change') : t('setting:confirm')}
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>
        </form>
      </div>
    </>
  );
};

const SettingEmailAuth = withAuth(SettingEmail);

SettingEmailAuth.getLayout = function getLayout(page: ReactElement) {
  return <SettingLayout>{page}</SettingLayout>;
};

export default SettingEmailAuth;
