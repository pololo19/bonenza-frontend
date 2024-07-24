import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { ArrowDown2, Global } from 'iconsax-react';
import Image from 'next/image';
import { Fragment, useEffect, useMemo, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { MoonpayCurrencyType, MoonpayFiatType } from '@/base/types/common';

import Loader from '../common/preloader/loader';
import InputSearch from '../input/typing/InputSearch';

type SelectInputFiatProps = {
  onChangeMoonpayFiat?: (value: MoonpayFiatType) => void;
  onChangeValue?: (value: number) => void;
  valueFiat?: number;
  activeCoinInformation?: MoonpayCurrencyType;
};

const SelectInputFiat = ({
  onChangeMoonpayFiat,
  onChangeValue,
  valueFiat,
  activeCoinInformation,
}: SelectInputFiatProps) => {
  const { t } = useTranslation('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowFiatModal, setIsShowFiatModal] = useState<boolean>(false);
  const [activeMoonpayFiat, setActiveMoonpayFiat] = useState<MoonpayFiatType>();
  const [listMoonpayFiat, setListMoonpayFiat] = useState<MoonpayFiatType[]>([]);
  const [currency, setCurrency] = useState<number>();
  const [searchInput, setSearchInput] = useState<string>('');

  const handleGetFiat = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('deposit/get-moonpay-fiat');
      setListMoonpayFiat(res.data.data.dataMoonpayFiat);
      setActiveMoonpayFiat(res.data.data.dataMoonpayFiat[0]);
      onChangeMoonpayFiat?.(res.data.data.dataMoonpayFiat[0]);
    } catch (error) {
      setListMoonpayFiat([]);
      setActiveMoonpayFiat(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLimitFiat = async (currencyString: string) => {
    const number = Number(currencyString.replace(/[^0-9.-]+/g, ''));
    const minValue = Number(activeCoinInformation?.minBuyAmount ?? 0);
    const maxValue = Number(activeCoinInformation?.maxBuyAmount ?? 0);
    const value = Math.max(minValue, Math.min(maxValue, Number(number ?? 0)));
    setCurrency(Number(value ?? 0));
    onChangeValue?.(Number(value ?? 0));
  };

  useEffect(() => {
    handleGetFiat();
  }, []);

  useEffect(() => {
    const minValue = Number(activeCoinInformation?.minBuyAmount ?? 0);
    setCurrency(minValue);
    onChangeValue?.(minValue);
  }, [activeCoinInformation]);

  const filterListFiat = useMemo(() => {
    return listMoonpayFiat.filter((item) => {
      return (
        String(item?.code).toLowerCase().includes(searchInput.toLowerCase()) ||
        String(item?.name).toLowerCase().includes(searchInput.toLowerCase())
      );
    });
  }, [listMoonpayFiat, searchInput]);

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <div className="flex-1 flex items-center gap-5 dark:bg-[#161D26] bg-[#f5f6fa] font-semibold mt-5 py-[10px] px-[22px] text-white w-full text-[16px] rounded-[16px] bg-[#161D26] outline-none">
          <div className="flex flex-1 h-full text-start">
            <CurrencyInput
              className="flex-1 outline-none bg-transparent dark:placeholder:text-color-text-primary placeholder:text-[#31373d] dark:text-white text-black h-full py-2"
              decimalsLimit={0}
              maxLength={15}
              onBlur={(event) => {
                handleLimitFiat(event.target.value);
              }}
              value={currency}
              onValueChange={(value) => {
                setCurrency(Number(value ?? 0));
              }}
              min={Number(12)}
            />
          </div>
          <div
            role="button"
            className="flex items-center gap-2 px-2 py-2 bg-white border-0 border-gray-600 border-solid rounded dark:bg-gray-700/50 dark:border min-w-fit"
            onClick={() => setIsShowFiatModal(true)}
          >
            {activeMoonpayFiat ? (
              <div className="flex items-center gap-3">
                <Image
                  width={25}
                  height={25}
                  src={`https://static.moonpay.com/widget/currencies/${activeMoonpayFiat?.code?.toLowerCase()}.svg`}
                  alt="currency"
                />
                <div className="font-normal dark:text-white text-black sm:text-[14px] text-[12px]">
                  {activeMoonpayFiat?.code}
                </div>
              </div>
            ) : (
              <Global />
            )}
            <ArrowDown2 size={20} className="text-black dark:text-white" />
          </div>
        </div>
      </div>
      <Transition.Root show={isShowFiatModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsShowFiatModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>
          <div className="fixed inset-0 z-10">
            <div className="flex items-center justify-center min-h-full p-0 p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95"
              >
                <Dialog.Panel className="text-white flex flex-col relative transform rounded-lg bg-[#f5f6fa] dark:bg-gray-800 text-left shadow-xl transition-all my-8 w-full max-w-5xl max-h-[80vh]">
                  <Dialog.Title as="div" className="relative px-4 pt-4 mb-2">
                    <div className="text-[18px] text-black dark:text-white font-[600]">{t('deposit:selectFiat')}</div>
                    <div
                      className="absolute bg-red-500 hover:opacity-70 dark:hover:bg-[#39B1C0] sm:top-[20px] top-[10px] sm:right-[20px] right-[10px] dark:sm:bg-[#20D4EB] rounded-md p-1 z-[10]"
                      role="button"
                      onClick={() => setIsShowFiatModal(false)}
                    >
                      <XMarkIcon width={15} className="text-[#ffffff] dark:text-black" />
                    </div>
                  </Dialog.Title>
                  <div className="px-5 py-[10px]  ba dark:bg-gray-900">
                    <InputSearch value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                  </div>
                  <div className="p-5 py-5 bg-[#f5f6fa] dark:bg-gray-900 border overflow-y-auto">
                    <div className={`grid grid-cols-1 gap-2`}>
                      {filterListFiat.map((item, key) => (
                        <button
                          key={key}
                          className={cn(
                            'flex rounded-md text-left px-5 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 items-center',
                            {
                              'border border-solid border-amber-500': activeMoonpayFiat?.code === item?.code,
                            },
                          )}
                          onClick={() => {
                            setActiveMoonpayFiat(item);
                            onChangeMoonpayFiat?.(item);
                            setIsShowFiatModal(false);
                          }}
                        >
                          <div className="flex-1 flex gap-[10px] items-center">
                            <Image
                              width={30}
                              height={30}
                              src={`https://static.moonpay.com/widget/currencies/${item?.code?.toLowerCase()}.svg`}
                              alt="currency"
                              onClick={() => setIsShowFiatModal(true)}
                            />
                            <div className="font-semibold text-black dark:text-[#ffffff] text-[14px]">{item.code}</div>
                          </div>
                          <div className="text-[#98A7B5] text-[14px]">{item.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default SelectInputFiat;
