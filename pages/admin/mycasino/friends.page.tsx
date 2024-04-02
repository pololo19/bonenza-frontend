import { yupResolver } from '@hookform/resolvers/yup';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import * as yup from 'yup';

import { api_affiliateFriends } from '@/api/bonus';
import { DATE_TIME_SUBMIT_FORMAT_WITH_SECOND } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import AdminInputDateRange from '@/components/input/admin/AdminInputDateRange';
import AdminInputText from '@/components/input/admin/AdminInputText';
import AdminSelectBox from '@/components/input/admin/AdminSelectBox';
import AdminLayout from '@/components/layouts/admin.layout';
import Paging from '@/components/paging/paging';
import AdminTableComponent from '@/components/table/adminTable';

type FilterType = {
  username?: string;
  userId?: string;
  registrationDate?: any[];
  wagerDateRange?: any[];
  code?: string;
};

type AffiliateFriendType = {
  referralCode: string;
  registrationDate: Date;
  status: string;
  totalCommission: number;
  totalWager: number;
  userId: number;
  username: string;
};

const fiatDecimals = 4;
const cryptoDecimals = 8;

function AdminFriendsManagementPage() {
  const exchangeRate = useExchange();
  const [totalFriendsCnt, setTotalFriendsCnt] = useState(0);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const schema = yup.object().shape({});
  const [tableData, setTableData] = useState<AffiliateFriendType[]>([]);
  const { t } = useTranslation('');

  const { referralCode, user, viewInFiat, localFiat } = useSelector(
    (state: AppState) => ({
      referralCode: state.auth.user.referralCode,
      user: state.auth.user,
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const [page, setPage] = useState(1);

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : action === 'Prev' ? page - 1 : +action;
    setPage(newPage);
    getListFriends();
  };

  const handleChangeItemPerPage = (itemPerPage: number) => {
    setLimit(itemPerPage);
    setPage(1);
  };

  const { handleSubmit, control } = useForm<FilterType>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FilterType) => {
    await getListFriends(data);
  };

  const getListFriends = useCallback(
    async (filter?: FilterType) => {
      try {
        setIsLoadingTable(true);
        const registrationStartDate = filter?.registrationDate
          ? new Date(filter.registrationDate[0]).getTime()
          : undefined;
        const registrationEndDate = filter?.registrationDate
          ? new Date(filter.registrationDate[1]).getTime()
          : undefined;
        const wagerStartDate = filter?.wagerDateRange ? new Date(filter.wagerDateRange[0]).getTime() : undefined;
        const wagerEndDate = filter?.wagerDateRange ? new Date(filter.wagerDateRange[0]).getTime() : undefined;
        const _res = await api_affiliateFriends(
          page,
          limit,
          filter?.username,
          filter?.userId,
          registrationStartDate,
          registrationEndDate,
          wagerStartDate,
          wagerEndDate,
        );
        const tempFriendsData =
          _res.data?.friends.map((item: any) => ({
            referralCode: referralCode,
            registrationDate: new Date(item.userRegisteredDate),
            status: '',
            totalCommission: Number(item.totalCommissionRewardsAmountUsd || 0),
            totalWager: Number(item.totalWagerAmountUsd || 0),
            userId: item.userId,
            username: item.userName,
          })) || [];
        setTotalRows(Number(_res.data?.totalCount || 0));
        setTotalFriendsCnt(Number(_res.data?.totalCount || 0));
        setTableData(tempFriendsData);
      } catch (error) {
        setTableData([]);
      } finally {
        setIsLoadingTable(false);
      }
    },
    [page, referralCode, limit],
  );

  useEffect(() => {
    getListFriends();
  }, []);

  const columns: ColumnDef<AffiliateFriendType>[] = useMemo(() => {
    return [
      {
        accessorKey: 'username',
        header: () => <div className="text-left">Username</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{row.original.username}</div>
          </div>
        ),
      },
      {
        accessorKey: 'userId',
        header: () => <div className="text-left">UserId</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{row.original.userId}</div>
          </div>
        ),
      },
      {
        accessorKey: 'totalWager',
        header: () => <div className="text-left">{t('mycasino:totalWager')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">
              {viewInFiat
                ? currencyFormat1(row.original.totalWager * exchangeRate, fiatDecimals, localFiat?.name)
                : currencyFormat1(row.original.totalWager, fiatDecimals)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'totalCommission',
        header: () => <div className="text-left">{t('mycasino:totalCommissionReward')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">
              {viewInFiat
                ? currencyFormat1(row.original.totalCommission * exchangeRate, fiatDecimals, localFiat?.name)
                : currencyFormat1(row.original.totalCommission, fiatDecimals)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'registrationDate',
        header: () => <div className="text-left">{t('mycasino:registrationDate')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">
              {formatDate(new Date(row.original.registrationDate), DATE_TIME_SUBMIT_FORMAT_WITH_SECOND)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'referralCode',
        header: () => <div className="text-left">{t('mycasino:code')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{row.original.referralCode}</div>
          </div>
        ),
      },
    ];
  }, []);

  return (
    <div>
      <div className="bg-white rounded border border-solid border-gray-200 p-4">
        <div className="min-h-[75px] flex items-center gap-[20px]">
          <span>
            <span>{t('mycasino:friendsNumber')}</span>&nbsp;&nbsp;
            <span className="text-[40px]">{totalFriendsCnt}</span>
          </span>
        </div>
      </div>
      <div className="bg-white rounded border border-solid border-gray-200 p-4 mt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="min-h-[120px] flex flex-wrap items-center gap-[20px]">
          <div className="flex flex-col items-start gap-1">
            <label htmlFor="username">{t('mycasino:Username')}</label>
            <AdminInputText control={control} name="username" placeholder="Please input" customClass="min-w-[350px]" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <label htmlFor="userId">{t('mycasino:UserId')}</label>
            <AdminInputText control={control} name="userId" placeholder="Please input" customClass="min-w-[350px]" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <label htmlFor="registrationDate">{t('mycasino:registrationDate')}</label>
            <AdminInputDateRange control={control} name="registrationDate" customClass="min-w-[350px]" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <label htmlFor="wagerDateRange">{t('mycasino:wagerDateRange')}</label>
            <AdminInputDateRange control={control} name="wagerDateRange" customClass="min-w-[350px]" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <label htmlFor="code">{t('mycasino:code')}</label>
            <AdminSelectBox
              control={control}
              name="code"
              customClass="min-w-[350px]"
              options={[
                {
                  value: 'all',
                  label: 'All',
                },
                {
                  value: 'lucy',
                  label: 'Lucy',
                },
                {
                  value: 'tom',
                  label: 'Tom',
                },
              ]}
            />
          </div>
          <div className="flex flex-col items-start gap-1">
            <label className="opacity-0">1</label>
            <button className="bg-gradient-btn-play px-6 py-1 rounded-default text-white" type="submit">
              {t('mycasino:search')}
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white rounded border border-solid border-gray-200 p-4 mt-4">
        <AdminTableComponent
          containerClassName="w-full"
          isLoading={isLoadingTable}
          data={tableData}
          columns={columns}
        />
        <Paging
          onPageChange={handleChangePage}
          itemPerPage={limit}
          totalItem={totalRows}
          currentPage={page}
          setItemPerPage={handleChangeItemPerPage}
          hiddenPerPage={true}
        />
      </div>
    </div>
  );
}

AdminFriendsManagementPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminFriendsManagementPage;
