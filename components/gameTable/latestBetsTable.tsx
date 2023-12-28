import { ColumnDef, Row } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowDown2, ArrowUp2 } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { currencyFormat, exchangeByLocaleFiat, formatLengthNumber, handleLocaleSymbol } from '@/base/libs/utils';
import { changeIsShowInformation } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { BetTableDetailType, GameDetail } from '@/base/types/common';

import ModalDetailBets from '../modal/detailBets/detailBets';
import RankingTableComponent from '../table/rankingTable';

const LatestBetsTableComponent = ({ gameDetail }: { gameDetail?: GameDetail }) => {
  const [allBetData, setAllBetData] = useState<BetTableDetailType[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  const [isShowDetailBet, setIsShowDetailBet] = useState<boolean>(false);
  const [betIdDetail, setBetIdDetail] = useState<number>();
  const [isPublicProfile, setIsPublicProfile] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { t } = useTranslation('');

  const { localeFiat, userId } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
      userId: state.auth.user.userId,
    }),
    shallowEqual,
  );

  const handleGetAllBet = async () => {
    try {
      setIsLoadingTable(true);
      const res = await api.get('game/all-bet', { params: { gameIdentifier: gameDetail?.identifier } });
      setAllBetData(res.data);
    } catch (error) {
      setAllBetData([]);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const openModalProfileUser = (row: Row<any>) => {
    const userData = {
      username: row.original.player,
      userId: row.original.playerId,
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    if (!row.original.isHideNamePublicList) {
      dispatch(changeIsShowInformation(true));
    }
  };

  const handleClickRow = (row: Row<any>) => {
    const betId = row?.getVisibleCells?.()[0].row.original.betId;
    setBetIdDetail(Number(betId));
    setIsShowDetailBet(true);
    setIsPublicProfile(row.original?.isHideNamePublicList);
  };

  const allBetDataFilter = useMemo(() => {
    if (isShowMore) return allBetData.slice(0, 20);
    else return allBetData.slice(0, 10);
  }, [allBetData, isShowMore]);

  const allBetColumns = useMemo(() => {
    const innerWidth = window.innerWidth;
    const allBetColumnsDefault: ColumnDef<any>[] = [
      {
        accessorKey: 'betId',
        header: String(t('gameTable:game')),
        cell: ({ row }) => (
          <div className="dark:text-[#98A7B5] text-[#31373d] font-bold truncate flex items-center gap-[5px]">
            <Image
              height={24}
              width={24}
              src={`https://cdn.softswiss.net/i/s4/${row.original.provider}/${row.original.identifier2}.png`}
              alt=""
              className="object-cover max-h-auto rounded-[5px]"
            />
            {row.original.title}
          </div>
        ),
      },
      {
        accessorKey: 'player',
        header: () => <div className="text-center">{t('gameTable:player')}</div>,
        cell: ({ row }) => (
          <div
            className={`${
              row.original.playerId !== userId && row.original.isHideNamePublicList && 'pointer-events-none'
            } font-bold truncate text-center`}
            onClick={() => openModalProfileUser(row)}
          >
            {row.original.playerId !== userId && row.original.isHideNamePublicList ? (
              <div className="dark:text-[#98A7B5] text-[#31373d]">{t('homePage:hidden')}</div>
            ) : (
              <div className="dark:text-white text-black">{row.original.player}</div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'betAmount',
        header: () => <div className="text-center">{t('gameTable:betAmount')}</div>,
        cell: ({ row }) => (
          <div className="dark:text-white text-[#31373d] font-bold truncate flex items-center justify-center gap-[5px]">
            {localeFiat?.currency
              ? `${handleLocaleSymbol(String(localeFiat?.currency))} ${currencyFormat(
                  exchangeByLocaleFiat(
                    row.original.currency,
                    String(localeFiat?.currency),
                    Math.abs(row.original.betAmount),
                  ),
                  2,
                )}`
              : `${formatLengthNumber(row.original.betAmount)}`}
            <Image
              className="sm:h-[15px] h-[10px] sm:w-[15px] w-[10px]"
              height={15}
              width={15}
              src={`/img/fiats/${row.original.sourceAccount}.png`}
              onError={(e) => {
                e.currentTarget.src = '/img/fiats/USD.png';
              }}
              alt=""
            />
          </div>
        ),
      },
      {
        accessorKey: 'multiplier',
        header: () => <div className="text-center">{t('gameTable:multiplier')}</div>,
        cell: ({ row }) => (
          <div className="dark:text-[#98A7B5] text-[#31373d] truncate text-center font-bold">{row.original.payout}</div>
        ),
      },
      {
        accessorKey: 'profit',
        header: String(t('gameTable:profitAmount')),
        minSize: 60,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-end gap-[5px]')}>
            <div
              className={cn('font-bold text-end truncate', {
                'text-green-500': row.original.profit >= 0,
                'text-red-500': row.original.profit < 0,
              })}
            >
              {row.original.profit > 0 && '+'}
              {localeFiat?.currency
                ? `${handleLocaleSymbol(String(localeFiat?.currency))} ${currencyFormat(
                    exchangeByLocaleFiat(
                      row.original.currency,
                      String(localeFiat?.currency),
                      Math.abs(row.original.profit),
                    ),
                    2,
                  )}`
                : `${formatLengthNumber(row.original.profit)}`}
            </div>
            <Image
              className="sm:h-[15px] h-[10px] sm:w-[15px] w-[10px]"
              height={15}
              width={15}
              src={`/img/fiats/${row.original.sourceAccount}.png`}
              onError={(e) => {
                e.currentTarget.src = '/img/fiats/USD.png';
              }}
              alt=""
            />
          </div>
        ),
      },
    ];
    if (innerWidth > 961) return allBetColumnsDefault;
    else {
      allBetColumnsDefault.splice(2, 1);
      return allBetColumnsDefault;
    }
  }, [localeFiat?.currency, userId]);

  useEffect(() => {
    handleGetAllBet();
  }, []);

  useEffect(() => {
    // const socket = io(String(process.env.SOCKET_URL), socketConfig);
    // socket.on('create_bet', (data) => {
    //   const camelizeKeysData = camelizeKeys(data) as BetTableDetailType;
    //   setAllBetData((oldArray) => {
    //     const index = oldArray.findIndex((bet) => bet.gameId === camelizeKeysData.gameId);
    //     if (index >= 0) {
    //       const newData = oldArray.map((bet) => {
    //         if (bet.gameId === camelizeKeysData.gameId) {
    //           return camelizeKeysData;
    //         }
    //         return bet;
    //       });
    //       return newData;
    //     } else {
    //       return [camelizeKeysData, ...oldArray];
    //     }
    //   });
    // });
    // Clean up the socket connection on unmount
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return (
    <>
      <div>
        <RankingTableComponent
          containerClassName="w-full"
          isLoading={isLoadingTable}
          data={allBetDataFilter}
          columns={allBetColumns}
          onRowClick={handleClickRow}
        />
        {!!allBetDataFilter.length && (
          <div className="flex justify-center mt-[20px] pb-[8px] md:pb-[23px]">
            <div
              className="flex items-center dark:bg-[#25262B] bg-[#f6f7fa] py-[9px] px-[10px] rounded-[5px]"
              role="button"
              onClick={() => {
                setIsShowMore(!isShowMore);
              }}
            >
              <div className="text-[10px] dark:text-[#FFFFFF] text-[#000] font-bold mr-[6px]">
                {!isShowMore ? t('homePage:showMore') : t('homePage:showLess')}
              </div>
              {!isShowMore ? (
                <ArrowDown2 size={12} className="dark:text-[#FFFFFF] text-[#000]" />
              ) : (
                <ArrowUp2 size={12} className="dark:text-[#FFFFFF] text-[#000]" />
              )}
            </div>
          </div>
        )}
      </div>
      {isShowDetailBet && (
        <ModalDetailBets
          show={isShowDetailBet}
          onClose={() => {
            setIsShowDetailBet(false);
          }}
          betId={betIdDetail}
          isPublicProfile={isPublicProfile}
        />
      )}
    </>
  );
};

export default LatestBetsTableComponent;
