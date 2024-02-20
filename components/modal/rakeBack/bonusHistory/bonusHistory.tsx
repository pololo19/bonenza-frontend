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
import { BonusTransactionType, FiatType } from '@/base/types/common';
import Paging from '@/components/paging/paging';
import TableComponent from '@/components/table';

import CommonModal from '../../commonModal/commonModal';

type ModalBonusHistory = {
  cryptoLocked?: FiatType;
  onClose: () => void;
  show: boolean;
  setShowModalRakeBack: () => void;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalBonusHistory({ show, onClose, cryptoLocked, setShowModalRakeBack }: ModalBonusHistory) {
  const exchangeRate = useExchange();
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation('');
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [listTypes, setListTypes] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [listTransactions, setListTransactions] = useState<BonusTransactionType[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const { localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const handleChangePage = async (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : page - 1;
    setPage(newPage);
    await getListBonusTransaction();
  };

  const handleChangeItemPerPage = async (itemPerPage: number) => {
    setLimit(itemPerPage);
    setPage(1);
    await getListBonusTransaction();
  };

  const getListBonusTransaction = useCallback(async () => {
    try {
      setIsLoadingTable(true);
      const _res = await api_bonusUsdtHistory(page, limit);
      const tempListTransactionData: BonusTransactionType[] = _res.data.bonuses?.map((item: any) => ({
        amount: item.amount,
        amountUsd: item.amountUsd,
        type: item.type,
        time: item.date,
      }));
      const totalCounts = Number(_res.data?.totalCount || 0);
      setListTransactions(tempListTransactionData);
      setTotalRows(totalCounts);
    } catch (error) {
    } finally {
      setIsLoadingTable(false);
    }
  }, [page, limit]);

  const columns = useMemo(() => {
    const columnsDefault: ColumnDef<BonusTransactionType>[] = [
      {
        accessorKey: 'actionType',
        header: () => (
          <div className="text-left text-[12px] text-color-text font-normal">{t('historyBonus:bonusType')}</div>
        ),
        cell: ({ row }) => (
          <div className="text-[12px] text-left dark:text-color-text text-[#000] truncate">{row.original.type}</div>
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
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:max-w-[464px] h-screen sm:h-[720px] sm:max-h-[80vh] sm:my-0"
        header={
          <div className="flex flex-col items-start dark:bg-color-header-primary bg-color-light-bg-primary px-[20px] py-[20px] gap-[20px]">
            <div className="text-[16px] dark:text-white text-black">USDT {t('deposit:bonusHistory')}</div>
          </div>
        }
      >
        <div className="dark:bg-color-modal-bg-primary bg-white p-3 pb-0">
          <TableComponent
            isLoading={isLoadingTable}
            handleClickRow={() => {}}
            data={listTransactions}
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
      </CommonModal>
    </>
  );
}
