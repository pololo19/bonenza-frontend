import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { Controller, useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import * as yup from 'yup';

import { useTranslation } from '@/base/config/i18next';
import { currencyFormat } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { FiatType } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import SelectFiat from '@/components/selectFiat/SelectFiat';

type DepositFiatForm = {
  amount: number;
  currency: FiatType;
};

const DepositFiatComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { t } = useTranslation('');

  const { userId } = useSelector(
    (state: AppState) => ({
      userId: state.auth.user.userId,
    }),
    shallowEqual,
  );

  const schema = yup.object().shape({
    currency: yup
      .object()
      .required(String(t('deposit:currencyRequired')))
      .nullable(String(t('deposit:currencyRequired'))),
    amount: yup.number().required(String(t('deposit:amountRequired'))),
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<DepositFiatForm>({
    resolver: yupResolver(schema),
  });

  const handleStripePayment = async (data: DepositFiatForm) => {
    // try {
    //   setIsLoading(true);
    //   const response = await api.post(`stripe/checkout-session`, {
    //     amount: data.amount,
    //     currency: data.currency?.currency?.toLocaleLowerCase(),
    //     userId: userId,
    //   });
    //   const stripe = await getStripe();
    //   await stripe!.redirectToCheckout({
    //     sessionId: response.data.id,
    //   });
    // } catch (error) {
    //   toast.error('Deposit Failed', { containerId: TOAST_ENUM.COMMON });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleBlurFiat = () => {
    const number = Number(watch('amount') ?? 0);
    const minValue = Number(watch('currency.minDepositAmount') ?? 0);
    const maxValue = Number(watch('currency.maxDepositAmount') ?? 0);
    const value = Math.max(minValue, Math.min(maxValue, Number(number ?? 0)));
    // setValue('amount', value);
    trigger('amount');
  };

  useEffect(() => {
    // setValue('amount', Number(watch('currency')?.minDepositAmount ?? 0));
    trigger('amount');
  }, [watch('currency')]);

  return (
    <>
      {isLoading && <Loader />}

      <form onSubmit={handleSubmit(handleStripePayment)} className="md:max-w-[492px]">
        <div className="flex justify-between items-center">
          <div className="dark:text-[#C2C2C2] text-[#31373d] text-[14px]">{t('deposit:depositCurrency')}</div>
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
        <div className="text-[16px] text-left mt-[16px]">
          <div className="dark:text-[#C2C2C2] text-[#31373d] text-[14px] mb-5">{t('deposit:choosePaymentMethod')}</div>
          <div className="dark:bg-[#161D26] bg-[#dadde680] py-[16px] px-4 sm:pr-[34px] relative" role="button">
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
                <div className="dark:text-white text-[#31373d] text-[12px] sm:text-[14px]">Stripe Pay</div>
              </div>
              <div className="flex items-center gap-[10px]">
                <div className="dark:text-[#C2C2C2] text-[#31373d] text-[12px] sm:text-[14px]">
                  {currencyFormat(Number(watch('currency')?.minDepositAmount), 0)} ~{' '}
                  {currencyFormat(Number(watch('currency')?.maxDepositAmount), 0)} {watch('currency')?.currency}
                </div>
                {/* <div className="bg-slate-800 rounded-[6px] w-[24px] h-[24px] flex items-center justify-center">
                  <ChevronRightIcon width={16} />
                </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="text-[14px] text-left mt-[30px]">
          <div className="dark:text-[#C2C2C2] text-[#31373d] mb-5">{t('deposit:depositAmount')}</div>
          <Controller
            control={control}
            name={'amount'}
            render={({ field }) => {
              return (
                <CurrencyInput
                  className="flex-1 px-5 w-full py-[16px] dark:text-white text-black w-full text-[14px] rounded dark:bg-[#161D26] bg-[#dadde680] placeholder:text-[#53575C] outline-none"
                  maxLength={15}
                  allowDecimals
                  placeholder={String(t('deposit:depositAmount'))}
                  value={field.value}
                  decimalSeparator="."
                  groupSeparator=","
                  onBlur={handleBlurFiat}
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
          className="bg-[#F61B4F] text-white dark:text-black text-[14px] mt-[30px] hover:opacity-[0.9] rounded-[5px] py-[10px] px-[20px] min-w-[140px]"
        >
          {t('withdraw:confirm')}
        </button>
      </form>
    </>
  );
};

export default DepositFiatComponent;
