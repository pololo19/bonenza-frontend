import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { api_sendMail, api_sendSMS, api_verify } from '@/api/auth';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo } from '@/base/libs/utils';
import getErrorMessage from '@/base/libs/utils/notificationToast';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { changeIsShowAuthenticationModal, changeIsShowResetPassword } from '@/base/redux/reducers/modal.reducer';
import { initWalletInfo } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { VerifyCodeRequest } from '@/base/types/requestTypes';
import Loader from '@/components/common/preloader/loader';
import { InputText } from '@/components/input/typing';

type VerificationFormType = {
  code: string;
};

export default function VerificationTab() {
  const { isPhoneVerifyRequested, verifyRequest, isForgetPassword } = useSelector(
    (state: AppState) => ({
      isPhoneVerifyRequested: state.auth.isPhoneVerifyRequested,
      verifyRequest: state.auth.verifyRequest,
      isForgetPassword: state.auth.isForgetPassword,
    }),
    shallowEqual,
  );

  const { t } = useTranslation('');
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    code: yup
      .string()
      .required(String(t('authentication:verificationCodeRequired')))
      .length(6, String(t('authentication:verificationCodeLength')))
      .trim(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VerificationFormType>({
    resolver: yupResolver(schema),
  });

  const onVerify = async (formReset: VerificationFormType) => {
    try {
      setIsLoading(true);
      const request: VerifyCodeRequest = {
        email: !isPhoneVerifyRequested ? verifyRequest : '',
        phone: isPhoneVerifyRequested ? verifyRequest : '',
        code: formReset.code,
        request: isForgetPassword ? 'reset' : '',
      };
      const resVerify = await api_verify(request);
      CookiesStorage.setAccessToken(resVerify.data.token);

      // If verify not from forget-password is success, store user info and go ahead
      // If not, request to reset password
      if (!isForgetPassword) {
        dispatch(
          saveUserInfo({
            ...convertUserInfo(resVerify.data.user),
          }),
        );
        dispatch(initWalletInfo());
        toast.success(
          t('authentication:verificationSuccess', { request: isPhoneVerifyRequested ? 'Phone' : 'Email' }),
          {
            containerId: TOAST_ENUM.COMMON,
          },
        );
        dispatch(changeIsShowAuthenticationModal(false));
      } else {
        dispatch(changeIsShowAuthenticationModal(false));
        dispatch(changeIsShowResetPassword(true));
      }
    } catch (error: any) {
      const message = error.response?.data?.message ?? '';
      const status = error.response?.data?.statusCode ?? '';
      const errData = getErrorMessage('auth', 'verification', status, message, '');
      toast.error(String(t(errData.message, errData.data)), { containerId: TOAST_ENUM.MODAL });
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerifyCode = async () => {
    if (!verifyRequest) return;
    setIsLoading(true);
    try {
      if (isPhoneVerifyRequested) {
        await api_sendSMS(verifyRequest, isForgetPassword ? 'reset' : '');
      } else {
        await api_sendMail(verifyRequest, isForgetPassword ? 'reset' : '');
      }
      toast.success(t('authentication:verificationSentSuccess'), { containerId: TOAST_ENUM.MODAL });
    } catch (error) {
      toast.error(t('authentication:verificationSentFailed'), { containerId: TOAST_ENUM.MODAL });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="sm:min-h-[428px]">
        <div className="sm:overflow-y-auto w-full">
          <div className="font-bold text-[16px] text-white">
            {isPhoneVerifyRequested && t('setting:phoneVerification')}
            {!isPhoneVerifyRequested && t('setting:emailVerification')}
          </div>
          <form onSubmit={handleSubmit(onVerify)} data-testid="user-detail-form">
            <div className="sm:mt-5 mt-3 flex flex-col items-start sm:gap-[12px] gap-[10px]">
              <div className="items-start text-[16px] !text-color-text-primary text-start font-[400]">
                {isPhoneVerifyRequested && t('setting:confirmYourPhoneNumber', { phone: verifyRequest })}
                {!isPhoneVerifyRequested && t('setting:verificationEmail')}
              </div>
              <InputText
                size={6}
                customClass="bg-color-bg-primary focus:outline-none w-full !rounded-[3px] h-[51px] px-[15px] placeholder:text-[14px] text-white mt-1"
                control={control}
                name="code"
                placeholder={t(String('authentication:verificationCode')) ?? ''}
              />
              <div
                className="items-start text-[14px] !text-white text-start font-[400] cursor-pointer hover:underline"
                onClick={sendVerifyCode}
              >
                {t('setting:noVerifyCode')}
              </div>
            </div>
            <button
              type="submit"
              className="bg-gradient-btn-default w-full rounded-large flex justify-between items-center py-[10px] pl-[40px] pr-[17px] mt-7"
            >
              <div />
              <div className="text-[14px] text-white">{t('authentication:submit')}</div>
              <div className="p-[10px] flex items-center justify-center rounded-large bg-white/20">
                <Image height={14} width={14} src="/img/icon/arrow-right.png" alt="" />
              </div>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
