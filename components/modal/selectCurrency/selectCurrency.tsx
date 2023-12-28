import { Dialog, DialogProps, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import Image from 'next/image';
import { ElementType, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { currencyFormat } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { DepositAddress } from '@/base/types/common';

type ModalSelectCurrencyProps = {
  onClose: () => void;
  show: boolean;
  cryptoSymbol: string;
  cryptoSymbolFrom?: string;
  onChangeCoin?: (coin: DepositAddress) => void;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalSelectCurrency({
  show,
  onClose,
  cryptoSymbol,
  cryptoSymbolFrom,
  onChangeCoin,
}: ModalSelectCurrencyProps) {
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation('');

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
      if (crypto.symbol !== 'USDT' || (crypto.symbol === 'USDT' && crypto.network === usdtNetwork)) array.push(crypto);
    });
    const newListCoin: DepositAddress[] = array.filter((coin) => coin?.symbol !== cryptoSymbolFrom);
    if (newListCoin) return newListCoin;
    else return array;
  }, [depositCryptoArray, cryptoSymbolFrom, usdtNetwork]);

  const [activeCoin, setActiveCoin] = useState<DepositAddress>();

  const handleChangeCoin = (coin: DepositAddress) => {
    setActiveCoin(coin);
    onClose();
  };

  useEffect(() => {
    const active = listCrypto.find((crypto) => crypto?.symbol === cryptoSymbol);
    if (active) setActiveCoin(active);
  }, [cryptoSymbol, listCrypto]);

  useEffect(() => {
    if (activeCoin) onChangeCoin?.(activeCoin);
  }, [activeCoin]);

  return (
    <>
      <Transition.Root show={show} as={Fragment}>
        <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={onClose}>
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
            <div className="flex min-h-full items-center justify-center p-4 text-center items-center p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95"
              >
                <Dialog.Panel className="text-white flex flex-col relative transform rounded-[15px] bg-gray-800 text-left shadow-xl transition-all my-8 w-full max-w-[799px] px-[40px] py-[30px] overflow-y-auto max-h-[80vh]">
                  <Dialog.Title as="div" className="relative mb-2">
                    <div className="text-[18px] text-white font-[600]">{t('deposit:assetsPortfolio')}</div>
                    <div
                      className="absolute hover:bg-[#39B1C0] top-0 right-0 bg-[#20D4EB] rounded-md p-1"
                      role="button"
                      onClick={onClose}
                    >
                      <XMarkIcon width={15} className="text-black" />
                    </div>
                  </Dialog.Title>
                  <div className="flex-1 flex-col flex gap-[10px] justify-between mt-[35px]">
                    {listCrypto.map((coin, index) => (
                      <div
                        key={index}
                        className={cn('flex items-center justify-start p-[10px] w-full rounded-lg', {
                          'border border-solid border-amber-500': coin?.symbol === activeCoin?.symbol,
                          'hover:bg-[#161D26]': coin?.symbol !== activeCoin?.symbol,
                        })}
                        role="button"
                        onClick={() => handleChangeCoin(coin)}
                      >
                        <div className="flex-1 flex items-center justify-start gap-[10px]">
                          <Image
                            width={30}
                            height={30}
                            src={`/img/fiats/${coin?.symbol}.png`}
                            className="inline"
                            alt=""
                          />
                          <div className="flex-1 text-start text-[14px]">
                            {coin?.symbol}
                            <span className="ml-[5px] text-[10px] text-gray-400">
                              {coin?.symbol == 'USDT' ? coin?.network : ''}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-start gap-[10px]">
                          <span className="text-[16px] text-white">{currencyFormat(Number(coin?.balance || 0))}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
