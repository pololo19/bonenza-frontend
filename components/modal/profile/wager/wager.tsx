import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_getContestHistory } from '@/api/user';
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
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [listWager, setListWager] = useState<WagerDetail[]>([]);

  const { localeFiat } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
      userId: state.auth.user.userId,
    }),
    shallowEqual,
  );

  const wagerColumns = useMemo(() => {
    const wagerColumnsDefault: ColumnDef<any>[] = [
      {
        accessorKey: 'date',
        header: () => <div className="text-left text-[14px] font-normal">{t('profile:date')}</div>,
        cell: ({ row }) => (
          <div className="font-medium text-[14px] text-left dark:text-[#98a7b5] text-[#000] truncate">
            {formatDate(new Date(row.original?.date), 'L/dd/yyyy')} {t('profile:daily')}
          </div>
        ),
      },
      {
        accessorKey: 'position',
        header: () => <div className="text-center text-[14px] font-normal">{t('profile:position')}</div>,
        cell: ({ row }) => (
          <div className="font-medium text-[14px] dark:text-white text-[#000] truncate text-center">
            {row.original.position}
            {row.original.position === 1 ? 'st' : row.original.position === 2 ? 'nd' : row.original.position === 3 ? 'rd' : 'th'} 
          </div>
        ),
      },
      {
        accessorKey: 'prize',
        header: () => <div className="text-right text-[14px] font-normal">{t('profile:prize')}</div>,
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
            <Image height={20} width={20} src={`/img/fiats/usdt.png`} alt="" />
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
    try {
      setIsLoading(true);
      const wager = await api_getContestHistory(page, limit);
      setListWager(wager.data.contest);
      setTotalRows(wager.data.totalCount);
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
    <div>
      <div className="mt-[24px] w-full">
        {!isLoading && listWager.length > 0 && (
          <RankingTableComponent
            isLoading={isLoading}
            containerClassName="w-full"
            data={listWager}
            columns={wagerColumns}
          />
        )}
        {!isLoading && listWager.length === 0 && (
          <div className="flex justify-center relative">
            <Image
              src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
              width={200}
              height={200}
              className="w-[200px] h-[200px]"
              alt=""
            />
            <p className="absolute dark:text-[#98a7b5] text-[#31373d] text-[12px] sm:text-[14px] bottom-0 text-center">
              {t('table:noData')}
            </p>
          </div>
        )}
      </div>
      {totalRows > 0 && (
        <Paging onPageChange={handleChangePage} itemPerPage={limit} totalItem={totalRows} currentPage={page} />
      )}
    </div>
  );
}
