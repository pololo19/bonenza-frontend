/* eslint-disable @next/next/no-img-element */
import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import {
  currencyFormat,
  exchangeByLocaleFiat,
  formatLengthNumber,
  handleLocaleSymbol,
  isDecimalNumber,
} from '@/base/libs/utils';
import { FiatType } from '@/base/types/common';
import { RootState } from '@/base/types/root-state';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';
import { Switch } from '@headlessui/react';
import cn from 'classnames';
import { SearchNormal } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

const BalancePage = () => {
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalBonus, setTotalBonus] = useState<number>(0);

  const { t } = useTranslation('');

  const { localeFiat, fiatArray, cryptoArray, usdtNetwork, viewInFiat } = useSelector(
    (state: RootState) => ({
      localeFiat: state.common.localeFiat,
      activeFiat: state.common.activeFiat,
      fiatArray: state.common.fiatArray,
      cryptoArray: state.common.cryptoArray,
      usdtNetwork: state.common.usdtNetwork,
      viewInFiat: state.common.viewInFiat,
    }),
    shallowEqual,
  );

  const handleGetBonus = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('vip/get-bonus');
      setTotalBonus(res.data.totalVipBonus);
    } catch (error) {
      setTotalBonus(0);
    } finally {
      setIsLoading(false);
    }
  };

  const filterListFiat = useMemo(() => {
    const arraySearch = fiatArray?.filter((item) => {
      return (
        String(item?.currency).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(item?.currencyAlias).toLowerCase().includes(searchValue.toLowerCase())
      );
    });
    return arraySearch?.filter((item) => {
      return hideBalance ? Number(item.amount) : true;
    });
  }, [searchValue, fiatArray, hideBalance]);

  const filterListCrypto = useMemo(() => {
    const arraySearch = cryptoArray?.filter((item) => {
      return (
        String(item?.currency).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(item?.currencyAlias).toLowerCase().includes(searchValue.toLowerCase())
      );
    });
    return arraySearch?.filter((item) => {
      return hideBalance ? Number(item.amount) : true;
    });
  }, [searchValue, cryptoArray, hideBalance, usdtNetwork]);

  const realMoney = useMemo(() => {
    const totalCrypto = cryptoArray?.reduce((a, b) => {
      return a + exchangeByLocaleFiat(b?.currency, String(localeFiat?.currency || 'USD'), Number(b?.amount) || 0);
    }, 0);
    const totalFiat = fiatArray?.reduce((a, b) => {
      return a + exchangeByLocaleFiat(b?.currency, String(localeFiat?.currency || 'USD'), Number(b?.amount) || 0);
    }, 0);
    return Number(totalCrypto) + Number(totalFiat);
  }, [cryptoArray, fiatArray, localeFiat]);

  const totalBalance = useMemo(() => {
    return exchangeByLocaleFiat('USD', String(localeFiat?.currency || 'USD'), totalBonus) + Number(realMoney ?? 0);
  }, [realMoney, totalBonus]);

  const getAmount = (amount: number) => {
    if (!amount) return currencyFormat(0, 2);
    if (isDecimalNumber(amount)) {
      return formatLengthNumber(amount);
    } else {
      return currencyFormat(Number(amount), 2);
    }
  };

  useEffect(() => {
    handleGetBonus();
  }, []);

  return (
    <div className={'mt-[-24px] sm:mx-[-32px] mb-[-32px]'}>
      {isLoading && <Loader />}
      <Head>
        <title>Balance - Bonenza</title>
      </Head>
      <div className="flex items-center justify-between pt-[24px] px-4 sm:px-[32px] pb-[32px]">
        <div className="flex items-center justify-start gap-[15px] max-sm:pt-[30px]">
          <Image src={'/img/total-balance.png'} width={35} height={35} alt="" />
          <div className="flex items-center justify-start md:gap-[35px] gap-[15px] flex-wrap">
            <div>
              <div className="text-start text-[14px] dark:text-gray-300 text-[#000] font-[700]">
                {t('balance:totalBalance')}
              </div>
              <div className="text-start text-[#F39717] text-[16px] font-bold break-keep">
                {handleLocaleSymbol(String(localeFiat?.currency || 'USD'))} {currencyFormat(totalBalance, 4)}
              </div>
            </div>
            <div>
              <div className="text-start text-[14px] dark:text-gray-400 text-[#000] font-[700]">
                {t('balance:realBalance')}
              </div>
              <div className="text-start dark:text-white text-black text-[16px] font-bold break-keep">
                {handleLocaleSymbol(String(localeFiat?.currency || 'USD'))} {currencyFormat(realMoney, 4)}
              </div>
            </div>
            <div>
              <div className="text-start text-[14px] dark:text-gray-400 text-[#000] font-[700]">
                {t('balance:bonusMoney')}
              </div>
              <div className="text-start dark:text-white text-black text-[16px] font-bold break-keep">
                {handleLocaleSymbol(String(localeFiat?.currency || 'USD'))}{' '}
                {currencyFormat(exchangeByLocaleFiat('USD', String(localeFiat?.currency || 'USD'), totalBonus), 4)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#f6f7fa] dark:bg-[#25262B] h-[20px] w-full"></div>
      <div className="w-full pt-[24px] sm:px-4 md:px-[32px] pb-[32px]">
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
                'p-[18px] pl-[50px] border border-[#EAECF3] border-solid dark:border-0 dark:text-white text-[#31373d] w-full text-[16px] h-[40px] rounded-[5px] dark:bg-[#161D26] bg-[#f1f3f7] placeholder:text-[#4D545C] placeholder:text-[#31373d] outline-none',
              )}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search"
            />
            <SearchNormal
              width={24}
              height={24}
              className="absolute top-1/2 dark:text-white text-[#31373d] left-[30px] transform -translate-x-1/2 -translate-y-1/2 !text-[14px]"
            />
          </div>
        </div>

        {!!filterListCrypto?.length && (
          <div className="w-full flex flex-col justify-start items-start">
            <div className="text-[14px] dark:text-[#C2C2C2] text-[#31373d] mb-[10px] max-sm:px-[15px]">
              {t('balance:cryptoCurrency')}
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-[5px]">
              {filterListCrypto?.map((item: FiatType, index: number): any => (
                <div
                  key={index}
                  className="w-full dark:bg-[#161D26] bg-[#f7f7fa] px-[20px] py-[10px] rounded-[16px] flex justify-between items-center"
                >
                  <div className="flex justify-center items-center gap-1 md:gap-3 gap-2 sm:text-[16px] text-[14px]">
                    <Image height={30} width={30} src={`/img/fiats/${item.currency}.png`} alt="" />
                    <div className="flex-1 text-start text-[14px] font-bold dark:text-white text-black">
                      {item.currency} <span className="ml-[5px] text-[10px] text-gray-400">{item.currencyAlias}</span>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center justify-end xl:gap-[30px] md:gap-[20px] gap-[10px] text-[#0AB247] font-normal">
                    {viewInFiat ? (
                      <div className="text-end">
                        <div className="dark:text-white text-black font-[600] truncate md:text-[14px] text-[12px]">
                          {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                          {currencyFormat(
                            exchangeByLocaleFiat(
                              item?.currency,
                              String(localeFiat?.currency),
                              Number(item?.amount) || 0,
                            ),
                            2,
                          )}
                        </div>
                        <span className="font-normal md:text-[12px] text-[10px] text-[#53575C]">
                          {currencyFormat(Number(item?.amount) || 0, 8)}
                        </span>
                      </div>
                    ) : (
                      <div className="text-end">
                        <div className="dark:text-white text-black font-[600] truncate md:text-[14px] text-[12px] font-bold">
                          {currencyFormat(Number(item?.amount), 8)}
                        </div>
                      </div>
                    )}
                    <div className="flex md:text-[12px] text-[10px] sm:flex-row flex-col sm:items-center items-end  xl:gap-[30px] md:gap-[10px] gap-[5px] dark:text-[#0DFDE4] text-[#F39717] font-normal">
                      <Link
                        className="dark:hover:text-white hover:text-[#ff9400]"
                        href={`${ROUTER.DepositCrypto}?coin=${item.currency}`}
                      >
                        {t('balance:deposit')}
                      </Link>
                      <Link
                        className="dark:hover:text-white hover:text-[#ff9400]"
                        href={`${ROUTER.WithdrawCrypto}?coin=${item.currency}`}
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

        {!!filterListFiat?.length && (
          <div className="w-full flex flex-col justify-start items-start mt-[20px]">
            <div className="text-[14px] text-[#C2C2C2] mb-[10px] max-sm:px-[15px]">{t('balance:fiatCurrency')}</div>
            <div className="w-full flex flex-col justify-start items-start gap-[5px]">
              {filterListFiat?.map((item: FiatType, index: number): any => (
                <div
                  key={index}
                  className="w-full dark:bg-[#161D26] bg-[#f7f7fa] px-[20px] py-[10px] rounded-[16px] flex justify-between items-center"
                >
                  <div className="flex justify-center items-center gap-1 md:gap-3 gap-2 sm:text-[16px] text-[14px]">
                    <Image height={30} width={30} src={`/img/fiats/${item.currency}.png`} alt="" />
                    <div className="text-[14px] font-bold dark:text-white text-black">{item.currency}</div>
                  </div>
                  <div className="flex flex-1 items-center justify-end xl:gap-[30px] md:gap-[20px] gap-[10px] text-[#0AB247] font-normal">
                    {viewInFiat ? (
                      <div className="text-end">
                        <div className="dark:text-white text-black font-[600] truncate md:text-[14px] text-[12px] font-bold">
                          {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                          {currencyFormat(
                            exchangeByLocaleFiat(
                              item?.currency,
                              String(localeFiat?.currency),
                              Number(item?.amount) || 0,
                            ),
                            2,
                          )}
                        </div>
                        <span className="font-normal md:text-[12px] text-[10px] text-[#53575C]">
                          {currencyFormat(Number(item?.amount) || 0, 8)}
                        </span>
                      </div>
                    ) : (
                      <div className="text-end">
                        <div className="dark:text-white text-black font-[600] truncate md:text-[14px] text-[12px] font-bold">
                          {currencyFormat(Number(item?.amount), 8)}
                        </div>
                      </div>
                    )}
                    <div className="flex md:text-[12px] text-[10px] sm:flex-row flex-col sm:items-center items-end  xl:gap-[30px] md:gap-[10px] gap-[5px] dark:text-[#0DFDE4] text-[#F39717] font-normal">
                      <Link
                        className="dark:hover:text-white hover:text-[#ff9400]"
                        href={`${ROUTER.DepositFiat}?coin=${item.currency}`}
                      >
                        {t('balance:deposit')}
                      </Link>
                      <Link
                        className="dark:hover:text-white hover:text-[#ff9400]"
                        href={`${ROUTER.WithdrawFiat}?coin=${item.currency}`}
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
