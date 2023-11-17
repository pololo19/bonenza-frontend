/* eslint-disable @next/next/no-img-element */
import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import {
  CRYPTO_NORMAL_DATA,
  DATE_TIME_SUBMIT_FORMAT_WITH_SECOND,
  TIME_SUBMIT_FORMAT_WITH_MARKER,
  TOAST_ENUM,
} from '@/base/constants/common';
import { currencyFormat, exchangeByLocaleFiat, formatDate, handleLocaleSymbol } from '@/base/libs/utils';
import { RootState } from '@/base/types/root-state';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';
import ModalDetailTransaction from '@/components/modal/transactionDetail/transactionDetail';
import Paging from '@/components/paging/paging';
import TableComponent from '@/components/table';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, LinkIcon } from '@heroicons/react/24/outline';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ArrowRight2, Copy } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import { Fragment, ReactElement, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './index.module.scss';

const TransactionPage = () => {
  const { t } = useTranslation('');

  const { localeFiat, viewInFiat } = useSelector(
    (state: RootState) => ({
      localeFiat: state.common.localeFiat,
      viewInFiat: state.common.viewInFiat,
    }),
    shallowEqual,
  );

  const LIST_FILTER_TYPE = [
    { name: String(t('transaction:deposit')), id: 1 },
    { name: String(t('transaction:withdraw')), id: 2 },
    { name: String(t('transaction:swap')), id: 3 },
    { name: String(t('transaction:buyCrypto')), id: 4 },
    { name: String(t('transaction:Bill')), id: 5 },
    { name: String(t('transaction:Bonus')), id: 6 },
  ];

  const LIST_FILTER_DATE = [
    { name: String(t('transaction:past60Days')), type: 60 },
    { name: String(t('transaction:past24Hours')), type: 1 },
    { name: String(t('transaction:past7Days')), type: 7 },
    { name: String(t('transaction:past90Days')), type: 90 },
  ];

  const LIST_FILTER_STATUS = [
    { name: String(t('transaction:allAssets')), type: '' },
    { name: String(t('transaction:complete')), type: 'success' },
    { name: String(t('transaction:processing')), type: 'process' },
    // { name: String(t('transaction:pending')), type: 'pending' },
    { name: String(t('transaction:failed')), type: 'fail' },
    // { name: String(t('transaction:canceled')), type: 'rejected' },
  ];

  const [isShowDetailTransaction, setIsShowDetailTransaction] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [typeBill, setTypeBill] = useState<string>(String(t('transaction:allType')));
  // const [typeDeposit, setTypeDeposit] = useState<any>(LIST_FILTER_STATUS[0]);

  const [optionFilter, setOptionFilter] = useState({
    type: LIST_FILTER_TYPE[0],
    currency: CRYPTO_NORMAL_DATA[0],
    dayPast: LIST_FILTER_DATE[0],
    filterStatus: LIST_FILTER_STATUS[0],
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalTable, setTotalTable] = useState(0);
  const [columnType, setColumnType] = useState<string>('deposit');

  const copy = (text: string) => {
    toast.success('Copied', { containerId: TOAST_ENUM.COMMON });
    navigator.clipboard.writeText(text);
  };

  const getColorStatus = (status: string) => {
    let bgColor = '';
    switch (status) {
      case 'process':
        bgColor = 'bg-[#efef19]';
        break;
      case 'pending':
        bgColor = 'bg-[#efef19]';
        break;
      case 'refunding':
        bgColor = 'bg-[#efef19]';
        break;
      case 'rejected':
        bgColor = 'bg-[#c31414]';
        break;
      case 'fail':
        bgColor = 'bg-[#c31414]';
        break;
      default:
        bgColor = 'bg-[#3BC117]';
        break;
    }
    return bgColor;
  };

  const getStatus = (status: string) => {
    let newStatus = '';
    switch (status) {
      case 'process':
        newStatus = 'processing';
        break;
      case 'pending':
        newStatus = 'processing';
        break;
      case 'refunding':
        newStatus = 'processing';
        break;
      case 'fail':
        newStatus = 'failed';
        break;
      case 'rejected':
        newStatus = 'failed';
        break;
      case 'approve':
        newStatus = 'success';
        break;
      default:
        newStatus = status;
        break;
    }
    return newStatus?.charAt(0)?.toUpperCase() + newStatus?.slice(1);
  };

  const depositColumns: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        accessorKey: 'transactionType',
        header: () => <div className="text-left dark:text-[#64748b] text-black">{String(t('transaction:type'))}</div>,
        cell: ({ row }) => (
          <div className="dark:text-white text-black text-left truncate">{optionFilter.type.name}</div>
        ),
        minSize: 30,
      },
      {
        accessorKey: 'amount',
        header: () => (
          <div className="text-center dark:text-[#64748b] text-black">{String(t('transaction:amount'))}</div>
        ),
        cell: ({ row }) => (
          <div
            className={`${
              optionFilter.type.name === 'Withdraw' ? 'text-red-500' : 'text-[#3BC117]'
            } flex items-center justify-center gap-1`}
          >
            {optionFilter.type.name === 'Withdraw' ? '-' : '+'}
            {viewInFiat ? (
              <>
                {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                {currencyFormat(
                  exchangeByLocaleFiat(row.original?.symbol, String(localeFiat?.currency), row.original?.amount),
                  4,
                )}
              </>
            ) : (
              currencyFormat(Math.abs(row.original?.amount), 4)
            )}

            <Image height={20} width={20} src={`/img/fiats/${row.original?.symbol}.png`} alt="" />
          </div>
        ),
        minSize: 120,
      },
      {
        accessorKey: 'time',
        header: () => (
          <div className="text-center dark:text-[#64748b] text-black">{String(t('transaction:timeTransfer'))}</div>
        ),
        cell: ({ row }) => (
          <div className="dark:text-white text-black">
            {formatDate(new Date(row.original.time), DATE_TIME_SUBMIT_FORMAT_WITH_SECOND)}
          </div>
        ),
        maxSize: 30,
      },
      {
        accessorKey: 'status',
        header: () => (
          <div className="text-right dark:text-[#64748b] text-black">{String(t('transaction:status'))}</div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <div className={`w-[5px] h-[5px] rounded-full ${getColorStatus(row.original.status)}`}></div>
            <div className="dark:text-white text-black text-[12px] break-keep	">{getStatus(row.original.status)}</div>
            <ArrowRight2 className="h-[16px] w-[16px] dark:text-[#64748b] text-[#31373d]" />
          </div>
        ),
        maxSize: 30,
        minSize: 30,
      },
    ];
  }, [localeFiat, viewInFiat, optionFilter.type, t]);

  const swapColumns: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        accessorKey: 'swapFrom + swapTo',
        header: () => <div className="text-left">{String(t('transaction:amount'))}</div>,
        cell: ({ row }) => <div className="text-white flex items-center gap-1 truncate">{optionFilter.type.name}</div>,
        minSize: 30,
      },
      {
        accessorKey: 'swapFrom',
        header: () => <div className="text-center">{String(t('transaction:swapFrom'))}</div>,
        cell: ({ row }) => (
          <div className="text-[#FF053B] flex items-center justify-center gap-1 truncate">
            <span>
              -
              {viewInFiat ? (
                <>
                  {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                  {currencyFormat(
                    exchangeByLocaleFiat(row.original?.symbolFrom, String(localeFiat?.currency), row.original.swapFrom),
                    4,
                  )}
                </>
              ) : (
                currencyFormat(row.original.swapFrom, 8)
              )}
            </span>
            <Image height={20} width={20} src={`/img/fiats/${row.original?.symbolFrom}.png`} alt="" />
          </div>
        ),
        minSize: 120,
      },
      {
        accessorKey: 'swapTo',
        header: () => <div className="text-center">{String(t('transaction:swapTo'))}</div>,
        cell: ({ row }) => (
          <div className="text-[#3BC117] flex items-center gap-1 justify-center truncate">
            <span>
              +{' '}
              {viewInFiat ? (
                <>
                  {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                  {currencyFormat(
                    exchangeByLocaleFiat(row.original?.symbolTo, String(localeFiat?.currency), row.original.swapTo),
                    4,
                  )}
                </>
              ) : (
                currencyFormat(row.original.swapTo, 8)
              )}
            </span>
            <Image height={20} width={20} src={`/img/fiats/${row.original?.symbolTo}.png`} alt="" />
          </div>
        ),
        minSize: 120,
      },
      {
        accessorKey: 'timeTransfer',
        header: () => <div className="text-right">{String(t('transaction:time'))}</div>,
        cell: ({ row }) => (
          <div className="text-[#98A7B5]">
            {formatDate(new Date(row.original.timeTransfer), TIME_SUBMIT_FORMAT_WITH_MARKER)}
          </div>
        ),
        maxSize: 50,
      },
    ];
  }, [localeFiat, viewInFiat, optionFilter, t]);

  const billColumns: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        accessorKey: 'actionType',
        header: () => (
          <div className="text-left dark:text-[#98A7B5] text-[#31373d]">{String(t('transaction:type'))}</div>
        ),
        cell: ({ row }) => (
          <>
            <div className="dark:text-white text-black flex items-center gap-1 truncate">
              {row.original?.actionType?.toUpperCase()}{' '}
              {row.original?.billType && row.original?.title && (
                <span className="text-[10px] text-gray-400 flex gap-[5px]">
                  ({row.original?.title})
                  <LinkIcon
                    width={12}
                    role="button"
                    className="hover:text-amber-500"
                    onClick={() =>
                      toast.success('Only the latest 100 betting history is recorded', {
                        containerId: TOAST_ENUM.COMMON,
                      })
                    }
                  />
                </span>
              )}
            </div>
            {row.original?.gameId && (
              <div className="text-[10px] dark:text-gray-500 text-black flex items-center gap-1 truncate">
                Game ID: {row.original?.gameId}
                <span role="button">
                  <Copy size={12} className="hover:text-amber-500" onClick={() => copy(String(row.original?.gameId))} />
                </span>
              </div>
            )}
          </>
        ),
        minSize: 30,
      },
      {
        accessorKey: 'amount',
        header: () => (
          <div className="text-center dark:text-[#98A7B5] text-[#31373d]">{String(t('transaction:amount'))}</div>
        ),
        cell: ({ row }) => (
          <div
            className={`${
              row.original?.amount < 0 ? 'text-red-500' : 'text-[#3BC117]'
            } flex items-center justify-center gap-1`}
          >
            {row.original?.amount < 0 ? '-' : '+'}
            {viewInFiat ? (
              <>
                {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                {currencyFormat(
                  exchangeByLocaleFiat(
                    row.original?.sourceAccount ?? row.original?.symbol,
                    String(localeFiat?.currency),
                    Math.abs(row.original?.amount),
                  ),
                  4,
                )}
              </>
            ) : (
              currencyFormat(Math.abs(row.original?.amount), 6)
            )}

            <Image
              height={20}
              width={20}
              src={`/img/fiats/${row.original?.sourceAccount ?? row.original?.symbol}.png`}
              alt=""
            />
          </div>
        ),
        minSize: 120,
      },
      {
        accessorKey: 'createdAt',
        header: () => (
          <div className="text-center dark:text-[#98A7B5] text-[#31373d] ">{String(t('transaction:time'))}</div>
        ),
        cell: ({ row }) => (
          <div className="dark:text-[#98A7B5] text-[#31373d]">
            {formatDate(new Date(row.original.createdAt), TIME_SUBMIT_FORMAT_WITH_MARKER)}
          </div>
        ),
        minSize: 100,
        maxSize: 100,
      },
      {
        accessorKey: 'balance',
        header: () => (
          <div className="text-right dark:text-[#98A7B5] text-[#31373d] ">{String(t('transaction:balance'))}</div>
        ),
        cell: ({ row }) => (
          <div className={`dark:text-white text-[#31373d] text-left flex items-center justify-end gap-1`}>
            <span className="flex-1 text-right">
              {viewInFiat ? (
                <>
                  {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                  {currencyFormat(
                    exchangeByLocaleFiat(
                      row.original?.sourceAccount ?? row.original?.symbol,
                      String(localeFiat?.currency),
                      Math.abs(row.original?.balance),
                    ),
                    4,
                  )}
                </>
              ) : (
                currencyFormat(Math.abs(row.original?.balance), 6)
              )}
            </span>

            <Image
              height={20}
              width={20}
              src={`/img/fiats/${row.original?.sourceAccount ?? row.original?.symbol}.png`}
              alt=""
            />
          </div>
        ),
        minSize: 120,
      },
    ];
  }, [localeFiat, viewInFiat, optionFilter, t]);

  const bonusColumns: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        accessorKey: 'actionType',
        header: () => (
          <div className="text-left dark:text-[#98A7B5] text-[#31373d]">{String(t('transaction:type'))}</div>
        ),
        cell: ({ row }) => (
          <div className="dark:text-white text-black flex items-center gap-1 truncate">{row?.original?.actionType}</div>
        ),
        minSize: 30,
      },
      {
        accessorKey: 'amountClaimed',
        header: () => (
          <div className="text-center dark:text-[#98A7B5] text-[#31373d]">{String(t('transaction:amount'))}</div>
        ),
        cell: ({ row }) => (
          <div
            className={`${
              row.original?.amountClaimed < 0 ? 'text-red-500' : 'text-[#3BC117]'
            } flex items-center justify-center gap-1`}
          >
            <span>{row.original?.amountClaimed < 0 ? '-' : '+'}</span>
            <span className="min-w-fit break-keep">
              {viewInFiat ? (
                <>
                  {`${handleLocaleSymbol(String(localeFiat?.currency))} ${currencyFormat(
                    exchangeByLocaleFiat(
                      row.original?.symbol,
                      String(localeFiat?.currency),
                      Math.abs(row.original?.amountClaimed),
                    ),
                    4,
                  )}`}
                </>
              ) : (
                currencyFormat(Math.abs(row.original?.amountClaimed), 6)
              )}
            </span>
            <Image height={20} width={20} src={`/img/fiats/${row.original?.symbol}.png`} alt="" />
          </div>
        ),
        minSize: 120,
      },
      {
        accessorKey: 'createdAt',
        header: () => (
          <div className="text-center dark:text-[#98A7B5] text-[#31373d] ">{String(t('transaction:time'))}</div>
        ),
        cell: ({ row }) => (
          <div className="dark:text-[#98A7B5] text-[#31373d]">
            {formatDate(new Date(row.original.createdAt), TIME_SUBMIT_FORMAT_WITH_MARKER)}
          </div>
        ),
        minSize: 100,
        maxSize: 100,
      },
      {
        accessorKey: 'balance',
        header: () => (
          <div className="text-right dark:text-[#98A7B5] text-[#31373d] ">{String(t('transaction:balance'))}</div>
        ),
        cell: ({ row }) => (
          <div className={`dark:text-white text-[#31373d] text-left truncate flex items-center justify-end gap-1`}>
            {viewInFiat ? (
              <>
                {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                {currencyFormat(
                  exchangeByLocaleFiat(row.original?.symbol, String(localeFiat?.currency), row.original?.balance),
                  4,
                )}
              </>
            ) : (
              currencyFormat(row.original.balance, 6)
            )}

            <Image height={20} width={20} src={`/img/fiats/${row.original?.symbol}.png`} alt="" />
          </div>
        ),
        minSize: 120,
      },
    ];
  }, [localeFiat, viewInFiat, optionFilter, t]);

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : page - 1;
    setPage(newPage);
    handleGetData(newPage);
  };

  const handleChangeItemPerPage = (itemPerPage: number) => {
    setLimit(itemPerPage);
    setPage(1);
  };

  const handleGetTransaction = async (page: number) => {
    if (optionFilter.type.name === LIST_FILTER_TYPE[3].name) {
      setDataTable([]);
      setTotalTable(0);
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.get('transaction-histories', {
        params: {
          type: optionFilter.type.name.toLowerCase(),
          currency:
            optionFilter.currency.symbol === String(t('transaction:allAssets')) ? '' : optionFilter.currency.symbol,
          dayPast: optionFilter.dayPast.type,
          status: optionFilter.filterStatus.type,
          page: page,
          limit,
        },
      });
      setColumnType(String(t('transaction:deposit')));
      setDataTable(res.data.data);
      setTotalTable(res.data.total);
    } catch (error) {
      setDataTable([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetBillHistory = async (page: number) => {
    try {
      setIsLoading(true);
      const res = await api.get('transaction-histories/get-bill-list', {
        params: {
          type: typeBill === String(t('transaction:allType')) ? '' : typeBill.toLowerCase(),
          currency:
            optionFilter.currency.symbol === String(t('transaction:allAssets')) ? '' : optionFilter.currency.symbol,
          dayPast: optionFilter.dayPast.type,
          page: page,
          limit,
        },
      });
      setColumnType(String(t('transaction:Bill')));
      setDataTable(res.data?.data);
      setTotalTable(res.data?.total);
    } catch (error) {
      setDataTable([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetBillTypeList = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('transaction-histories/get-bill-type-list');
      const listType = [{ type: 'All Type' }, ...res.data?.data];
      setTypes(listType);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetTransactionBonus = async (page: number) => {
    try {
      setIsLoading(true);
      const res = await api.get('vip/get-list-bonus-transactions', {
        params: {
          currency: String(t('transaction:allAssets')) ? '' : optionFilter.currency.symbol,
          time: optionFilter.dayPast.type,
          page: page,
          limit,
        },
      });
      setColumnType(String(t('transaction:Bonus')));
      setDataTable(res.data.data);
      setTotalTable(res.data.total);
    } catch (error) {
      setDataTable([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetTransactionSwap = async (page: number) => {
    try {
      setIsLoading(true);
      const res = await api.get('exchange/get-swap', {
        params: {
          currency: optionFilter.currency.symbol,
          time: optionFilter.dayPast.type,
          page: page,
          limit,
        },
      });
      setColumnType(String(t('transaction:swap')));
      setDataTable(res.data.data);
      setTotalTable(res.data.total);
    } catch (error) {
      setDataTable([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetData = (page: number) => {
    switch (optionFilter.type.name) {
      case String(t('transaction:swap')):
        handleGetTransactionSwap(page);
        break;
      case String(t('transaction:Bill')):
        handleGetBillHistory(page);
        break;
      case String(t('transaction:Bonus')):
        handleGetTransactionBonus(page);
        break;
      default:
        handleGetTransaction(page);
        break;
    }
  };

  const handleClickRow = (row: Row<any>) => {
    if (optionFilter.type.id !== 5 && optionFilter.type.id !== 6) {
      setIsShowDetailTransaction(true);
      setTransaction({ ...row.original, ...optionFilter });
    }
  };

  useEffect(() => {
    handleGetBillTypeList();
  }, []);

  useEffect(() => {
    setPage(1);
    handleGetData(1);
  }, [optionFilter, limit, typeBill]);

  const columns = useMemo(() => {
    switch (columnType) {
      case String(t('transaction:swap')):
        return swapColumns;
      case String(t('transaction:Bill')):
        return billColumns;
      default:
        if (optionFilter.type.name === 'Bonus') {
          return bonusColumns;
        }
        return depositColumns;
    }
  }, [columnType, viewInFiat, localeFiat, optionFilter, t]);

  return (
    <div className={`${styles.cardContent}`}>
      <Head>
        <title>Transactions History - Bonenza</title>
      </Head>
      <div className="w-full h-1/3 p-3 md:p-5 dark:bg-[#31343D] bg-[#f5f6f7] dark:text-white text-black">
        <div className="flex items-center flex-wrap mb-[40px] sm:gap-[20px] gap-[10px]">
          <Menu
            as="div"
            className="relative flex py-[10px] px-[20px] min-w-[165px] dark:bg-[#24262B] bg-white rounded-[12px]"
          >
            <Menu.Button className="flex-1">
              <div className="flex items-center justify-between w-full" role="button">
                <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                  <div className="flex-1 text-start dark:text-white text-black">{optionFilter.type.name}</div>
                </div>
                <div className="flex items-center justify-start gap-[10px]">
                  <ChevronDownIcon className=" dark:text-white text-black" width={15} />
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
              <Menu.Items className="absolute dark:bg-[#24262B] bg-white w-full origin-top-right right-0 top-[50px] z-[10] cursor-pointer">
                <div className="py-1">
                  {LIST_FILTER_TYPE.map((item, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <div
                          className="flex items-center justify-start py-[10px] px-[20px] w-full dark:hover:bg-[#212b36] hover:bg-[#f5f6fa]"
                          role="button"
                          onClick={() => setOptionFilter({ ...optionFilter, type: item })}
                        >
                          <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                            <div className="flex-1 text-start dark:text-white text-black">{item.name}</div>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <Menu
            as="div"
            className="relative flex py-[10px] px-[20px] min-w-[165px] dark:bg-[#24262B] bg-white rounded-[12px]"
          >
            <Menu.Button className="flex-1">
              <div className="flex items-center justify-between w-full" role="button">
                <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                  <div className="flex-1 text-start dark:text-white text-black">{optionFilter.currency.symbol}</div>
                </div>
                <div className="flex items-center justify-start gap-[10px]">
                  <ChevronDownIcon className=" dark:text-white text-black" width={15} />
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
              <Menu.Items className="absolute dark:bg-[#24262B] bg-white w-full origin-top-right right-0 top-[50px] z-[10] cursor-pointer">
                <div className="py-1">
                  {CRYPTO_NORMAL_DATA.map((coin, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <div
                          className="flex items-center justify-start py-[10px] px-[20px] w-full dark:hover:bg-[#212b36] hover:bg-[#f5f6fa]"
                          role="button"
                          onClick={() => setOptionFilter({ ...optionFilter, currency: coin })}
                        >
                          <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                            <div className="flex-1 text-start dark:text-white text-black">{coin.symbol}</div>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <Menu
            as="div"
            className="relative flex py-[10px] px-[20px] min-w-[165px] dark:bg-[#24262B] bg-white rounded-[12px]"
          >
            <Menu.Button className="flex-1">
              <div className="flex items-center justify-between w-full" role="button">
                <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                  <div className="flex-1 text-start dark:text-white text-black">{optionFilter.dayPast.name}</div>
                </div>
                <div className="flex items-center justify-start gap-[10px]">
                  <ChevronDownIcon className=" dark:text-white text-black" width={15} />
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
              <Menu.Items className="absolute dark:bg-[#24262B] bg-white w-full origin-top-right right-0 top-[50px] z-[10] cursor-pointer">
                <div className="py-1">
                  {LIST_FILTER_DATE.map((item, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <div
                          className="flex items-center justify-start py-[10px] px-[20px] w-full dark:hover:bg-[#212b36] hover:bg-[#f5f6fa]"
                          role="button"
                          onClick={() => setOptionFilter({ ...optionFilter, dayPast: item })}
                        >
                          <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                            <div className="flex-1 text-start dark:text-white text-black">{item.name}</div>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          {optionFilter.type.name === String(t('transaction:Bill')) && (
            <Menu
              as="div"
              className="relative flex py-[10px] px-[20px] min-w-[165px] dark:bg-[#24262B] bg-white rounded-[12px]"
            >
              <Menu.Button className="flex-1">
                <div className="flex items-center justify-between w-full" role="button">
                  <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                    <div className="flex-1 text-start dark:text-white text-black capitalize">{typeBill}</div>
                  </div>
                  <div className="flex items-center justify-start gap-[10px]">
                    <ChevronDownIcon className=" dark:text-white text-black" width={15} />
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
                <Menu.Items className="absolute dark:bg-[#24262B] bg-white w-full origin-top-right right-0 top-[50px] z-[10] cursor-pointer">
                  <div className="py-1">
                    {types.map((item, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className="flex items-center justify-start py-[10px] px-[20px] w-full dark:hover:bg-[#212b36] hover:bg-[#f5f6fa]"
                            role="button"
                            onClick={() => setTypeBill(item.type)}
                          >
                            <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                              <div className="flex-1 text-start dark:text-white text-black capitalize">{item.type}</div>
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
          {optionFilter.type.name === String(t('transaction:withdraw')) && (
            <Menu
              as="div"
              className="relative flex py-[10px] px-[20px] min-w-[165px] dark:bg-[#24262B] bg-white rounded-[12px]"
            >
              <Menu.Button className="flex-1">
                <div className="flex items-center justify-between w-full" role="button">
                  <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                    <div className="flex-1 text-start dark:text-white text-black">
                      {optionFilter?.filterStatus.name}
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-[10px]">
                    <ChevronDownIcon className=" dark:text-white text-black" width={15} />
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
                <Menu.Items className="absolute dark:bg-[#24262B] bg-white w-full origin-top-right right-0 top-[50px] z-[10] cursor-pointer">
                  <div className="py-1">
                    {LIST_FILTER_STATUS.map((item, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className="flex items-center justify-start py-[10px] px-[20px] w-full dark:hover:bg-[#212b36] hover:bg-[#f5f6fa]"
                            role="button"
                            onClick={() => setOptionFilter({ ...optionFilter, filterStatus: item })}
                          >
                            <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                              <div className="flex-1 text-start dark:text-white text-black">{item.name}</div>
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>
        <TableComponent isLoading={isLoading} handleClickRow={handleClickRow} data={dataTable} columns={columns} />
        <Paging
          onPageChange={handleChangePage}
          itemPerPage={limit}
          totalItem={totalTable}
          currentPage={page}
          setItemPerPage={handleChangeItemPerPage}
          hiddenPerPage={true}
        />
        {isShowDetailTransaction && (
          <ModalDetailTransaction
            show={isShowDetailTransaction}
            titleModal={String(t('transaction:transactionDetail'))}
            onClose={() => {
              setIsShowDetailTransaction(false);
            }}
            transaction={transaction}
            type={optionFilter.type.name}
          />
        )}
      </div>
    </div>
  );
};

const TransactionPageAuth = withAuth(TransactionPage);

TransactionPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default TransactionPageAuth;
