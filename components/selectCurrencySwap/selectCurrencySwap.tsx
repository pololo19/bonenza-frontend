import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import { Repeat } from 'iconsax-react';
import Image from 'next/image';
import React, { Ref, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useForm, UseFormGetValues } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import * as yup from 'yup';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { formatLengthNumber } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { BasicFormRef, DepositAddress } from '@/base/types/common';

import InputNumber from '../input/typing/InputNumber';
import ModalAssetsPortfolio from '../modal/assestsPortfolio/assestsPortfolio';

type SelectCurrencySwapProps = {
  onSubmit: (data: SwapFormType) => void;
};

export type SwapFormType = {
  amountFrom: number;
  amountTo: number;
  symbolFrom: string;
  symbolTo: string;
  networkFrom: string;
  networkTo: string;
};

export type SelectCurrencySwapFormRef = BasicFormRef & {
  emitData?: () => void;
  formData?: SwapFormType;
  getValues?: UseFormGetValues<SwapFormType>;
};

const SelectCurrencySwap = (props: SelectCurrencySwapProps, ref: Ref<SelectCurrencySwapFormRef>) => {
  const { onSubmit } = props;
  const { t } = useTranslation('');

  const { depositCryptoArray } = useSelector(
    (state: AppState) => ({
      depositCryptoArray: state.common.depositCryptoArray,
    }),
    shallowEqual,
  );

  const listCrypto = useMemo(() => {
    let array: DepositAddress[] = [];
    depositCryptoArray.forEach((crypto) => {
      const existCrypto = array.find((e) => e?.symbol === crypto?.symbol);
      if (!existCrypto) array.push(crypto);
    });
    return array;
  }, [depositCryptoArray]);

  const [isLoadingApproximately, setIsLoadingApproximately] = useState<boolean>(false);
  const [isShowFromModal, setIsShowFromModal] = useState<boolean>(false);
  const [isShowToModal, setIsShowToModal] = useState<boolean>(false);
  const [coinFromBalance, setCoinFromBalance] = useState<number>(0);
  const [swapData, setSwapData] = useState<any>({});

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  useImperativeHandle(ref, () => ({
    emitData: handleSubmitForm,
    getValues: getValues,
  }));

  const schema = yup.object().shape({
    amountFrom: yup
      .string()
      .required(String(t('withdraw:withdrawAddressRequire')))
      .trim(),
    amountTo: yup
      .string()
      .required(String(t('withdraw:withdrawAmountRequire')))
      .trim(),
  });

  const {
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<SwapFormType>({
    resolver: yupResolver(schema),
    defaultValues: { amountFrom: 0, amountTo: 0, symbolFrom: listCrypto[0]?.symbol, symbolTo: listCrypto[1]?.symbol },
  });

  const handleChangeCoinSwap = () => {
    const curVal = JSON.parse(JSON.stringify(getValues()));
    setValue('symbolFrom', curVal.symbolTo);
    setValue('symbolTo', curVal.symbolFrom);
    setValue('amountFrom', curVal.amountFrom);
    setValue('amountTo', curVal.amountTo);
    handleApproximately();
  };

  const handleApproximately = async () => {
    try {
      setIsLoadingApproximately(true);
      if (!watch('amountFrom')) {
        setValue('amountTo', 0);
        return;
      }
      const res = await api.post('exchange/quote', {
        fromTokenAddress: watch('symbolFrom'),
        toTokenAddress: watch('symbolTo'),
        amount: Number(watch('amountFrom')),
        networkFromTokenAddress: watch('networkFrom'),
      });
      setValue('amountTo', res.data.data);
      setSwapData(res.data);
    } catch (error) {
      setValue('amountTo', 0);
      setSwapData({
        data: 0,
        min: 0,
        fee: 0,
        bonusMoney: 0,
        max: 0,
        balance: 0,
      });
    } finally {
      setIsLoadingApproximately(false);
    }
  };

  const handleGetMaxBalance = () => {
    setValue('amountFrom', Number(swapData.max));
  };

  useEffect(() => {
    handleApproximately();
  }, [watch('amountFrom')]);

  return (
    <>
      <div className="text-left w-full">
        <div className="flex items-center gap-1 justify-between">
          <div className="text-[16px] text-[#31373d] dark:text-[#C2C2C2] mb-[20px] text-left">
            {t('swap:getApproximately')}
          </div>
          <div className="text-[16px] text-[#31373d] dark:text-[#C2C2C2] mb-[20px] text-left">
            <div>Min: {Number(swapData.min) ?? 0}</div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-[5px] relative">
            <div
              className={cn(
                'w-full pl-[18px] pr-[20px] py-[5px] text-[16px] rounded-[16px] bg-[#f5f6fa] dark:bg-[#161D26] flex items-center justify-between gap-[10px]',
                {
                  'border-red-500 border border-solid': errors.amountFrom?.message,
                },
              )}
            >
              <InputNumber
                size={7}
                customClass="flex-1 bg-transparent pl-[2px]"
                control={control}
                isShowError={false}
                name="amountFrom"
              />
              <div className="flex items-center md:gap-[10px] gap-[2px] h-full md:text-[16px] text-[12px]">
                <div
                  role="button"
                  onClick={handleGetMaxBalance}
                  className="px-2 md:px-3 py-[6px] md:min-w-[60px] md:rounded-[10px] rounded-[5px] dark:bg-[#272C33] bg-white dark:text-white text-black text-center text-[14px]"
                >
                  {t('deposit:max')}
                </div>
                <div
                  className="flex items-center dark:bg-[#161d26] px-2 bg-white justify-start gap-[10px] w-full"
                  role="button"
                  onClick={() => setIsShowFromModal(true)}
                >
                  <div className="text-[14px]">{watch('symbolFrom')}</div>
                  <Image
                    width={35}
                    height={35}
                    src={`/img/fiats/${watch('symbolFrom')}.png`}
                    onError={(e) => {
                      e.currentTarget.src = '/img/icon/USDT-logo.svg';
                    }}
                    className="inline"
                    alt=""
                  />
                  <div>
                    <ChevronDownIcon width={15} />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="z-[9] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 dark:bg-[#272C33] bg-[#f5f6fa] border-2 border-solid border-[#eaecf3] dark:border-0 rounded-[10px] p-[8px]"
              role="button"
              onClick={handleChangeCoinSwap}
            >
              <Repeat />
            </div>
            <div
              className={cn(
                'w-full pl-[18px] pr-[20px] py-[5px] text-[16px] rounded-[16px] bg-[#f5f6fa] dark:bg-[#161D26] flex items-center justify-between gap-[10px]',
                {
                  'border-red-500 border border-solid': errors.amountFrom?.message,
                  'blur-[2px]': isLoadingApproximately,
                },
              )}
            >
              <div className={cn('w-full flex-1')}>
                <InputNumber
                  size={7}
                  customClass="flex-1 bg-transparent pl-[2px]"
                  control={control}
                  isShowError={false}
                  name="amountTo"
                  disabled
                />
              </div>
              <div className="flex items-center md:gap-[10px] gap-[2px] h-full md:text-[16px] text-[12px]">
                <div
                  className="flex items-center dark:bg-[#161d26] px-2 bg-white justify-start gap-[10px] w-full"
                  role="button"
                  onClick={() => setIsShowToModal(true)}
                >
                  <div className="text-[14px]">{watch('symbolTo')}</div>
                  <Image
                    width={35}
                    height={35}
                    src={`img/fiats/${watch('symbolTo')}.png`}
                    onError={(e) => {
                      e.currentTarget.src = '/img/icon/USDT-logo.svg';
                    }}
                    className="inline"
                    alt=""
                  />
                  <div>
                    <ChevronDownIcon width={15} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[20px] flex items-center mb-2 gap-1 justify-between text-[14px]">
            <div>Real Money: {(Number(watch('amountFrom')) ?? 0) + (Number(swapData.fee) ?? 0)}</div>
            <div>Bonus Money: {Number(swapData.bonusMoney)}</div>
          </div>
          <div
            className={cn(
              'flex flex-col items-start gap-[15px] w-full px-[20px] py-[10px] text-[#C2C2C2] bg-[#f5f6fa] dark:bg-[#161D26] rounded-[16px] text-start',
              {
                'blur-[2px]': isLoadingApproximately,
              },
            )}
          >
            <div className="dark:text-white text-[#31373d] font-[700]">
              <span className="inline-block w-1 h-1 rounded-full	bg-[#3BC117] mr-1"></span>{' '}
              {formatLengthNumber(watch('amountFrom'))} {watch('symbolFrom')} ≈ {formatLengthNumber(watch('amountTo'))}{' '}
              {watch('symbolTo')}
            </div>
          </div>
          <div className="flex items-center mt-[2px] justify-between text-[0.75rem] gap-[0.5rem] w-full px-[20px] py-[10px] bg-[#f5f6fa] dark:bg-[#161D26] rounded-t-[4px]">
            <p className="text-[#98a7b5]">{t('swap:estimatedTime')}</p>
            <p className="dark:text-white text-[#31373d]">{t('swap:seconds')}</p>
          </div>
          <div className="flex items-center justify-between text-[0.75rem] gap-[0.5rem] w-full px-[20px] py-[10px] bg-[#f5f6fa] dark:bg-[#161D26] rounded-b-[4px]">
            <p className="text-[#98a7b5]">{t('swap:swapFee')}</p>
            <p className="dark:text-white text-[#31373d]">
              {swapData.fee} <span className="text-[#98a7b5]">{watch('symbolFrom')}</span>
            </p>
          </div>
        </form>
      </div>
      <ModalAssetsPortfolio
        onChangeCoin={(crypto) => {
          setValue('symbolFrom', String(crypto?.symbol));
          let balance = Number(crypto.balance) < 1 ? Number(crypto.balance) : 1;
          setCoinFromBalance(Number(crypto.balance));
          setValue('amountFrom', Number(balance));
          setValue('networkFrom', String(crypto?.network));
          handleApproximately();
        }}
        cryptoSymbol={watch('symbolFrom')}
        cryptoSymbolFrom={watch('symbolTo')}
        show={isShowFromModal}
        onClose={() => setIsShowFromModal(false)}
      />
      <ModalAssetsPortfolio
        onChangeCoin={(crypto) => {
          setValue('symbolTo', String(crypto?.symbol));
          setValue('networkTo', String(crypto?.network));
          handleApproximately();
        }}
        cryptoSymbol={watch('symbolTo')}
        cryptoSymbolFrom={watch('symbolFrom')}
        show={isShowToModal}
        onClose={() => setIsShowToModal(false)}
      />
    </>
  );
};

export default React.forwardRef(SelectCurrencySwap);
