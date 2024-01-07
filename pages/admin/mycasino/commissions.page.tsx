import AdminInputDateRange from '@/components/input/admin/AdminInputDateRange';
import AdminInputText from '@/components/input/admin/AdminInputText';
import AdminLayout from '@/components/layouts/admin.layout';
import AdminTableComponent from '@/components/table/adminTable';
import { yupResolver } from '@hookform/resolvers/yup';
import { ColumnDef } from '@tanstack/react-table';
import { Select, Space } from 'antd';
import cn from 'classnames';
import { Clock, RulerPen } from 'iconsax-react';
import Image from 'next/image';
import { ReactElement, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

type FilterType = {
  username?: string;
  registrationDate?: any[];
};

function AdminRewardsPage() {
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);

  const { t } = useTranslation('');

  const schema = yup.object().shape({});

  const { handleSubmit, control } = useForm<FilterType>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FilterType) => {
    console.log('data', data);
  };

  const tableData = [
    {
      totalCommissionRewards: 'totalCommissionRewards',
      commissionRewardsAvailable: 'commissionRewardsAvailable',
    },
    {
      totalCommissionRewards: 'totalCommissionRewards',
      commissionRewardsAvailable: 'commissionRewardsAvailable',
    },
    {
      totalCommissionRewards: 'totalCommissionRewards',
      commissionRewardsAvailable: 'commissionRewardsAvailable',
    },
    {
      totalCommissionRewards: 'totalCommissionRewards',
      commissionRewardsAvailable: 'commissionRewardsAvailable',
    },
  ];

  const columns: ColumnDef<any>[] = useMemo(() => {
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
            <div className="font-bold truncate">{row.original.commissionRewardsAvailable}</div>
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
            <span className="text-[40px] text-amber-400 font-[700]">20 USD</span>
          </div>
          <div className="flex items-center text-[14px] gap-4">
            <button className="flex items-center gap-1 font-[500]">
              <Clock size={18} variant="Bold" />
              {t('mycasino:history')}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded border border-solid border-gray-200 p-4 mt-4 flex gap-4">
        <div className="max-w-[500px] w-[500px]">
          <AdminTableComponent
            containerClassName="w-full"
            isLoading={isLoadingTable}
            data={tableData}
            columns={columns}
          />
        </div>
        <div className="max-w-[500px] w-[500px] bg-[#f7f7fa] px-10 py-6">
          <div className="flex flex-col gap-2 items-center">
            <div className="text-[24px] text-[#36434c] font-[600] text-center">{t('mycasino:swapAll')}</div>
            <Select
              showSearch
              optionFilterProp="children"
              className="w-[80%]"
              options={[
                { label: 'USDT ($1 ~ $100000)', value: 'USDT', icon: 'USDT' },
                { label: 'BNB ($1 ~ $100000)', value: 'BNB', icon: 'BNB' },
                { label: 'ETH ($1 ~ $100000)', value: 'ETH', icon: 'ETH' },
                { label: 'GOD ($1 ~ $100000)', value: 'GOD', icon: 'GOD' },
                { label: 'DRON ($1 ~ $100000)', value: 'DRON', icon: 'DRON' },
              ]}
              optionRender={(option) => (
                <Space>
                  <Image src={`/img/fiats/${option.data.icon}.png`} alt="" width={20} height={20} />
                  {option.data.label}
                </Space>
              )}
            />
            <span className="text-[14px] text-[#36434c] font-[500] w-[60%] text-center">{t('mycasino:note')}</span>
            <button className="bg-color-primary px-6 py-1 rounded-md w-fit text-white text-[20px]" type="submit">
              {t('mycasino:swap')}
            </button>
          </div>
          <div className="flex flex-col gap-2 items-center mt-4">
            <div className="text-[24px] text-[#36434c] font-[600] text-center">{t('mycasino:allCryptos')}</div>
            <button className="bg-color-primary px-6 py-1 rounded-md w-fit text-white text-[20px]" type="submit">
              {t('mycasino:withdraw')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

AdminRewardsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminRewardsPage;
