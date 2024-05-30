import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import { ElementType, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useTranslation } from '@/base/config/i18next';

import CommonModal from '../commonModal/commonModal';
import { AppState } from '@/base/redux/store';
import { shallowEqual, useSelector } from 'react-redux';
import { API_AVATAR } from '@/base/constants/common';
import { CryptoNetWorkType, CurrencyType } from '@/base/types/wallet';
import SelectCurrency from '@/components/selectCurrency/selectCurrency';
import { useForm } from 'react-hook-form';
import { InputNumber } from '@/components/input/typing';
import { currencyFormat1 } from '@/base/libs/utils';
import { useExchange } from '@/base/hooks/useExchange';
import ModalRollover from '../rollover/Rollover';
import Textarea from '@/components/input/typing/Textarea';

type ChatTipProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

type TipFormType = {
  tipAmount: string;
  tipMessage: string;
};

export default function ModalChatTip({ show, onClose }: ChatTipProps) {
  const { t } = useTranslation('');
  const exchangeRate = useExchange();
  const { tipReceiver } = useSelector(
    (state: AppState) => ({
      tipReceiver: state.modal.tipReceiver,
    }),
    shallowEqual,
  );
  const [openRollover, setOpenRollover] = useState<boolean>(false);
  const [isShowMessage, setIsShowMessage] = useState<boolean>(false);

  const [activeCoin, setActiveCoin] = useState<CurrencyType>({
    id: '',
    name: '',
    alias: '',
    logo: '',
    iso_currency: '',
    availableNetworks: [],
    iso_decimals: 0,
    price: 0,
    type: 'crypto',
    favorite: false,
  });

  const [activeNetwork, setActiveNetwork] = useState<CryptoNetWorkType>({
    id: '',
    name: '',
    type: 1,
  });

  const [withdrawInfo, setWithdrawInfo] = useState({
    availableAmountUsd: 0,
    availableAmount: 0,
    lockedAmount: 0,
    lockedAmountUsd: 0,
  });

  const { cryptoCurrencies, cryptoSymbols, balances, localFiat, viewInFiat, restrictedTo } = useSelector(
    (state: AppState) => ({
      // localeFiat: state.common.localeFiat,
      restrictedTo: state.auth.user.restrictedTo,
      localFiat: state.wallet.localFiat,
      balances: state.wallet.balances,
      cryptoCurrencies: state.wallet.cryptoCurrencies,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      cryptoSymbols: state.wallet.symbols,
    }),
    shallowEqual,
  );

  const renderMinValue = useMemo(() => {
    const cryptoCurrency = cryptoCurrencies.find(
      (item) => item.networkId === activeNetwork.id && item.symbolId === activeCoin.id,
    );
    return {
      min: cryptoCurrency ? cryptoCurrency.minWithdrawAmount : 0,
      fee: cryptoCurrency ? cryptoCurrency.withdrawFee : 0,
    };
  }, [activeNetwork, activeCoin, cryptoCurrencies, withdrawInfo]);

  const renderMaxValue = useMemo(() => {
    const activeCrypto = cryptoSymbols.find((item) => item.id === activeCoin.id);
    const withdrawableAmountUsd = withdrawInfo.availableAmountUsd;
    const withdrawableAmount = withdrawableAmountUsd / (activeCrypto?.price || 1);
    return withdrawableAmount;
  }, [cryptoSymbols, withdrawInfo, activeCoin]);

  const renderBalanceValue = useMemo(() => {
    const selectedBalanceInfo = balances.find((item) => item.symbolId === activeCoin.id);
    return selectedBalanceInfo ? selectedBalanceInfo.amount : 0;
  }, [balances, activeCoin]);

  const schema = yup.object().shape({
    tipMessage: yup.string(),
    tipAmount: yup
      .number()
      .required('Withdraw amount is required')
      .typeError('Withdraw amount is required')
      .min(+renderMinValue.min.toFixed(4), `Winthdraw amount should greater than ${renderMinValue.min.toFixed(4)}`)
      .max(+renderMaxValue.toFixed(4), `Winthdraw amount should be less than or equal to ${renderMaxValue.toFixed(4)}`),
  });
  const {
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<TipFormType>({
    resolver: yupResolver(schema),
    defaultValues: { tipAmount: '0' },
    mode: 'onSubmit',
  });

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass={`max-w-full sm:max-w-[420px] sm:max-h-[90vh] h-full sm:!h-[700px]`}
      >
        <div className="bg-gradient-card-modal p-6 h-full">
          <div className="font-normal dark:text-white text-black text-[14px] sm:text-[16px] pb-4">Tip</div>
          <div className="flex flex-col overflow-y-auto h-full">
            <div className="flex flex-col items-center gap-4">
              {tipReceiver?.userName ? (
                <Image
                  className="w-[80px] h-[80px] rounded-full"
                  width={80}
                  height={80}
                  src={tipReceiver.userAvatar ? `${API_AVATAR}${tipReceiver.userAvatar}` : '/img/avatar-1.png'}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.src = '/img/avatar-1.png';
                  }}
                />
              ) : (
                <Image
                  className="w-[80px] h-[80px] rounded-full grayscale brightness-50"
                  width={80}
                  height={80}
                  src="/img/avatar-hidden.png"
                  alt=""
                />
              )}
              <span className="font-bold">{tipReceiver.userName || ''}</span>
            </div>
            <form className="flex flex-col h-full">
              <div>
                <SelectCurrency
                  activeCoin={activeCoin}
                  activeNetwork={activeNetwork}
                  onChangeCoin={setActiveCoin}
                  onChangeNetwork={setActiveNetwork}
                  withDrawTab={true}
                  isShowNetwork={false}
                  labelText={String(t('tip:tipCurrency'))}
                />
                <div className="mt-[20px] flex flex-col gap-2">
                  <div className="text-default dark:text-color-text-primary text-color-light-text-primary text-left">
                    {t('tip:tipAmount')}
                  </div>
                  <InputNumber
                    customClass="px-[20px] py-[15px] dark:bg-color-input-primary bg-color-light-input-primary !text-default rounded-default"
                    control={control}
                    placeholder={String(t('withdraw:withdrawalAddressPlaceholder'))}
                    name="tipAmount"
                  />
                  <div className="flex justify-between mt-2 text-default">
                    <div className="flex flex-wrap gap-1">
                      <span className="dark:text-color-text-primary text-color-light-text-primary">
                        {t('withdraw:available')}:
                      </span>
                      <span className="flex text-black dark:text-white">
                        {viewInFiat
                          ? currencyFormat1(
                              withdrawInfo.availableAmountUsd * exchangeRate,
                              4,
                              String(localFiat?.name || 'USD'),
                            )
                          : `${currencyFormat1(withdrawInfo.availableAmount, 4, '', false)}`}
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-end gap-1">
                      <span
                        className="underline cursor-pointer dark:text-color-text-primary text-color-light-text-primary"
                        onClick={() => setOpenRollover(true)}
                      >
                        {t('withdraw:lockedFunds')}:
                      </span>
                      <span className="flex text-black dark:text-white">
                        {viewInFiat
                          ? `${currencyFormat1(
                              withdrawInfo.lockedAmountUsd * exchangeRate,
                              4,
                              localFiat?.name || 'USD',
                            )}`
                          : `${currencyFormat1(withdrawInfo.lockedAmount, 4, '', false)}`}
                      </span>
                    </div>
                  </div>
                </div>
                {isShowMessage && (
                  <div className="mt-5 flex flex-col gap-2">
                    <div className="text-default dark:text-color-text-primary text-color-light-text-primary text-left">
                      {t('tip:tipMessage')}
                    </div>
                    <Textarea
                      customClass="px-[20px] py-[15px] dark:bg-color-input-primary bg-color-light-input-primary !text-default rounded-default"
                      control={control}
                      name="tipMessage"
                    />
                  </div>
                )}
                <div className="flex items-center gap-[10px] mt-5">
                  <input
                    checked={isShowMessage}
                    onChange={(event) => {
                      setIsShowMessage(event.target.checked);
                      if (event.target.checked === true) setValue('tipMessage', '');
                    }}
                    className="w-[14px] h-[14px] bg-color-primary text-color-primary"
                    type="checkbox"
                    id="vehicle1"
                  />
                  <label htmlFor="vehicle1" className="text-m_default !text-color-text-primary font-normal text-start">
                    {t('tip:tipMessageDescription')}
                  </label>
                </div>
              </div>
              <div className="mt-6 w-full text-white text-start flex items-center justify-center gap-[10px]">
                <button
                  type="submit"
                  className="bg-gradient-btn-play hover:opacity-[0.9] rounded-large py-[10px] px-[20px] min-w-[140px]"
                >
                  {t('tip:tipConfirm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </CommonModal>
      {openRollover && <ModalRollover show={openRollover} onClose={() => setOpenRollover(false)} />}
    </>
  );
}
