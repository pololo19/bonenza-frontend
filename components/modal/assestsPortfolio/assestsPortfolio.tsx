import { Dialog, DialogProps, Switch, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import Image from 'next/image';
import { ElementType, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { CookieKey } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { currencyFormat, exchangeByLocaleFiat, handleLocaleSymbol } from '@/base/libs/utils';
import { changeLocaleFiat, changeViewInFiat } from '@/base/redux/reducers/common.reducer';
import { AppState } from '@/base/redux/store';
import { DepositAddress } from '@/base/types/common';
import InputSearch from '@/components/input/typing/InputSearch';
import CommonModal from '@/components/modal/commonModal/commonModal';

type ModalAssetsPortfolioProps = {
  onClose: () => void;
  show: boolean;
  cryptoSymbol: string;
  cryptoSymbolFrom?: string;
  onChangeCoin?: (coin: DepositAddress) => void;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalAssetsPortfolio({
  show,
  onClose,
  cryptoSymbol,
  cryptoSymbolFrom,
  onChangeCoin,
}: ModalAssetsPortfolioProps) {
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
  const [searchFiatInput, setSearchFiatInput] = useState<string>('');

  const handleChangeCoin = (coin: DepositAddress) => {
    setActiveCoin(coin);
    onClose();
  };

  const [listCoin, setListCoin] = useState<DepositAddress[]>([]);

  useEffect(() => {
    if (searchFiatInput.trim().length) {
      let newList: any = listCrypto.filter(
        (item) =>
          String(item?.symbol).toLowerCase().includes(searchFiatInput.toLowerCase()) ||
          String(item?.symbol).toLowerCase().includes(searchFiatInput.toLowerCase()),
      );
      setListCoin(newList);
      return;
    }
    setListCoin(listCrypto);
  }, [searchFiatInput, listCrypto]);

  useEffect(() => {
    const active = listCrypto.find((crypto) => crypto?.symbol === cryptoSymbol);
    if (active) setActiveCoin(active);
  }, [cryptoSymbol, listCrypto]);

  useEffect(() => {
    if (activeCoin) onChangeCoin?.(activeCoin);
  }, [activeCoin]);

  const [showSmallFiat, setShowSmallFiat] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [showAllFiat, setShowAllFiat] = useState<boolean>(false);

  const { localeFiat, fiatArray, cryptoArray, viewInFiat } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
      activeFiat: state.common.activeFiat,
      fiatArray: state.common.fiatArray,
      cryptoArray: state.common.cryptoArray,
      depositCryptoArray: state.common.depositCryptoArray,
      usdtNetwork: state.common.usdtNetwork,
      viewInFiat: state.common.viewInFiat,
      userId: state.auth.userId,
    }),
    shallowEqual,
  );

  const handleChangeLocaleFiat = (item: any) => {
    try {
      dispatch(changeLocaleFiat(item));
      CookiesStorage.setCookieData(CookieKey.localeFiat, String(item?.currency));
    } catch (error) {}
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
                <Dialog.Panel className="dark:text-white text-black max-w-[464px] flex flex-col relative transform rounded-[15px] dark:bg-gray-800 bg-[#fff] text-left shadow-xl transition-all my-8 w-full max-w-[799px] pb-[30px] overflow-y-auto max-h-[80vh]">
                  <Dialog.Title
                    as="div"
                    className="relative dark:bg-[#17181b] bg-[#f5f6fa] mb-2 px-[1rem] sm:px-[30px] py-[10px] flex justify-between items-center"
                  >
                    <div className="text-[0.875rem] sm:text-[1rem] dark:text-white text-black font-[600]">
                      {t('deposit:assetsPortfolio')}
                    </div>
                    <div className="flex gap-1 items-center">
                      <div className="w-[7.5rem] sm:w-[9.375rem]">
                        <InputSearch
                          value={searchFiatInput}
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
                  <div className="flex-1 flex-col flex gap-[10px] justify-between mt-[1rem] mx-[20px]">
                    <div className="flex">
                      <div className="dark:bg-[#2D3035] bg-white cursor-pointer px-2 dark:text-white text-black font-bold h-[2.5rem] flex items-center justify-center rounded text-[0.875rem] grow">
                        Currency
                      </div>
                      <div className="dark:bg-[#374151BF] bg-[#f0f1f5] cursor-not-allowed px-2 dark:text-white text-[#31373d] font-bold h-[2.5rem] flex items-center justify-center rounded text-[0.875rem] grow">
                        mNFT
                      </div>
                    </div>
                    {viewInFiat &&
                      listCoin?.map((coin: any, index) => (
                        <div
                          key={index}
                          className={cn('flex items-center justify-start p-[10px] w-full rounded-lg', {
                            'border border-solid border-amber-500': coin?.symbol === activeCoin?.symbol,
                            'dark:hover:bg-[#161D26] hover:bg-[#f5f6fa]': coin?.symbol !== activeCoin?.symbol,
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
                              <span className="ml-[5px] text-[10px] dark:text-gray-400 text-[#31373d]">
                                {coin?.symbol == 'USDT' ? coin?.network : ''}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                            {currencyFormat(
                              exchangeByLocaleFiat(coin?.symbol, String(localeFiat?.currency), coin?.balance),
                              2,
                            )}
                            <br />
                            <span className="dark:text-gray-400 text-[#31373d] text-[12px]">
                              {currencyFormat(coin?.balance || 0, 8)}
                            </span>
                            {/* <span className="text-[16px] dark:text-white text-black">{currencyFormat(Number(coin?.balance || 0))}</span> */}
                          </div>
                        </div>
                      ))}
                    <div className="py-[10px] px-[10px] flex items-center justify-between">
                      <div className="flex items-center gap-[5px]">
                        <Switch
                          checked={viewInFiat}
                          onChange={(value: any) => {
                            dispatch(changeViewInFiat(value));
                            if (value) setShowAllFiat(true);
                          }}
                          className={`${
                            viewInFiat ? 'bg-[#3bc11733]' : 'bg-gray-500'
                          } relative inline-flex h-4 w-8 items-center rounded-full`}
                        >
                          <span
                            className={`${
                              viewInFiat ? 'translate-x-4 bg-amber-600' : 'translate-x-1 bg-gray-400'
                            } inline-block h-3 w-3 transform rounded-full transition`}
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
                            showSmallFiat ? 'bg-[#3bc11733]' : 'bg-gray-500'
                          } relative inline-flex h-4 w-8 items-center rounded-full`}
                        >
                          <span
                            className={`${
                              showSmallFiat ? 'translate-x-4 bg-amber-600' : 'translate-x-1 bg-gray-400'
                            } inline-block h-3 w-3 transform rounded-full transition`}
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
      <CommonModal
        show={showAllFiat}
        panelClass="sm:max-w-[400px]"
        onClose={() => setShowAllFiat(false)}
        header={
          <div className="relative p-[20px] pb-0">
            <div className="flex items-center dark:text-white text-black gap-[10px]">
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
            {fiatArray?.map((item, key) => (
              <label
                htmlFor={String(key)}
                key={key}
                role="button"
                className={cn(
                  'p-[2px] rounded-md text-left flex items-center justify-between hover:text-white w-full text-[14px] max-w-[80px] rounded m-auto',
                )}
                onClick={() => {
                  handleChangeLocaleFiat(item);
                }}
              >
                <div className="flex gap-3 items-center justify-between w-full">
                  <div className="flex items-center gap-1">
                    {item.currency === localeFiat?.currency && (
                      <input
                        id={String(key)}
                        type="radio"
                        checked={true}
                        name="default-radio"
                        className="w-4 h-4 accent-amber-500 bg-gray-100 border-gray-300 ring-none outline-none"
                      />
                    )}
                    {item.currency !== localeFiat?.currency && (
                      <div className="w-4 h-4 border border-solid border-gray-600 bg-gray-800 rounded-full"></div>
                    )}

                    <div className="text-[12px]">{item.currency}</div>
                  </div>
                  <Image height={16} width={16} src={`/img/fiats/${item.currency}.png`} alt="" />
                </div>
              </label>
            ))}
          </div>
          <div className="m-auto">
            <button
              className="text-white rounded-[5px] bg-primary p-[10px] xl:text-[14px] text-[12px]"
              onClick={() => setShowAllFiat(false)}
            >
              {String(t('withdraw:confirm'))}
            </button>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
