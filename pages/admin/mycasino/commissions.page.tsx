import { yupResolver } from '@hookform/resolvers/yup';
import { ColumnDef } from '@tanstack/react-table';
import { Select, Space } from 'antd';
import cn from 'classnames';
import { Clock, RulerPen } from 'iconsax-react';
import Image from 'next/image';
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { api_affiliateCommissionRewards, api_affiliateCommissionRewardsHistory } from '@/api/bonus';
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
};

function AdminRewardsPage() {
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);

  const { t } = useTranslation('');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [totalCommissionRewardsAmountUsd, setTotalCommissionRewardsAmountUsd] = useState(0);
  const [tableData, setTableData] = useState<CommissionRewardType[]>([]);
  const schema = yup.object().shape({});

  const { handleSubmit, control } = useForm<FilterType>({
    resolver: yupResolver(schema),
  });

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : page - 1;
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
      }));
      setTotalCommissionRewardsAmountUsd(Number(_resAffiliateTotal.data?.totalCommissionRewardsAmountUsd));
      setTotalRows(Number(_resAffiliateTotal.data?.totalCount || 0));
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

  const columns: ColumnDef<CommissionRewardType>[] = useMemo(() => {
    return [
      {
        accessorKey: 'totalCommissionRewards',
        header: () => <div className="text-left">{t('mycasino:totalCommission')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{row.original.totalCommissionRewards}</div>
          </div>
        ),
      },
      {
        accessorKey: 'commissionRewardsAvailable',
        header: () => <div className="text-left">{t('mycasino:commissionRewards')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{`${row.original.commissionRewardsAvailable} ${row.original.currencyName}`}</div>
          </div>
        ),
      },
    ];
  }, []);

  return (
    <div>
      <div className="bg-white rounded border border-solid border-gray-200 p-4">
        <div className="min-h-[75px] flex items-center justify-between gap-[20px]">
          <div>
            <span>{t('mycasino:totalCommissionRewards')}</span>&nbsp;&nbsp;
            <span className="text-[40px] text-amber-400 font-[700]">{totalCommissionRewardsAmountUsd} USD</span>
          </div>
          {/* <div className="flex items-center text-[14px] gap-4">
            <button className="flex items-center gap-1 font-[500]">
              <Clock size={18} variant="Bold" />
              {t('mycasino:history')}
            </button>
          </div> */}
        </div>
      </div>
      <div className="bg-white rounded border border-solid border-gray-200 p-4 mt-4 flex gap-4">
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
