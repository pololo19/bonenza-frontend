import { useTranslation } from '@/base/config/i18next';
import { BasicFormRef, ReferralCodeDetail } from '@/base/types/common';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { Ref, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import AdminInputText from '../input/admin/AdminInputText';

type ReferralCodeDetailFormProps = {
  onSubmit: (data: ReferralCodeDetail) => void;
  referralCodeDetail?: ReferralCodeDetail;
};

function ReferralCodeDetailForm(props: ReferralCodeDetailFormProps, ref: Ref<BasicFormRef>) {
  const { onSubmit, referralCodeDetail } = props;

  const { t } = useTranslation(' ');

  const schema = yup.object().shape({
    referralCode: yup
      .string()
      .required(t('affiliateAdmin:referralCodeRequired') || '')
      .min(6, t('affiliateAdmin:referralCodeMinCharacter', { min: 6 }) || '')
      .max(16, t('affiliateAdmin:referralCodeMaxCharacter', { max: 15 }) || '')
      .trim(),
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitted },
  } = useForm<ReferralCodeDetail>({
    resolver: yupResolver(schema),
  });

  const isEditType = useMemo(() => {
    return !!referralCodeDetail?.id;
  }, [referralCodeDetail?.id]);

  useEffect(() => {
    if (referralCodeDetail?.id) {
      setValue('referralCode', referralCodeDetail?.referralCode);
    }
  }, [referralCodeDetail, setValue]);

  useImperativeHandle(ref, () => ({
    emitData: handleSubmit(onSubmit),
  }));

  return (
    <>
      <form className="mt-5 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-start gap-1">
          <AdminInputText
            control={control}
            name="referralCode"
            placeholder="Please input"
            customClass="min-w-[350px] py-2"
          />
          <div className="p-2 bg-[#e6f6ff] rounded border border-solid border-blue-500/40 w-full text-black">
            {t('affiliateAdmin:referralCodeNote')}
          </div>
        </div>
      </form>
    </>
  );
}

export default React.forwardRef(ReferralCodeDetailForm);
