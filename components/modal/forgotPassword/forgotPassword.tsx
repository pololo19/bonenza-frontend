import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import api from '@/api/api';
import { REGEX_EMAIL } from '@/base/constants/validation';
import { useTranslation } from '@/base/config/i18next';
import { changeAuthenticationType } from '@/base/redux/reducers/modal.reducer';

import InputEmailAuthentication from '@/components/input/typing/InputEmailAuthentication';
import Loader from '@/components/common/preloader/loader';
import Image from 'next/image';
import { TOAST_ENUM } from '@/base/constants/common';
import { AuthenticationModeEnum } from '@/base/types/common';
import InputEmailPhone from '@/components/input/typing/InputEmailPhone';
import { COUNTRY_CALLING_CODES } from '@/base/constants/countryCallingCode';

type ForgotPasswordFormType = {
  email: string;
};

export default function ModalForgotPassword() {
  const { t } = useTranslation('');
  const dispatch = useDispatch();
  const [countryCallingCode, setCountryCallingCode] = useState<(typeof COUNTRY_CALLING_CODES)[number]>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .required(String(t('authentication:emailRequired')))
      .email(String(t('authentication:emailWrong')))
      .matches(REGEX_EMAIL, String(t('authentication:emailWrong')))
      .trim(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ForgotPasswordFormType>({
    resolver: yupResolver(schema),
  });

  const onReset = async (formReset: ForgotPasswordFormType) => {
    try {
      setIsLoading(true);
      const isPhoneNumber = formReset.email?.length > 2 && Number.isInteger(Number(formReset.email));
      const _res = await api.post('/auth/send-mail', {
        email: !isPhoneNumber ? formReset.email : '',
        phone: isPhoneNumber ? String(countryCallingCode?.countryCallingCode) + formReset.email : '',
      });
      if (_res.data.msg === 'success') {
        dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
      }
      toast.error(t('authentication:sendMailSuccessfully'), { containerId: TOAST_ENUM.MODAL });
    } catch (error) {
      toast.error(t('authentication:resetPasswordFailed'), { containerId: TOAST_ENUM.MODAL });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="sm:min-h-[428px]">
        <div className="sm:overflow-y-auto w-full">
          <div className="font-bold text-[16px] text-white">{t('resetPassword:resetPassword')}</div>
          <form onSubmit={handleSubmit(onReset)} data-testid="user-detail-form">
            <div className="sm:mt-5 mt-3 flex flex-col items-start sm:gap-[20px] gap-[10px]">
              <InputEmailPhone
                onChangeCountryCallingCode={setCountryCallingCode}
                control={control}
                name="email"
                placeholder={String(t('authentication:emailOrPhoneNumber'))}
              />
            </div>
            <button
              type="submit"
              className="bg-primary w-full rounded-large flex justify-between items-center py-[10px] pl-[40px] pr-[17px] mt-5"
            >
              <div />
              <div className="text-[14px] text-white">{t('resetPassword:resetPassword')}</div>
              <div className="p-[10px] flex items-center justify-center rounded-large bg-white/20">
                <Image height={14} width={14} src="/img/icon/arrow-right.png" alt="" />
              </div>
            </button>
            <div className="text-white text-[13px] mt-5">
              <span className="mr-[5px]">{t('resetPassword:haveAccount')}</span>
              <span
                role="button"
                className="text-[#0DFDE4] hover:text-amber-500"
                onClick={() => {
                  dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                }}
              >
                {t('layout:signIn')}
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
