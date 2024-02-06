import { Menu, Transition } from '@headlessui/react';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_BetStatistics } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import Paging from '@/components/paging/paging';
import RankingTableComponent from '@/components/table/rankingTable';

import { GameDetail, UserDetail } from '../../../../types/common';

type ModalStatisticProps = {
  userData: UserDetail;
};

type StatisticTransactionType = {
  currencyLogo: string;
  curency: string;
  wins: number;
  bets: number;
  wagered: number;
  wageredUsd: number;
};

export default function Statistic({ userData }: ModalStatisticProps) {
  const { theme } = useTheme();
  const { t } = useTranslation('');
  const exchange = useExchange();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [game, setGame] = useState<GameDetail>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalTable, setTotalTable] = useState(0);
  const [statisticTransaction, setStatisticTransaction] = useState<StatisticTransactionType[]>([]);
  const [listGames, setListGame] = useState<GameDetail[]>([]);

  const { userName, userId, avatar, viewInFiat, localFiat } = useSelector(
    (state: AppState) => ({
      userName: state.auth.user.userName,
      avatar: state.auth.user.avatar,
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      userId: state.auth.user.userId,
    }),
    shallowEqual,
  );

  const statisticsColumn = useMemo(() => {
    const statisticsColumnsDefault: ColumnDef<any>[] = [
      {
        accessorKey: 'currency',
        header: () => <div className="text-center text-[12px] font-normal">{t('statistic:currency')}</div>,
        cell: ({ row }) => (
          <div className="text-color-text-primary truncate flex items-center justify-center gap-[5px]">
            <Image
              height={20}
              width={20}
              src={row.original.currencyLogo}
              alt=""
              onError={(e) => {
                e.currentTarget.src = '/img/fiats/USDT.png';
              }}
            />
            <span className="dark:text-white text-black font-bold">{row.original.currency}</span>
          </div>
        ),
      },
      {
        accessorKey: 'win',
        header: () => <div className="text-center text-[12px] font-normal">{t('statistic:win')}</div>,
        cell: ({ row }) => (
          <div className="font-bold dark:text-white text-[#000] truncate text-center">{row.original.wins}</div>
        ),
      },
      {
        accessorKey: 'betAmount',
        header: () => <div className="text-center text-[12px] font-normal">{t('statistic:bet')}</div>,
        cell: ({ row }) => (
          <div className="font-bold dark:text-white text-[#000] truncate text-center">{row.original.bets}</div>
        ),
      },
      {
        accessorKey: 'wagered',
        header: () => <div className="text-center text-[12px] font-normal">{t('statistic:wagered')}</div>,
        cell: ({ row }) => (
          <div className="dark:text-white text-[#000] truncate text-center font-bold">
            {viewInFiat
              ? currencyFormat1(row.original.wageredUsd * exchange, 2, localFiat?.name || 'USD')
              : currencyFormat1(row.original.wagered, 4, '', false)}
          </div>
        ),
      },
    ];
    return statisticsColumnsDefault;
  }, [exchange, viewInFiat, localFiat]);

  useEffect(() => {
    handleGetStatisticTransaction();
  }, []);

  const handleGetStatisticTransaction = async () => {
    try {
      setIsLoading(true);
      const res = await api_BetStatistics();
      const tempStatisticTransactions: StatisticTransactionType[] = res.data?.map((item: any) => ({
        currencyLogo: item.currencyLogo ?? '/image/fiats/USDT.png',
        currency: item.currencyName ?? 'USDT',
        bets: Number(item.totalBets ?? 0),
        wins: Number(item.totalWins ?? 0),
        wagered: Number(item.wageredAmount ?? 0),
        wageredUsd: Number(item.wageredAmountUsd ?? 0),
      }));
      setStatisticTransaction(tempStatisticTransactions);
    } catch (error) {
      setStatisticTransaction([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : page - 1;
    setPage(newPage);
  };

  return (
    <>
      <div className="mt-[14px]">
        <div className="flex gap-[16px] items-center justify-between">
          <div className="dark:text-white text-black text-[14px] sm:text-[16px] font-semibold">
            {t('statistic:statistics')}
          </div>
          <Menu
            as="div"
            className="relative w-full max-w-[200px] text-left rounded flex dark:text-white text-[#000] dark:bg-color-input-primary bg-[#F6F7FA]"
          >
            <Menu.Button className="w-full">
              <div className="dark:bg-[#1e2024] bg-white flex items-center justify-between w-full h-[36px] px-[20px]">
                <div className="dark:text-color-text-primary text-[#31373d] text-[12px] sm:text-[14px] truncate">
                  {game?.title || t('statistic:global')}
                </div>
                <div className="dark:text-white truncate text-right min-w-[15px]">
                  <ArrowRight2 size={15} className="dark:text-[#abb6c2] text-[#9FA5AC]" />
                </div>
              </div>
            </Menu.Button>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute sm:hidden block inset-0 bg-black/80 transition-opacity z-[-1]" />
            </Transition.Child>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute xl:right-0 sm:left-[100px] md:left-[auto] sm:right-[auto] right-0 z-[50] w-full mt-14 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1 rounded-[5px] dark:bg-color-input-primary bg-white max-w-[200px -top-[20px]">
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        className={cn(
                          active
                            ? 'dark:bg-gray-600 bg-gray-100 dark:text-white text-black'
                            : 'dark:text-gray-400 text-black',
                          'px-2 py-2 text-sm cursor-pointer flex rounded-md items-center gap-[10px]',
                        )}
                        onClick={() => setGame({})}
                      >
                        <div>{t('statistic:global')}</div>
                      </div>
                    )}
                  </Menu.Item>
                  {listGames.map((item, index) => {
                    return (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div
                            className={cn(
                              active
                                ? 'dark:bg-gray-600 bg-gray-100 dark:text-white text-black'
                                : 'dark:text-gray-400 text-black',
                              'px-2 py-2 text-sm cursor-pointer flex rounded-md items-center gap-[10px]',
                            )}
                            onClick={() => setGame(item)}
                          >
                            <div className="max-w-full truncate">{item.title}</div>
                          </div>
                        )}
                      </Menu.Item>
                    );
                  })}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <div className="flex items-center gap-[6px]">
            <div className="h-[35px] w-[35px] rounded-full overflow-hidden">
              <Image
                height={35}
                width={35}
                src={String(process.env.API_AVATAR) + (userData?.avatar || avatar)}
                alt=""
                onError={(e) => {
                  e.currentTarget.src = '/img/avatar-1.png';
                }}
              />
            </div>
            <div className="text-black dark:text-white max-w-[85px] sm:max-w-[100px] truncate text-[12px] sm:text-[14px] font-[700]">
              {userData?.userName || userName}
            </div>
          </div>
        </div>
        <div className="dark:bg-color-modal-bg-primary bg-white rounded-[5px] p-[14px] flex items-center justify-between mt-[12px] gap-3">
          <div className="bg-[#f5f6fa] dark:bg-color-card-body-secondary rounded-[10px] flex flex-col justify-center items-center gap-[8px] pt-[16px] pb-[12px] h-[80px] w-full sm:w-[30%]">
            <div className="flex gap-[5px] items-center">
              <Image src="/img/icon/total-win.png" width={12} height={12} className="w-[12px] h-[12px]" alt="" />
              <div className="text-[10px] sm:text-[12px] text-color-text-primary">{t('profile:totalWins')}</div>
            </div>
            <div className="text-[14px] sm:text-[16px] dark:text-white text-black">
              {Number(userData.winCount) || 0}
            </div>
          </div>
          <div className="bg-[#f5f6fa] dark:bg-color-card-body-secondary rounded-[10px] flex flex-col justify-center items-center gap-[8px] pt-[16px] pb-[12px] h-[80px] w-full sm:w-[30%]">
            <div className="flex gap-[5px] items-center">
              <Image src="/img/icon/total-bets.png" width={12} height={12} className="w-[12px] h-[12px]" alt="" />
              <div className="text-[10px] sm:text-[12px] text-color-text-primary">{t('profile:totalBets')}</div>
            </div>
            <div className="text-[14px] sm:text-[16px] dark:text-white text-black">
              {Number(userData.betCount) || 0}
            </div>
          </div>
          <div className="bg-[#f5f6fa] dark:bg-color-card-body-secondary rounded-[10px] flex flex-col justify-center items-center gap-[8px] pt-[16px] pb-[12px] h-[80px] w-full sm:w-[30%] max-w-[30%]">
            <div className="flex gap-[5px] items-center">
              <Image src="/img/icon/total-wagered.png" width={12} height={12} className="w-[12px] h-[12px]" alt="" />
              <div className="text-[10px] sm:text-[12px] text-color-text-primary">{t('profile:totalWagered')}</div>
            </div>
            <div className="text-[14px] sm:text-[16px] dark:text-white text-black text-center w-full truncate">
              {viewInFiat
                ? currencyFormat1(userData.totalWager, 2, localFiat?.name || 'USD')
                : currencyFormat1(userData.totalWager, 2)}
            </div>
          </div>
        </div>
        <div className="dark:bg-color-modal-bg-primary bg-white mt-[10px]">
          {!isLoading && statisticTransaction.length > 0 && (
            <RankingTableComponent
              isLoading={isLoading}
              containerClassName="w-full dark:bg-[#1e2024] bg-white"
              data={statisticTransaction.filter((e) => !!e)}
              columns={statisticsColumn}
            />
          )}
          {!isLoading && statisticTransaction.length === 0 && (
            <div className="flex justify-center relative py-6">
              <Image
                src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
                width={200}
                height={200}
                className="w-[200px] h-[200px]"
                alt=""
              />
              <p className="absolute dark:text-color-text-primary text-[#31373d] text-[12px] sm:text-[14px] bottom-[24px] text-center">
                {t('table:noData')}
              </p>
            </div>
          )}
        </div>
        {!!statisticTransaction.length && (
          <Paging onPageChange={handleChangePage} itemPerPage={limit} totalItem={totalTable} currentPage={page} />
        )}
      </div>
    </>
  );
}
