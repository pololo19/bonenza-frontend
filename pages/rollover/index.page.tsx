/* eslint-disable @next/next/no-img-element */
import React, { Fragment, ReactElement, useEffect, useMemo, useState } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import { Menu, Transition } from '@headlessui/react';
import { ArrowRight2 } from 'iconsax-react';

import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';
import { useTranslation } from '@/base/config/i18next';
import api from '@/api/api';
import TableComponent from '@/components/table';
import Paging from '@/components/paging/paging';
import { currencyFormat, exchangeByLocaleFiat, formatDate, handleLocaleSymbol } from '@/base/libs/utils';
import { TIME_DATE_SUBMIT_FORMAT } from '@/base/constants/common';
import Image from 'next/image';
import { shallowEqual } from 'react-redux';
import { RootState } from '@/base/types/root-state';
import { useSelector } from 'react-redux';
import ModalDetailsRollover from '@/components/modal/rolloverDetail/RolloverDetail';

const RolloverPage = () => {
  const { t } = useTranslation('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalTable, setTotalTable] = useState<number>(0);
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [isShowDetailTransaction, setIsShowDetailTransaction] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<any>({});

  const { localeFiat, viewInFiat } = useSelector(
    (state: RootState) => ({
      localeFiat: state.common.localeFiat,
      viewInFiat: state.common.viewInFiat,
    }),
    shallowEqual,
  );

  const LIST_FILTER_TYPE = [
    { name: String(t('transaction:allType')), id: 1 },
    { name: String(t('transaction:deposit')), id: 2 },
    { name: String(t('transaction:Bonus')), id: 3 },
  ];

  const LIST_FILTER_STATUS = [
    { name: String(t('transaction:allStatus')), type: null },
    { name: String(t('transaction:notStarted')), type: 'not_started' },
    { name: String(t('transaction:onGoing')), type: 'on_going' },
    { name: String(t('transaction:done')), type: 'done' },
  ];

  const LIST_FILTER_EVENT_BONUS = [
    { name: String(t('transaction:bonusType')), type: null },
    { name: String(t('transaction:newbieTaskRewards')), type: 60 },
    { name: String(t('transaction:depositBonus')), type: 1 },
    { name: String(t('transaction:freeSpinWinnings')), type: 7 },
    { name: String(t('transaction:newbieLuckySpinBonus')), type: 90 },
    { name: String(t('transaction:eventBonus')), type: 90 },
  ];

  const [optionFilter, setOptionFilter] = useState({
    type: LIST_FILTER_TYPE[0],
    bonusEvent: LIST_FILTER_EVENT_BONUS[0],
    status: LIST_FILTER_STATUS[0],
  });

  const replaceStatus = (status: string) => {
    return status.split('_').join(' ');
  };

  const getColorStatus = (status: string) => {
    let bgColor = '';
    switch (status) {
      case 'on_going':
        bgColor = 'bg-[#efef19]';
        break;
      case 'not_started':
        bgColor = 'bg-[#c31414]';
        break;
      default:
        bgColor = 'bg-[#3BC117]';
        break;
    }
    return bgColor;
  };

  const columns: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        accessorKey: 'type',
        header: () => <div className="text-left dark:text-[#64748b] text-black">{String(t('transaction:type'))}</div>,
        cell: ({ row }) => <div className="dark:text-white text-black text-left truncate">{row.original?.type}</div>,
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
        minSize: 250,
      },
      {
        accessorKey: 'time',
        header: () => <div className="text-center dark:text-[#64748b] text-black">{String(t('transaction:time'))}</div>,
        cell: ({ row }) => (
          <div className="dark:text-white text-black text-center">
            {formatDate(new Date(row.original.time), TIME_DATE_SUBMIT_FORMAT)}
          </div>
        ),
        minSize: 150,
      },
      {
        accessorKey: 'status',
        header: () => (
          <div className="text-right dark:text-[#64748b] text-black">{String(t('transaction:status'))}</div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2 cursor-pointer">
            <div className={`w-[5px] h-[5px] rounded-full ${getColorStatus(row.original.status)}`}></div>
            <div className="dark:text-white text-black text-[12px] break-keep	">
              {replaceStatus(row.original.status)?.charAt(0).toUpperCase() +
                replaceStatus(row.original.status)?.slice(1)}
            </div>
            <ArrowRight2 className="h-[16px] w-[16px] dark:text-[#64748b] text-[#31373d]" />
          </div>
        ),
        maxSize: 30,
        minSize: 30,
      },
    ];
  }, [localeFiat, viewInFiat, t]);

  const handleGetRolloverOverview = async (page: number) => {
    if (optionFilter.type.name === LIST_FILTER_TYPE[2].name) {
      setDataTable([]);
      setTotalTable(0);
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.get('transaction-histories/get-rollover-overview', {
        params: {
          type: optionFilter.type.name.toLowerCase(),
          status: optionFilter.status.type,
          page: page,
          limit,
        },
      });
      setDataTable(res.data.data);
      setTotalTable(res.data.total);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickRow = (row: Row<any>) => {
    setIsShowDetailTransaction(true);
    setTransaction(row.original);
  };

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : page - 1;
    setPage(newPage);
    handleGetRolloverOverview(newPage);
  };

  const handleChangeItemPerPage = (itemPerPage: number) => {
    setLimit(itemPerPage);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
    handleGetRolloverOverview(1);
  }, [optionFilter, limit]);

  return (
    <div>
      <Head>
        <title>Rollover Overview - Bonenza</title>
      </Head>
      <div className="w-full h-1/3 sm:min-h-[400px] p-3 md:p-5 dark:bg-[#31343D] bg-[#f5f6f7] dark:text-white text-black">
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
                          className="flex items-center justify-start py-[10px] px-[16px] w-full dark:hover:bg-[#212b36] hover:bg-[#f5f6fa]"
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
          {optionFilter.type.name === String(t('transaction:Bonus')) && (
            <Menu
              as="div"
              className="relative flex py-[10px] px-[20px] min-w-[165px] dark:bg-[#24262B] bg-white rounded-[12px]"
            >
              <Menu.Button className="flex-1">
                <div className="flex items-center justify-between w-full" role="button">
                  <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                    <div className="flex-1 text-start dark:text-white text-black">{optionFilter.bonusEvent.name}</div>
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
                    {LIST_FILTER_EVENT_BONUS.map((item, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className="flex items-center justify-start py-[10px] px-[16px] w-full dark:hover:bg-[#212b36] hover:bg-[#f5f6fa]"
                            role="button"
                            onClick={() => setOptionFilter({ ...optionFilter, bonusEvent: item })}
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
          <Menu
            as="div"
            className="relative flex py-[10px] px-[20px] min-w-[165px] dark:bg-[#24262B] bg-white rounded-[12px]"
          >
            <Menu.Button className="flex-1">
              <div className="flex items-center justify-between w-full" role="button">
                <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                  <div className="flex-1 text-start dark:text-white text-black">{optionFilter.status.name}</div>
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
                          className="flex items-center justify-start py-[10px] px-[16px] w-full dark:hover:bg-[#212b36] hover:bg-[#f5f6fa]"
                          role="button"
                          onClick={() => setOptionFilter({ ...optionFilter, status: item })}
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
        </div>
        {(isLoading || !!dataTable.length) && (
          <>
            <TableComponent isLoading={isLoading} handleClickRow={handleClickRow} data={dataTable} columns={columns} />
            <Paging
              onPageChange={handleChangePage}
              itemPerPage={limit}
              totalItem={totalTable}
              currentPage={page}
              setItemPerPage={handleChangeItemPerPage}
              hiddenPerPage={true}
            />
          </>
        )}
        {!isLoading && dataTable.length === 0 && (
          <div className="relative flex items-center justify-center  my-[32px]">
            <Image src="/img/empty.png" width={200} height={200} alt="" />
            <p className="absolute dark:text-[#98a7b5] text-[#31373d] text-[12px] sm:text-[14px] bottom-0 text-center">
              {t('table:noData')}
            </p>
          </div>
        )}
        {isShowDetailTransaction && (
          <ModalDetailsRollover
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

const RolloverPageAuth = withAuth(RolloverPage);

RolloverPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default RolloverPageAuth;
