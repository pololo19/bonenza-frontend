import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { ElementType, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { api_getSpinLatest } from '@/api/spin';
import RankingTableComponent from '@/components/table/rankingTable';

import CommonModal from '../commonModal/commonModal';

type SpinDataType = {
  userName: string;
  userAvatar: string;
  amount: number;
  amountUsd: number;
  symbol: string;
  symbolLogo: string;
  type: string;
};

type ModalLatestSpinsProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalLatestSpins({ show, onClose }: ModalLatestSpinsProps) {
  const { t } = useTranslation('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [latestSpins, setLatestSpins] = useState<SpinDataType[]>([]);
  const getLatestSpin = async () => {
    try {
      setIsLoading(true);
      const res = await api_getSpinLatest();
      const tempLatestSpin = res.data.map((item: any) => ({
        amount: item?.amount || 0,
        amountUsd: item?.amountUsd || 0,
        symbol: item?.symbol || '',
        symbolLogo: item?.symbolLogo || '',
        type: item?.type || '',
        userAvatar: item?.userAvatar || '',
        userName: item?.userName || '',
      }));
      setLatestSpins(tempLatestSpin);
    } catch (error) {
      setLatestSpins([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    getLatestSpin();
  }, [show]);

  const spinColumns: ColumnDef<SpinDataType>[] = [
    {
      accessorKey: 'username',
      header: () => (
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">{t('profile:username')}</div>
      ),
      minSize: 30,
      cell: ({ row }) => (
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px] text-[10px] sm:text-m_default truncate">
          {row.original?.userName || ''}
        </div>
      ),
    },
    {
      accessorKey: 'spinLevel',
      header: () => (
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">{t('bonus:spinLevel')}</div>
      ),
      minSize: 30,
      cell: ({ row }) => (
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px] text-[10px] sm:text-m_default truncate">
          {row.original?.type || ''}
        </div>
      ),
    },
    {
      accessorKey: 'prize',
      header: () => (
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">{t('profile:prize')}</div>
      ),
      minSize: 30,
      cell: ({ row }) => (
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px] font-bold truncate flex gap-1 items-center justify-end">
          {row.original?.amount || ''}
          <Image
            width={25}
            height={25}
            className="w-[20px] h-[20px]"
            src={row.original?.symbolLogo || '/img/fiats/USD.png'}
            alt=""
          />
        </div>
      ),
    },
  ];
  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:rounded max-w-full sm:max-w-[400px]"
        header={
          <div className="text-center py-5">
            {t('bonus:spinBonus')}
          </div>
        }
      >
        <div className="pb-5">
          <RankingTableComponent
            containerClassName="w-full"
            isLoading={isLoading}
            data={latestSpins}
            columns={spinColumns}
          />
        </div>
      </CommonModal>
    </>
  );
}
