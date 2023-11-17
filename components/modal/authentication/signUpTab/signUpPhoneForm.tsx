/* eslint-disable @next/next/no-img-element */

import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch, Ref, SetStateAction, forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useTranslation } from '@/base/config/i18next';
import { SignUpPhoneFormRef, SignUpPhoneFormRequest } from '@/base/types/common';
import InputPassAuthentication from '@/components/input/typing/InputPassAuthentication';
import InputPhoneNumber from '@/components/input/typing/InputPhoneNumber';
import { COUNTRY_CALLING_CODES } from '@/base/constants/countryCallingCode';
import { ArrowDown2 } from 'iconsax-react';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { CookieKey } from '@/base/constants/common';
import InputText from '@/components/input/typing/InputText';

type SignUpPhoneFormProps = {
  onSubmit: (data: SignUpPhoneFormRequest) => void;
  setCountryCallingCode: Dispatch<
    SetStateAction<{ countryCode: string; countryCallingCode: string; country: string } | undefined>
  >;
};

const SignUpPhoneForm = (props: SignUpPhoneFormProps, ref: Ref<SignUpPhoneFormRef>) => {
  const { onSubmit } = props;
  const [countryCallingCode, setCountryCallingCode] = useState<(typeof COUNTRY_CALLING_CODES)[number]>();
  const [isEnterReferral, setCheckIsReferral] = useState<boolean>(false);

  const { t } = useTranslation('');

  const schema = yup.object().shape({
    phone: yup
      .string()
      .required(String(t('authentication:phoneRequired')))
      .trim(),
    password: yup
      .string()
      .required(String(t('authentication:passwordRequired')))
      .trim(),
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SignUpPhoneFormRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      referralCode: CookiesStorage.getCookieData(CookieKey.referralCode)
        ? String(CookiesStorage.getCookieData(CookieKey.referralCode))
        : '',
    },
  });

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  useImperativeHandle(ref, () => ({
    emitData: handleSubmitForm,
  }));

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        data-testid="user-detail-form"
        autoComplete="new-password"
        className="w-full"
      >
        <div className="sm:mt-5 mt-3 flex flex-col items-start gap-[13px]">
          <InputPhoneNumber
            control={control}
            onChangeCountryCallingCode={(value) => {
              setCountryCallingCode(value);
              props.setCountryCallingCode(value);
            }}
            name="phone"
            placeholder={String(t('setting:phonePlaceholder'))}
            autoComplete="off"
          />
          <InputPassAuthentication
            control={control}
            name="password"
            placeholder={String(t('authentication:password'))}
            type="password"
            autoComplete="off"
          />
        </div>
        <div
          className="flex items-center text-[#98A7B5] text-[14px] gap-[4px] cursor-pointer mt-2"
          onClick={() => {
            setCheckIsReferral(!isEnterReferral);
          }}
        >
          <div>{t('authentication:enterReferral')}</div>
          <div>
            <ArrowDown2 className={`w-[14px] ${isEnterReferral ? '-rotate-180' : ''}`} />
          </div>
        </div>
        {isEnterReferral && (
          <InputText
            control={control}
            name="referralCode"
            customClass="bg-[#12181F] focus:outline-none w-full !rounded-[10px] h-[51px] px-[15px] placeholder:text-[14px] text-white mt-1"
            placeholder={String(t('authentication:referral'))}
            autoComplete="off"
          />
        )}
      </form>
    </>
  );
};

export default forwardRef(SignUpPhoneForm);
