import { yupResolver } from '@hookform/resolvers/yup';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { Clock, RulerPen } from 'iconsax-react';
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { api_affiliateReferralRewards, api_affiliateReferralRewardsWithdrw } from '@/api/bonus';
import { DATE_TIME_SUBMIT_FORMAT_WITH_SECOND, TOAST_ENUM } from '@/base/constants/common';
import { formatDate } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import AdminInputDateRange from '@/components/input/admin/AdminInputDateRange';
import AdminInputText from '@/components/input/admin/AdminInputText';
import AdminLayout from '@/components/layouts/admin.layout';
import Paging from '@/components/paging/paging';
import AdminTableComponent from '@/components/table/adminTable';

type FilterType = {
  username?: string;
  registrationDate?: any[];
};

type RewardType = {
  level: number;
  referralCode: string;
  registrationTime: Date;
  totalEarnedMe: string;
  userName: string;
};

function AdminRewardsPage() {
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [tableData, setTableData] = useState<RewardType[]>([]);
  const { t } = useTranslation('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [referralRewardsAmount, setReferralRewardsAmount] = useState(0);
  const [referralRewards, setReferralRewards] = useState({
    totalReferralRewardsReceivedAmountUsd: 0,
    rewardsAvailableAmountUsd: 0,
  });
  const { referralCode } = useSelector(
    (state: AppState) => ({
      referralCode: state.auth.user.referralCode,
    }),
    shallowEqual,
  );

  const schema = yup.object().shape({});

  const { handleSubmit, control } = useForm<FilterType>({
    resolver: yupResolver(schema),
  });

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : page - 1;
    setPage(newPage);
    handleRewards();
  };

  const handleChangeItemPerPage = (itemPerPage: number) => {
    setLimit(itemPerPage);
    setPage(1);
  };

  const onSubmit = async (data: FilterType) => {
    await handleRewards(data);
  };

  const handleRewards = useCallback(
    async (filter?: FilterType) => {
      try {
        setIsLoadingTable(true);
        const registrationStartDate = filter?.registrationDate
          ? new Date(filter.registrationDate[0]).getTime()
          : undefined;
        const registrationEndDate = filter?.registrationDate
          ? new Date(filter.registrationDate[1]).getTime()
          : undefined;
        const _res = await api_affiliateReferralRewards(
          page,
          limit,
          filter?.username,
          registrationStartDate,
          registrationEndDate,
        );
        const tempTableData: RewardType[] =
          _res.data?.rewards?.map((item: any) => ({
            level: item.vipLevel,
            referralCode: referralCode,
            registrationTime: new Date(item.registrationDate),
            totalEarnedMe: item.earnedMe,
            userName: item.userName,
          })) || [];
        setTotalRows(Number(_res.data?.totalCount || 0));
        setReferralRewards({
          totalReferralRewardsReceivedAmountUsd: Number(_res.data?.totalReferralRewardsReceivedAmountUsd || 0),
          rewardsAvailableAmountUsd: Number(_res.data?.referralRewardsAvailableAmountUsd || 0),
        });
        setTableData(tempTableData);
      } catch (error) {
        setTableData([]);
      } finally {
        setIsLoadingTable(false);
      }
    },
    [page, limit],
  );

  const handleWithdraw = async () => {
    try {
      const _res = await api_affiliateReferralRewardsWithdrw();
      toast.success('Successfully Withdrawed', { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      const message = error.response?.data?.message ?? '';
      const status = error.response?.data?.statusCode ?? '';
      const description = error.response?.data?.error ?? '';
      toast.error(description, { containerId: TOAST_ENUM.COMMON });
    }
  };

  const columns: ColumnDef<RewardType>[] = useMemo(() => {
    return [
      {
        accessorKey: 'username',
        header: () => <div className="text-left">Username</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{row.original.userName}</div>
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
    handleRewards();
  }, []);

  return (
    <div>
      <div className="bg-white rounded border border-solid border-gray-200 p-4">
        <div className="min-h-[75px] lg:flex-row flex-col flex lg:items-center items-start justify-between gap-[20px]">
          <div className="flex lg:flex-row flex-col lg:items-end items-start gap-[20px] flex-1">
            <div>
              <div>
                <span className="text-[#6f6f6f]">{t('mycasino:newlyAvailable')}</span>&nbsp;&nbsp;
                <span className="text-[40px] text-color-secondary font-[500]">
                  {referralRewards.rewardsAvailableAmountUsd} USD
                </span>
              </div>
              <div className="flex lg:flex-row flex-col lg:items-center items-start gap-4 text-[14px]">
                <div>
                  {t('mycasino:receivedInTotal')}{' '}
                  <span className="text-[14px] text-color-secondary">
                    {referralRewards.totalReferralRewardsReceivedAmountUsd} USD
                  </span>
                </div>
                <div>
                  {t('mycasino:theFriends')}
                  <span className="text-[14px] text-color-secondary">20 USD</span>
                </div>
              </div>
            </div>
            <button className="bg-gradient-btn-default px-6 py-2 rounded-default text-white" onClick={handleWithdraw}>
              {t('mycasino:withdraw')}
            </button>
          </div>
          {/* <div className="flex items-center text-[14px] gap-4">
            <button className="flex items-center gap-1 font-[500]">
              <Clock size={18} variant="Bold" />
              {t('mycasino:history')}
            </button>
            <button className="flex items-center gap-1 font-[500]">
              <RulerPen size={18} variant="Bold" />
              {t('mycasino:rule')}
            </button>
          </div> */}
        </div>
      </div>
      <div className="bg-white rounded border border-solid border-gray-200 p-4 mt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="min-h-[120px] flex flex-wrap items-center gap-[20px]">
          <div className="flex flex-col items-start gap-1">
            <label htmlFor="username">{t('mycasino:Username')}</label>
            <AdminInputText control={control} name="username" placeholder="Please input" customClass="min-w-[200px]" />
          </div>

          <div className="flex flex-col items-start gap-1">
            <label htmlFor="registrationDate">{t('mycasino:registrationDate')}</label>
            <AdminInputDateRange control={control} name="registrationDate" customClass="min-w-[350px]" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <label className="opacity-0">1</label>
            <button className="bg-gradient-btn-default px-6 py-1 rounded-default text-white" type="submit">
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

AdminRewardsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminRewardsPage;
