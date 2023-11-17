import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import { useSelector, shallowEqual } from 'react-redux';
import { ElementType, useEffect, useState, useMemo, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

import { useTranslation } from '@/base/config/i18next';
import CommonModal from '../commonModal/commonModal';
import api from '@/api/api';
import Loader from '@/components/common/preloader/loader';
import { currencyFormat, exchangeByLocaleFiat, formatDate, handleLocaleSymbol } from '@/base/libs/utils';
import { RootState } from '@/base/types/root-state';
import { ColumnDef } from '@tanstack/react-table';
import { TIME_SUBMIT_FORMAT_WITH_MARKER } from '@/base/constants/common';
import TableComponent from '@/components/table';
import Paging from '@/components/paging/paging';

type ModalBonusDetailProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalBonusDetail({ show, onClose }: ModalBonusDetailProps) {
  const { t } = useTranslation('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [listTypes, setListTypes] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [listTransactions, setListTransactions] = useState<any[]>([]);
  const [totalTable, setTotalTable] = useState<number>(0);
  const { localeFiat } = useSelector(
    (state: RootState) => ({
      localeFiat: state.common.localeFiat,
    }),
    shallowEqual,
  );

  const bonusCategories = [
    {
      title: 'Quest',
      img: '/img/modal/quests.png',
      value: '0.00',
    },
    {
      title: 'Lucky Spin',
      img: '/img/modal/spin.png',
      value: '0.00',
    },
    {
      title: 'Roll Competition',
      img: '/img/modal/roll.png',
      value: '0.00',
    },
    {
      title: 'Recharge',
      img: '/img/modal/recharge.png',
      value: '0.00',
    },
    {
      title: 'Weekly Cashback',
      img: '/img/modal/weekly.png',
      value: '0.00',
    },
    {
      title: 'Monthly Cashback',
      img: '/img/modal/monthly.png',
      value: '0.00',
    },
    {
      title: 'Sports Weekly Bonus',
      img: '/img/modal/sports.png',
      value: '0.00',
    },
    {
      title: 'Level-up Bonus',
      img: '/img/modal/levelup.png',
      value: '0.00',
    },
    {
      title: 'Free Spin',
      img: '/img/modal/freespin.png',
      value: '0.00',
    },
    {
      title: 'Deposit Bonus',
      img: '/img/modal/deposit.png',
      value: '0.00',
    },
  ];

  const getListTypeBonus = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('vip/get-list-action-type-bonus');
      setListTypes(res.data.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    getListTypeBonus();
  }, []);

  useEffect(() => {
    setPage(1);
    getListBonusTransaction(1);
  }, [limit, typeFilter]);

  const columns = useMemo(() => {
    const columnsDefault: ColumnDef<any>[] = [
      {
        accessorKey: 'actionType',
        header: () => (
          <div className="text-left text-[12px] text-[#98a7b5] font-normal">{t('historyBonus:bonusType')}</div>
        ),
        cell: ({ row }) => (
          <div className="text-[14px] text-left dark:text-[#98a7b5] text-[#000] truncate">
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
          <div className="font-bold text-[14px] flex justify-center gap-1 dark:text-white text-[#000] truncate text-center">
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

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : page - 1;
    setPage(newPage);
    getListBonusTransaction(newPage);
  };

  const handleChangeItemPerPage = (itemPerPage: number) => {
    setLimit(itemPerPage);
    setPage(1);
  };

  return (
    <>
      {isLoading && <Loader />}
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="rounded"
        header={
          <div className="relative px-[18px] h-[60px] flex items-center bg-white dark:bg-[#17191b]">
            {t('bonus:bonusDetail')}
          </div>
        }
      >
        <div className="flex flex-col dark:text-[#98A7B5] text-[#3137d] overflow-y-auto px-[20px] p-5 bg-[#f6f7fa] dark:bg-[#24262B]">
          <div className="">
            <div className="dark:text-white text-black text-[16px] mb-3">{t('bonus:bonusCategories')}</div>
            <div className="grid grid-cols-2 sm:grid-cols-5 p-4 pt-0 bg-[#2D3035]">
              {bonusCategories.map((item, index) => (
                <div key={index} className="text-[12px] mt-4">
                  <div className="flex items-center">
                    <div className="w-[28px] h-[28px] flex items-center justify-center">
                      <Image src={item.img} width={21} height={21} alt="" />
                    </div>
                    <div className="truncate max-w-full">{item.title}</div>
                  </div>
                  <div className="text-[14px] font-bold dark:text-white text-black pl-[6px]">
                    {handleLocaleSymbol(localeFiat?.currency || 'USD')}
                    {localeFiat
                      ? ` ${currencyFormat(exchangeByLocaleFiat('USD', String(localeFiat?.currency), 0), 2)}`
                      : currencyFormat(0, 2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-between mt-5">
            <div className="dark:text-white text-black text-[16px]">{t('bonus:bonusTransaction')}</div>
            <Menu
              as="div"
              className="relative flex h-[40px] px-[20px] min-w-[200px] dark:bg-[#2D3035] bg-white rounded-[4px]"
            >
              <Menu.Button className="flex-1">
                <div className="flex items-center justify-between w-full" role="button">
                  <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                    <div className="flex-1 text-start dark:text-white text-black">{t('bonus:allBonuses')}</div>
                  </div>
                  <div className="flex items-center justify-start gap-[10px]">
                    <ChevronDownIcon className=" dark:text-white text-black" width={15} />
                  </div>
                </div>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute dark:bg-[#17181b] bg-white w-full origin-top-right right-0 top-[50px] z-[10] cursor-pointer">
                  <div className="py-1  dark:bg-[#17181b] bg-white">
                    {listTypes.map((type, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className="flex items-center justify-start py-[10px] px-[20px] w-full dark:hover:bg-[#2d303566] hover:bg-[#f5f6fa]"
                            role="button"
                            onClick={() => setTypeFilter(type.actionType)}
                          >
                            <div className="flex-1 flex items-center justify-start gap-[10px] sm:text-[14px] text-[12px]">
                              <div className="flex-1 text-start dark:text-white max-w-full truncate text-black capitalize">
                                {type.actionType}
                              </div>
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          <div className="mt-2 mb-3 text-[14px]">{t('bonus:onlyTheLatest')}</div>
          <div className="bg-[#2D3035] p-3 pb-0">
            <TableComponent
              isLoading={isLoadingTable}
              handleClickRow={() => {}}
              data={listTransactions}
              columns={columns}
            />
          </div>
          <div className="bg-[#2D3035] pb-3">
            <Paging
              onPageChange={handleChangePage}
              itemPerPage={limit}
              totalItem={totalTable}
              currentPage={page}
              setItemPerPage={handleChangeItemPerPage}
              hiddenPerPage={true}
            />
          </div>
        </div>
      </CommonModal>
    </>
  );
}
