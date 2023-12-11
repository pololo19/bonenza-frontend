import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { currencyFormat, exchangeByLocaleFiat, formatDate, handleLocaleSymbol } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { UserDetail, WagerDetail } from '@/base/types/common';
import Paging from '@/components/paging/paging';
import RankingTableComponent from '@/components/table/rankingTable';

type WagerContestProps = {
  userData?: UserDetail;
};

export default function WagerContest({ userData }: WagerContestProps) {
  const { t } = useTranslation('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalTable, setTotalTable] = useState(0);
  const [listWager, setListWager] = useState<WagerDetail[]>([]);

  const { localeFiat, userId } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
      userId: state.auth.userId,
    }),
    shallowEqual,
  );

  const wagerColumns = useMemo(() => {
    const wagerColumnsDefault: ColumnDef<any>[] = [
      {
        accessorKey: 'dateReceive',
        header: () => <div className="text-left pl-6 text-[12px] font-normal">{t('profile:date')}</div>,
        cell: ({ row }) => (
          <div className="font-bold text-[14px] text-left dark:text-[#98a7b5] text-[#000] truncate">
            {formatDate(new Date(row.original?.dateReceive), 'LL/dd/yyyy')} {t('profile:daily')}
          </div>
        ),
      },
      {
        accessorKey: 'rank',
        header: () => <div className="text-center text-[12px] font-normal">{t('profile:position')}</div>,
        cell: ({ row }) => (
          <div className="font-bold text-[14px] dark:text-white text-[#000] truncate text-center">
            {row.original.rank}th
          </div>
        ),
      },
      {
        accessorKey: 'currency',
        header: () => <div className="text-right pr-6 text-[12px] font-normal">{t('profile:prize')}</div>,
        cell: ({ row }) => (
          <div className="text-[#98A7B5] truncate flex items-center justify-end gap-[5px]">
            <span className="dark:text-white text-black font-bold text-[14px]">
              {localeFiat
                ? `${handleLocaleSymbol(String(localeFiat?.currency))} ${currencyFormat(
                    exchangeByLocaleFiat(row.original?.currency, String(localeFiat?.currency), row.original?.prize),
                    2,
                  )}`
                : `${currencyFormat(Number(row.original?.prize || 0), 2)}`}
            </span>
            <Image height={20} width={20} src={`/img/fiats/${row.original?.currency}.png`} alt="" />
          </div>
        ),
      },
    ];
    return wagerColumnsDefault;
  }, [t]);

  useEffect(() => {
    if (userData) getUserWagerContestList();
  }, [page, userData]);

  const getUserWagerContestList = async () => {
    let id = userData?.id || userData?.userId || userId;
    try {
      setIsLoading(true);
      const res = await api.get(`user-profile/get-wager-contest-list/${id}`, {
        params: {
          userId: id,
          limit,
          page,
        },
      });
      setListWager(res?.data.data);
      setTotalTable(res?.data.total);
    } catch (error) {
      setListWager([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : page - 1;
    setPage(newPage);
  };

  return (
    <>
      <div className="dark:bg-[#12181F] bg-white my-[24px]">
        {!isLoading && listWager.length > 0 && (
          <RankingTableComponent
            isLoading={isLoading}
            containerClassName="w-full dark:bg-[#12181F] bg-white"
            data={listWager}
            columns={wagerColumns}
          />
        )}
        {!isLoading && listWager.length === 0 && (
          <div className="flex justify-center relative">
            <Image src="/img/empty.png" width={200} height={200} className="w-[200px] h-[200px]" alt="" />
            <p className="absolute dark:text-[#98a7b5] text-[#31373d] text-[12px] sm:text-[14px] bottom-0 text-center">
              {t('table:noData')}
            </p>
          </div>
        )}
      </div>
      {totalTable > 0 && (
        <Paging onPageChange={handleChangePage} itemPerPage={limit} totalItem={totalTable} currentPage={page} />
      )}
    </>
  );
}
