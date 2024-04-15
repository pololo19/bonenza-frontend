import { yupResolver } from '@hookform/resolvers/yup';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { Clock } from 'iconsax-react';
import Image from 'next/image';
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import {
  api_affiliateCommissionRewards,
  api_affiliateCommissionRewardsHistory,
  api_affiliateCommissionRewardsWithdraw,
} from '@/api/bonus';
import { api_getClaims } from '@/api/wallet';
import { DATE_TIME_SUBMIT_FORMAT_WITH_SECOND, TOAST_ENUM } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { useUSDTPrice } from '@/base/hooks/useUSDTPrice';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
import { setLockedAmount } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import AdminLayout from '@/components/layouts/admin.layout';
import Paging from '@/components/paging/paging';
import AdminTableComponent from '@/components/table/adminTable';

type FilterType = {
  username?: string;
  registrationDate?: any[];
};

type CommissionRewardType = {
  totalCommissionRewards: number;
  commissionRewardsAvailable: number;
  currencyLogo: string;
  currencyName: string;
  time: string;
  status: boolean;
};

const decimals = 6;

function AdminRewardsPage() {
  const exchangeRate = useExchange();
  const usdtPrice = useUSDTPrice();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);

  const { t } = useTranslation('');
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [totalCommissionRewardsData, setTotalCommissionRewardsData] = useState({
    totalCommissionRewardsAmountUsd: 0,
    totalCommissionRewardsReceivedAmountUsd: 0,
    commissionRewardsAvailableAmountUsd: 0,
  });

  const { viewInFiat, localFiat } = useSelector(
    (state: AppState) => ({
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      localFiat: state.wallet.localFiat,
    }),
    shallowEqual,
  );
  const [tableData, setTableData] = useState<CommissionRewardType[]>([]);
  const schema = yup.object().shape({});

  const { handleSubmit, control } = useForm<FilterType>({
    resolver: yupResolver(schema),
  });

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : action === 'Prev' ? page - 1 : +action;
    setPage(newPage);
    getCommissionData();
  };

  const handleChangeItemPerPage = (itemPerPage: number) => {
    setLimit(itemPerPage);
    setPage(1);
  };

  const getCommissionData = useCallback(async () => {
    try {
      setIsLoadingTable(true);
      const [_resAffiliateTotal, _resAffiliateHistory] = await Promise.all([
        api_affiliateCommissionRewards(),
        api_affiliateCommissionRewardsHistory(page, limit),
      ]);
      const tempCommissionData = _resAffiliateHistory.data?.rewards?.map((reward: any) => ({
        totalCommissionRewards: Number(reward.totalCommissionRewards || 0),
        commissionRewardsAvailable: Number(reward.amount || 0),
        currencyLogo: reward.currencyLogo,
        currencyName: reward.currencyName,
        time: reward.time,
        status: reward.status,
      }));
      setTotalCommissionRewardsData({
        totalCommissionRewardsAmountUsd: Number(_resAffiliateTotal.data?.totalCommissionRewardsAmountUsd || 0),
        totalCommissionRewardsReceivedAmountUsd: Number(
          _resAffiliateTotal.data?.totalCommissionRewardsReceivedAmountUsd || 0,
        ),
        commissionRewardsAvailableAmountUsd: Number(_resAffiliateTotal.data?.commissionRewardsAvailableAmountUsd || 0),
      });

      setTotalRows(Number(_resAffiliateHistory.data?.totalCount || 0));
      setTableData(tempCommissionData);
    } catch (error) {
      setTableData([]);
    } finally {
      setIsLoadingTable(false);
    }
  }, [page, limit]);

  useEffect(() => {
    getCommissionData();
  }, []);

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      const _res = await api_affiliateCommissionRewardsWithdraw();

      const _resBonus = await api_getClaims();

      const tempLockedAmount = Number(_resBonus.data?.lockedAmount ?? 0);
      await getCommissionData();

      dispatch(setLockedAmount(tempLockedAmount));
      toast.success(`Your withdraw is successful`, { containerId: TOAST_ENUM.COMMON });
    } catch (error: any) {
      console.log(error);
      const message = error.response?.data?.message ?? '';
      const status = error.response?.data?.statusCode ?? '';
      const description = error.response?.data?.error ?? '';
      toast.error(description, { containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<CommissionRewardType>[] = useMemo(() => {
    return [
      {
        accessorKey: 'commissionRewardsAvailable',
        header: () => <div className="text-center text-[12px]">{t('mycasino:commissionRewards')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-center text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate flex gap-1">
              {`${
                viewInFiat
                  ? currencyFormat1(
                      row.original.commissionRewardsAvailable * usdtPrice * exchangeRate,
                      decimals,
                      localFiat?.name,
                    )
                  : currencyFormat1(row.original.commissionRewardsAvailable * usdtPrice, decimals)
              }`}
              <Image
                height={20}
                width={20}
                src={`/img/fiats/USDT.png`}
                alt=""
                onError={(e) => {
                  e.currentTarget.src = '/img/fiats/USDT.png';
                }}
              />
            </div>
          </div>
        ),
        minSize: 250,
        maxSize: 250,
      },
      {
        accessorKey: 'totalCommissionRewards',
        header: () => <div className="text-center text-[12px]">{t('historyBonus:time')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">
              {formatDate(new Date(row.original.time), DATE_TIME_SUBMIT_FORMAT_WITH_SECOND)}
            </div>
          </div>
        ),
        minSize: 100,
        maxSize: 100,
      },
      {
        accessorKey: 'status',
        header: () => <div className="text-center text-[12px]">{t('mycasino:status')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div
              className={cn('font-bold truncate', {
                'text-color-primary': row.original.status,
                'text-color-secondary': !row.original.status,
              })}
            >
              {row.original.status ? 'Successed' : 'Available'}
            </div>
          </div>
        ),
        minSize: 30,
        maxSize: 30,
      },
    ];
  }, [exchangeRate]);

  return (
    <div className="bg-white rounded border border-solid border-gray-200 p-4 flex flex-col xl:grid xl:grid-cols-2 gap-[40px]">
      <div className="flex flex-col items-center justify-start gap-[5px] mt-[15px]">
        <div className="flex items-center justify-between w-full">
          <span className="font-[600] text-[16px]">{t('mycasino:totalCommissionRewards')}</span>&nbsp;&nbsp;
          <span className="text-[32px] xl:text-[20px] 2xl:text-[32px] text-amber-400 font-[700] text-right truncate">
            {viewInFiat
              ? currencyFormat1(
                  totalCommissionRewardsData.totalCommissionRewardsReceivedAmountUsd * exchangeRate,
                  decimals,
                  localFiat?.name,
                )
              : currencyFormat1(totalCommissionRewardsData.totalCommissionRewardsReceivedAmountUsd, decimals)}
          </span>
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="font-[600] text-[16px]">{t('mycasino:totalCommission')}</span>&nbsp;&nbsp;
          <span className="text-[32px] xl:text-[20px] 2xl:text-[32px] text-amber-400 font-[700] text-right">
            {viewInFiat
              ? currencyFormat1(
                  totalCommissionRewardsData.totalCommissionRewardsAmountUsd * exchangeRate,
                  decimals,
                  localFiat?.name,
                )
              : currencyFormat1(totalCommissionRewardsData.totalCommissionRewardsAmountUsd, decimals)}
          </span>
        </div>

        <div className="flex items-center justify-between w-full">
          <span className="font-[600] text-[16px]">{t('mycasino:commissionRewards')}</span>&nbsp;&nbsp;
          <span className="text-[32px] xl:text-[20px] 2xl:text-[32px] text-amber-400 font-[700] text-right">
            {viewInFiat
              ? currencyFormat1(
                  totalCommissionRewardsData.commissionRewardsAvailableAmountUsd * exchangeRate,
                  decimals,
                  localFiat?.name,
                )
              : currencyFormat1(totalCommissionRewardsData.commissionRewardsAvailableAmountUsd, decimals)}
          </span>
        </div>
        <div className="flex items-center justify-end w-full">
          <button
            className="bg-gradient-btn-play px-6 py-3 rounded-default text-white flex items-center"
            onClick={handleWithdraw}
          >
            {isLoading && (
              <div className="w-fit px-1 flex items-center justify-center">
                <ReactLoading type={'spin'} width={20} height={20} />
              </div>
            )}

            {t('mycasino:withdraw')}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center gap-1">
          <Clock size={18} variant="Bold" />
          <span className="font-[600]">{t('mycasino:history')}</span>
        </div>
        <div className="w-full">
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
    </div>
  );
}

AdminRewardsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminRewardsPage;
