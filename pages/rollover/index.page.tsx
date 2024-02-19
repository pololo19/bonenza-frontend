import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { ColumnDef, Row } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowRight2 } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import React, { Fragment, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_getRollover } from '@/api/wallet';
import { useTranslation } from '@/base/config/i18next';
import { TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, formatDate, getColorByStatus } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { RolloverStatus, RolloverType } from '@/base/types/common';
import withAuth from '@/components/hoc/withAuth';
import DepositLayout from '@/components/layouts/deposit.layout';
import ModalDetailsRollover from '@/components/modal/rolloverDetail/RolloverDetail';
import Paging from '@/components/paging/paging';
import TableComponent from '@/components/table';

const LIST_FILTER_TYPE = [
  { name: 'transaction:allType', id: 1 },
  { name: 'transaction:deposit', id: 2 },
  { name: 'transaction:Bonus', id: 3 },
];

const LIST_FILTER_STATUS = [
  { name: 'transaction:allStatus', type: 'all' },
  { name: 'transaction:notStarted', type: 'not_started' },
  { name: 'transaction:onGoing', type: 'ongoing' },
  { name: 'transaction:done', type: 'done' },
];

const LIST_FILTER_EVENT_BONUS = [
  { name: 'transaction:bonusType', type: null },
  { name: 'transaction:newbieTaskRewards', type: 60 },
  { name: 'transaction:depositBonus', type: 1 },
  { name: 'transaction:freeSpinWinnings', type: 7 },
  { name: 'transaction:newbieLuckySpinBonus', type: 90 },
  { name: 'transaction:eventBonus', type: 90 },
];

