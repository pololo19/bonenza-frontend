import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowDown2 } from 'iconsax-react';
import { forwardRef, Ref, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useTranslation } from '@/base/config/i18next';
import { CookieKey } from '@/base/constants/common';
import { REGEX_EMAIL } from '@/base/constants/validation';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { SignUpEmailFormRef } from '@/base/types/common';
import { SignUpEmailRequest } from '@/base/types/requestTypes';
import InputEmailAuthentication from '@/components/input/typing/InputEmailAuthentication';
import InputPassAuthentication from '@/components/input/typing/InputPassAuthentication';
import InputText from '@/components/input/typing/InputText';

type SignUpEmailFormProps = {
  onSubmit: (data: SignUpEmailRequest) => void;
};

const SignUpEmailForm = (props: SignUpEmailFormProps, ref: Ref<SignUpEmailFormRef>) => {
  const { onSubmit } = props;
  const [isEnterReferral, setCheckIsReferral] = useState<boolean>(false);

  const { t } = useTranslation('');

  const schema = yup.object().shape({
    email: yup
      .string()
      .required(String(t('authentication:emailRequired')))
      .email(String(t('authentication:emailWrong')))
      .matches(REGEX_EMAIL, String(t('authentication:emailWrong')))
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
  } = useForm<SignUpEmailRequest>({
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
          <InputEmailAuthentication
            control={control}
            name="email"
            placeholder={String(t('authentication:email'))}
            type="email"
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

export default forwardRef(SignUpEmailForm);
