import { Dialog, DialogProps, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { ElementType, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_bonusUsdtHistory } from '@/api/bonus';
import { useTranslation } from '@/base/config/i18next';
import { TIME_SUBMIT_FORMAT_WITH_MARKER } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
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

type ListTransactionType = {
  amount: number;
  amountUsd: number;
  type: string;
  time: string;
};
export default function ModalBonusHistory({ show, onClose, cryptoLocked, setShowModalRakeBack }: ModalBonusHistory) {
  const exchangeRate = useExchange();
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation('');
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [listTypes, setListTypes] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [listTransactions, setListTransactions] = useState<ListTransactionType[]>([]);
  const [totalTable, setTotalTable] = useState<number>(0);
  const { localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const getListBonusTransaction = useCallback(async () => {
    try {
      setIsLoadingTable(true);
      const res = await api_bonusUsdtHistory(page, limit);
      const tempListTransactionData: ListTransactionType[] = res.data?.map((item: any) => ({
        amount: item.amount,
        amountUsd: item.amountUsd,
        type: item.type,
        time: item.date,
      }));
      setListTransactions(tempListTransactionData);
      setTotalTable(0);
    } catch (error) {
    } finally {
      setIsLoadingTable(false);
    }
  }, [page, limit]);

  const columns = useMemo(() => {
    const columnsDefault: ColumnDef<any>[] = [
      {
        accessorKey: 'actionType',
        header: () => (
          <div className="text-left text-[12px] text-color-text font-normal">{t('historyBonus:bonusType')}</div>
        ),
        cell: ({ row }) => (
          <div className="text-[12px] text-left dark:text-color-text text-[#000] truncate">{row?.original?.type}</div>
        ),
        minSize: 50,
        maxSize: 80,
      },
      {
        accessorKey: 'amountClaimed',
        header: () => (
          <div className="text-center text-[12px] font-normal text-color-text">{t('historyBonus:amountClaimed')}</div>
        ),
        cell: ({ row }) => (
          <div className="font-bold text-[12px] flex justify-center gap-1 dark:text-white text-[#000] truncate text-center">
            {viewInFiat
              ? currencyFormat1(row.original.amountUsd * exchangeRate, 2, localFiat?.name || 'USD')
              : currencyFormat1(row.original.amount, 4, '', false)}
            <Image height={20} width={20} src={`/img/fiats/USDT.png`} alt="" />
          </div>
        ),
        minSize: 200,
        maxSize: 200,
      },
      {
        accessorKey: 'createdAt',
        header: () => (
          <div className="text-right text-[12px] text-color-text font-normal">{t('historyBonus:time')}</div>
        ),
        cell: ({ row }) => (
          <div className="text-color-text truncate flex items-center justify-end gap-[5px]">
            {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_MARKER)}
          </div>
        ),
      },
    ];
    return columnsDefault;
  }, [t, localFiat, exchangeRate]);

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
                <Dialog.Panel className="!overflow-hidden dark:text-color-text-primary text-color-light-text-primary dark:bg-color-modal-bg-primary bg-white text-[14px] sm:max-w-[464px] h-screen sm:h-[720px] sm:max-h-[80vh] relative transform rounded-[3px] text-left shadow-xl transition-all my-0 w-full !p-0">
                  <Dialog.Title
                    as="div"
                    className="relative h-[60px] px-[20px] flex justify-between dark:bg-color-header-primary bg-color-light-bg-primary items-center"
                  >
                    <div className="text-[16px] dark:text-white text-black">USDT {t('deposit:bonusHistory')}</div>
                    <div className="group rounded-md" role="button" onClick={() => handleCloseModal()}>
                      <XMarkIcon
                        width={15}
                        className="text-[#9FA5AC] group-hover:text-black dark:group-hover:text-white w-[1.5rem] h-[1.5rem]"
                      />
                    </div>
                  </Dialog.Title>
                  <div className="dark:bg-color-modal-bg-primary bg-white p-3 pb-0">
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
