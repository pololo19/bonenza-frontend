import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowLeft2 } from 'iconsax-react';
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
      setLatestSpins(tempLatestSpin.slice(0, 20));
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
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">
          {t('profile:username')}
        </div>
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
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">
          {t('bonus:spinLevel')}
        </div>
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
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">
          {t('profile:prize')}
        </div>
      ),
      minSize: 30,
      cell: ({ row }) => (
        <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px] font-bold truncate flex gap-1 items-center justify-end">
          {row.original?.amount || ''}
          <Image
            width={25}
            height={25}
            className="ml-2 w-[20px] h-[20px]"
            src={row.original?.symbolLogo || '/img/fiats/USD.png'}
            alt=""
          />
        </div>
      ),
    },
  ];
  return (
    <>
      <CommonModal show={show} onClose={onClose} panelClass="sm:rounded max-w-full sm:max-w-[400px]">
        <div className="rounded-large max-h-[723px] overflow-hidden overflow-y-scroll bg-[url('/img/spin/spin-background.png')] bg-cover relative">
          <div
            className={cn(
              'absolute top-[20px] left-[20px]',
              'dark:text-color-text-primary dark:hover:text-white text-color-light-text-primary hover:text-black',
            )}
            role="button"
            onClick={onClose}
          >
            <ArrowLeft2 width={16} className="stroke-[3]" />
          </div>
          <div className="w-[60%] object-cover m-auto py-4">
            <Image width={230} height={233} alt="" src="/img/spin/spin-winners.png" />
          </div>
          <div className="bg-black mx-4 mb-4 rounded-large overflow-hidden max-h-[598px]">
            <RankingTableComponent
              containerClassName="w-full"
              isLoading={isLoading}
              data={latestSpins}
              columns={spinColumns}
              isHeadInvisible
            />
          </div>
        </div>
      </CommonModal>
    </>
  );
}
