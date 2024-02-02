import { Dialog, DialogProps, Switch, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import Image from 'next/image';
import { ElementType, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { updateSetting } from '@/base/redux/reducers/auth.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { BalanceType, CurrencyType } from '@/base/types/wallet';
import InputSearch from '@/components/input/typing/InputSearch';

import ViewInFiat from '../viewInFiat/viewInFiat';

type ModalAssetsPortfolioProps = {
  onClose: () => void;
  show: boolean;
  cryptoSymbol: string;
  cryptoSymbols: CurrencyType[];
  onChangeCoin?: (coin: CurrencyType) => void;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

const fiatDecimals = 2;
const cryptoDecimals = 4;

export default function ModalAssetsPortfolio({
  show,
  onClose,
  cryptoSymbol,
  cryptoSymbols,
  onChangeCoin,
}: ModalAssetsPortfolioProps) {
  const exchangeRate = useExchange();
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();

  const { balances, localFiat, viewInFiat, settings } = useSelector(
    (state: AppState) => ({
      cryptoSymbols: state.wallet.symbols,
      balances: state.wallet.balances,
      localFiat: state.wallet.localFiat,
      fiatSymbols: state.wallet.fiatSymbols,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      settings: state.auth.user.generalSetting,
    }),
    shallowEqual,
  );

  const [activeCoin, setActiveCoin] = useState<CurrencyType>();
  const [searchFiatInput, setSearchFiatInput] = useState<string>('');
  const [showSmallFiat, setShowSmallFiat] = useState<boolean>(false);
  const [showAllFiat, setShowAllFiat] = useState<boolean>(false);
  const [tab, setTab] = useState<number>(0);

  const handleChangeCoin = (coin: CurrencyType) => {
    setActiveCoin(coin);
    if (onChangeCoin) {
      onChangeCoin(coin);
    }
    onClose();
  };

  const filterListCryptos = useMemo(() => {
    let arraySearch = [...cryptoSymbols].filter((item) =>
      item.name.toLowerCase().includes(searchFiatInput.trim().toLowerCase()),
    );
    if (showSmallFiat) {
      const avaSymbols = balances.filter((item: BalanceType) => item.amount > 0).map((item) => item.symbolId);
      arraySearch = [...arraySearch.filter((item) => avaSymbols.indexOf(item.id) != -1)];
    }
    return arraySearch;
  }, [cryptoSymbols, searchFiatInput, showSmallFiat, balances]);

  useEffect(() => {
    const active = filterListCryptos.find((crypto) => crypto.id === cryptoSymbol);
    if (active) {
      setActiveCoin(active);
    }
  }, [cryptoSymbol, filterListCryptos]);

  const getBalanceByCrypto = (crypto: CurrencyType) => {
    const tempBalances = [...balances];
    const selectedBalance = tempBalances.find((item) => item.symbolId === crypto.id);
    if (selectedBalance) return selectedBalance.amount;
    return 0;
  };

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
            <div className="fixed inset-0 bg-[#000000aa] transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10">
            <div className="flex min-h-full items-center justify-center p-4 text-center p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95"
              >
                <Dialog.Panel className="dark:text-white text-black sm:max-w-[500px] max-w-full flex flex-col relative transform rounded-[3px] dark:!bg-color-modal-bg-primary bg-[#fff] text-left shadow-xl transition-all my-8 w-full pb-[30px] overflow-y-auto max-h-[80vh]">
                  <Dialog.Title
                    as="div"
                    className="relative px-[1rem] sm:px-[30px] py-[20px] flex justify-between items-center"
                  >
                    <div className="text-[0.875rem] sm:text-[1rem] dark:text-white text-black font-[600]">
                      {t('deposit:assetsPortfolio')}
                    </div>
                    <div className="flex gap-1 items-center">
                      <div className="w-[7.5rem] sm:w-[9.375rem]">
                        <InputSearch
                          value={searchFiatInput}
                          className="border border-solid border-transparent focus-within:border-color-primary dark:!bg-color-panel-bg-primary !bg-color-light-bg-primary"
                          showClose={searchFiatInput !== '' ? true : false}
                          onClose={() => {
                            setSearchFiatInput('');
                          }}
                          onChange={(e) => setSearchFiatInput(e.target.value)}
                        />
                      </div>
                      <div className="group rounded-md p-1" role="button" onClick={onClose}>
                        <XMarkIcon
                          width={15}
                          className="dark:text-[#9FA5AC] text-[#31373d] dark:group-hover:text-white group-hover:text-black w-[1.5rem] h-[1.5rem]"
                        />
                      </div>
                    </div>
                  </Dialog.Title>
                  <div className="flex-1 flex-col flex gap-[10px] justify-between mx-[20px]">
                    <div className="flex p-[5px] dark:bg-color-header-secondary">
                      <div
                        className={cn(
                          ' cursor-pointer px-2 font-bold h-[2.5rem] flex items-center justify-center text-[0.875rem] grow rounded-[5px]',
                          {
                            'dark:bg-color-panel-bg-primary text-black bg-color-light-active-primary font-bold dark:text-white':
                              tab === 0,
                            'dark:bg-color-header-secondary bg-white dark:text-white text-black': tab === 1,
                          },
                        )}
                      >
                        Currency
                      </div>
                      <div className="dark:bg-color-header-secondary bg-[#f0f1f5] cursor-not-allowed px-2 dark:text-white text-[#31373d] font-bold h-[2.5rem] flex items-center justify-center text-[0.875rem] grow">
                        mNFT
                      </div>
                    </div>
                    {filterListCryptos?.map((coin: CurrencyType, index) => (
                      <div
                        key={index}
                        className={cn('flex items-center justify-start p-[10px] w-full rounded-[3px]', {
                          'border border-solid border-color-primary': coin.id === activeCoin?.id,
                          'dark:hover:bg-color-hover-primary hover:bg-[#f5f6fa]': coin?.id !== activeCoin?.id,
                        })}
                        role="button"
                        onClick={() => handleChangeCoin(coin)}
                      >
                        <div className="flex-1 flex items-center justify-start gap-[10px]">
                          <Image
                            width={30}
                            height={30}
                            src={coin.logo}
                            className="inline"
                            alt=""
                            onError={(e) => {
                              e.currentTarget.src = '/img/fiats/USD.png';
                            }}
                          />
                          <div className="flex-1 text-start text-[14px]">
                            {coin.name}
                            {/* <span className="ml-[5px] text-[10px] dark:text-gray-400 text-[#31373d]">
                                {coin.symbol == 'USDT' ? coin?.network : ''}
                              </span> */}
                          </div>
                        </div>
                        <div className="text-right">
                          {viewInFiat && (
                            <>
                              {currencyFormat1(
                                getBalanceByCrypto(coin) * coin.price * exchangeRate,
                                fiatDecimals,
                                localFiat?.name || 'USD',
                              )}
                              <br />
                              <span className="dark:text-gray-400 text-[#31373d] text-[12px]">
                                {currencyFormat1(getBalanceByCrypto(coin), cryptoDecimals, '', false)}
                              </span>
                            </>
                          )}
                          {!viewInFiat && <>{currencyFormat1(getBalanceByCrypto(coin), cryptoDecimals, '', false)}</>}
                        </div>
                      </div>
                    ))}
                    <div className="py-[10px] px-[10px] flex items-center justify-between">
                      <div className="flex items-center gap-[5px]">
                        <Switch
                          checked={viewInFiat}
                          onChange={(value: any) => {
                            dispatch(updateSetting({ ...settings, settingViewInFiat: value }));
                            if (value) setShowAllFiat(true);
                          }}
                          className={`${
                            viewInFiat ? 'bg-[#3bc11733]' : 'dark:bg-color-toggle-primary bg-gray-200'
                          } relative inline-flex h-4 w-8 items-center rounded-full`}
                        >
                          <span
                            className={`${
                              viewInFiat ? 'translate-x-[15px] bg-color-primary' : 'translate-x-0 bg-gray-400'
                            } inline-block h-4 w-4 transform rounded-full transition`}
                          />
                        </Switch>
                        <div className="text-[12px] dark:text-gray-400 text-[#31373d]">
                          {t('fiatHeader:viewInFiat')}
                        </div>
                      </div>
                      <div className="flex items-center gap-[5px]">
                        <Switch
                          checked={showSmallFiat}
                          onChange={setShowSmallFiat}
                          className={`${
                            showSmallFiat ? 'bg-[#3bc11733]' : 'dark:bg-color-toggle-primary bg-gray-200'
                          } relative inline-flex h-4 w-8 items-center rounded-full`}
                        >
                          <span
                            className={`${
                              showSmallFiat ? 'translate-x-[15px] bg-color-primary' : 'translate-x-0 bg-gray-400'
                            } inline-block h-4 w-4 transform rounded-full transition`}
                          />
                        </Switch>
                        <div className="text-[12px] dark:text-gray-400 text-[#31373d]">{t('fiatHeader:smallFiat')}</div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <ViewInFiat show={showAllFiat} onClose={() => setShowAllFiat(false)} />
    </>
  );
}
