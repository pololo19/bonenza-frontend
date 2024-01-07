import api from '@/api/api';
import { DATE_TIME_SUBMIT_FORMAT_WITH_SECOND } from '@/base/constants/common';
import { formatDate } from '@/base/libs/utils';
import AdminInputDateRange from '@/components/input/admin/AdminInputDateRange';
import AdminInputText from '@/components/input/admin/AdminInputText';
import AdminLayout from '@/components/layouts/admin.layout';
import AdminTableComponent from '@/components/table/adminTable';
import { yupResolver } from '@hookform/resolvers/yup';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { Clock, RulerPen } from 'iconsax-react';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

type FilterType = {
  username?: string;
  registrationDate?: any[];
};

type RewardType = {
  level?: number;
  referralCode?: string;
  registrationTime?: Date;
  totalEarnedMe?: string;
  username?: string;
};

function AdminRewardsPage() {
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [tableData, setTableData] = useState<RewardType[]>([]);
  const { t } = useTranslation('');

  const schema = yup.object().shape({});

  const { handleSubmit, control } = useForm<FilterType>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FilterType) => {
    await handleListFriend(data);
    console.log('data', data.registrationDate);
  };

  const handleListFriend = async (filter?: FilterType) => {
    try {
      setIsLoadingTable(true);
      const res = await api.get('affiliate/get-reward-list', {
        params: {
          username: filter?.username,
          startDate: filter?.registrationDate?.[0]?.$d,
          endDate: filter?.registrationDate?.[1]?.$d,
        },
      });
      setTableData(res.data.data);
    } catch (error) {
      setTableData([]);
    } finally {
      setIsLoadingTable(false);
    }
  };

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
        accessorKey: 'level',
        header: () => <div className="text-left">VIP Level</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{row.original.level}</div>
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
        accessorKey: 'registrationTime',
        header: () => <div className="text-left">{t('mycasino:registrationTime')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">
              {formatDate(new Date(row.original.registrationTime), DATE_TIME_SUBMIT_FORMAT_WITH_SECOND)}
            </div>
          </div>
        ),
      },
    ];
  }, []);

  useEffect(() => {
    handleListFriend();
  }, []);

  return (
    <div>
      <div className="bg-white rounded border border-solid border-gray-200 p-4">
        <div className="min-h-[75px] lg:flex-row flex-col flex lg:items-center items-start justify-between gap-[20px]">
          <div className="flex lg:flex-row flex-col lg:items-end items-start gap-[20px] flex-1">
            <div>
              <div>
                <span className="text-[#6f6f6f]">{t('mycasino:newlyAvailable')}</span>&nbsp;&nbsp;
                <span className="text-[40px] text-amber-400 font-[500]">20 USD</span>
              </div>
              <div className="flex lg:flex-row flex-col lg:items-center items-start gap-4 text-[14px]">
                <div>
                  {t('mycasino:receivedInTotal')} <span className="text-[14px] text-amber-400">20 USD</span>
                </div>
                <div>
                  {t('mycasino:theFriends')}
                  <span className="text-[14px] text-amber-400">20 USD</span>
                </div>
              </div>
            </div>
            <button className="bg-color-primary px-6 py-2 rounded-md text-white">{t('mycasino:withdraw')}</button>
          </div>
          <div className="flex items-center text-[14px] gap-4">
            <button className="flex items-center gap-1 font-[500]">
              <Clock size={18} variant="Bold" />
              {t('mycasino:history')}
            </button>
            <button className="flex items-center gap-1 font-[500]">
              <RulerPen size={18} variant="Bold" />
              {t('mycasino:rule')}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded border border-solid border-gray-200 p-4 mt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="min-h-[120px] flex flex-wrap items-center gap-[20px]">
          <div className="flex flex-col items-start gap-1">
            <label htmlFor="username">Username</label>
            <AdminInputText control={control} name="username" placeholder="Please input" customClass="min-w-[200px]" />
          </div>

          <div className="flex flex-col items-start gap-1">
            <label htmlFor="registrationDate">{t('mycasino:Username')}</label>
            <AdminInputDateRange control={control} name="registrationDate" customClass="min-w-[350px]" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <label className="opacity-0">1</label>
            <button className="bg-color-primary px-6 py-1 rounded-md text-white" type="submit">
              {t('m')}
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

AdminRewardsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminRewardsPage;
