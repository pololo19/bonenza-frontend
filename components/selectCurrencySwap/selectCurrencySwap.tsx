import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import { Repeat } from 'iconsax-react';
import Image from 'next/image';
import React, { Ref, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useForm, UseFormGetValues } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { useTranslation } from '@/base/config/i18next';
import { SWAP_FEE, SWAP_MIN, TOAST_ENUM } from '@/base/constants/common';
import { currencyFormat1 } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { BasicFormRef } from '@/base/types/common';
import { CurrencyType } from '@/base/types/wallet';

import InputNumber from '../input/typing/InputNumber';
import ModalAssetsPortfolio from '../modal/assestsPortfolio/assestsPortfolio';

type SelectCurrencySwapProps = {
  onSubmit: (data: SwapFormType) => void;
};

export type SwapFormType = {
  amountFrom: string;
  amountTo: string;
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

  const { cryptoSymbols, balances } = useSelector(
    (state: AppState) => ({
      cryptoSymbols: state.wallet.symbols,
      balances: state.wallet.balances,
    }),
    shallowEqual,
  );

  const [isLoadingApproximately, setIsLoadingApproximately] = useState<boolean>(false);
  const [isShowFromModal, setIsShowFromModal] = useState<boolean>(false);
  const [isShowToModal, setIsShowToModal] = useState<boolean>(false);

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
    defaultValues: { amountFrom: '0', amountTo: '0', symbolFrom: cryptoSymbols[0]?.id, symbolTo: cryptoSymbols[1]?.id },
  });

  const getBalanceBySymbolId = (symbolId: string) => {
    const tempBalance = balances.find((item) => item.symbolId === symbolId);
    return tempBalance ? tempBalance.amount : 0;
  };

  const getSymbolById = (id: string) => {
    const symbol = cryptoSymbols.find((item: CurrencyType) => item.id === id);
    if (!symbol) return null;
    return symbol;
  };

  const handleErrors = () => {
    let error = false;
    let messError = '';
    if (Number(getValues('amountFrom')) == 0) {
      error = true;
      messError = t('swap:inValidSwapAmount');
    }
    if (Number(getValues('amountFrom')) < SWAP_MIN / (getSymbolById(watch('symbolFrom'))?.price || 1)) {
      error = true;
      messError = t('swap:inValidSwapAmount');
    }
    if (SWAP_MIN / (getSymbolById(watch('symbolFrom'))?.price || 1) > getBalanceBySymbolId(watch('symbolFrom'))) {
      error = true;
      messError = t('swap:notEnoughAmount');
    }
    if (messError) {
      toast.error(t(messError), { containerId: TOAST_ENUM.COMMON });
    }
    return error;
  };

  const handleSubmitForm = () => {
    if (!handleErrors()) {
      handleSubmit(onSubmit)();
    }
  };

  useImperativeHandle(ref, () => ({
    emitData: handleSubmitForm,
    getValues: getValues,
  }));

  const toSymbols = useMemo(() => {
    const tempSymbols = [...cryptoSymbols];
    const symbolFromIndex = tempSymbols.findIndex((item) => item.id === watch('symbolFrom'));
    tempSymbols.splice(symbolFromIndex, 1);
    return tempSymbols;
  }, [watch('symbolFrom'), cryptoSymbols]);

  const fromSymbols = useMemo(() => {
    const tempSymbols = [...cryptoSymbols];
    const symbolFromIndex = tempSymbols.findIndex((item) => item.id === watch('symbolTo'));
    tempSymbols.splice(symbolFromIndex, 1);
    return tempSymbols;
  }, [watch('symbolTo')]);

  const exchangeCoinRate = useMemo(() => {
    const symbolFrom = getSymbolById(watch('symbolFrom'));
    const symbolTo = getSymbolById(watch('symbolTo'));

    const fromPrice = symbolFrom ? symbolFrom.price : 0;
    const toPrice = symbolTo ? symbolTo.price : 1;
    return fromPrice / toPrice;
  }, [watch('symbolFrom'), watch('symbolTo')]);

  const handleChangeCoinSwap = () => {
    const curVal = JSON.parse(JSON.stringify(getValues()));
    setValue('symbolFrom', curVal.symbolTo);
    setValue('symbolTo', curVal.symbolFrom);
    setValue('amountFrom', curVal.amountTo);
  };

  const handleApproximately = async (balance: string) => {
    try {
      setIsLoadingApproximately(true);
      // const res = await api_exchangeRate(watch('symbolFrom'), watch('symbolTo'));
      const symbolFrom = getSymbolById(watch('symbolFrom'));
      const symbolTo = getSymbolById(watch('symbolTo'));

      const fromPrice = symbolFrom ? symbolFrom.price : 0;
      const toPrice = symbolTo ? symbolTo.price : 1;

      // const { fromPrice, toPrice } = res.data;
      const amountTo = (Number(balance) * fromPrice) / toPrice;

      setValue('amountTo', currencyFormat1(amountTo, 8, '', false));
    } catch (error) {
      setValue('amountTo', '0');
    } finally {
      setIsLoadingApproximately(false);
    }
  };

  const handleGetMaxBalance = () => {
    const symbolFrom = getSymbolById(watch('symbolFrom'));
    if (symbolFrom) {
      const avaBalance = getBalanceBySymbolId(symbolFrom.id);
      setValue('amountFrom', currencyFormat1(avaBalance, 4, '', false));
    }
  };

  const onBlurFromBalance = () => {
    const balance = getBalanceBySymbolId(watch('symbolFrom'));
    if (Number(getValues('amountFrom')) > balance) {
      setValue('amountFrom', currencyFormat1(Number(balance), 4, '', false));
    }
  };

  useEffect(() => {
    if (cryptoSymbols.length) {
      const symbolFrom = cryptoSymbols[0].id;
      const symbolTo = cryptoSymbols[1].id;
      const tempAmountFrom = Math.min(getBalanceBySymbolId(symbolFrom), SWAP_MIN / (cryptoSymbols[0].price || 1));

      setValue('symbolFrom', symbolFrom);
      setValue('symbolTo', symbolTo);
      setValue('amountFrom', currencyFormat1(Number(tempAmountFrom), 4, '', false));
    }
  }, [cryptoSymbols]);

  useEffect(() => {
    handleApproximately(watch('amountFrom'));
  }, [watch('amountFrom'), watch('symbolFrom'), watch('symbolTo')]);

  return (
    <>
      <div className="text-left w-full">
        <div className="flex items-center gap-1 justify-between">
          <div className="text-[16px] text-[#31373d] dark:text-[#C2C2C2] mb-[20px] text-left">
            {t('swap:getApproximately')}
          </div>
          <div className="text-[16px] text-[#31373d] dark:text-[#C2C2C2] mb-[20px] text-left">
            <div>
              Min:
              {currencyFormat1(SWAP_MIN / (getSymbolById(watch('symbolFrom'))?.price ?? 1), 4, '', false)}{' '}
              {getSymbolById(watch('symbolFrom'))?.name ?? ''}
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-[5px] relative min-h-[45px]">
            <div
              className={cn(
                'w-full pl-[18px] pr-[5px] h-full py-[5px] text-[16px] rounded-[3px] bg-[#f5f6fa] dark:bg-color-input-primary flex items-center justify-between border border-solid border-transparent gap-[10px] focus-within:border-color-primary min-h-[45px]',
                {
                  'border-red-50': errors.amountFrom?.message,
                },
              )}
            >
              <InputNumber
                size={7}
                customClass="flex-1 !bg-color-input-primary pl-[2px]"
                control={control}
                onBlur={onBlurFromBalance}
                isShowError={false}
                name="amountFrom"
              />
              <div className="flex items-center md:gap-[10px] gap-[2px] h-full md:text-[16px] text-[12px]">
                <div
                  role="button"
                  onClick={handleGetMaxBalance}
                  className="px-2 md:px-3 py-[6px] md:min-w-[60px] md:rounded-[5px] rounded-[5px] dark:bg-color-btn-primary bg-white dark:text-color-text-primary text-black text-center text-[14px]"
                >
                  {t('deposit:max')}
                </div>
                <div
                  className="flex items-center dark:bg-color-btn-primary rounded-[5px] px-2 py-1 bg-white justify-start gap-[10px] w-full"
                  role="button"
                  onClick={() => setIsShowFromModal(true)}
                >
                  <Image
                    width={24}
                    height={24}
                    src={getSymbolById(watch('symbolFrom'))?.logo || ''}
                    onError={(e) => {
                      e.currentTarget.src = '/img/icon/USDT-logo.svg';
                    }}
                    className="inline"
                    alt=""
                  />
                  <div className="text-[14px]">
                    {getSymbolById(watch('symbolFrom')) && getSymbolById(watch('symbolFrom'))?.name}
                  </div>

                  <div>
                    <ChevronDownIcon width={15} />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="z-[9] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 dark:bg-color-btn-primary bg-[#f5f6fa] dark:text-white text-black dark:border-0 rounded-[10px] p-[8px]"
              role="button"
              onClick={handleChangeCoinSwap}
            >
              <Repeat />
            </div>
            <div
              className={cn(
                'w-full pl-[18px] pr-[5px] py-[5px] text-[16px] rounded-[3px] bg-[#f5f6fa] dark:bg-color-input-primary flex items-center justify-between gap-[10px] border border-solid border-transparent focus-within:border-color-primary min-h-[45px]',
                {
                  'border-red-500': errors.amountFrom?.message,
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
                  className="flex items-center dark:bg-color-btn-primary px-2 py-1 bg-white justify-start gap-[10px] w-full"
                  role="button"
                  onClick={() => setIsShowToModal(true)}
                >
                  <Image
                    width={30}
                    height={30}
                    src={getSymbolById(watch('symbolTo'))?.logo || ''}
                    onError={(e) => {
                      e.currentTarget.src = '/img/icon/USDT-logo.svg';
                    }}
                    className="inline"
                    alt=""
                  />
                  <div className="text-[14px]">
                    {getSymbolById(watch('symbolTo')) && getSymbolById(watch('symbolTo'))?.name}
                  </div>

                  <div>
                    <ChevronDownIcon width={15} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[20px] flex items-center mb-2 gap-1 justify-between text-[14px]">
            <div>
              Real Money: {getBalanceBySymbolId(watch('symbolFrom'))} {getSymbolById(watch('symbolFrom'))?.name ?? ''}
            </div>
            {/* <div>Bonus Money: {Number(swapData.bonusMoney)}</div> */}
          </div>
          <div
            className={cn(
              'flex flex-col items-start gap-[15px] w-full px-[20px] py-[10px] text-[#C2C2C2] bg-[#f5f6fa] dark:bg-color-input-primary rounded-[3px] text-start',
              {
                'blur-[2px]': isLoadingApproximately,
              },
            )}
          >
            <div className="dark:text-white text-[#31373d] font-[700]">
              <span className="inline-block w-1 h-1 rounded-full	bg-[#3BC117] mr-1"></span>{' '}
              {currencyFormat1(1, 2, '', false)} {getSymbolById(watch('symbolFrom'))?.name} ≈{' '}
              {currencyFormat1(exchangeCoinRate, 8, '', false)} {getSymbolById(watch('symbolTo'))?.name}
            </div>
          </div>
          <div className="flex items-center mt-[2px] justify-between text-[0.75rem] gap-[0.5rem] w-full px-[20px] py-[10px] bg-[#f5f6fa] dark:bg-color-input-primary rounded-t-[4px]">
            <p className="text-[#98a7b5]">{t('swap:estimatedTime')}</p>
            <p className="dark:text-white text-[#31373d]">{t('swap:seconds')}</p>
          </div>
          <div className="flex items-center justify-between text-[0.75rem] gap-[0.5rem] w-full px-[20px] py-[10px] bg-[#f5f6fa] dark:bg-color-input-primary rounded-b-[4px]">
            <p className="text-[#98a7b5]">{t('swap:swapFee')}</p>
            <p className="dark:text-white text-[#31373d]">
              {Number(SWAP_FEE) * Number(watch('amountFrom'))}{' '}
              <span className="text-[#98a7b5]">{getSymbolById(watch('symbolFrom'))?.name}</span>
            </p>
          </div>
        </form>
      </div>
      <ModalAssetsPortfolio
        onChangeCoin={(crypto: CurrencyType) => {
          const minValue: number = Math.min(getBalanceBySymbolId(crypto.id), SWAP_MIN / (crypto.price || 1));
          setValue('symbolFrom', String(crypto.id));
          setValue('amountFrom', currencyFormat1(Number(minValue), 4, '', false));
        }}
        cryptoSymbol={watch('symbolFrom')}
        cryptoSymbols={fromSymbols}
        show={isShowFromModal}
        onClose={() => setIsShowFromModal(false)}
      />
      <ModalAssetsPortfolio
        onChangeCoin={(crypto: CurrencyType) => {
          setValue('symbolTo', String(crypto.id));
        }}
        cryptoSymbol={watch('symbolTo')}
        cryptoSymbols={toSymbols}
        show={isShowToModal}
        onClose={() => setIsShowToModal(false)}
      />
    </>
  );
};

export default React.forwardRef(SelectCurrencySwap);