const RolloverPage = () => {
  const exchange = useExchange();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalTable, setTotalTable] = useState<number>(0);
  const [dataTable, setDataTable] = useState<RolloverType[]>([]);
  const [isShowDetailTransaction, setIsShowDetailTransaction] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<RolloverType>({
    id: '',
    type: '',
    amount: 0,
    amountUsd: 0,
    pendingWagerRequiredAmount: 0,
    pendingWagerRequiredUsdAmount: 0,
    wagerCompletedAmount: 0,
    wagerCompletedUsdAmount: 0,
    withdrawableFoundsAmount: 0,
    withdrawableFoundsUsdAmount: 0,
    currency: '',
    currencyLogo: '',
    status: 'not_started',
    times: 0,
    createdAt: new Date(),
  });

  const { localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const [optionFilter, setOptionFilter] = useState({
    type: LIST_FILTER_TYPE[0],
    bonusEvent: LIST_FILTER_EVENT_BONUS[0],
    status: LIST_FILTER_STATUS[0],
  });

  const replaceStatus = (status: string) => {
    return status.split('_').join(' ');
  };

  const columns: ColumnDef<RolloverType>[] = useMemo(() => {
    return [
      {
        accessorKey: 'type',
        header: () => (
          <div className="text-left dark:text-color-text-primary text-black">{String(t('transaction:type'))}</div>
        ),
        cell: ({ row }) => <div className="dark:text-white text-black text-left truncate py-2">{row.original.type}</div>,
        minSize: 30,
      },
      {
        accessorKey: 'amount',
        header: () => (
          <div className="text-center dark:text-color-text-primary text-black">{String(t('transaction:amount'))}</div>
        ),
        cell: ({ row }) => (
          <div
            className={`${
              optionFilter.type.name === 'Withdraw' ? 'text-red-500' : 'text-color-primary'
            } flex items-center justify-center gap-1`}
          >
            {optionFilter.type.name === 'Withdraw' ? '-' : ''}
            {viewInFiat ? (
              <>{currencyFormat1(Math.abs(row.original.amountUsd) * exchange, 2, localFiat?.name || 'USD')}</>
            ) : (
              currencyFormat1(Math.abs(row.original.amount), 4, '', false)
            )}

            <Image height={20} width={20} src={`${row.original?.currencyLogo}`} alt="" />
          </div>
        ),
        minSize: 250,
      },
      {
        accessorKey: 'time',
        header: () => (
          <div className="text-center dark:text-color-text-primary text-black">{String(t('transaction:time'))}</div>
        ),
        cell: ({ row }) => (
          <div className="dark:text-white text-black text-center">
            {formatDate(new Date(row.original.createdAt), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
          </div>
        ),
        minSize: 150,
      },
      {
        accessorKey: 'status',
        header: () => (
          <div className="text-right dark:text-color-text-primary text-black">{String(t('transaction:status'))}</div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2 cursor-pointer">
            <div className={cn('w-[8px] h-[8px] rounded-full', {
              'bg-[#efef19]': row.original.status.toString() === 'processing' || 
                                row.original.status.toString() === 'pending' || 
                                row.original.status.toString() === 'refunding' ||
                                row.original.status.toString() === 'ongoing',
              'bg-[#c31414]': row.original.status.toString() === 'rejected' ||
                                row.original.status.toString() === 'failed' ||
                                row.original.status.toString() === 'not_started',
              'bg-[#3BC117]': row.original.status.toString() === 'done' ||
                                row.original.status.toString() === 'all' ||
                                row.original.status.toString() === 'complete' ||
                                row.original.status.toString() === 'approved'
            })}></div>
            <div className="dark:text-white text-black text-[14px] break-keep	">
              {replaceStatus(row.original.status)?.charAt(0).toUpperCase() +
                replaceStatus(row.original.status)?.slice(1)}
            </div>
            <ArrowRight2 className="h-[16px] w-[16px] dark:text-color-text-primary text-[#31373d]" />
          </div>
        ),
        maxSize: 30,
        minSize: 30,
      },
    ];
  }, [localFiat, i18n.language, exchange, viewInFiat]);

  const getRolloverOverview = useCallback(
    async (page: number) => {
      if (optionFilter.type.name === LIST_FILTER_TYPE[2].name) {
        setDataTable([]);
        setTotalTable(0);
        return;
      }
      try {
        setIsLoading(true);
        const _res = await api_getRollover({
          page,
          pageSize: limit,
          status: optionFilter.status.type as RolloverStatus,
        });
        const totalCount = _res.data?.totalCount;
        const tempRollovers: RolloverType[] = _res.data?.transactions?.map((item: any) => ({
          id: item?.id ?? '',
          type: 'Deposit',
          amount: Number(item?.amount || 0),
          amountUsd: Number(item?.amountUsd || 0),
          pendingWagerRequiredAmount: Number(item?.pendingWagerRequiredAmount || 0),
          pendingWagerRequiredUsdAmount: Number(item?.pendingWagerRequiredAmountUsd || 0),
          wagerCompletedAmount: Number(item?.wagerCompletedAmount || 0),
          wagerCompletedUsdAmount: Number(item?.wagerCompletedAmountUsd || 0),
          withdrawableFoundsAmount: Number(item?.withdrawableFoundsAmount || 0),
          withdrawableFoundsUsdAmount: Number(item?.withdrawableFoundsAmountUsd || 0),
          currency: item?.currencySymbol ?? 'USD',
          currencyLogo: item?.currencyLogo ?? '/image/fiats/USD.png',
          status: item?.rollover ?? 'not_started',
          times: item?.times ?? 0,
          createdAt: new Date(item?.createdAt ?? ''),
        }));
        setDataTable(tempRollovers);
        setTotalTable(totalCount);
      } catch (error) {
        setDataTable([]);
        setTotalTable(0);
      } finally {
        setIsLoading(false);
      }
    },
    [limit, optionFilter],
  );

  const handleClickRow = (row: Row<any>) => {
    setIsShowDetailTransaction(true);
    setTransaction(row.original);
  };

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : page - 1;
    setPage(newPage);
    getRolloverOverview(newPage);
  };

  const handleChangeItemPerPage = (itemPerPage: number) => {
    setLimit(itemPerPage);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
    getRolloverOverview(1);
  }, [optionFilter, limit]);

  return (
    <div>
      <Head>
        <title>Rollover Overview - Bonenza</title>
      </Head>
      <div className="w-full h-1/3 sm:min-h-[400px]">
        <div className="flex items-center flex-wrap mb-[40px] sm:gap-[20px] gap-[10px]">
          <Menu
            as="div"
            className="relative flex py-[10px] px-[20px] min-w-[165px] dark:bg-color-select-bg-primary bg-color-light-select-bg-primary rounded-[5px]"
          >
            <Menu.Button className="flex-1">
              <div className="flex items-center justify-between w-full" role="button">
                <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                  <div className="flex-1 text-start dark:text-white text-black">{t(optionFilter.type.name)}</div>
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
              <Menu.Items className="absolute dark:bg-color-select-bg-primary bg-color-light-select-bg-primary shadow-bs-default w-full origin-top-right right-0 top-[50px] z-[10] cursor-pointer">
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
                            <div className="flex-1 text-start dark:text-white text-black">{t(item.name)}</div>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          {optionFilter.type.id === 3 && (
            <Menu
              as="div"
              className="relative flex py-[10px] px-[20px] min-w-[165px] dark:bg-color-select-bg-primary bg-color-light-select-bg-primary rounded-[5px]"
            >
              <Menu.Button className="flex-1">
                <div className="flex items-center justify-between w-full" role="button">
                  <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                    <div className="flex-1 text-start dark:text-white text-black">
                      {t(optionFilter.bonusEvent.name)}
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
                <Menu.Items className="absolute dark:bg-color-select-bg-primary bg-color-light-select-bg-primary shadow-bs-default w-full origin-top-right right-0 top-[50px] z-[10] cursor-pointer">
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
                              <div className="flex-1 text-start dark:text-white text-black">{t(item.name)}</div>
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
            className="relative flex py-[10px] px-[20px] min-w-[165px] dark:bg-color-select-bg-primary bg-color-light-select-bg-primary rounded-[5px]"
          >
            <Menu.Button className="flex-1">
              <div className="flex items-center justify-between w-full" role="button">
                <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                  <div className="flex-1 text-start dark:text-white text-black">{t(optionFilter.status.name)}</div>
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
              <Menu.Items className="absolute dark:bg-color-select-bg-primary bg-color-light-select-bg-primary shadow-bs-default w-full origin-top-right right-0 top-[50px] z-[10] cursor-pointer">
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
                            <div className="flex-1 text-start dark:text-white text-black">{t(item.name)}</div>
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
        <TableComponent isLoading={isLoading} handleClickRow={handleClickRow} data={dataTable} columns={columns} />
        <Paging
          onPageChange={handleChangePage}
          itemPerPage={limit}
          totalItem={totalTable}
          currentPage={page}
          setItemPerPage={handleChangeItemPerPage}
          hiddenPerPage={true}
        />
        <ModalDetailsRollover
          show={isShowDetailTransaction}
          titleModal={String(t('transaction:transactionDetail'))}
          onClose={() => {
            setIsShowDetailTransaction(false);
          }}
          transaction={transaction}
          type={optionFilter.type.name}
        />
      </div>
    </div>
  );
};

const RolloverPageAuth = withAuth(RolloverPage);

RolloverPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <DepositLayout>{page}</DepositLayout>;
};

export default RolloverPageAuth;
