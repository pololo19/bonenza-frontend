import { Switch } from '@headlessui/react';
import cn from 'classnames';
import { SearchNormal } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { BalanceType, CurrencyType } from '@/base/types/wallet';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';

const fiatDecimals = 2;
const cryptoDecimals = 4;

const BalancePage = () => {
  const exchangeRate = useExchange();
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalBonus, setTotalBonus] = useState<number>(0);

  const { t } = useTranslation('');

  const {
    localFiat,
    viewInFiat,
    cryptoSymbols,
    fiatSymbols,
    cryptoBalances,
    totalUsdBalance,
    realUsdBalance,
    bonusUsdBalance,
  } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
      activeFiat: state.common.activeFiat,
      fiatArray: state.common.fiatArray,
      usdtNetwork: state.common.usdtNetwork,
      viewInFiat: state.common.viewInFiat,

      userCurrency: state.auth.user.generalSetting.settingCurrency,

      fiatSymbols: state.wallet.fiatSymbols,
      cryptoSymbols: state.wallet.symbols,
      cryptoBalances: state.wallet.balances,

      localFiat: state.wallet.localFiat,
      totalUsdBalance: state.wallet.totalBalance,
      realUsdBalance: state.wallet.realBalance,
      bonusUsdBalance: state.wallet.bonusBalance,
    }),
    shallowEqual,
  );

  const filterListFiat = useMemo(() => {
    const arraySearch = fiatSymbols.filter((item) => {
      return String(item.name).toLowerCase().includes(searchValue.toLowerCase());
    });

    return hideBalance ? [] : arraySearch;
  }, [searchValue, fiatSymbols, hideBalance]);

  const filterListCrypto = useMemo(() => {
    let arraySearch = cryptoSymbols.filter((item) => {
      return String(item.name).toLowerCase().includes(searchValue.toLowerCase());
    });

    if (hideBalance) {
      const avaSymbols = cryptoBalances.filter((item: BalanceType) => item.amount > 0).map((item) => item.symbolId);
      arraySearch = [...arraySearch.filter((item) => avaSymbols.indexOf(item.id) != -1)];
    }

    return arraySearch;
  }, [searchValue, cryptoSymbols, hideBalance, cryptoBalances]);

  const renderBalance = (symbol: CurrencyType) => {
    const balance = [...cryptoBalances].find((item) => item.symbolId === symbol.id);
    const usdPrice = symbol.price || 1;

    return {
      usd: balance ? balance.amount * usdPrice : 0,
      amount: balance ? balance.amount : 0,
    };
  };

  return (
    <div className={'mt-[-24px] sm:mx-[-32px] mb-[-32px]'}>
      {isLoading && <Loader />}
      <Head>
        <title>Balance - Bonenza</title>
      </Head>
      <div className="flex items-center justify-between pt-[24px] px-4 sm:px-[32px] pb-[32px] dark:bg-color-modal-bg-secondary bg-white">
        <div className="flex items-center justify-start gap-[15px] max-sm:pt-[30px]">
          <Image src={'/img/total-balance.png'} width={35} height={35} alt="" />
          <div className="flex items-center justify-start md:gap-[35px] gap-[15px] flex-wrap">
            <div>
              <div className="text-start text-[14px] dark:text-gray-300 text-[#000] font-[700]">
                {t('balance:totalBalance')}
              </div>
              <div className="text-start text-[#F39717] text-[16px] font-bold break-keep">
                {currencyFormat1(totalUsdBalance * exchangeRate, fiatDecimals, localFiat?.name)}
              </div>
            </div>
            <div>
              <div className="text-start text-[14px] dark:text-gray-400 text-[#000] font-[700]">
                {t('balance:realBalance')}
              </div>
              <div className="text-start dark:text-white text-black text-[16px] font-bold break-keep">
                {currencyFormat1(realUsdBalance * exchangeRate, fiatDecimals, localFiat?.name)}
              </div>
            </div>
            <div>
              <div className="text-start text-[14px] dark:text-gray-400 text-[#000] font-[700]">
                {t('balance:bonusMoney')}
              </div>
              <div className="text-start dark:text-white text-black text-[16px] font-bold break-keep">
                {currencyFormat1(bonusUsdBalance, fiatDecimals, localFiat?.name)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full pt-[24px] sm:px-4 md:px-[32px] pb-[32px] mt-[20px] dark:bg-color-modal-bg-secondary bg-white">
        <div className="w-full flex justify-between items-center mb-[18px] rounded">
          <div className="flex items-center gap-[10px]">
            <div className="max-sm:pl-[15px] dark:text-[#98A7B5] text-[#31373d] text-[14px]">
              {t('balance:hideBalance')}
            </div>
            <Switch
              checked={hideBalance}
              onChange={setHideBalance}
              className={`${
                hideBalance ? 'bg-[#3bc11733]' : 'dark:bg-[#272C33] bg-[#5f697566]'
              } relative inline-flex h-[24px] min-w-[44px] w-[44px] items-center rounded-full`}
            >
              <span
                className={`${
                  hideBalance ? 'translate-x-5 bg-amber-600' : 'translate-x-1 dark:bg-[#31343D] bg-white'
                } inline-block h-[20px] w-[20px] transform rounded-full transition`}
              />
            </Switch>
          </div>
          <div className="relative">
            <input
              className={cn(
                'p-[18px] pl-[50px] border border-[#EAECF3] border-solid dark:border-0 dark:text-white text-[#31373d] w-full text-[16px] h-[40px] rounded-[5px] dark:bg-color-panel-bg-primary bg-[#f1f3f7] placeholder:text-[#4D545C] placeholder:text-[#31373d] outline-none',
              )}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search"
            />
            <SearchNormal
              width={24}
              height={24}
              className="absolute top-1/2 dark:text-color-text-primary text-[#31373d] left-[30px] transform -translate-x-1/2 -translate-y-1/2 !text-[14px]"
            />
          </div>
        </div>

        {!!filterListCrypto?.length && (
          <div className="w-full flex flex-col justify-start items-start">
            <div className="text-[14px] dark:text-[#C2C2C2] text-[#31373d] mb-[10px] max-sm:px-[15px]">
              {t('balance:cryptoCurrency')}
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-[5px]">
              {filterListCrypto?.map((item: CurrencyType, index: number): any => (
                <div
                  key={index}
                  className="w-full dark:bg-color-active-primary  bg-[#f7f7fa] px-[20px] py-[10px] rounded-[3px] flex justify-between items-center"
                >
                  <div className="flex justify-center items-center gap-1 md:gap-3 gap-2 sm:text-[16px] text-[14px]">
                    <Image
                      height={30}
                      width={30}
                      src={item.logo}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.src = '/img/fiats/USD.png';
                      }}
                    />
                    <div className="flex-1 text-start text-[14px] font-bold dark:text-white text-black">
                      {item.name} <span className="ml-[5px] text-[10px] text-gray-400">{item.alias}</span>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center justify-end xl:gap-[30px] md:gap-[20px] gap-[10px] text-[#0AB247] font-normal">
                    {viewInFiat ? (
                      <div className="text-end">
                        <div className="dark:text-white text-black font-[600] truncate md:text-[14px] text-[12px]">
                          {currencyFormat1(renderBalance(item).usd * exchangeRate, fiatDecimals, localFiat?.name)}
                        </div>
                        <span className="font-normal md:text-[12px] text-[10px] text-[#53575C]">
                          {currencyFormat1(renderBalance(item).amount, cryptoDecimals, '', false)}
                        </span>
                      </div>
                    ) : (
                      <div className="text-end">
                        <div className="dark:text-white text-black font-[600] truncate md:text-[14px] text-[12px] font-bold">
                          {currencyFormat1(renderBalance(item).amount, cryptoDecimals, '', false)}
                        </div>
                      </div>
                    )}
                    <div className="flex md:text-[12px] text-[10px] sm:flex-row flex-col sm:items-center items-end  xl:gap-[30px] md:gap-[10px] gap-[5px] dark:text-color-primary text-[#F39717] font-normal">
                      <Link
                        className="dark:hover:text-white hover:text-[#ff9400]"
                        href={`${ROUTER.DepositCrypto}?coin=${item.name}`}
                      >
                        {t('balance:deposit')}
                      </Link>
                      <Link
                        className="dark:hover:text-white hover:text-[#ff9400]"
                        href={`${ROUTER.WithdrawCrypto}?coin=${item.name}`}
                      >
                        {t('balance:withdraw')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!!filterListFiat.length && (
          <div className="w-full flex flex-col justify-start items-start mt-[20px]">
            <div className="text-[14px] text-[#C2C2C2] mb-[10px] max-sm:px-[15px]">{t('balance:fiatCurrency')}</div>
            <div className="w-full flex flex-col justify-start items-start gap-[5px]">
              {filterListFiat.map((item: CurrencyType, index: number): any => (
                <div
                  key={index}
                  className="w-full dark:bg-color-active-primary bg-[#f7f7fa] px-[20px] py-[10px] roundeded-[3px] flex justify-between items-center"
                >
                  <div className="flex justify-center items-center gap-1 md:gap-3 gap-2 sm:text-[16px] text-[14px]">
                    <Image
                      height={30}
                      width={30}
                      src={item.logo}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.src = '/img/fiats/USD.png';
                      }}
                    />
                    <div className="text-[14px] font-bold dark:text-white text-black">{item.name}</div>
                  </div>
                  <div className="flex flex-1 items-center justify-end xl:gap-[30px] md:gap-[20px] gap-[10px] text-[#0AB247] font-normal">
                    {viewInFiat ? (
                      <div className="text-end">
                        <div className="dark:text-white text-black font-[600] truncate md:text-[14px] text-[12px] font-bold">
                          {currencyFormat1(renderBalance(item).usd * exchangeRate, fiatDecimals, localFiat?.name)}
                        </div>
                        <span className="font-normal md:text-[12px] text-[10px] text-[#53575C]">
                          {currencyFormat1(renderBalance(item).amount, cryptoDecimals, '', false)}
                        </span>
                      </div>
                    ) : (
                      <div className="text-end">
                        <div className="dark:text-white text-black font-[600] truncate md:text-[14px] text-[12px] font-bold">
                          {currencyFormat1(renderBalance(item).amount, cryptoDecimals, '', false)}
                        </div>
                      </div>
                    )}
                    <div className="flex md:text-[12px] text-[10px] sm:flex-row flex-col sm:items-center items-end  xl:gap-[30px] md:gap-[10px] gap-[5px] dark:text-color-primary text-[#F39717] font-normal">
                      <Link
                        className="dark:hover:text-white hover:text-[#ff9400]"
                        href={`${ROUTER.DepositFiat}?coin=${item.name}`}
                      >
                        {t('balance:deposit')}
                      </Link>
                      <Link
                        className="dark:hover:text-white hover:text-[#ff9400]"
                        href={`${ROUTER.WithdrawFiat}?coin=${item.name}`}
                      >
                        {t('balance:withdraw')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BalancePageAuth = withAuth(BalancePage);

BalancePageAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default BalancePageAuth;
