import AdminInputDateRange from '@/components/input/admin/AdminInputDateRange';
import AdminInputText from '@/components/input/admin/AdminInputText';
import AdminSelectBox from '@/components/input/admin/AdminSelectBox';
import AdminLayout from '@/components/layouts/admin.layout';
import AdminTableComponent from '@/components/table/adminTable';
import { yupResolver } from '@hookform/resolvers/yup';
import { ColumnDef } from '@tanstack/react-table';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import cn from 'classnames';
import api from '@/api/api';
import { DATE_TIME_SUBMIT_FORMAT_WITH_SECOND } from '@/base/constants/common';
import { formatDate } from '@/base/libs/utils';
import { Coin } from 'iconsax-react';
import { useTranslation } from 'react-i18next';

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
  totalCommission: string;
  totalDeposit: string;
  totalWager: string;
  userId: number;
  username: string;
};

function AdminFriendsManagementPage() {
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const schema = yup.object().shape({});
  const [tableData, setTableData] = useState<AffiliateFriendType[]>([]);
  const { t } = useTranslation('');

  const { handleSubmit, control } = useForm<FilterType>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FilterType) => {
    await handleListFriend(data);
  };

  const handleListFriend = async (filter?: FilterType) => {
    try {
      setIsLoadingTable(true);
      const res = await api.get('affiliate/get-list-friends-management', {
        params: {
          userid: filter?.userId,
          username: filter?.username,
        },
      });
      setTableData(res.data.data);
    } catch (error) {
      setTableData([]);
    } finally {
      setIsLoadingTable(false);
    }
  };

  useEffect(() => {
    handleListFriend();
  }, []);

  const columns: ColumnDef<any>[] = useMemo(() => {
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
        accessorKey: 'totalDeposit',
        header: () => <div className="text-left">{t('mycasino:totalDeposit')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{row.original.totalDeposit}</div>
          </div>
        ),
      },
      {
        accessorKey: 'totalWager',
        header: () => <div className="text-left">{t('mycasino:totalWager')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{row.original.totalWager}</div>
          </div>
        ),
      },
      {
        accessorKey: 'totalCommission',
        header: () => <div className="text-left">{t('mycasino:totalCommissionReward')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{row.original.totalCommission}</div>
          </div>
        ),
      },
      {
        accessorKey: 'registrationDate',
        header: () => <div className="text-left">{t('mycasino:registrationDate')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">
              {formatDate(new Date(row.original.createdAt), DATE_TIME_SUBMIT_FORMAT_WITH_SECOND)}
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
      {
        accessorKey: 'status',
        header: () => <div className="text-left">{t('mycasino:status')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{row.original.status}</div>
          </div>
        ),
      },
      {
        accessorKey: 'tip',
        header: () => <div className="text-left">{t('mycasino:status')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-amber-500 gap-[5px] truncate')}>
            <Coin size={20} />
            <div className="font-bold truncate">{t('mycasino:tip')}</div>
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
            <span className="text-[40px]">20</span>
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
            <button className="bg-primary px-6 py-1 rounded-md" type="submit">
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
      </div>
    </div>
  );
}

AdminFriendsManagementPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminFriendsManagementPage;
