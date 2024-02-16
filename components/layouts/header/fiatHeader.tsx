import { Menu, Switch, Transition } from '@headlessui/react';
import cn from 'classnames';
import { ArrowDown2, Lock } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { CookieKey } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { currencyFormat1 } from '@/base/libs/utils';
import { updateSetting } from '@/base/redux/reducers/auth.reducer';
import { changeActiveFiat, changeViewInFiat } from '@/base/redux/reducers/common.reducer';
import { changeIsShowRakeBack } from '@/base/redux/reducers/modal.reducer';
import { setActiveCurrency, setLocalFiat } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { FiatType } from '@/base/types/common';
import { BalanceType, CurrencyType } from '@/base/types/wallet';
import InputSearch from '@/components/input/typing/InputSearch';
import ModalFavoriteCoins from '@/components/modal/favoriteCoins/favoriteCoins';
import ModalBonusHistory from '@/components/modal/rakeBack/bonusHistory/bonusHistory';
import ModalRakeBack from '@/components/modal/rakeBack/rakeBack';
import ModalRakeBackDetail from '@/components/modal/rakeBack/rakeBackDetail/rakeBackDetail';
import ViewInFiatModal from '@/components/modal/viewInFiat/viewInFiat';

type FiatHeaderProps = {
  inGamePage?: boolean;
  wrapperClass?: string;
  buttonClass?: string;
};

const fiatDecimals = 2;
const cryptoDecimals = 4;

