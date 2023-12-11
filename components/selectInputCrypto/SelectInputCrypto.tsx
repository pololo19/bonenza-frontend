import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { ArrowDown2 } from 'iconsax-react';
import Image from 'next/image';
import { Fragment, useEffect, useMemo, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { currencyFormat } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { DepositAddress, MoonpayDepositAddress } from '@/base/types/common';

import Loader from '../common/preloader/loader';

type SelectInputCryptoProps = {
  currencyConvert?: number;
  onChangeCoin?: (value: MoonpayDepositAddress) => void;
  activeCoin: MoonpayDepositAddress;
};

const SelectInputCrypto = ({ currencyConvert = 0, onChangeCoin, activeCoin }: SelectInputCryptoProps) => {
  const { t } = useTranslation('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowFiatModal, setIsShowFiatModal] = useState<boolean>(false);

  const { depositCryptoArray, usdtNetwork } = useSelector(
    (state: AppState) => ({
      depositCryptoArray: state.common.depositCryptoArray,
      usdtNetwork: state.common.usdtNetwork,
    }),
    shallowEqual,
  );

  const listCrypto = useMemo(() => {
    let array: DepositAddress[] = [];
    depositCryptoArray.forEach((crypto) => {
      if (
        crypto.symbol !== 'DRON' &&
        (crypto.symbol !== 'USDT' || (crypto.symbol === 'USDT' && crypto.network === usdtNetwork))
      )
        array.push(crypto);
    });
    return array;
  }, [depositCryptoArray, usdtNetwork]);

  const [coin, setCoin] = useState<MoonpayDepositAddress>();

  useEffect(() => {
    onChangeCoin?.(listCrypto[0]);
    setCoin(listCrypto[0]);
  }, [depositCryptoArray]);

  return (
    <>
      {isLoading && <Loader />}

      <div>
        <div className="flex-1 flex justify-between items-center sm:gap-5 gap-2 dark:bg-[#161D26] font-semibold mt-5 py-[10px] px-[22px] text-white w-full text-[16px] rounded-[16px] bg-[#f5f6fa] outline-none">
          <CurrencyInput
            className="outline-none bg-transparent ms:w-full dark:placeholder:text-[#53575C] placeholder:text-[#31373d] dark:text-white text-black h-full py-2"
            decimalsLimit={0}
            maxLength={15}
            size={15}
            value={currencyConvert}
            disabled
          />
          <div
            role="button"
            className="flex items-center gap-2 dark:bg-gray-700/50 bg-white py-2 px-2 dark:border border-0 border-solid border-gray-600 rounded"
            onClick={() => setIsShowFiatModal(true)}
          >
            <div className="flex items-center gap-3">
              <Image width={25} height={25} src={`/img/fiats/${coin?.symbol}.png`} alt="" />
              <div className="font-normal dark:text-white text-black sm:text-[14px] text-[12px] truncate">
                {coin?.symbol} <span className="font-[300] text-[12px] text-gray-400">{coin?.network}</span>
              </div>
            </div>
            <ArrowDown2 className="dark:text-white text-black" />
          </div>
        </div>
        {coin?.depositAddress && (
          <div className="text-[#C2C2C2] mt-3 text-left text-[12px]">
            {t('deposit:yourWallet')}: <span className="dark:text-white text-black">{coin?.depositAddress}</span>
          </div>
        )}
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10">
            <div className="flex min-h-full justify-center p-4 text-center items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95"
              >
                <Dialog.Panel className="bg-[#f5f6fa] text-black dark:text-white flex flex-col relative transform rounded-lg dark:bg-gray-800 text-left shadow-xl transition-all my-8 w-full max-w-5xl max-h-[80vh]">
                  <Dialog.Title as="div" className="relative mb-2 px-4 pt-4">
                    <div className="text-[18px] text-black dark:text-white font-[600]">
                      {t('deposit:assetsPortfolio')}
                    </div>
                    <div
                      className="absolute bg-red-500 hover:opacity-70 dark:hover:bg-[#39B1C0] sm:top-[20px] top-[10px] sm:right-[20px] right-[10px] dark:sm:bg-[#20D4EB] rounded-md p-1 z-[10]"
                      role="button"
                      onClick={() => setIsShowFiatModal(false)}
                    >
                      <XMarkIcon width={15} className="text-[#ffffff] dark:text-black" />
                    </div>
                  </Dialog.Title>
                  <div className="p-5 py-5 mt-3 bg-[#f5f6fa] dark:bg-gray-900 border overflow-y-auto ">
                    <div className={`grid grid-cols-1 gap-2 `}>
                      {listCrypto.map((item, key) => (
                        <button
                          key={key}
                          className={cn(
                            'flex rounded-md text-left px-5 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 items-center',
                            {
                              'border border-solid border-amber-500': coin?.symbol === item?.symbol,
                            },
                          )}
                          onClick={() => {
                            setCoin(item);
                            onChangeCoin?.(item);
                            setIsShowFiatModal(false);
                          }}
                        >
                          <div className="flex-1 flex gap-[10px] items-center">
                            <Image
                              width={30}
                              height={30}
                              src={`/img/fiats/${item?.symbol}.png`}
                              alt=""
                              onClick={() => setIsShowFiatModal(true)}
                            />
                            <div className="font-semibold text-[14px]">
                              {item?.symbol}{' '}
                              <span className="font-[300] text-[12px] text-gray-500">{item?.network}</span>
                            </div>
                          </div>
                          <div className="text-[#98A7B5] text-[14px]">{currencyFormat(Number(item?.balance))}</div>
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

export default SelectInputCrypto;
