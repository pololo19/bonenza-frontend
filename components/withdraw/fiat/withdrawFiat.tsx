/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import CurrencyInput from 'react-currency-input-field';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { FiatType } from '@/base/types/common';
import { useTranslation } from '@/base/config/i18next';
import { currencyFormat } from '@/base/libs/utils';

import Loader from '@/components/common/preloader/loader';
import SelectFiat from '@/components/selectFiat/SelectFiat';

type WithdrawFiatForm = {
  amount: number;
  currency: FiatType;
};

const WithdrawFiatComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { t } = useTranslation('');

  const schema = yup.object().shape({
    currency: yup
      .object()
      .required(String(t('withdraw:currencyRequired')))
      .nullable(String(t('withdraw:currencyRequired'))),
    amount: yup
      .number()
      .required(String(t('withdraw:withdrawAmountRequire')))
      .test('currency', String(t('withdraw:withdrawAmountWrong')), (_item, testContext) => {
        return _item < Number(testContext.parent.currency?.amount ?? 0);
      }),
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WithdrawFiatForm>({
    resolver: yupResolver(schema),
  });

  const handleStripePayment = async (data: WithdrawFiatForm) => {
    try {
      setIsLoading(true);
    } catch (error) {
      toast.error('Deposit Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}

      <form onSubmit={handleSubmit(handleStripePayment)} className="md:max-w-[492px]">
        <div className="flex justify-between">
          <div className="dark:text-[#C2C2C2] text-[#31373d] text-[#31373d] text-[16px]">
            {t('withdraw:withdrawCurrency')}
          </div>
          <Controller
            control={control}
            name={'currency'}
            render={({ field }) => {
              return (
                <SelectFiat
                  onChangeMoonpayFiat={(val) => {
                    field.onChange(val);
                  }}
                />
              );
            }}
          ></Controller>
        </div>
        <div className="text-[16px] text-left mt-[30px]">
          <div className="dark:text-[#C2C2C2] text-[#31373d] mb-5">{t('deposit:choosePaymentMethod')}</div>
          <div className="dark:bg-[#161D26] bg-[#f5f6fa] py-[16px] px-4 sm:pr-[34px] relative" role="button">
            <Image
              height={66}
              width={66}
              src={'/img/icon/popular-tag.png'}
              className="w-[40px] sm:w-[66px] absolute right-0 top-0"
              alt=""
            />
            <div className="flex justify-between">
              <div className="flex items-center gap-[5px] sm:gap-[25px]">
                <Image height={30} width={30} src={'/img/icon/stripe-logo.png'} alt="" className="rounded" />
                <div className="dark:text-white text-black text-[12px] sm:text-[16px]">Stripe Pay</div>
              </div>
              <div className="flex items-center gap-[10px]">
                <div className="dark:text-[#C2C2C2] text-[#31373d] text-[12px] sm:text-[16px]">
                  {currencyFormat(Number(watch('currency')?.minDepositAmount), 0)} ~{' '}
                  {currencyFormat(Number(watch('currency')?.maxDepositAmount), 0)} {watch('currency')?.currency}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[16px] text-left mt-[30px]">
          <div className="dark:text-[#C2C2C2] text-[#31373d] mb-5">{t('withdraw:withdrawAmount')}</div>
          <Controller
            control={control}
            name={'amount'}
            render={({ field }) => {
              return (
                <CurrencyInput
                  className="flex-1 px-5 w-full py-[16px] text-white w-full text-[16px] rounded dark:bg-[#161D26] bg-[#f5f6fa] placeholder:text-[#53575C] outline-none"
                  maxLength={15}
                  allowDecimals
                  placeholder={String(t('withdraw:withdrawAmount'))}
                  value={field.value}
                  decimalSeparator="."
                  groupSeparator=","
                  onValueChange={(value) => field.onChange(value)}
                />
              );
            }}
          ></Controller>
        </div>
        <div className="flex flex-col items-start mt-3">
          {errors.amount?.message && <div className="text-red-500"> {errors.amount?.message}</div>}
          {errors.currency?.message && <div className="text-red-500"> {errors.currency?.message}</div>}
        </div>
        <button
          type="submit"
          className="bg-[#F61B4F] mt-[30px] hover:opacity-[0.9] rounded-[5px] py-[10px] px-[20px] min-w-[140px]"
        >
          {t('withdraw:confirm')}
        </button>
      </form>
    </>
  );
};

export default WithdrawFiatComponent;