export default function FiatHeader({ inGamePage, wrapperClass, buttonClass }: FiatHeaderProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('');
  const exchangeRate = useExchange();
  const { theme } = useTheme();

  const {
    viewInFiat,
    showFullNameCurrency,
    cryptoSymbols,
    cryptoBalances,
    fiatSymbols,
    localFiat,
    bonus,
    settings,
    activeCurrency,
    lockedAmount,
  } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
      // fiatArray: state.common.fiatArray,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      settings: state.auth.user.generalSetting,

      activeCurrency: state.wallet.activeCurrency,
      showFullNameCurrency: state.auth.user.generalSetting.settingShowFullNameCrypto,
      cryptoSymbols: state.wallet.symbols,
      cryptoBalances: state.wallet.balances,
      fiatSymbols: state.wallet.fiatSymbols,
      localFiat: state.wallet.localFiat,
      bonus: state.wallet.bonusBalance,
      lockedAmount: state.wallet.lockedAmount,
    }),

    shallowEqual,
  );

  const [searchFiatInput, setSearchFiatInput] = useState<string>('');

  const [showSmallFiat, setShowSmallFiat] = useState<boolean>(false);
  const [showAllFiat, setShowAllFiat] = useState<boolean>(false);

  const [showFavoriteCoins, setShowFavoriteCoins] = useState<boolean>(false);
  const [showModalRakeBack, setShowModalRakeBack] = useState<boolean>(false);

  const [showModalRakeBackDetail, setShowModalRakeBackDetail] = useState<boolean>(false);
  const [showModalBonusHistory, setShowModalBonusHistory] = useState<boolean>(false);

  const filterListFiat = useMemo(() => {
    const arraySearch = fiatSymbols.filter(
      (item: CurrencyType) => item.name.toLowerCase().includes(searchFiatInput.toLowerCase()) && item.favorite,
    );

    return showSmallFiat ? [] : arraySearch;
    // return arraySearch?.filter((item) => {
    //   return !searchFiatInput && showSmallFiat ? Number(item.amount) : true;
    // });
  }, [searchFiatInput, fiatSymbols, showSmallFiat]);

  const filterListCrypto = useMemo(() => {
    let arraySearch = cryptoSymbols.filter(
      (item: CurrencyType) =>
        item.name.toLowerCase().includes(searchFiatInput.toLowerCase()) &&
        (item.favorite || (cryptoBalances.find((bal) => bal.symbolId === item.id)?.amount ?? 0) > 0),
    );
    if (showSmallFiat) {
      const avaSymbols = cryptoBalances.filter((item: BalanceType) => item.amount > 0).map((item) => item.symbolId);
      arraySearch = [...arraySearch.filter((item) => avaSymbols.indexOf(item.id) != -1)];
    }
    return arraySearch;
  }, [searchFiatInput, cryptoSymbols, cryptoBalances, showSmallFiat]);

  const usdFiat = useMemo(() => {
    const usd = fiatSymbols.find((item) => item.name.toLowerCase() === 'usd');
    if (usd) return usd;
    return null;
  }, [fiatSymbols]);

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
        dispatch(setActiveCurrency(defaultSymbol));
      }
    }
  }, [cryptoSymbols]);

  return (
    <>
      <Menu
        as="div"
        className="relative w-auto text-left rounded flex dark:text-white h-full text-[#000] dark:bg-color-modal-bg-primary bg-color-light-bg-primary"
      >
        <Menu.Button>
          {activeCurrency.id && (
            <div
              role="button"
              className={cn(
                'flex items-center max-[435px]:max-w-[150px] sm:max-md:max-w-[150px] md:max-w-[200px] gap-2 py-2 px-2 w-full rounded',
                buttonClass,
              )}
            >
              <Image
                height={20}
                width={20}
                src={activeCurrency.logo}
                alt=""
                onError={(e) => {
                  e.currentTarget.src = '/img/fiats/USD.png';
                }}
              />
              {viewInFiat && (
                <div className="text-default truncate w-full font-bold">
                  {viewInFiat
                    ? `${currencyFormat1(
                        getBalanceBySymbol(activeCurrency) * activeCurrency.price * exchangeRate,
                        fiatDecimals,
                        localFiat?.name || 'USD',
                      )}`
                    : `${currencyFormat1(Number(getBalanceBySymbol(activeCurrency)), cryptoDecimals, '', false)}`}
                </div>
              )}
              {!viewInFiat && (
                <div className="text-default truncate w-full font-bold">
                  {currencyFormat1(getBalanceBySymbol(activeCurrency), cryptoDecimals, '', false)}
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
          <div className="fixed hidden inset-0 bg-black/80 transition-opacity z-[1]" />
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
              'sm:absolute sm:mr-0 mr-[10px] fixed sm:right-0 sm:left-auto left-0 z-[50] mt-[57px] sm:min-w-[470px] min-w-[calc(100vw-20px)] origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none top-0',
              wrapperClass,
            )}
          >
            <div className="sm:py-1 sm:relative fixed flex flex-col gap-[20px] sm:right-0 sm:left-auto left-0 rounded-default dark:bg-color-menu-primary bg-white sm:w-auto w-[100vw] dark:shadow-gray-900 shadow-gray-200 shadow">
              <div className="flex px-[20px] mt-[20px]">
                <div className="grow">
                  <InputSearch
                    value={searchFiatInput}
                    showClose={searchFiatInput !== '' ? true : false}
                    onClose={() => {
                      setSearchFiatInput('');
                    }}
                    className="dark:text-white !bg-color-light-bg-primary dark:!bg-color-panel-bg-primary min-h-[40px] border border-solid border-transparent focus-within:border-color-primary"
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

              <div className="flex w-full px-[20px] ">
                <div className="flex w-full p-[5px] dark:bg-color-header-secondary bg-color-light-header-secondary rounded-[3px]">
                  <div
                    role="button"
                    className="flex w-full py-[10px] dark:text-white text-color-light-text-primary font-bold text-center justify-center rounded-[3px] dark:bg-color-panel-bg-primary bg-white"
                  >
                    Currency
                  </div>
                  <div
                    role="button"
                    className="flex w-full py-[10px] text-color-text-primary text-center justify-center"
                  >
                    mNFT
                  </div>
                </div>
              </div>
              {/* Fiat */}
              <div className="sm:max-h-[40vh] max-h-[calc(100vh_-_366px)] overflow-y-auto px-[20px] w-full">
                {!!filterListCrypto?.length && (
                  <div className="text-default text-gray-400 mb-2 ml-4">{t('deposit:crypto')}</div>
                )}
                {filterListCrypto?.map((crypto, index) => {
                  return (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <div
                          className={cn(
                            'mb-[5px]',
                            active
                              ? 'dark:bg-color-hover-primary bg-gray-100 dark:text-white text-black mb-1'
                              : 'dark:text-white text-black  mb-1',
                            activeCurrency.id === crypto.id && 'border border-solid border-color-primary',
                            'sm:px-[20px] sm:py-[10px] px-[10px] py-[5px] text-sm cursor-pointer flex rounded-md items-center gap-[10px]',
                          )}
                          onClick={() => dispatch(setActiveCurrency(crypto))}
                        >
                          <Image
                            height={30}
                            width={30}
                            src={crypto.logo}
                            alt=""
                            onError={(e) => {
                              e.currentTarget.src = '/img/fiats/USD.png';
                            }}
                          />
                          <div>
                            <div className="text-default font-vietnam-bold">{crypto.name}</div>
                          </div>
                          <div className="text-default dark:text-white text-black truncate text-right w-full font-bold">
                            {viewInFiat &&
                              currencyFormat1(
                                getBalanceBySymbol(crypto) * crypto.price * exchangeRate,
                                fiatDecimals,
                                localFiat?.name || 'USD',
                              )}
                            {!viewInFiat && currencyFormat1(getBalanceBySymbol(crypto), cryptoDecimals, '', false)}
                            {viewInFiat && (
                              <>
                                <br />
                                <span className="text-gray-400 text-[12px]">
                                  {currencyFormat1(getBalanceBySymbol(crypto), cryptoDecimals, '', false)}
                                </span>
                                <br />
                              </>
                            )}
                            <div className="text-default dark:text-white text-black truncate text-right w-full font-vietnam-bold">
                              {crypto.name.toLowerCase() === 'usdt' && (
                                <div className="mt-1 flex justify-end text-color-secondary">
                                  <div
                                    className="w-fit flex items-center justify-end dark:bg-white/20 bg-black/10 px-1 rounded gap-2"
                                    onClick={() => dispatch(changeIsShowRakeBack(true))}
                                  >
                                    <Lock size={12} variant="Bold" /> {currencyFormat1(lockedAmount, 2, '', false)}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  );
                })}
                {!!filterListFiat?.length && (
                  <div className="pt-[10px] text-default text-gray-400 mb-2 ml-4">{t('deposit:fiat')}</div>
                )}
                {filterListFiat?.map((fiat, index) => {
                  return (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <div
                          className={cn(
                            active
                              ? 'dark:bg-color-hover-primary bg-gray-100 dark:text-white text-black mb-1'
                              : 'dark:text-white text-black mb-1',
                            activeCurrency.id === fiat.id && 'border border-solid border-color-secondary',
                            'sm:px-[20px] sm:py-[10px] px-[10px] py-[5px] text-sm cursor-pointer flex rounded-md items-center gap-[10px]',
                          )}
                          onClick={() => {
                            dispatch(setActiveCurrency(fiat));
                          }}
                        >
                          <Image
                            height={30}
                            width={30}
                            src={fiat.logo}
                            alt=""
                            onError={(e) => {
                              e.currentTarget.src = '/img/fiats/USD.png';
                            }}
                          />
                          <div className="w-full">
                            <div className="text-default font-vietnam-bold">{fiat.name}</div>
                            {showFullNameCurrency && <div className="text-[12px] text-gray-400">{fiat.alias}</div>}
                          </div>
                          <div className="text-default dark:text-white text-black truncate text-right w-full font-bold">
                            {viewInFiat ? (
                              <>
                                {currencyFormat1(
                                  getBalanceBySymbol(fiat) * fiat.price * exchangeRate,
                                  fiatDecimals,
                                  localFiat?.name,
                                )}
                                <br />
                                <span className="text-gray-400 text-[12px]">
                                  {currencyFormat1(getBalanceBySymbol(fiat) * fiat.price, fiatDecimals, '', false)}
                                </span>
                              </>
                            ) : (
                              <>{currencyFormat1(getBalanceBySymbol(fiat) * fiat.price, fiatDecimals, '', false)}</>
                            )}
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  );
                })}
                {searchFiatInput && !!listSuggestCoins.length && (
                  <div className="text-default text-gray-400">{t('deposit:otherSupportedCoin')}</div>
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
                            <Image
                              height={30}
                              width={30}
                              src={coin.logo}
                              alt=""
                              onError={(e) => {
                                e.currentTarget.src = '/img/fiats/USD.png';
                              }}
                            />
                            <div className="w-full">
                              <div className="text-default font-bold">{coin.name}</div>
                              {showFullNameCurrency && <div className="text-[12px] text-gray-400">{coin.alias}</div>}
                            </div>
                            <div className="text-default dark:text-white text-black truncate text-right w-full font-bold">
                              {viewInFiat && (
                                <>
                                  {currencyFormat1(
                                    getBalanceBySymbol(coin) * coin.price * exchangeRate,
                                    fiatDecimals,
                                    localFiat?.name,
                                  )}
                                  <br />
                                </>
                              )}
                              <span className="text-gray-400 text-[12px]">
                                {currencyFormat1(getBalanceBySymbol(coin), cryptoDecimals, '', false)}
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
                      <Image
                        src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
                        width={200}
                        height={200}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.src = '/img/fiats/USD.png';
                        }}
                      />
                      <p className="absolute dark:text-color-text-primary text-color-light-text-primary text-[12px] sm:text-default bottom-0 text-center">
                        {t('table:noData')}
                      </p>
                    </div>
                    <div className="flex items-center justify-center mt-[60px] mb-[20px]">
                      <div className="w-full">
                        <Link href="/swap" className="hover:text-white">
                          <div className="flex text-white items-center bg-color-primary w-full justify-center font-bold h-[40px] sm:h-[3rem] rounded-[4px] cursor-pointer text-[12px] sm:text-default">
                            {t('deposit:swapCoin')}
                          </div>
                        </Link>
                        <p className="text-center dark:text-color-text-primary text-color-light-text-primary text-[12px] sm:text-default mt-[10px]">
                          {t('deposit:swapCoinContent')}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!inGamePage && (
                <div className="py-[20px] px-[10px] flex border-t-[1px] border-[#98a7b566] border-solid items-center justify-between">
                  <div className="flex items-center gap-[5px]">
                    <Switch
                      checked={viewInFiat}
                      onChange={(value) => {
                        if (!value) {
                          if (usdFiat) {
                            dispatch(
                              updateSetting({ ...settings, settingViewInFiat: value, settingCurrency: usdFiat.id }),
                            );
                          }
                        } else {
                          dispatch(updateSetting({ ...settings, settingViewInFiat: value }));
                        }
                        if (value) setShowAllFiat(true);
                      }}
                      className={`${
                        viewInFiat ? 'bg-[#3bc11733]' : 'dark:bg-color-toggle-primary bg-gray-200'
                      } relative inline-flex h-[24px] w-[44px] items-center rounded-full`}
                    >
                      <span
                        className={`${
                          viewInFiat ? 'translate-x-[20px] bg-color-primary' : 'translate-x-1 bg-gray-400'
                        } inline-block h-[18px] w-[18px] transform rounded-full transition`}
                      />
                    </Switch>
                    <div className="text-[15px] dark:text-white text-black">{t('fiatHeader:viewInFiat')}</div>
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <Switch
                      checked={showSmallFiat}
                      onChange={setShowSmallFiat}
                      className={`${
                        showSmallFiat ? 'bg-[#3bc11733]' : 'dark:bg-color-toggle-primary bg-gray-200'
                      } relative inline-flex h-[24px] w-[44px] items-center rounded-full`}
                    >
                      <span
                        className={`${
                          showSmallFiat ? 'translate-x-[20px] bg-color-primary' : 'translate-x-1 bg-gray-400'
                        } inline-block h-[18px] w-[18px] transform rounded-full transition`}
                      />
                    </Switch>
                    <div className="text-[15px] dark:text-white text-black">{t('fiatHeader:smallFiat')}</div>
                  </div>
                </div>
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <ViewInFiatModal show={showAllFiat} onClose={() => setShowAllFiat(false)} />
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
          onClose={() => {
            setShowModalRakeBack(false);
          }}
          setShowModalRakeBackDetail={() => setShowModalRakeBackDetail(true)}
          setShowModalBonusHistory={() => setShowModalBonusHistory(true)}
        />
      )}
      <ModalRakeBackDetail
        show={showModalRakeBackDetail}
        onClose={() => {
          setShowModalRakeBackDetail(false);
        }}
        setShowModalRakeBack={() => setShowModalRakeBack(true)}
      />
      {showModalBonusHistory && (
        <ModalBonusHistory
          show={showModalBonusHistory}
          onClose={() => {
            setShowModalBonusHistory(false);
          }}
          setShowModalRakeBack={() => setShowModalRakeBack(true)}
        />
      )}
    </>
  );
}
