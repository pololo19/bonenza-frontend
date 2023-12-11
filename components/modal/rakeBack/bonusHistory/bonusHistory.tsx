import { Dialog, DialogProps, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { ElementType, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { TIME_SUBMIT_FORMAT_WITH_MARKER } from '@/base/constants/common';
import { currencyFormat, exchangeByLocaleFiat, formatDate, handleLocaleSymbol } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { FiatType } from '@/base/types/common';
import TableComponent from '@/components/table';

type ModalBonusHistory = {
  cryptoLocked?: FiatType;
  onClose: () => void;
  show: boolean;
  setShowModalRakeBack: () => void;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalBonusHistory({ show, onClose, cryptoLocked, setShowModalRakeBack }: ModalBonusHistory) {
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation('');
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [listTypes, setListTypes] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [listTransactions, setListTransactions] = useState<any[]>([]);
  const [totalTable, setTotalTable] = useState<number>(0);
  const { localeFiat } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
    }),
    shallowEqual,
  );

  const getListBonusTransaction = async (page?: number) => {
    try {
      setIsLoadingTable(true);
      const res = await api.get('vip/get-list-bonus-transactions', {
        params: {
          actionType: typeFilter,
          page: page,
          limit,
        },
      });
      setListTransactions(res?.data?.data);
      setTotalTable(res?.data?.total);
    } catch (error) {
    } finally {
      setIsLoadingTable(false);
    }
  };

  const columns = useMemo(() => {
    const columnsDefault: ColumnDef<any>[] = [
      {
        accessorKey: 'actionType',
        header: () => (
          <div className="text-left text-[12px] text-[#98a7b5] font-normal">{t('historyBonus:bonusType')}</div>
        ),
        cell: ({ row }) => (
          <div className="text-[12px] text-left dark:text-[#98a7b5] text-[#000] truncate">
            {row?.original?.actionType}
          </div>
        ),
        minSize: 50,
        maxSize: 80,
      },
      {
        accessorKey: 'amountClaimed',
        header: () => (
          <div className="text-center text-[12px] font-normal text-[#98a7b5]">{t('historyBonus:amountClaimed')}</div>
        ),
        cell: ({ row }) => (
          <div className="font-bold text-[12px] flex justify-center gap-1 dark:text-white text-[#000] truncate text-center">
            {localeFiat ? (
              <>
                {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                {currencyFormat(
                  exchangeByLocaleFiat(
                    row.original?.symbol,
                    String(localeFiat?.currency),
                    Math.abs(row.original?.amountClaimed),
                  ),
                  2,
                )}
              </>
            ) : (
              currencyFormat(Math.abs(row.original?.amountClaimed), 2)
            )}
            <Image height={20} width={20} src={`/img/fiats/${row.original?.symbol}.png`} alt="" />
          </div>
        ),
        minSize: 200,
        maxSize: 200,
      },
      {
        accessorKey: 'createdAt',
        header: () => <div className="text-right text-[12px] text-[#98a7b5] font-normal">{t('historyBonus:time')}</div>,
        cell: ({ row }) => (
          <div className="text-[#98A7B5] truncate flex items-center justify-end gap-[5px]">
            {formatDate(new Date(row.original.createdAt), TIME_SUBMIT_FORMAT_WITH_MARKER)}
          </div>
        ),
      },
    ];
    return columnsDefault;
  }, [t, localeFiat]);

  const handleCloseModal = () => {
    onClose();
    setShowModalRakeBack();
  };
  useEffect(() => {
    getListBonusTransaction();
  }, []);

  return (
    <>
      <Transition.Root show={show} as={Fragment}>
        <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10">
            <div className="flex min-h-full justify-center p-0 sm:p-4 text-center items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95"
              >
                <Dialog.Panel className="!overflow-hidden dark:text-[#98a7b5] text-[#31373d] dark:bg-[#1e2024] bg-white text-[14px] sm:max-w-[550px] h-screen sm:h-[720px] sm:max-h-[80vh] relative transform rounded-[15px] text-left shadow-xl transition-all my-0 w-full !p-0">
                  <Dialog.Title
                    as="div"
                    className="relative h-[60px] px-[20px] flex justify-between dark:bg-[#17181b] bg-[#f5f6fa] items-center"
                  >
                    <div className="text-[16px] dark:text-white text-black">USDT {t('deposit:bonusHistory')}</div>
                    <div className="group rounded-md" role="button" onClick={() => handleCloseModal()}>
                      <XMarkIcon
                        width={15}
                        className="text-[#9FA5AC] group-hover:text-black dark:group-hover:text-white w-[1.5rem] h-[1.5rem]"
                      />
                    </div>
                  </Dialog.Title>
                  <div className="bg-[#2D3035] p-3 pb-0">
                    <TableComponent
                      isLoading={isLoadingTable}
                      handleClickRow={() => {}}
                      data={listTransactions}
                      columns={columns}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
