import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { CookieKey, LIST_NETWORK_USDT } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { currencyFormat } from '@/base/libs/utils';
import { changeActiveFiat, changeUsdtNetwork } from '@/base/redux/reducers/common.reducer';
import { AppState } from '@/base/redux/store';
import { CurrencyEnum, DepositAddress } from '@/base/types/common';

import InputSearch from '../input/typing/InputSearch';

type SelectCurrencyProps = {
  onChangeCoin?: (coin: DepositAddress) => void;
  setBalance?: (balance: number) => void;
  withDrawTab?: boolean;
};

const SelectCurrency = ({ onChangeCoin, withDrawTab, setBalance }: SelectCurrencyProps) => {
  const { t } = useTranslation('');
  const { query } = useRouter();
  const dispatch = useDispatch();

  const { depositCryptoArray, usdtNetwork } = useSelector(
    (state: AppState) => ({
      depositCryptoArray: state.common.depositCryptoArray,
      usdtNetwork: state.common.usdtNetwork,
    }),
    shallowEqual,
  );

  const [activeCoin, setActiveCoin] = useState<DepositAddress>();
  const [activeNetwork, setActiveNetwork] = useState<string>(String(usdtNetwork));
  const [listNetwork, setListNetwork] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');

  // const listCrypto = useMemo(() => {
  //   let array: DepositAddress[] = [];
  //   depositCryptoArray.forEach((crypto) => {
  //     if (crypto?.symbol !== 'USDT' || ) array.push(crypto);
  //     else if (crypto?.symbol === 'USDT' && crypto?.network && crypto?.network === usdtNetwork) array.push(crypto);
  //     else if (crypto?.symbol === 'USDT' && !crypto?.network) array.push(crypto);
  //   });
  //   return array;
  // }, [depositCryptoArray, usdtNetwork]);

  const handleGetDepositAddress = async () => {
    try {
      await api.get('deposit/get-deposit-address');
    } catch (error) {
    } finally {
    }
  };

  const handleChangeCrypto = (symbol: string) => {
    const listSameCrypto = depositCryptoArray.filter((crypto) => crypto?.symbol === symbol);
    const listNetworkByCrypto = listSameCrypto?.map((crypto) => String(crypto?.network));
    if (listSameCrypto[0]?.symbol === 'USDT') {
      setActiveCoin({ ...listSameCrypto[0], network: String(usdtNetwork) });
      setBalance?.(Number(listSameCrypto[0].balance));
      setActiveNetwork(String(usdtNetwork));
      setListNetwork(LIST_NETWORK_USDT);
    } else {
      setActiveCoin(listSameCrypto[0]);
      setBalance?.(Number(listSameCrypto[0].balance));
      setActiveNetwork(listNetworkByCrypto?.[0]);
      setListNetwork(listNetworkByCrypto);
    }
  };

  const handleChangeNetwork = async (network: string) => {
    setActiveNetwork(network);

    let newActiveCrypto = depositCryptoArray.find(
      (crypto) => crypto?.symbol === activeCoin?.symbol && crypto?.network === network,
    );
    if (!newActiveCrypto) {
      newActiveCrypto = { ...depositCryptoArray[0], network: network };
    }
    if (newActiveCrypto) {
      setActiveCoin(newActiveCrypto);
      if (newActiveCrypto.symbol === 'USDT') {
        dispatch(changeUsdtNetwork(network ?? 'BEP20'));
        CookiesStorage.setCookieData(CookieKey.usdtNetwork, network);
        const usdtActive = {
          amount: Number(newActiveCrypto?.balance),
          amountLocked: Number(newActiveCrypto?.balanceLocked),
          currency: newActiveCrypto?.symbol,
          currencyAlias: newActiveCrypto?.network,
          id: newActiveCrypto?.id,
          maxDepositAmount: undefined,
          minDepositAmount: undefined,
          isFavorite: newActiveCrypto?.isFavorite,
          type: CurrencyEnum.CRYPTO,
        };
        dispatch(changeActiveFiat(usdtActive));
        CookiesStorage.setCookieData(CookieKey.activeFiat, String(usdtActive?.currency));
        CookiesStorage.setCookieData(CookieKey.activeFiatData, JSON.stringify(usdtActive));
      }
    }
  };

  useEffect(() => {
    if (activeCoin) onChangeCoin?.(activeCoin);
  }, [activeCoin]);

  useEffect(() => {
    if (query.coin) {
      const coin = depositCryptoArray.find((e) => e.symbol === String(query.coin).toUpperCase());
      if (coin) {
        handleChangeCrypto(String(query.coin));
      }
    } else {
      handleChangeCrypto(String(depositCryptoArray[0]?.symbol));
    }
  }, [query, depositCryptoArray]);

  useEffect(() => {
    handleGetDepositAddress();
  }, []);

  const filterListCoin = useMemo(() => {
    return depositCryptoArray?.filter((item) => {
      return String(item?.symbol).toLowerCase().includes(searchInput.toLowerCase());
    });
  }, [depositCryptoArray, searchInput]);

  return (
    <div className="flex flex-col items-start md:gap-[20px] gap-[15px] text-white">
      <div className="flex flex-col items-start w-full gap-2">
        {!withDrawTab && (
          <div className="text-[14px] dark:text-[#C2C2C2] text-[#31373d]">{t('deposit:depositCurrency')}</div>
        )}
        {withDrawTab && (
          <div className="text-[14px] dark:text-[#C2C2C2] text-[#31373d]">{t('withdraw:withdrawCurrency')}</div>
        )}
        {!withDrawTab && (
          <div className="w-full flex flex-wrap gap-1 overflow-x-auto">
            {depositCryptoArray.map((crypto, index) => (
              <div
                className={cn(
                  'w-fit p-[2px] font-semibold rounded-full',
                  {
                    'bg-primary my-auto': crypto?.symbol === activeCoin?.symbol,
                  },
                  {
                    'border-2 border-solid dark:border-[#272C33] border-[#EAECF3] dark:bg-[#161D26] bg-[#F6F7FA]':
                      crypto?.symbol !== activeCoin?.symbol,
                  },
                )}
                key={index}
                onClick={() => handleChangeCrypto(String(crypto?.symbol))}
              >
                <button
                  className={cn(
                    'sm:min-w-[80px] min-w-[75px] px-1 py-1 dark:text-white text-[#31373d] rounded-full flex items-center gap-2 capitalize dark:hover:bg-primary hover:bg-[#f6f7fa] bg-[#F6F7FA] dark:bg-[#161D26]',
                  )}
                >
                  <Image width={24} height={24} src={`/img/fiats/${crypto?.symbol}.png`} className="inline" alt="" />
                  <h1 className="sm:text-[14px] text-[12px] font-normal">{crypto?.symbol}</h1>
                </button>
              </div>
            ))}
          </div>
        )}
        <Menu as="div" className="relative flex w-full dark:bg-[#161D26] bg-[#F6F7FA] rounded-[16px]">
          <Menu.Button className="flex-1">
            <div className="flex items-center justify-between w-full py-[13px] px-[20px] " role="button">
              <div className="flex-1 flex items-center justify-start gap-[10px]">
                <Image
                  width={30}
                  height={30}
                  src={`img/fiats/${activeCoin?.symbol}.png`}
                  onError={(e) => {
                    e.currentTarget.src = '/img/fiats/USDT.png';
                  }}
                  className="inline"
                  alt=""
                />
                <div className="dark:text-white text-black flex-1 text-start text-[14px]">
                  {activeCoin?.symbol} <span className="ml-[5px] text-[10px] text-gray-400">{activeCoin?.network}</span>
                </div>
              </div>
              <div className="flex items-center justify-start gap-[10px]">
                <div className="flex items-center text-[14px] dark:text-[#C2C2C2] text-[#31373d] gap-[10px]">
                  {t('deposit:balance')}{' '}
                  <span className="text-[14px] font-semibold dark:text-white text-[#31373d]">
                    {activeCoin?.balance ? currencyFormat(Number(activeCoin?.balance)) : 0}
                  </span>
                </div>
                <ChevronDownIcon width={15} className="dark:text-white text-[#31373d]" />
              </div>
            </div>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute dark:text-white text-black dark:bg-[#161D26] bg-[#f6f7fa] w-full origin-top-right right-0 top-[60px] z-[10] cursor-pointer">
              <div className="py-[10px] px-[10px]">
                <InputSearch value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
              </div>
              <div className="py-1 max-h-[250px] overflow-y-auto p-2">
                {filterListCoin.map((crypto, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <div
                        className={cn(
                          'flex items-center justify-start py-[10px] px-[10px] w-full dark:hover:bg-[#212b36] mb-2',
                          {
                            'border border-amber-500/50 border-solid rounded': crypto?.symbol === activeCoin?.symbol,
                          },
                        )}
                        role="button"
                        onClick={() => handleChangeCrypto(String(crypto?.symbol))}
                      >
                        <div className="flex-1 flex items-center justify-start gap-[10px]">
                          <Image
                            width={30}
                            height={30}
                            src={`img/fiats/${crypto?.symbol}.png`}
                            onError={(e) => {
                              e.currentTarget.src = '/img/icon/USDT-logo.svg';
                            }}
                            className="inline"
                            alt=""
                          />
                          <div className="flex-1 text-start text-[14px] dark:text-white text-black font-semibold">
                            {crypto?.symbol}
                          </div>
                        </div>
                        <div className="flex items-center justify-start gap-[10px]">
                          <span className="text-[14px] font-semibold dark:text-white text-black">
                            {currencyFormat(Number(crypto?.balance || 0))}
                          </span>
                          <ChevronDownIcon width={15} className="opacity-0" />
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <div className="flex flex-col items-start w-full gap-2">
        <div className="text-[14px] dark:text-[#C2C2C2] text-[#31373d]">{t('deposit:chooseNetwork')}</div>
        <Menu as="div" className="relative flex w-full dark:bg-[#161D26] bg-[#f6f7fa] rounded-[16px]">
          <Menu.Button className="flex-1 py-[15px] px-[20px]">
            <div className="flex items-center justify-between w-full" role="button">
              <div className="flex-1 flex items-center justify-start gap-[10px]">
                <div className="flex-1 text-start dark:text-white text-black text-[14px]">{activeNetwork}</div>
              </div>
              <div className="flex items-center justify-start gap-[10px]">
                <ChevronDownIcon width={15} className="dark:text-white text-[#31373d]" />
              </div>
            </div>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute dark:bg-[#161D26] bg-[#f6f7fa] w-full origin-top-right right-0 top-[60px] z-[10] cursor-pointer">
              <div className="py-1 max-h-[250px] overflow-y-auto p-2">
                {listNetwork.map((network, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <div
                        className="flex items-center justify-start py-[10px] px-[10px] w-full dark:hover:bg-[#212b36]"
                        role="button"
                        onClick={() => handleChangeNetwork(network)}
                      >
                        <div className="flex-1 flex items-center justify-start gap-[10px]">
                          {network && (
                            <div className="flex-1 dark:text-white text-[#31373d] text-start text-[14px] font-semibold">
                              {network}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-start gap-[10px]">
                          <ChevronDownIcon width={15} className="opacity-0" />
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default SelectCurrency;
