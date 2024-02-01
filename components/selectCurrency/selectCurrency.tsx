import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { Lock } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { CryptoNetWorkType, CurrencyType } from '@/base/types/wallet';

import InputSearch from '../input/typing/InputSearch';

type SelectCurrencyProps = {
  activeCoin: CurrencyType;
  activeNetwork: CryptoNetWorkType;
  onChangeCoin: (coin: CurrencyType) => void;
  onChangeNetwork: (network: CryptoNetWorkType) => void;
  withDrawTab?: boolean;
};

const fiatDecimals = 2;
const cryptoDecimals = 4;

const SelectCurrency = ({
  activeCoin,
  activeNetwork,
  onChangeCoin,
  onChangeNetwork,
  withDrawTab,
}: SelectCurrencyProps) => {
  const exchangeRate = useExchange();
  const { t } = useTranslation('');
  const { query } = useRouter();

  const { symbols, balances, networks, localFiat, bonus } = useSelector(
    (state: AppState) => ({
      symbols: state.wallet.symbols,
      balances: state.wallet.balances,
      networks: state.wallet.networks,
      localFiat: state.wallet.localFiat,
      bonus: state.wallet.bonusBalance,
    }),
    shallowEqual,
  );

  const [availableNetworks, setAvailabeNetworks] = useState<CryptoNetWorkType[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');

  const filterListCoin = useMemo(() => {
    return symbols.filter((item) => {
      return String(item.name).toLowerCase().includes(searchInput.toLowerCase());
    });
  }, [symbols, searchInput]);

  useEffect(() => {
    if (networks.length > 0) {
      /*****  SET BSC network as default network *****/
      const defaultNetwork = networks.find((item) => item.name.toLowerCase() === 'bsc');
      if (defaultNetwork) {
        onChangeNetwork(defaultNetwork);
        // USDT is exist in all networks....
        setAvailabeNetworks([...networks]);
      }
    }
  }, [networks]);

  useEffect(() => {
    if (symbols.length > 0) {
      /***** SET USDT as default symbol *****/
      const defaultSymbol = symbols.find((item) => item.name.toLowerCase() === 'usdt');
      if (defaultSymbol) {
        onChangeCoin(defaultSymbol);
      }
    }
  }, [symbols]);

  const handleChangeCrypto = (symbol: CurrencyType) => {
    const availableNetworkIds = symbol.availableNetworks;

    const filteredNetworks: CryptoNetWorkType[] = networks.filter((item) => availableNetworkIds.indexOf(item.id) != -1);
    const defaultNetwork = filteredNetworks[0];

    setAvailabeNetworks([...filteredNetworks]);
    setSearchInput('');
    onChangeCoin(symbol);
    onChangeNetwork(defaultNetwork);
  };

  const getBalanceBySymbol = (symbol: CurrencyType) => {
    const tempBalances = [...balances];
    const selectedBalance = tempBalances.find((item) => item.symbolId === symbol.id);

    return selectedBalance?.amount || 0;
  };
  useEffect(() => {
    if (query.coin) {
      const coin = symbols.find((e) => e.name.toUpperCase() === String(query.coin).toUpperCase());
      if (coin) {
        handleChangeCrypto(coin);
      }
    }
  }, [query, symbols, networks]);

  return (
    <div className="flex flex-col items-start md:gap-[20px] gap-[15px] text-white">
      <div className="flex flex-col items-start w-full gap-2">
        {!withDrawTab && (
          <div className="text-[14px] dark:text-[#C2C2C2] text-color-light-text-primary">
            {t('deposit:depositCurrency')}
          </div>
        )}
        {withDrawTab && (
          <div className="text-[14px] dark:text-[#C2C2C2] text-color-light-text-primary">
            {t('withdraw:withdrawCurrency')}
          </div>
        )}
        {!withDrawTab && (
          <div className="w-full flex flex-wrap gap-1 overflow-x-auto">
            {symbols.map((symbol, index) => (
              <div
                className={cn(
                  'w-fit p-[2px] font-semibold rounded-full',
                  {
                    'bg-color-primary my-auto': symbol.id === activeCoin.id,
                  },
                  {
                    'border-2 border-solid dark:border-[#272C33] border-[#EAECF3] dark:bg-color-input-primary bg-[#F6F7FA]':
                      symbol.id !== activeCoin.id,
                  },
                )}
                key={index}
                onClick={() => handleChangeCrypto(symbol)}
              >
                <button
                  className={cn(
                    'sm:min-w-[80px] min-w-[75px] px-1 py-1 dark:text-white text-color-light-text-primary rounded-full flex items-center gap-2 capitalize dark:hover:bg-color-primary hover:bg-[#f6f7fa] bg-[#F6F7FA] dark:bg-color-input-primary',
                  )}
                >
                  <Image
                    width={24}
                    height={24}
                    src={symbol.logo}
                    className="inline"
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = '/img/fiat/USD.png';
                    }}
                  />
                  <h1 className="sm:text-[14px] text-[12px] font-normal">{symbol.name}</h1>
                </button>
              </div>
            ))}
          </div>
        )}
        <Menu
          as="div"
          className="relative flex w-full dark:bg-color-input-primary bg-color-light-input-primary rounded-[3px]"
        >
          <Menu.Button className="flex-1">
            <div className="flex items-center justify-between w-full py-[13px] px-[20px] " role="button">
              <div className="flex-1 flex items-center justify-start gap-[10px]">
                <Image
                  width={30}
                  height={30}
                  src={activeCoin.logo}
                  onError={(e) => {
                    e.currentTarget.src = '/img/fiats/USDT.png';
                  }}
                  className="inline"
                  alt=""
                />
                <div className="dark:text-white text-black flex-1 text-start text-[14px]">
                  {activeCoin.name}
                  <span className="ml-[5px] text-[10px] text-gray-400">{activeCoin.name}</span>
                </div>
              </div>
              <div className="flex items-center justify-start gap-[10px]">
                <div className="flex items-center text-[14px] dark:text-[#C2C2C2] text-color-light-text-primary gap-[10px]">
                  {t('deposit:balance')}{' '}
                  <span className="text-[14px] font-semibold dark:text-white text-color-light-text-primary">
                    {currencyFormat1(getBalanceBySymbol(activeCoin), cryptoDecimals, '', false)}
                  </span>
                </div>
                <ChevronDownIcon width={15} className="dark:text-white text-color-light-text-primary" />
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
            <Menu.Items className="absolute dark:text-white text-black dark:bg-color-input-primary bg-color-light-input-primary w-full origin-top-right right-0 top-[60px] z-[10] cursor-pointer shadow-bs-default">
              <div className="py-[10px] px-[10px]">
                <InputSearch
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="dark:text-white !bg-white dark:!bg-color-panel-bg-primary min-h-[40px] border border-solid border-transparent focus-within:border-color-primary"
                />
              </div>
              <div className="py-1 max-h-[250px] overflow-y-auto p-2">
                {filterListCoin.map((symbol, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <div
                        className={cn(
                          'flex items-center justify-start w-full dark:hover:bg-color-hover-primary hover:bg-color-light-hover-primary mb-2',
                          {
                            'border border-color-primary/50 border-solid rounded': symbol.id === activeCoin.id,
                          },
                        )}
                        role="button"
                        onClick={() => handleChangeCrypto(symbol)}
                      >
                        <div className="flex-1 flex items-center justify-start py-[10px] px-[10px] gap-[10px]">
                          <Image
                            width={30}
                            height={30}
                            src={symbol.logo}
                            onError={(e) => {
                              e.currentTarget.src = '/img/icon/USDT-logo.svg';
                            }}
                            className="inline"
                            alt=""
                          />
                          <div className="flex-1 text-start text-[14px] dark:text-white text-black font-semibold">
                            {symbol.name}
                          </div>
                        </div>
                        <div className="flex items-center justify-start gap-[10px] py-[10px]">
                          <div className="flex flex-col">
                            <span className="text-[14px] font-semibold dark:text-white text-black text-right">
                              {currencyFormat1(
                                getBalanceBySymbol(symbol) * symbol.price * exchangeRate,
                                fiatDecimals,
                                localFiat?.name || 'USD',
                              )}
                            </span>
                            <span className="text-[10px] font-semibold text-gray-400 text-right">
                              {currencyFormat1(getBalanceBySymbol(symbol), cryptoDecimals, '', false)}
                            </span>
                            {symbol.name.toLowerCase() === 'usdt' && (
                              <div className="text-[14px] dark:text-white text-black truncate text-right w-full font-vietnam-bold">
                                <div className="mt-1 flex justify-end text-amber-500">
                                  <span className="w-fit flex items-center text-[10px] text-right justify-end dark:bg-white/20 bg-black/10 px-1 rounded gap-2">
                                    <Lock size={12} variant="Bold" />{' '}
                                    {currencyFormat1(
                                      bonus * exchangeRate,
                                      fiatDecimals,
                                      String(localFiat?.name || 'USD'),
                                    )}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

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
        <div className="text-[14px] dark:text-[#C2C2C2] text-color-light-text-primary">
          {t('deposit:chooseNetwork')}
        </div>
        <Menu
          as="div"
          className="relative flex w-full dark:bg-color-input-primary bg-color-light-input-primary rounded-[3px]"
        >
          <Menu.Button className="flex-1 py-[15px] px-[20px]">
            <div className="flex items-center justify-between w-full" role="button">
              <div className="flex-1 flex items-center justify-start gap-[10px]">
                <div className="flex-1 text-start dark:text-white text-black text-[14px]">{activeNetwork.name}</div>
              </div>
              <div className="flex items-center justify-start gap-[10px]">
                <ChevronDownIcon width={15} className="dark:text-white text-color-light-text-primary" />
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
            <Menu.Items className="absolute dark:bg-color-input-primary bg-[#f6f7fa] w-full origin-top-right right-0 top-[60px] z-[10] cursor-pointer  shadow-bs-default">
              <div className="py-1 max-h-[250px] overflow-y-auto p-2">
                {availableNetworks.map((network, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <div
                        className="flex items-center justify-start py-[10px] px-[10px] w-full dark:hover:bg-color-hover-primary hover:bg-color-light-hover-primary"
                        role="button"
                        onClick={() => onChangeNetwork(network)}
                      >
                        <div className="flex-1 flex items-center justify-start gap-[10px]">
                          {network && (
                            <div className="flex-1 dark:text-white text-color-light-text-primary text-start text-[14px] font-semibold">
                              {network.name}
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
