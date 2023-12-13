import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import * as yup from 'yup';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER, TOAST_ENUM } from '@/base/constants/common';
import {
  currencyFormat,
  currencyFormat1,
  exchangeByLocaleFiat,
  formatLengthNumber,
  handleLocaleSymbol,
} from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { InformationWithdraw } from '@/base/types/common';
import { CryptoNetWorkType, CurrencySymbolType } from '@/base/types/wallet';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import InputNumber from '@/components/input/typing/InputNumber';
import InputText from '@/components/input/typing/InputText';
import DepositLayout from '@/components/layouts/deposit.layout';
import ModalRollover from '@/components/modal/rollover/Rollover';
import SelectCurrency from '@/components/selectCurrency/selectCurrency';

import styles from './index.module.scss';

type WithdrawFormType = {
  withdrawAddress: string;
  withdrawAmount: string;
};

const WithdrawCryptoPage = () => {
  const { t } = useTranslation('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openRollover, setOpenRollover] = useState<boolean>(false);

  const [activeCoin, setActiveCoin] = useState<CurrencySymbolType>({
    id: '',
    name: '',
    logo: '',
    iso_currency: '',
    availableNetworks: [],
    iso_decimals: 0,
    price: 0,
  });
  const [activeNetwork, setActiveNetwork] = useState<CryptoNetWorkType>({
    id: '',
    name: '',
    type: 1,
  });

  const [informationWithdraw, setInformationWithdraw] = useState<InformationWithdraw>({
    fee: 0,
  });

  const { activeFiat, localeFiat, minAmounts, balances } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
      activeFiat: state.common.activeFiat,
      balances: state.wallet.balances,
      minAmounts: state.wallet.cryptoCurrencies,
    }),
    shallowEqual,
  );

  const renderMinValue = useMemo(() => {
    const min = minAmounts.find((item) => item.networkId === activeNetwork.id && item.symbolId === activeCoin.id);
    return min ? min.minWithdrawAmount : 0;
  }, [activeNetwork, activeCoin, minAmounts]);

  const renderBalanceValue = useMemo(() => {
    const selectedBalanceInfo = balances.find((item) => item.symbolId === activeCoin.id);
    return selectedBalanceInfo ? selectedBalanceInfo.amount : 0;
  }, [balances, activeCoin]);

  const renderKeys = useMemo(() => {
    let key = {
      isMin: true,
      isQuater: true,
      isHalf: true,
      isMax: true,
    };
    const percent = renderMinValue / renderBalanceValue;
    if (percent > 1) {
      key = {
        isMax: false,
        isMin: false,
        isHalf: false,
        isQuater: false,
      };
    } else if (percent > 0.5) {
      key = {
        isMin: true,
        isQuater: false,
        isHalf: false,
        isMax: true,
      };
    } else if (percent > 0.25) {
      key = {
        isMin: true,
        isQuater: false,
        isHalf: true,
        isMax: true,
      };
    } else {
      key = {
        isMin: true,
        isQuater: true,
        isHalf: true,
        isMax: true,
      };
    }
    return key;
  }, [renderMinValue, renderBalanceValue]);

  const schema = yup.object().shape({
    withdrawAddress: yup
      .string()
      // .required(String(t('withdraw:withdrawAddressRequire')))
      .trim(),
    withdrawAmount: yup.string(),
    // .required(String(t('withdraw:withdrawAmountRequire')))
    // .test('withdrawAmount', String(t('withdraw:withdrawAmountGreater', { max: minValue })), (_item, testContext) => {
    //   if (testContext?.parent.withdrawAmount > Number(activeCoin?.balance || 0)) return false;
    //   return true;
    // }),
  });

  const {
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<WithdrawFormType>({
    resolver: yupResolver(schema),
    defaultValues: { withdrawAmount: '0' },
  });

  const setAmountByPercent = (percent: number) => {
    let avaBalance = (renderBalanceValue * percent) / 100;
    if (avaBalance < renderMinValue) {
      avaBalance = renderMinValue;
    }

    setValue('withdrawAmount', String(avaBalance));
  };

  const handleError = (formWithdraw: WithdrawFormType) => {
    let messError = '';
    let validate = false;
    if (!formWithdraw.withdrawAddress) {
      messError = t('withdraw:withdrawFailMess1');
      validate = true;
    } else if (!formWithdraw.withdrawAmount) {
      messError = t('withdraw:withdrawFailMess2');
      validate = true;
    } else if (Number(formWithdraw.withdrawAmount) < Number(informationWithdraw?.fee)) {
      messError = t('withdraw:withdrawFailMess4');
      validate = true;
    } else if (Number(formWithdraw.withdrawAmount) > renderBalanceValue) {
      messError = t('withdraw:withdrawFailMess4');
      validate = true;
    }
    if (messError) {
      toast.error(t(messError), { containerId: TOAST_ENUM.COMMON });
    }
    return validate;
  };

  const handleConfirmWithdraw = async (formWithdraw: WithdrawFormType) => {
    const validate = handleError(formWithdraw);
    if (validate) {
      return;
    }
    try {
      setIsLoading(true);
      // const _res = await api.post('/withdraw', {
      //   toAddress: formWithdraw.withdrawAddress,
      //   value: formWithdraw.withdrawAmount,
      //   symbol: activeCoin?.symbol,
      //   network: activeCoin?.network,
      //   currency: localeFiat?.currency,
      //   sourceAccount: activeFiat?.currency,
      // });
      toast.error(
        `Congratulations! Your withdrawal of ${
          Number(watch('withdrawAmount')) - Number(informationWithdraw?.fee) > 0
            ? (Number(watch('withdrawAmount')) - Number(informationWithdraw?.fee)).toFixed(6)
            : Number(0).toFixed(6)
        } ${informationWithdraw?.unitFee} is in progress!`,
        { containerId: TOAST_ENUM.COMMON },
      );
      // router.push(ROUTER.Transaction);
    } catch (error) {
      // if (Number(formWithdraw.withdrawAmount) < Number(minValue || 0)) {
      //   toast.error(t('withdraw:withdrawFailMess'), { containerId: TOAST_ENUM.COMMON });
      // } else {
      //   toast.error('Withdraw Failed', { containerId: TOAST_ENUM.COMMON });
      // }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setValue('withdrawAmount', String(renderMinValue));
  }, [renderMinValue]);

  return (
    <>
      <div className={`${styles.cardContent}`}>
        <Head>
          <title>Withdraw Crypto - Bonenza</title>
        </Head>
        {isLoading && <Loader />}
        <div className={`h-1/3 px-[12px] py-[24px] sm:p-0 ${styles.contentHeader}`}>
          <div className="flex sm:mb-[32px] mb-[20px]">
            <Link
              href={ROUTER.WithdrawCrypto}
              className={cn(
                'bg-gradient-to-t from-[#F61B4F]/20 border-[#F61B4F] max-w-[161px] flex-1 flex hover:opacity-[0.9] items-center justify-center border-b-2 border-solid border-[#272C33] pb-[5px] mt-[10px]',
              )}
              role="button"
            >
              <div className="text-[16px] dark:text-white text-black font-[700]">{t('deposit:crypto')}</div>
            </Link>
            <Link
              href={ROUTER.WithdrawFiat}
              className={cn(
                'flex-1 flex items-center hover:opacity-[0.9] max-w-[161px] justify-center border-b-2 border-solid dark:border-[#272C33] border-[#ccc] pb-[5px] mt-[10px]',
              )}
              role="button"
            >
              <div className="text-[16px] dark:text-white text-black font-[700]">{t('deposit:fiat')}</div>
            </Link>
          </div>
          <div className="md:max-w-[492px]">
            <div className="">
              <SelectCurrency
                activeCoin={activeCoin}
                activeNetwork={activeNetwork}
                onChangeCoin={setActiveCoin}
                onChangeNetwork={setActiveNetwork}
                withDrawTab={true}
              />
            </div>

            <form onSubmit={handleSubmit(handleConfirmWithdraw)}>
              <div className="mt-[20px] text-left">
                <div className="text-[14px] dark:text-[#98a7b5] text-[#31373d] mb-[10px] text-left">
                  {t('withdraw:withdrawalAddress')}
                </div>
                <InputText
                  customClass="px-[20px] py-[15px] dark:bg-[#161D26] bg-[#f6f7fa] !text-[14px]"
                  control={control}
                  placeholder={String(t('withdraw:withdrawalAddressPlaceholder'))}
                  name="withdrawAddress"
                />
              </div>

              <div className="mt-[20px] text-left">
                <div className="flex justify-between">
                  <div className="text-[14px] dark:text-[#98a7b5] text-[#31373d] mb-[10px] text-left">
                    {t('withdraw:withdrawAmount')}
                  </div>
                  <div className="text-[14px] dark:text-[#98a7b5] text-[#31373d] mb-[10px] text-left">
                    {t('deposit:min')} : {renderMinValue}
                  </div>
                </div>
                <div
                  className={cn(
                    'w-full pl-[18px] min-h-[51px] pr-[20px] py-[5px] text-[16px] rounded-[16px] dark:bg-[#161D26] bg-[#f6f7fa] flex items-center justify-between gap-[10px]',
                    {
                      'border-red-500 border border-solid': errors.withdrawAmount?.message,
                    },
                  )}
                >
                  <InputNumber
                    size={7}
                    customClass="flex-1 bg-transparent pl-[2px]"
                    control={control}
                    isShowError={false}
                    name="withdrawAmount"
                    placeholder={String(t('withdraw:withdrawAmount'))}
                  />
                  <div className="flex items-center md:gap-[10px] gap-[2px] h-full md:text-[16px] text-[12px]">
                    {renderKeys.isMin && (
                      <div
                        role="button"
                        className="text-[14px] px-2 md:px-3 py-[10px] md:min-w-[60px] md:rounded-[10px] rounded-[5px] dark:bg-[#272C33] bg-white dark:hover:bg-gray-700 hover-[#f6f7fa] dark:text-white text-black text-center"
                        onClick={() => setValue('withdrawAmount', String(renderMinValue))}
                      >
                        {t('deposit:min')}
                      </div>
                    )}
                    {renderKeys.isQuater && (
                      <div
                        role="button"
                        className="md:block hidden text-[14px] px-2 md:px-3 py-[10px] md:min-w-[60px] md:rounded-[10px] rounded-[5px] dark:bg-[#272C33] bg-white dark:hover:bg-gray-700 hover-[#f6f7fa] dark:text-white text-black text-center"
                        onClick={() => setAmountByPercent(25)}
                      >
                        25%
                      </div>
                    )}
                    {renderKeys.isHalf && (
                      <div
                        role="button"
                        className="md:block hidden text-[14px] px-2 md:px-3 py-[10px] md:min-w-[60px] md:rounded-[10px] rounded-[5px] dark:bg-[#272C33] bg-white dark:hover:bg-gray-700 hover-[#f6f7fa] dark:text-white text-black text-center"
                        onClick={() => setAmountByPercent(50)}
                      >
                        50%
                      </div>
                    )}
                    {renderKeys.isMax && (
                      <div
                        role="button"
                        className="text-[14px] px-2 md:px-3 py-[10px] md:min-w-[60px] md:rounded-[10px] rounded-[5px] dark:bg-[#272C33] bg-white dark:hover:bg-gray-700 hover-[#f6f7fa] dark:text-white text-black text-center"
                        onClick={() => setAmountByPercent(100)}
                      >
                        {t('deposit:max')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-[14px]">
                  <div className="flex gap-1 flex-wrap">
                    <span className="dark:text-[#98a7b5] text-[#37313d]">{t('withdraw:available')}:</span>
                    <span className="dark:text-[#fff] text-[#000] flex">
                      {localeFiat
                        ? currencyFormat1(
                            exchangeByLocaleFiat(
                              informationWithdraw?.unitFee,
                              String(localeFiat?.currency),
                              renderBalanceValue,
                            ),
                            2,
                            String(localeFiat?.currency),
                          )
                        : `${formatLengthNumber(renderBalanceValue, 2)}`}
                    </span>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end">
                    <span
                      className="dark:text-[#98a7b5] text-[#37313d] underline cursor-pointer"
                      onClick={() => setOpenRollover(true)}
                    >
                      {t('withdraw:lockedFunds')}:
                    </span>
                    <span className="dark:text-[#fff] text-[#000] flex">
                      {localeFiat
                        ? `${handleLocaleSymbol(String(localeFiat?.currency))} ${currencyFormat(
                            exchangeByLocaleFiat(
                              informationWithdraw?.unitFee,
                              String(localeFiat?.currency),
                              Number(informationWithdraw?.locked),
                            ),
                            2,
                          )}`
                        : `${formatLengthNumber(Number(informationWithdraw?.locked), 2)}`}
                    </span>
                  </div>
                </div>
                {errors.withdrawAmount?.message && (
                  <span className="text-red-500 w-full"> {errors.withdrawAmount?.message}</span>
                )}
              </div>
              <div className="dark:bg-[#161D26] bg-[#f5f6fa] rounded-[16px] px-[12px] py-[6px] dark:text-[#98a7b5] text-[#31373d] mt-[22px] flex flex-col gap-[12px]">
                <div className="flex items-center justify-between">
                  <div className="text-[14px]">{t('withdraw:withDrawAmount')}</div>
                  <div className="font-semibold dark:text-white text-[#31373d]">
                    {Number(watch('withdrawAmount')) - Number(informationWithdraw?.fee) > 0
                      ? (Number(watch('withdrawAmount')) - Number(informationWithdraw?.fee)).toFixed(6)
                      : Number(0).toFixed(6)}{' '}
                    {informationWithdraw?.unitFee}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[14px] flex gap-[5px]">
                    {t('withdraw:fee')}{' '}
                    <QuestionMarkCircleIcon
                      width={20}
                      className="text-amber-500"
                      role="button"
                      data-tooltip-id={'fee-tooltip'}
                    />
                    <Tooltip id={'fee-tooltip'} place="bottom" content={String(t('withdraw:feeTooltip'))} />
                  </div>
                  <div className="font-semibold dark:text-white text-[#31373d]">
                    {informationWithdraw?.fee} {informationWithdraw?.unitFee}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[14px]">{t('withdraw:totalWithdrawAmount')}</div>
                  <div className="dark:text-amber-500 text-[#31373d] font-semibold">
                    {Number(watch('withdrawAmount')).toFixed(6)} {informationWithdraw?.unitFee}
                  </div>
                </div>
              </div>
              <div className="mt-[12px] w-full px-[20px] py-[10px] dark:text-[#0DFDE4] text-[#31373d] dark:bg-[#161D26] bg-[#f5f6fa] rounded-[16px] text-start">
                <h1 className="text-[16px]">
                  <span className="text-[#0EC505] me-1 inline">{t('withdraw:notice')}</span> {t('withdraw:note2')}{' '}
                  {activeCoin.name}
                </h1>
              </div>

              <div className="mt-[40px] w-full text-white text-start flex items-center justify-center gap-[10px]">
                <button
                  type="submit"
                  className="bg-[#F61B4F] hover:opacity-[0.9] rounded-[5px] py-[10px] px-[20px] min-w-[140px]"
                >
                  {t('withdraw:confirm')}
                </button>
              </div>
              <div className="flex items-center justify-end text-[16px] text-[#98a7b5] gap-[5px] mt-5">
                <div>{t('deposit:share')}</div>
                <Link href={'/'}>
                  <Image src={'/img/facebook.png'} alt="" width={30} height={30} />
                </Link>
                <Link href={'/'}>
                  <Image src={'/img/telegram.png'} alt="" width={30} height={30} />
                </Link>
              </div>
            </form>
          </div>
        </div>
        {openRollover && <ModalRollover show={openRollover} onClose={() => setOpenRollover(false)} />}
      </div>
    </>
  );
};

const WithdrawCryptoPageAuth = withAuth(WithdrawCryptoPage);

WithdrawCryptoPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default WithdrawCryptoPageAuth;
