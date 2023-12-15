import { Menu, Switch, Transition } from '@headlessui/react';
import cn from 'classnames';
import { ArrowDown2 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { CookieKey } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { currencyFormat1, formatLengthNumber } from '@/base/libs/utils';
import { changeActiveFiat, changeViewInFiat } from '@/base/redux/reducers/common.reducer';
import { setLocalFiat } from '@/base/redux/reducers/wallet.reducer';
import { AppState } from '@/base/redux/store';
import { FiatType } from '@/base/types/common';
import { BalanceType, CurrencyType } from '@/base/types/wallet';
import InputSearch from '@/components/input/typing/InputSearch';
import CommonModal from '@/components/modal/commonModal/commonModal';
import ModalFavoriteCoins from '@/components/modal/favoriteCoins/favoriteCoins';
import ModalBonusHistory from '@/components/modal/rakeBack/bonusHistory/bonusHistory';
import ModalRakeBack from '@/components/modal/rakeBack/rakeBack';
import ModalRakeBackDetail from '@/components/modal/rakeBack/rakeBackDetail/rakeBackDetail';

type FiatHeaderProps = {
  inGamePage?: boolean;
  wrapperClass?: string;
  buttonClass?: string;
};

const toFixedValue = 2;

export default function FiatHeader({ inGamePage, wrapperClass, buttonClass }: FiatHeaderProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation('');
  const exchangeRate = useExchange();

  const { localeFiat, viewInFiat, showFullNameCurrency, cryptoSymbols, cryptoBalances, fiatSymbols, localFiat } =
    useSelector(
      (state: AppState) => ({
        localeFiat: state.common.localeFiat,
        // fiatArray: state.common.fiatArray,
        viewInFiat: state.common.viewInFiat,

        showFullNameCurrency: state.auth.user.generalSetting.settingShowFullNameCrypto,
        cryptoSymbols: state.wallet.symbols,
        cryptoBalances: state.wallet.balances,
        fiatSymbols: state.wallet.fiatSymbols,
        localFiat: state.wallet.localFiat,
      }),

      shallowEqual,
    );

  const [searchFiatInput, setSearchFiatInput] = useState<string>('');

  const [activeCoin, setActiveCoin] = useState<CurrencyType>({
    id: '',
    name: '',
    alias: '',
    logo: '',
    iso_currency: '',
    iso_decimals: 0,
    availableNetworks: [],
    type: 'crypto',
    price: 0,
  });

  const [localeCoin, setLocaleCoin] = useState<FiatType>({});
  const [showSmallFiat, setShowSmallFiat] = useState<boolean>(false);
  const [showAllFiat, setShowAllFiat] = useState<boolean>(false);

  const [showFavoriteCoins, setShowFavoriteCoins] = useState<boolean>(false);
  const [showModalRakeBack, setShowModalRakeBack] = useState<boolean>(false);

  const [cryptoLocked, setCryptoLocked] = useState<FiatType>({});

  const [localeModalCoin, setLocaleModalCoin] = useState<CurrencyType>(fiatSymbols?.[0]);
  const [showModalRakeBackDetail, setShowModalRakeBackDetail] = useState<boolean>(false);
  const [showModalBonusHistory, setShowModalBonusHistory] = useState<boolean>(false);

  const filterListFiat = useMemo(() => {
    const arraySearch = fiatSymbols.filter((item: CurrencyType) =>
      item.name.toLowerCase().includes(searchFiatInput.toLowerCase()),
    );

    return showSmallFiat ? [] : arraySearch;
    // return arraySearch?.filter((item) => {
    //   return !searchFiatInput && showSmallFiat ? Number(item.amount) : true;
    // });
  }, [searchFiatInput, fiatSymbols, showSmallFiat]);

  const filterListCrypto = useMemo(() => {
    let arraySearch = cryptoSymbols.filter((item: CurrencyType) =>
      item.name.toLowerCase().includes(searchFiatInput.toLowerCase()),
    );
    if (showSmallFiat) {
      const avaSymbols = cryptoBalances.filter((item: BalanceType) => item.amount > 0).map((item) => item.symbolId);
      arraySearch = [...arraySearch.filter((item) => avaSymbols.indexOf(item.id) != -1)];
    }
    return arraySearch;
  }, [searchFiatInput, cryptoSymbols, cryptoBalances, showSmallFiat]);

  const getBalanceBySymbol = (symbol: CurrencyType) => {
    const tempBalances = [...cryptoBalances];
    const selectedBalance = tempBalances.find((item) => item.symbolId === symbol.id);

    return selectedBalance?.amount || 0;
  };

  const listSuggestCoins = useMemo(() => {
    let commonArray =
      Array.isArray(cryptoSymbols) && Array.isArray(fiatSymbols) ? [...cryptoSymbols, ...fiatSymbols] : [];

    return commonArray.filter((item: CurrencyType) =>
      item.name.toLowerCase().includes(searchFiatInput.toLowerCase().trim()),
    );
  }, [searchFiatInput, cryptoSymbols, fiatSymbols]);

  const handleChangeCoinSuggest = (coin: any) => {
    dispatch(changeActiveFiat(coin));
    setSearchFiatInput('');
    sessionStorage.setItem(CookieKey.activeFiat, JSON.stringify(coin));
    CookiesStorage.setCookieData(CookieKey.activeFiat, String(coin?.currency));
  };

  useEffect(() => {
    if (cryptoSymbols.length > 0) {
      /** SET USDT as a default coin */
      const defaultSymbol = cryptoSymbols.find((item) => item.name.toLowerCase() === 'usdt');
      if (defaultSymbol) {
        setActiveCoin(defaultSymbol);
      }
    }
  }, [cryptoSymbols]);
  return (
    <>
      <Menu
        as="div"
        className="relative w-auto text-left rounded flex dark:text-white h-[36px] sm:h-[44px] text-[#000] dark:bg-[#1D1E22] bg-[#F6F7FA]"
      >
        <Menu.Button>
          {activeCoin.id && (
            <div
              role="button"
              className={cn(
                'flex items-center max-[435px]:max-w-[150px] sm:max-md:max-w-[150px] md:max-w-[200px] gap-2 py-2 px-2 w-full rounded',
                buttonClass,
              )}
            >
              <Image height={20} width={20} src={activeCoin.logo} alt="" />
              {viewInFiat && (
                <div className="sm:text-[14px] text-[12px] truncate w-full font-bold">
                  {localFiat
                    ? `${currencyFormat1(
                        getBalanceBySymbol(activeCoin) * activeCoin.price * exchangeRate,
                        toFixedValue,
                        localFiat.name,
                      )}`
                    : `${formatLengthNumber(Number(getBalanceBySymbol(activeCoin)), toFixedValue)}`}
                </div>
              )}
              {!viewInFiat && (
                <div className="sm:text-[14px] text-[12px] truncate w-full font-bold">
                  {currencyFormat1(getBalanceBySymbol(activeCoin), toFixedValue, '', false)}
                </div>
              )}
              <div className="text-white truncate text-right min-w-[15px]">
                <ArrowDown2 size={15} className="fill-[#abb6c2] dark:fill-none" />
              </div>
            </div>
          )}
        </Menu.Button>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed sm:hidden block inset-0 bg-black/80 transition-opacity z-[1]" />
        </Transition.Child>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={cn(
              'sm:absolute sm:mr-0 mr-[10px] fixed xl:right-[-115px] md:right-[-115px] sm:right-[auto] right-0 z-[50] mt-14 sm:min-w-[420px] min-w-[calc(100vw-20px)] origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none top-0',
              wrapperClass,
            )}
          >
            <div className="py-1 sm:relative fixed rounded-md dark:bg-[#1c1c20] bg-white sm:w-auto w-[calc(100vw-20px)] shadow-gray-900 shadow">
              <div className="py-[10px] px-[10px] flex ">
                <div className="grow">
                  <InputSearch
                    value={searchFiatInput}
                    showClose={searchFiatInput !== '' ? true : false}
                    onClose={() => {
                      setSearchFiatInput('');
                    }}
                    className="dark:text-white !bg-[#f5f6fa] dark:!bg-gray-700/75"
                    onChange={(e) => setSearchFiatInput(e.target.value)}
                  />
                </div>
                {!inGamePage && (
                  <div
                    onClick={() => setShowFavoriteCoins(true)}
                    className="flex flex-col items-center justify-center px-[10px] pb-[2px] dark:text-[#67707B] text-[36px] text-[#9FA5AC] cursor-pointer"
                  >
                    <span className="leading-[0.5]">+</span>
                    <span className="leading-[0.1]">-</span>
                  </div>
                )}
              </div>
              {/* Fiat */}
              {viewInFiat && (
                <div className="py-1 max-h-[40vh] overflow-y-auto p-2 w-full">
                  {!!filterListCrypto?.length && (
                    <div className="text-[14px] text-gray-400 mb-2">{t('deposit:crypto')}</div>
                  )}
                  {filterListCrypto?.map((crypto, index) => {
                    return (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className={cn(
                              active
                                ? 'dark:bg-gray-600 bg-gray-100 dark:text-white text-black'
                                : 'dark:text-white text-black',
                              activeCoin.id === crypto.id && 'border border-solid border-[#f59e0b]',
                              'px-2 py-2 text-sm cursor-pointer flex rounded-md items-center gap-[10px]',
                            )}
                            onClick={() => setActiveCoin(crypto)}
                            // onClick={() => {
                            //   dispatch(changeActiveFiat(crypto));
                            //   sessionStorage.setItem(CookieKey.activeFiat, JSON.stringify(crypto));
                            //   CookiesStorage.setCookieData(CookieKey.activeFiat, String(crypto?.currency));
                            // }}
                          >
                            <Image height={30} width={30} src={crypto.logo} alt="" />
                            <div>
                              <div className="text-[14px] font-vietnam-bold">{crypto.name}</div>
                            </div>
                            <div className="text-[14px] dark:text-white text-black truncate text-right w-full font-bold">
                              {currencyFormat1(
                                getBalanceBySymbol(crypto) * crypto.price * exchangeRate,
                                toFixedValue,
                                localFiat?.name,
                              )}
                              <br />
                              <span className="text-gray-400 text-[12px]">
                                {formatLengthNumber(getBalanceBySymbol(crypto), toFixedValue)}
                              </span>
                              <br />
                              {/* {!crypto?.amountLocked && Number(crypto?.amount) > 0 && (
                                <span className="text-gray-400 text-[12px]">
                                  {formatLengthNumber(crypto?.amount || 0)}
                                </span>
                              )} */}
                              <div className="text-[14px] dark:text-white text-black truncate text-right w-full font-vietnam-bold">
                                {/* {Number(crypto?.amountLocked) > 0 && (
                                  <div className="mt-1 flex justify-end text-amber-500">
                                    <div
                                      onClick={() => {
                                        setCryptoLocked(crypto);
                                        setShowModalRakeBack(true);
                                      }}
                                      className="w-fit flex items-center justify-end dark:bg-white/20 bg-black/10 px-1 rounded gap-2"
                                    >
                                      <Lock size={12} variant="Bold" />{' '}
                                      {currencyFormat1(
                                        exchangeByLocaleFiat(
                                          crypto.name,
                                          String(localeFiat?.currency),
                                          crypto?.amountLocked,
                                        ),
                                        2,
                                        String(localeFiat?.currency),
                                      )}
                                    </div>
                                  </div>
                                )} */}
                              </div>
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    );
                  })}
                  {!!filterListFiat?.length && (
                    <div className="pt-[10px] text-[14px] text-gray-400 mb-2">{t('deposit:fiat')}</div>
                  )}
                  {filterListFiat?.map((fiat, index) => {
                    return (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className={cn(
                              active
                                ? 'dark:bg-gray-600 bg-gray-100 dark:text-white text-black'
                                : 'dark:text-white text-black',
                              activeCoin.id === fiat.id && 'border border-solid border-[#f59e0b]',
                              'px-2 py-2 text-sm cursor-pointer flex rounded-md items-center gap-[10px]',
                            )}
                            onClick={() => {
                              setActiveCoin(fiat);
                              // dispatch(changeActiveFiat(fiat));
                              // sessionStorage.setItem(CookieKey.activeFiat, JSON.stringify(fiat));
                              // CookiesStorage.setCookieData(CookieKey.activeFiat, String(fiat?.currency));
                            }}
                          >
                            <Image height={30} width={30} src={fiat.logo} alt="" />
                            <div className="w-full">
                              <div className="text-[14px] font-vietnam-bold">{fiat.name}</div>
                              {showFullNameCurrency && <div className="text-[12px] text-gray-400">{fiat.alias}</div>}
                            </div>
                            <div className="text-[14px] dark:text-white text-black truncate text-right w-full font-bold">
                              {currencyFormat1(
                                getBalanceBySymbol(fiat) * fiat.price * exchangeRate,
                                toFixedValue,
                                localFiat?.name,
                              )}
                              <br />
                              <span className="text-gray-400 text-[12px]">{formatLengthNumber(0, toFixedValue)}</span>
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    );
                  })}
                  {searchFiatInput && !!listSuggestCoins.length && (
                    <div className="text-[14px] text-gray-400">{t('deposit:otherSupportedCoin')}</div>
                  )}
                  {searchFiatInput &&
                    listSuggestCoins?.map((coin, index) => {
                      return (
                        <Menu.Item key={index}>
                          {({ active }) => (
                            <div
                              className="px-2 py-2 text-sm cursor-pointer flex rounded-md items-center gap-[10px] dark:text-white text-black"
                              // onClick={() => handleChangeCoinSuggest(coin)}
                            >
                              <Image height={30} width={30} src={coin.logo} alt="" />
                              <div className="w-full">
                                <div className="text-[14px] font-bold">{coin.name}</div>
                                {showFullNameCurrency && <div className="text-[12px] text-gray-400">{coin.alias}</div>}
                              </div>
                              <div className="text-[14px] dark:text-white text-black truncate text-right w-full font-bold">
                                {currencyFormat1(
                                  getBalanceBySymbol(coin) * coin.price * exchangeRate,
                                  toFixedValue,
                                  localFiat?.name,
                                )}
                                <br />
                                <span className="text-gray-400 text-[12px]">
                                  {formatLengthNumber(getBalanceBySymbol(coin), toFixedValue)}
                                </span>
                              </div>
                            </div>
                          )}
                        </Menu.Item>
                      );
                    })}
                  {filterListFiat?.length === 0 && filterListCrypto?.length === 0 && listSuggestCoins?.length === 0 && (
                    <>
                      <div className="relative flex items-center justify-center  my-[32px]">
                        <Image src="/img/empty.png" width={200} height={200} alt="" />
                        <p className="absolute dark:text-[#98a7b5] text-[#31373d] text-[12px] sm:text-[14px] bottom-0 text-center">
                          {t('table:noData')}
                        </p>
                      </div>
                      <div className="flex items-center justify-center mt-[60px] mb-[20px]">
                        <div className="w-[80%]">
                          <Link href="/swap" className="hover:text-white">
                            <div className="flex items-center bg-[#FD6E0B] w-full justify-center font-bold h-[40px] sm:h-[3rem] rounded-[4px] cursor-pointer text-[12px] sm:text-[14px]">
                              {t('deposit:swapCoin')}
                            </div>
                          </Link>
                          <p className="text-center dark:text-[#98a7b5] text-[#31373d] text-[12px] sm:text-[14px] mt-[10px]">
                            {t('deposit:swapCoinContent')}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              {!viewInFiat && (
                <div className="py-1 max-h-[40vh] overflow-y-auto p-2 w-full">
                  {!!filterListCrypto?.length && (
                    <div className="text-[14px] text-gray-400 mb-2">{t('deposit:crypto')}</div>
                  )}
                  {filterListCrypto?.map((crypto, index) => {
                    return (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className={cn(
                              active ? 'dark:bg-gray-600 bg-gray-200 text-white' : 'text-gray-400',
                              activeCoin.id === crypto.id && 'border border-solid border-[#f59e0b]',
                              'px-2 py-2 text-sm cursor-pointer flex rounded-md items-center gap-[10px]',
                            )}
                            onClick={() => setActiveCoin(crypto)}
                            // onClick={() => {
                            //   dispatch(changeActiveFiat(crypto));
                            //   sessionStorage.setItem(CookieKey.activeFiat, JSON.stringify(crypto));
                            //   CookiesStorage.setCookieData(CookieKey.activeFiat, String(crypto?.currency));
                            // }}
                          >
                            <Image height={30} width={30} src={crypto.logo} alt="" />
                            <div className="text-[14px] dark:text-white text-black font-vietnam-bold">
                              {crypto.name}
                            </div>
                            <div className="text-[14px] dark:text-white text-black truncate text-right w-full font-vietnam-bold">
                              {formatLengthNumber(getBalanceBySymbol(crypto), toFixedValue)}
                              {/* {Number(crypto?.amountLocked) > 0 && (
                                <div className="mt-1 flex justify-end text-amber-500">
                                  <div
                                    onClick={() => {
                                      setCryptoLocked(crypto);
                                      setShowModalRakeBack(true);
                                    }}
                                    className="w-fit flex items-center justify-end dark:bg-white/20 bg-black/10 px-1 rounded gap-2"
                                  >
                                    <Lock size={12} variant="Bold" /> {formatLengthNumber(crypto?.amountLocked ?? 0)}
                                  </div>
                                </div>
                              )} */}
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    );
                  })}
                  {!!filterListFiat?.length && (
                    <div className="text-[14px] text-gray-400 pt-[10px]">{t('deposit:fiat')}</div>
                  )}
                  {filterListFiat?.map((fiat, index) => {
                    return (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className={cn(
                              active ? 'dark:bg-gray-600 bg-gray-200 text-white' : 'text-gray-400',
                              activeCoin.id === fiat.id && 'border border-solid border-[#f59e0b]',
                              'px-2 py-2 text-sm cursor-pointer flex rounded-md items-center gap-[10px]',
                            )}
                            onClick={() => {
                              setActiveCoin(fiat);
                              // dispatch(changeActiveFiat(fiat));
                              // sessionStorage.setItem(CookieKey.activeFiat, JSON.stringify(fiat));
                              // CookiesStorage.setCookieData(CookieKey.activeFiat, String(fiat?.currency));
                            }}
                          >
                            <Image height={30} width={30} src={fiat.logo} alt="" />
                            <div className="w-full dark:text-white text-black">
                              <div className="text-[14px] font-vietnam-bold">{fiat.name}</div>
                              {showFullNameCurrency && <div className="text-[12px]">{fiat.alias}</div>}
                            </div>
                            <div className="text-[14px] dark:text-white text-black truncate text-right w-full font-vietnam-bold">
                              {formatLengthNumber(0, toFixedValue)}
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    );
                  })}
                  {searchFiatInput && !!listSuggestCoins.length && (
                    <div className="pt-[10px] text-[14px] text-gray-400">{t('deposit:otherSupportedCoin')}</div>
                  )}
                  {searchFiatInput &&
                    listSuggestCoins?.map((coin, index) => {
                      return (
                        <Menu.Item key={index}>
                          {({ active }) => (
                            <div
                              className="px-2 py-2 text-sm cursor-pointer flex rounded-md items-center gap-[10px] dark:text-white text-black"
                              onClick={() => handleChangeCoinSuggest(coin)}
                            >
                              <Image height={30} width={30} src={coin.logo} alt="" />
                              <div className="w-full">
                                <div className="text-[14px] font-bold">{coin.name}</div>
                                {showFullNameCurrency && <div className="text-[12px] text-gray-400">{coin.alias}</div>}
                              </div>
                              <div className="text-[14px] dark:text-white text-black truncate text-right w-full font-bold">
                                {currencyFormat1(
                                  getBalanceBySymbol(coin) * coin.price * exchangeRate,
                                  toFixedValue,
                                  localFiat?.name,
                                )}
                                <br />
                                <span className="text-gray-400 text-[12px]">
                                  {formatLengthNumber(getBalanceBySymbol(coin), toFixedValue)}
                                </span>
                              </div>
                            </div>
                          )}
                        </Menu.Item>
                      );
                    })}
                  {filterListFiat?.length === 0 && filterListCrypto?.length === 0 && listSuggestCoins?.length === 0 && (
                    <div className="relative flex items-center justify-center my-[60px]">
                      <Image src="/img/empty.png" width={200} height={200} alt="" />
                      <p className="absolute text-14 bottom-0 text-center">{t('table:noData')}</p>
                    </div>
                  )}
                </div>
              )}
              {!inGamePage && (
                <div className="py-[20px] px-[10px] flex border-t-[1px] border-[#98a7b566] border-solid items-center justify-between">
                  <div className="flex items-center gap-[5px]">
                    <Switch
                      checked={viewInFiat}
                      onChange={(value) => {
                        dispatch(changeViewInFiat(value));
                        if (value) setShowAllFiat(true);
                      }}
                      className={`${
                        viewInFiat ? 'bg-[#3bc11733]' : 'dark:bg-gray-500 bg-gray-200'
                      } relative inline-flex h-4 w-8 items-center rounded-full`}
                    >
                      <span
                        className={`${
                          viewInFiat ? 'translate-x-4 bg-amber-600' : 'translate-x-1 bg-gray-400'
                        } inline-block h-3 w-3 transform rounded-full transition`}
                      />
                    </Switch>
                    <div className="text-[15px] text-gray-400">{t('fiatHeader:viewInFiat')}</div>
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <Switch
                      checked={showSmallFiat}
                      onChange={setShowSmallFiat}
                      className={`${
                        showSmallFiat ? 'bg-[#3bc11733]' : 'dark:bg-gray-500 bg-gray-200'
                      } relative inline-flex h-4 w-8 items-center rounded-full`}
                    >
                      <span
                        className={`${
                          showSmallFiat ? 'translate-x-4 bg-amber-600' : 'translate-x-1 bg-gray-400'
                        } inline-block h-3 w-3 transform rounded-full transition`}
                      />
                    </Switch>
                    <div className="text-[15px] text-gray-400">{t('fiatHeader:smallFiat')}</div>
                  </div>
                </div>
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <CommonModal
        show={showAllFiat}
        panelClass="sm:max-w-[400px]"
        onClose={() => setShowAllFiat(false)}
        header={
          <div className="relative p-[20px] pb-0">
            <div className="flex items-center dark:text-white gap-[10px]">
              <div className="text-[18px] font-[600]">Information</div>
            </div>
          </div>
        }
      >
        <div className="p-[20px] flex flex-col gap-3 overflow-y-auto">
          <div className="text-[12px] text-gray-500 text-center">
            Please note that these are currency approximations. All bets & transactions will be calculated in equivalent
            currencies. For more details feel free to contact our live support.
          </div>
          <div className={'grid grid-cols-3 gap-y-2 justify-between items-center'}>
            {fiatSymbols?.map((item, key) => (
              <label
                htmlFor={String(key)}
                key={key}
                role="button"
                className={cn(
                  'p-[2px] text-left flex items-center justify-between dark:text-white text-black dark:hover:text-white hover:text-amber-600 w-full text-[14px] max-w-[80px] rounded m-auto',
                )}
                onClick={() => {
                  dispatch(setLocalFiat(item));
                  // handleChangeLocaleFiat(item);
                  // dispatch(changeLocaleFiat(item));
                  // CookiesStorage.setCookieData(CookieKey.localeFiat, String(localeModalCoin?.currency));
                }}
              >
                <div className="flex gap-3 items-center justify-between w-full">
                  <div className="flex items-center gap-1">
                    {item.id === localFiat?.id && (
                      <input
                        id={String(key)}
                        type="radio"
                        checked={true}
                        name="default-radio"
                        className="w-4 h-4 accent-amber-500 bg-gray-100 border-gray-300 ring-none outline-none"
                      />
                    )}
                    {item.id !== localFiat?.id && (
                      <div className="w-4 h-4 border border-solid dark:border-gray-600 border-gray-300 dark:bg-gray-800 bg-gray-200 rounded-full"></div>
                    )}

                    <div className="text-[12px]">{item.name}</div>
                  </div>
                  <Image height={16} width={16} src={item.logo} alt="" />
                </div>
              </label>
            ))}
          </div>
          <div className="m-auto">
            <button
              className="text-white rounded-[5px] bg-primary p-[10px] xl:text-[14px] text-[12px]"
              onClick={() => {
                // dispatch(changeLocaleFiat(localeModalCoin));
                // CookiesStorage.setCookieData(CookieKey.localeFiat, String(localeModalCoin?.currency));
                setShowAllFiat(false);
              }}
            >
              {String(t('withdraw:confirm'))}
            </button>
          </div>
        </div>
      </CommonModal>
      {showFavoriteCoins && (
        <ModalFavoriteCoins
          show={showFavoriteCoins}
          onClose={() => {
            setShowFavoriteCoins(false);
          }}
        />
      )}
      {showModalRakeBack && (
        <ModalRakeBack
          show={showModalRakeBack}
          cryptoLocked={cryptoLocked}
          onClose={() => {
            setShowModalRakeBack(false);
          }}
          setShowModalRakeBackDetail={() => setShowModalRakeBackDetail(true)}
          setShowModalBonusHistory={() => setShowModalBonusHistory(true)}
        />
      )}
      <ModalRakeBackDetail
        show={showModalRakeBackDetail}
        cryptoLocked={cryptoLocked}
        onClose={() => {
          setShowModalRakeBackDetail(false);
        }}
        setShowModalRakeBack={() => setShowModalRakeBack(true)}
      />
      <ModalBonusHistory
        show={showModalBonusHistory}
        cryptoLocked={cryptoLocked}
        onClose={() => {
          setShowModalBonusHistory(false);
        }}
        setShowModalRakeBack={() => setShowModalRakeBack(true)}
      />
    </>
  );
}
