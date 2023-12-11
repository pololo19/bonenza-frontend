import { Dialog, DialogProps, Switch, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowDown, ArrowUp } from 'iconsax-react';
import Image from 'next/image';
import { ElementType, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { changeCryptoArray, changeFiatArray } from '@/base/redux/reducers/common.reducer';
import { AppState } from '@/base/redux/store';
import { FiatType } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import InputSearch from '@/components/input/typing/InputSearch';

type ModalFiatTypesProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalFiatTypes({ show, onClose }: ModalFiatTypesProps) {
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const { fiatArray, cryptoArray, usdtNetwork } = useSelector(
    (state: AppState) => ({
      fiatArray: state.common.fiatArray || [],
      cryptoArray: state.common.cryptoArray || [],
      usdtNetwork: state.common.usdtNetwork,
    }),
    shallowEqual,
  );

  const [searchInput, setSearchInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReverse, setIsReverse] = useState<boolean>(false);
  const [openTab, setOpenTab] = useState<number>(1);
  const [limit] = useState<number>(100);
  const [listCrypto, setListCrypto] = useState<FiatType[]>([]);
  const [listFiat, setListFiat] = useState<FiatType[]>([]);
  const [listFavorite, setListFavorite] = useState<FiatType[]>([]);

  const listCoinCrypto = useMemo(() => {
    return listCrypto
      ?.filter(
        (coin: FiatType) =>
          coin?.currencyAlias?.toLowerCase()?.includes(searchInput.toLowerCase().trim()) ||
          String(coin?.currency).toLowerCase().includes(searchInput.toLowerCase()),
      )
      ?.filter((item) => item.currency !== 'USDT' || (item.currency === 'USDT' && item.currencyAlias === usdtNetwork));
  }, [searchInput, listCrypto, isReverse]);

  const listCoinFiat = useMemo(() => {
    return listFiat?.filter(
      (coin: FiatType) =>
        coin?.currencyAlias?.toLowerCase()?.includes(searchInput.toLowerCase().trim()) ||
        String(coin?.currency).toLowerCase().includes(searchInput.toLowerCase().trim()),
    );
  }, [searchInput, listFiat, isReverse]);

  const listCoinFavorite = useMemo(() => {
    return listFavorite
      ?.filter(
        (coin: FiatType) =>
          (coin?.currencyAlias?.toLowerCase()?.includes(searchInput.toLowerCase().trim()) ||
            String(coin?.currency).toLowerCase().includes(searchInput.toLowerCase().trim())) &&
          !!Number(coin.isFavorite),
      )
      ?.filter(
        (item: FiatType) =>
          item.currency !== 'USDT' || (item.currency === 'USDT' && item.currencyAlias === usdtNetwork),
      );
  }, [searchInput, listFavorite, isReverse]);

  const handleFavoriteCoin = async (listCoin: FiatType[], coinChange: FiatType) => {
    setIsLoading(true);
    handleToggleLikeCoin(listCoin, coinChange);
    let key = openTab === 1 ? 'cryptoCurrency' : 'fiatCurrency';
    let param = {
      [key]: coinChange.currency,
      network: coinChange.currencyAlias,
    };

    try {
      await api.post('currency/liked', param);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLikeCoin = (listCoin: FiatType[], coinChange: FiatType) => {
    const indexCoin = listCoin.findIndex(
      (coin: FiatType) => coin.currency === coinChange.currency && coin.currencyAlias === coinChange.currencyAlias,
    );
    const newListCoin = JSON.parse(JSON.stringify(listCoin));
    newListCoin[indexCoin].isFavorite = !coinChange.isFavorite;
    if (openTab === 1) {
      setListCrypto(newListCoin);
      dispatch(changeCryptoArray(newListCoin));
    } else {
      setListFiat(newListCoin);
      dispatch(changeFiatArray(newListCoin));
    }
  };

  useEffect(() => {
    setListCrypto(cryptoArray);
    setListFiat(fiatArray);
    setListFavorite([...cryptoArray, ...fiatArray]);
  }, [cryptoArray, fiatArray]);

  useEffect(() => {
    setIsReverse(!isReverse);
  }, [openTab]);

  const handlesortCoins = () => {
    switch (openTab) {
      case 1:
        sort(listCrypto, setListCrypto);
        break;
      case 2:
        sort(listFiat, setListFiat);
        break;
      default:
        sort(listFavorite, setListFavorite);
        break;
    }
  };

  const sort = (listCoin: FiatType[], callBack: Function) => {
    const listCoinsSort = JSON.parse(JSON.stringify(listCoin)).reverse();
    setIsReverse(!isReverse);
    callBack(listCoinsSort);
  };

  return (
    <>
      <Loader />
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
                <Dialog.Panel className="!overflow-hidden text-[#98a7b5] dark:bg-[#1c1c20] text-[14px] max-w-[464px] h-[720px] flex flex-col relative transform rounded-[15px] bg-gray-800 text-left shadow-xl transition-all my-8 w-full px-[20px] pb-0 pt-[16px] max-h-[80vh]">
                  <Dialog.Title as="div" className="relative mb-2 flex justify-between items-center">
                    <div className="flex gap-4 items-center w-full">
                      <div className="grow">
                        <InputSearch
                          value={searchInput}
                          showClose={searchInput !== '' ? true : false}
                          onClose={() => {
                            setSearchInput('');
                          }}
                          onChange={(e) => setSearchInput(e.target.value)}
                        />
                      </div>
                      <div className="group rounded-md" role="button" onClick={onClose}>
                        <XMarkIcon width={15} className="text-[#9FA5AC] group-hover:text-white w-[1.5rem] h-[1.5rem]" />
                      </div>
                    </div>
                  </Dialog.Title>
                  <div className="flex-col flex gap-[10px] justify-between mt-[1rem] mb-[20px]">
                    <div className="flex">
                      <div
                        onClick={() => setOpenTab(1)}
                        className={`${
                          openTab === 1
                            ? 'dark:text-white dark:bg-[#24262B] text-[#000] bg-white font-bold rounded-[5px]'
                            : 'dark:hover:text-white dark:bg-[#1D1E22] bg-[#f0f1f5] hover:bg-[#f0f1f5] hover:text-black text-[#31373D] dark:text-[rgba(255,255,255,0.5)]'
                        } text-[14px] inline-block px-2 py-3 cursor-pointer grow text-center`}
                      >
                        {t('deposit:crypto')}
                      </div>
                      <div
                        onClick={() => setOpenTab(2)}
                        className={`${
                          openTab === 2
                            ? 'dark:text-white dark:bg-[#24262B] text-[#000] bg-white font-bold rounded-[5px]'
                            : 'dark:hover:text-white dark:bg-[#1D1E22] bg-[#f0f1f5] hover:bg-[#f0f1f5] hover:text-black text-[#31373D] dark:text-[rgba(255,255,255,0.5)]'
                        } text-[14px] inline-block px-2 py-3 cursor-pointer grow text-center`}
                      >
                        {t('deposit:fiat')}
                      </div>
                      <div
                        onClick={() => setOpenTab(3)}
                        className={`${
                          openTab === 3
                            ? 'dark:text-white dark:bg-[#24262B] text-[#000] bg-white font-bold rounded-[5px]'
                            : 'dark:hover:text-white dark:bg-[#1D1E22] bg-[#f0f1f5] hover:bg-[#f0f1f5] hover:text-black text-[#31373D] dark:text-[rgba(255,255,255,0.5)]'
                        } pointer-events-none cursor-not-allowed text-[14px] inline-block px-2 py-3 grow text-center`}
                      >
                        {t('deposit:mNFT')}
                      </div>
                      <div
                        onClick={() => setOpenTab(4)}
                        className={`${
                          openTab === 4
                            ? 'dark:text-white dark:bg-[#24262B] text-[#000] bg-white font-bold rounded-[5px]'
                            : 'dark:hover:text-white dark:bg-[#1D1E22] bg-[#f0f1f5] hover:bg-[#f0f1f5] hover:text-black text-[#31373D] dark:text-[rgba(255,255,255,0.5)]'
                        } text-[14px] inline-block px-2 py-3 cursor-pointer grow text-center`}
                      >
                        {t('deposit:myFavorite')}
                      </div>
                    </div>
                  </div>
                  <div className="text-[#98a7b5]  max-h-[calc(100%-122px)]">
                    <div className="flex justify-between items-center ">
                      {t('deposit:myFavoriteCoins')}
                      {isReverse ? (
                        <ArrowUp
                          size="28"
                          color="#98a7b5"
                          variant="Bold"
                          className="cursor-pointer"
                          onClick={handlesortCoins}
                        />
                      ) : (
                        <ArrowDown
                          size="28"
                          color="#98a7b5"
                          variant="Bold"
                          className="cursor-pointer"
                          onClick={handlesortCoins}
                        />
                      )}
                    </div>
                    <div className="pt-[10px] h-full overflow-scroll pb-[32px]">
                      {openTab === 1 &&
                        listCoinCrypto.length > 0 &&
                        listCoinCrypto?.map((coin) => (
                          <div
                            onClick={() => handleFavoriteCoin(listCrypto, coin)}
                            key={coin?.id || coin?.currency}
                            className="flex items-center justify-between p-[10px] w-full rounded-lg"
                            role="button"
                          >
                            <div className="flex-1 flex items-center justify-start gap-[10px]">
                              <Image
                                width={30}
                                height={30}
                                src={`/img/fiats/${coin?.currency}.png`}
                                className="inline"
                                alt=""
                              />
                              <div className="flex-1 text-start text-[14px]">{coin?.currency}</div>
                            </div>
                            <div className="flex items-center">
                              <span>{coin?.currencyAlias}</span>
                              <Switch
                                id={`coin_${coin?.id}`}
                                checked={!!Number(coin?.isFavorite)}
                                className={`${
                                  !!Number(coin?.isFavorite) ? 'bg-[#3bc11733]' : 'dark:bg-gray-500 bg-gray-200'
                                } bg-[#3bc11733] relative inline-flex h-4 w-8 items-center rounded-full ml-[15px]`}
                              >
                                <span
                                  className={`${
                                    !!Number(coin?.isFavorite)
                                      ? 'translate-x-5 bg-amber-600'
                                      : 'translate-x-1 dark:bg-[#31343D] bg-white'
                                  } inline-block bg-amber-600 h-3 w-3 transform rounded-full transition`}
                                />
                              </Switch>
                            </div>
                          </div>
                        ))}
                      {openTab === 2 &&
                        listCoinFiat.length > 0 &&
                        listCoinFiat?.map((coin) => (
                          <div
                            onClick={() => handleFavoriteCoin(listFiat, coin)}
                            key={coin?.currency}
                            className="flex items-center  justify-between p-[10px] w-full rounded-lg"
                            role="button"
                          >
                            <div className="flex-1 flex items-center justify-start gap-[10px]">
                              <Image
                                width={30}
                                height={30}
                                src={`/img/fiats/${coin?.currency}.png`}
                                className="inline"
                                alt=""
                              />
                              <div className="flex-1 text-start text-[14px]">{coin?.currency}</div>
                            </div>
                            <div className="flex items-center">
                              <span>{coin?.currencyAlias}</span>
                              <Switch
                                id={`coin_${coin?.id}`}
                                checked={!!Number(coin?.isFavorite)}
                                className={`${
                                  !!Number(coin?.isFavorite) ? 'bg-[#3bc11733]' : 'dark:bg-gray-500 bg-gray-200'
                                } bg-[#3bc11733] relative inline-flex h-4 w-8 items-center rounded-full ml-[15px]`}
                              >
                                <span
                                  className={`${
                                    !!Number(coin?.isFavorite)
                                      ? 'translate-x-5 bg-amber-600'
                                      : 'translate-x-1 dark:bg-[#31343D] bg-white'
                                  } inline-block bg-amber-600 h-3 w-3 transform rounded-full transition`}
                                />
                              </Switch>
                            </div>
                          </div>
                        ))}
                      {openTab === 4 &&
                        listCoinFavorite.length > 0 &&
                        listCoinFavorite.map((coin: FiatType) => (
                          <div
                            key={coin?.id || coin?.currency}
                            className="flex items-center  justify-between p-[10px] w-full rounded-lg"
                            role="button"
                          >
                            <div className="flex-1 flex items-center justify-start gap-[10px]">
                              <Image
                                width={30}
                                height={30}
                                src={`/img/fiats/${coin?.currency}.png`}
                                className="inline"
                                alt=""
                              />
                              <div className="flex-1 text-start text-[14px]">{coin?.currency}</div>
                            </div>
                            <div className="flex items-center">
                              <span>{coin?.currencyAlias}</span>
                            </div>
                          </div>
                        ))}
                      {!!listCoinCrypto.length ||
                        !!listCoinFiat.length ||
                        (openTab === 4 && !!listCoinFavorite.length) || (
                          <div className="relative flex items-center justify-center">
                            <Image src="/img/empty.png" width={200} height={200} alt="" />
                            <p className="absolute text-14 bottom-0 text-center">{t('deposit:noCoin')}</p>
                          </div>
                        )}
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
}
