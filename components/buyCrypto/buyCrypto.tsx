import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatValue } from 'react-currency-input-field';
import { LIST_MOONPAY_COIN, TOAST_ENUM } from '@/base/constants/common';
import { MoonpayCurrencyType, MoonpayDepositAddress, MoonpayFiatType } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import { toast } from 'react-toastify';
import { useTranslation } from '@/base/config/i18next';
import Image from 'next/image';
import ModalMoonpay from '@/components/modal/moonpay/moonpay';
import SelectInputFiat from '@/components/selectInputFiat/SelectInputFiat';
import SelectInputCrypto from '@/components/selectInputCrypto/SelectInputCrypto';
import api from '@/api/api';
import { truncateAddress } from '@/base/libs/utils';

const BuyCryptoComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowMoonpay, setIsShowMoonpay] = useState<boolean>(false);
  const [isCheckboxApprove, setIsCheckboxApprove] = useState<boolean>(false);
  const [fiatMoonpay, setFiatMoonpay] = useState<MoonpayFiatType>();
  const [valueFiat, setValueFiat] = useState<number>();
  const [infoCoinConvert, setInfoCoinConvert] = useState<any>();
  const [activeCoin, setActiveCoin] = useState<MoonpayDepositAddress>(LIST_MOONPAY_COIN[0]);
  const [activeCoinInformation, setActiveCoinInformation] = useState<MoonpayCurrencyType>();
  const activeCoinInformationRef = useRef<MoonpayCurrencyType>();

  const { t } = useTranslation('');

  const activeMoonpayCrypto = useMemo(() => {
    return LIST_MOONPAY_COIN.find((e) => e.symbol === activeCoin.symbol);
  }, [activeCoin]);

  const handleLimitFiat = async () => {
    try {
      setIsLoading(true);
      const moonpayObject = {
        apiKey: 'pk_live_R5Lf25uBfNZyKwccAZpzcxuL3ZdJ3Hc',
        baseCurrencyCode: String(fiatMoonpay?.code).toLowerCase(),
        areFeesIncluded: 'true',
      };
      const params = new URLSearchParams(moonpayObject).toString();

      const res = await api.get(
        `https://api.moonpay.com/v3/currencies/${activeMoonpayCrypto?.moonpaySymbol}/limits?${params}`,
      );
      setActiveCoinInformation(res.data.baseCurrency);
      activeCoinInformationRef.current = res.data.baseCurrency;
    } catch (error) {
      setActiveCoinInformation({});
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertFiat = async () => {
    try {
      setIsLoading(true);
      const moonpayObject = {
        apiKey: 'pk_live_R5Lf25uBfNZyKwccAZpzcxuL3ZdJ3Hc',
        baseCurrencyCode: String(fiatMoonpay?.code).toLowerCase(),
        baseCurrencyAmount: String(Number(valueFiat ?? 0)),
        lockAmount: 'true',
        fixed: 'true',
        areFeesIncluded: 'true',
        regionalPricing: 'true',
      };
      const params = new URLSearchParams(moonpayObject).toString();
      const res = await api.get(
        `https://api.moonpay.com/v3/currencies/${activeMoonpayCrypto?.moonpaySymbol}/buy_quote?${params}`,
      );
      setInfoCoinConvert(res.data);
    } catch (error) {
      setInfoCoinConvert({
        quoteCurrencyAmount: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitMoonpay = (e: any) => {
    if (!isCheckboxApprove) {
      e.preventDefault();
      toast.error(String(t('buyCrypto:pleaseApprove')), { containerId: TOAST_ENUM.COMMON });
    } else {
      e.preventDefault();
      const moonpayObject = {
        baseCurrencyCode: String(fiatMoonpay?.code).toLowerCase(),
        apiKey: 'pk_live_R5Lf25uBfNZyKwccAZpzcxuL3ZdJ3Hc',
        baseCurrencyAmount: String(Number(valueFiat ?? 0)),
        currencyCode: String(activeMoonpayCrypto?.moonpaySymbol),
        walletAddress: String(activeCoin?.depositAddress),
        lockAmount: 'true',
        fixed: 'true',
        areFeesIncluded: 'true',
        regionalPricing: 'true',
      };
      const params = new URLSearchParams(moonpayObject).toString();
      const urlMoonpay = `https://buy.moonpay.com?${params}`;
      window.open(urlMoonpay, '_blank');
    }
  };

  useEffect(() => {
    if (activeMoonpayCrypto?.moonpaySymbol && fiatMoonpay?.code) {
      handleLimitFiat();
    }
  }, [fiatMoonpay, activeMoonpayCrypto]);

  useEffect(() => {
    if (activeMoonpayCrypto?.moonpaySymbol && valueFiat) {
      handleConvertFiat();
    }
  }, [valueFiat, activeMoonpayCrypto]);
  return (
    <>
      {/* {isLoading && <Loader />} */}
      <div className={'flex flex-col gap-[16px]'}>
        <div>
          <div className="text-[14px] text-[#31373d] dark:text-[#C2C2C2] text-left">{t('buyCrypto:payWith')}</div>
          <SelectInputFiat
            onChangeMoonpayFiat={setFiatMoonpay}
            onChangeValue={setValueFiat}
            valueFiat={valueFiat}
            activeCoinInformation={activeCoinInformation || undefined}
          />
        </div>
        <div>
          <div className="text-[14px] text-[#31373d] dark:text-[#C2C2C2] text-left">{t('buyCrypto:get')}</div>
          <SelectInputCrypto
            currencyConvert={Number(infoCoinConvert?.quoteCurrencyAmount ?? 0)}
            onChangeCoin={setActiveCoin}
            activeCoin={activeCoin}
          />
        </div>
        <div>
          <div className="text-[14px] text-[#31373d] dark:text-[#C2C2C2] text-left">
            {t('buyCrypto:paymentDetails')}
          </div>
          <div className="mt-5 dark:bg-[#161D26] bg-[#f5f6fa] rounded-[16px] p-[22px]">
            <div className="flex justify-between items-center">
              <div className="text-[14px] text-[#31373d] dark:text-[#C2C2C2] text-left">{t('buyCrypto:provider')}</div>
              <div className="flex items-center gap-[10px]">
                <Image width={30} height={30} src="/img/img-moonpay.png" className="w-[30px] h-[30px]" alt="moonpay" />
                <div className="text-[14px] dark:text-white text-[#31373d] font-bold">Moonpay</div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-[12px]">
              <div className="text-[14px] text-[#31373d] dark:text-[#C2C2C2] text-left">{t('buyCrypto:method')}</div>
              <div className="flex flex-col items-end sm:items-center sm:flex-row gap-[10px]">
                <div className="text-[14px] dark:text-white text-[#31373d] font-bold">{t('buyCrypto:creditCard')}</div>
                <Image width={150} height={30} src="/img/img-visa.png" className="w-[150px] h-[30px]" alt="visa" />
              </div>
            </div>
            <div className="flex justify-between items-center mt-[12px]">
              <div className="text-[14px] text-[#31373d] dark:text-[#C2C2C2] text-left">
                {t('buyCrypto:depositToAccount')}
              </div>
              <div className="text-[14px] dark:text-white text-[#31373d] font-bold">
                {truncateAddress(String(activeCoin?.depositAddress))}
              </div>
            </div>
          </div>
          <div className="mt-5 dark:bg-[#161D26] bg-[#f5f6fa] rounded-[16px] p-[22px]">
            <div className="flex justify-between items-center">
              <div className="text-[14px] text-[#31373d] dark:text-[#C2C2C2] text-left">
                {t('buyCrypto:totalIncludingFee')}
              </div>
              <div className="text-[14px] dark:text-white text-[#31373d] font-bold">
                {formatValue({ value: String(Number(valueFiat ?? 0)) })} {fiatMoonpay?.code}
              </div>
            </div>
            <div className="flex justify-between items-center mt-[12px]">
              <div className="text-[14px] text-[#31373d] dark:text-[#C2C2C2] text-left">{t('buyCrypto:willGet')}</div>
              <div className="text-[14px] text-[#0DFDE4] font-bold">
                {formatValue({ value: String(Number(infoCoinConvert?.quoteCurrencyAmount ?? 0)) })} {activeCoin?.symbol}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full px-[20px] py-[10px] bg-[#0DFDE4]/10 rounded-[16px] text-start">
          <h1 className="text-[14px] dark:text-white text-[#31373d]">
            <span className="text-[#0DFDE4] me-1 inline">{t('buyCrypto:notice')}</span> {t('buyCrypto:noticeDes')}
          </h1>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-[10px]">
            <input
              checked={isCheckboxApprove}
              onChange={(event) => {
                setIsCheckboxApprove(event.target.checked);
              }}
              className="w-[25px] h-[25px] before:bg-[#161D26]"
              type="checkbox"
            />
            <label
              htmlFor="vehicle1"
              className="sm:text-[14px] text-[12px] text-[#31373d] dark:text-[#C2C2C2] font-normal text-start"
            >
              {' '}
              {t('buyCrypto:checkContent')}
            </label>
          </div>
          <button onClick={handleSubmitMoonpay}>
            <div
              className="bg-[#F61B4F] hover:opacity-[0.9 text-[#31373d] text-[14px] font-bold rounded-[5px] h-[45px] flex items-center justify-center gap-[7px] px-[20px] py-[10px]"
              role="button"
            // onClick={() => setIsShowMoonpay(true)}
            >
              <Image width={30} height={30} src="/img/buy-moonpay.png" alt="moonpay" />
              <div className="sm:text-[14px] dark:text-[#ffffff] text-black text-[12px]">
                {t('buyCrypto:buyViaMoonpay')}
              </div>
            </div>
          </button>
        </div>
      </div>
      {isShowMoonpay && <ModalMoonpay show={isShowMoonpay} onClose={() => setIsShowMoonpay(false)} />}
    </>
  );
};

export default BuyCryptoComponent;
