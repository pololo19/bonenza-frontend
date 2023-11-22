import cn from 'classnames';
import { useTheme } from 'next-themes';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import api from '@/api/api';
import { Trans, useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { COUNTRY_CALLING_CODES } from '@/base/constants/countryCallingCode';
import { URL_LOGIN_WITH_EMAIL, URL_SIGNUP_WITH_EMAIL, URL_SIGNUP_WITH_PHONE } from '@/base/constants/endpoints';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo } from '@/base/libs/utils';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { changeAuthenticationType, changeIsShowAuthenticationModal } from '@/base/redux/reducers/modal.reducer';
import {
  AuthenticationModeEnum,
  SignUpEmailFormRef,
  SignUpEmailFormRequest,
  SignUpPhoneFormRef,
  SignUpPhoneFormRequest,
} from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import Image from 'next/image';
import Link from 'next/link';
import SignUpEmailForm from './signUpEmailForm';
import SignUpPhoneForm from './signUpPhoneForm';
type SignUpTabProps = {
  onClose: () => void;
};

export default function SignUpTab({ onClose }: SignUpTabProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isCheckboxApprove, setIsCheckboxApprove] = useState<boolean>(true);
  const [isConfirm, setCheckIsConfirm] = useState<boolean>(false);
  const [isPhoneNumber, setCheckIsPhoneNumber] = useState<boolean>(false);
  const [isEnterReferral, setCheckIsReferral] = useState<boolean>(false);
  const [countryCallingCode, setCountryCallingCode] = useState<(typeof COUNTRY_CALLING_CODES)[number]>();

  const emailFormDataRef = useRef<SignUpEmailFormRef>(null);
  const phoneFormDataRef = useRef<SignUpPhoneFormRef>(null);

  const { theme } = useTheme();
  const dispatch = useDispatch();

  const { t } = useTranslation('');

  const emitEmailData = () => emailFormDataRef.current?.emitData?.();
  const emitPhoneData = () => phoneFormDataRef.current?.emitData?.();

  const onSubmitEmail = async (data: SignUpEmailFormRequest) => {
    try {
      setIsLoading(true);
      const resSignUp = await api.post(URL_SIGNUP_WITH_EMAIL, data);
      if (resSignUp?.status === 200) {
        try {
          const resSignIn = await api.post(URL_LOGIN_WITH_EMAIL, data);
          if (resSignIn?.status === 200) {
            CookiesStorage.setAccessToken(resSignIn.data.data.accessToken);
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
            dispatch(changeIsShowAuthenticationModal(false));
          }
        } catch (error) {
          toast.error(t('authentication:loginEmailFailed'), { containerId: TOAST_ENUM.MODAL });
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      if (error?.response?.data?.msg === 'Email was taken') {
        toast.error(String(t('authentication:emailTaken')), { containerId: TOAST_ENUM.MODAL });
      } else {
        toast.error(String(t('authentication:signUpFailed')), { containerId: TOAST_ENUM.MODAL });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPhone = async (data: SignUpPhoneFormRequest) => {
    try {
      setIsLoading(true);
      const formData = {
        ...data,
        phone: String(countryCallingCode?.countryCallingCode) + data.phone,
      };
      const resSignUp = await api.post(URL_SIGNUP_WITH_PHONE, formData);
      if (resSignUp?.status === 200) {
        try {
          const resSignIn = await api.post(URL_LOGIN_WITH_EMAIL, formData);
          if (resSignIn?.status === 200) {
            CookiesStorage.setAccessToken(resSignIn.data.data.accessToken);
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
            dispatch(changeIsShowAuthenticationModal(false));
          }
        } catch (error) {
          toast.error(t('authentication:loginPhoneFailed'), { containerId: TOAST_ENUM.MODAL });
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      if (error?.response?.data?.msg === 'Phone number was taken') {
        toast.error(String(t('authentication:phoneTaken')), { containerId: TOAST_ENUM.MODAL });
      } else {
        toast.error(String(t('authentication:signUpFailed')), { containerId: TOAST_ENUM.MODAL });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUp = async () => {
    if (!isConfirm) {
      toast.error(String(t('authentication:pleaseAgree')), { containerId: TOAST_ENUM.MODAL });
      return;
    }
    if (isPhoneNumber) await emitPhoneData();
    else await emitEmailData();
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="sm:min-h-[275px]">
        <div className="sm:mt-5 mt-3 flex flex-col items-start gap-[13px]">
          <div className="flex w-full">
            <div
              className={cn(
                ' flex-1 flex hover:opacity-[0.9] items-center justify-center border-b-2 border-solid border-[#272C33] pb-[10px]',
                { 'bg-gradient-to-t from-[#F61B4F]/20 border-[#F61B4F]': !isPhoneNumber },
              )}
              role="button"
              onClick={() => {
                setCheckIsPhoneNumber(false);
              }}
            >
              <div className="text-[16px] dark:text-white text-black font-[700]">{t('authentication:email')}</div>
            </div>
            <div
              className={cn(
                'flex-1 flex items-center hover:opacity-[0.9]  justify-center border-b-2 border-solid border-[#272C33] pb-[10px]',
                { 'bg-gradient-to-t from-[#F61B4F]/20 border-[#F61B4F]': isPhoneNumber },
              )}
              role="button"
              onClick={() => {
                setCheckIsPhoneNumber(true);
              }}
            >
              <div className="text-[16px] dark:text-white text-black font-[700]">{t('setting:phoneNumber')}</div>
            </div>
          </div>
          {!isPhoneNumber && <SignUpEmailForm onSubmit={onSubmitEmail} ref={emailFormDataRef} />}
          {isPhoneNumber && (
            <SignUpPhoneForm
              onSubmit={onSubmitPhone}
              setCountryCallingCode={setCountryCallingCode}
              ref={phoneFormDataRef}
            />
          )}
          <div className="flex items-center gap-[10px]">
            <input
              checked={isConfirm}
              onChange={(event) => {
                setCheckIsConfirm(event.target.checked);
              }}
              className="w-[14px] h-[14px] before:bg-[#161D26]"
              type="checkbox"
              id="confirm18"
            />
            <label htmlFor="confirm18" className="text-[12px] !text-[#98A7B5] font-normal text-start">
              <Trans i18nKey="authentication:confirmAtLeast18YearsOld">
                I agree to the
                <Link className="text-white font-bold" href="/helper-center/terms-of-service/" target="_blank">
                  User Agreement
                </Link>
                & confirm I am at least 18 years old
              </Trans>
            </label>
          </div>
          <div className="flex items-center gap-[10px]">
            <input
              checked={isCheckboxApprove}
              onChange={(event) => {
                setIsCheckboxApprove(event.target.checked);
              }}
              className="w-[14px] h-[14px] before:bg-[#161D26]"
              type="checkbox"
              id="vehicle1"
            />
            <label htmlFor="vehicle1" className="text-[12px] !text-[#98A7B5] font-normal text-start">
              {t('authentication:agreeToReceive')}
            </label>
          </div>
        </div>
        <button
          type="submit"
          onClick={onSignUp}
          className="bg-primary w-full rounded-[5px] flex justify-between items-center py-[10px] pl-[40px] pr-[17px] mt-5"
        >
          <div />
          <div className="text-[14px] text-white">{t('authentication:continue')}</div>
          <div className="w-[34px] h-[35px] flex items-center justify-center rounded-large bg-white/20">
            <Image width={15} height={15} src="/img/icon/arrow-right.png" alt="" />
          </div>
        </button>
        <div className="flex items-center gap-[12px] mt-[16px] text-[#98A7B5]">
          <div className="text-[14px]">{t('authentication:alreadyHaveAccount')}</div>
          <div
            className="text-[14px] cursor-pointer text-white hover:text-amber-500"
            onClick={() => dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN))}
          >
            {t('layout:signIn')}
          </div>
        </div>
      </div>
    </>
  );
}
