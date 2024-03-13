import { yupResolver } from '@hookform/resolvers/yup';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { RulerPen, Timer1 } from 'iconsax-react';
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { api_affiliateReferralRewards, api_affiliateReferralRewardsWithdrw } from '@/api/bonus';
import { DATE_TIME_SUBMIT_FORMAT_WITH_SECOND, TOAST_ENUM } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import AdminInputDateRange from '@/components/input/admin/AdminInputDateRange';
import AdminInputText from '@/components/input/admin/AdminInputText';
import AdminLayout from '@/components/layouts/admin.layout';
import ModalReferralRewardsRule from '@/components/modal/mycasino/reerralRewardsRule';
import ModalReferralRewardsHistory from '@/components/modal/mycasino/referralRewardsHistory';
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

const fiatDecimals = 2;
const cryptoDecimals = 4;

function AdminRewardsPage() {
  const exchangeRate = useExchange();
  const [isHistory, setIsHistory] = useState(false);
  const [isRule, setIsRule] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [tableData, setTableData] = useState<RewardType[]>([]);
  const { t } = useTranslation('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [referralRewards, setReferralRewards] = useState({
    totalReferralRewardsReceivedAmountUsd: 0,
    rewardsAvailableAmountUsd: 0,
  });
  const { referralCode, localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      referralCode: state.auth.user.referralCode,
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const schema = yup.object().shape({});

  const { handleSubmit, control } = useForm<FilterType>({
    resolver: yupResolver(schema),
  });

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : action === 'Prev' ? page - 1 : +action;
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
        header: () => <div className="text-left">{t('mycasino:Username')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{row.original.userName}</div>
          </div>
        ),
      },
      {
        accessorKey: 'level',
        header: () => <div className="text-left">{t('mycasino:vipLevel')}</div>,
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
                  {viewInFiat
                    ? currencyFormat1(
                        referralRewards.rewardsAvailableAmountUsd * exchangeRate,
                        fiatDecimals,
                        localFiat?.name,
                      )
                    : currencyFormat1(referralRewards.rewardsAvailableAmountUsd, fiatDecimals)}
                </span>
              </div>
              <div className="flex lg:flex-row flex-col lg:items-center items-start gap-4 text-[14px]">
                <div>
                  {t('mycasino:receivedInTotal')}{' '}
                  <span className="text-[14px] text-color-secondary">
                    {viewInFiat
                      ? currencyFormat1(
                          referralRewards.totalReferralRewardsReceivedAmountUsd * exchangeRate,
                          fiatDecimals,
                          localFiat?.name,
                        )
                      : currencyFormat1(referralRewards.totalReferralRewardsReceivedAmountUsd, fiatDecimals)}
                  </span>
                </div>
              </div>
            </div>
            <button className="bg-gradient-btn-play px-6 py-3 rounded-default text-white" onClick={handleWithdraw}>
              {t('mycasino:withdraw')}
            </button>
          </div>

          <div className="flex items-center gap-[10px]">
            <button className="flex items-center gap-[2px] font-bold text-default" onClick={() => setIsHistory(true)}>
              <Timer1 />
              {t('mycasino:history')}
            </button>
            <button className="flex items-center gap-[2px] font-bold text-default" onClick={() => setIsRule(true)}>
              <RulerPen />
              {t('mycasino:rule')}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded border border-solid border-gray-200 p-4 mt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-center gap-[20px]">
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
      {isHistory && <ModalReferralRewardsHistory show={isHistory} onClose={() => setIsHistory(false)} />}
      {isRule && <ModalReferralRewardsRule show={isRule} onClose={() => setIsRule(false)} />}
    </div>
  );
}

AdminRewardsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminRewardsPage;
