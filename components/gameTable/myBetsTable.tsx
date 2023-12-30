import { ColumnDef, Row } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowDown2, ArrowUp2 } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_getLatestBetForUser } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { TIME_SUBMIT_FORMAT_WITH_SECOND } from '@/base/constants/common';
import {
  currencyFormat,
  exchangeByLocaleFiat,
  formatDate,
  formatLengthNumber,
  handleLocaleSymbol,
} from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { BetTableDataType, GameListType } from '@/base/types/common';

import ModalDetailBets from '../modal/detailBets/detailBets';
import RankingTableComponent from '../table/rankingTable';

const MyBetsTableComponent = ({ gameDetail }: { gameDetail?: GameListType }) => {
  const [myBetData, setMyBetData] = useState<BetTableDataType[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  const [isShowDetailBet, setIsShowDetailBet] = useState<boolean>(false);
  const [betIdDetail, setBetIdDetail] = useState<number>();
  const [selBetDetail, setSelBetDetail] = useState<BetTableDataType>({
    game: '',
    gameIdenfiter: '',
    player: '',
    playerId: '',
    playerAvatar: '',
    betAmount: 0,
    betAmountUsd: 0,
    multiplier: 0,
    profitAmount: 0,
    profitAmountUsd: 0,
    currency: '',
    betId: '',
    time: new Date(),
  });

  const { t } = useTranslation('');

  const { localeFiat, isLogin, userId } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
      isLogin: state.auth.isLogin,
      userId: state.auth.user.userId,
    }),
    shallowEqual,
  );

  const handleGetMyBet = async () => {
    try {
      setIsLoadingTable(true);
      if (!gameDetail) return;
      const res = await api_getLatestBetForUser(gameDetail.id);
      const tempBetData = res.data.map((item: any) => ({
        game: item.gameName ?? '',
        gameIdenfiter: item.gameIdentifier ?? '',
        player: item.playerName ?? '',
        playerId: item.playerId ?? '',
        playerAvatar: item.playerAvatar ?? '',
        betAmount: Number(item.betAmount || 0),
        betAmountUsd: Number(item.betAmountUsd || 0),
        multiplier: Number(item.multiplier || 0),
        profitAmount: Number(item.profitAmount || 0),
        profitAmountUsd: Number(item.profitAmountUsd || 0),
        currency: item.currency ?? 'USD',
        betId: item.id ?? '',
        time: item.time ?? new Date(),
      }));
      // const res = await api.get('game/my-bet', { params: { gameIdentifier: gameDetail?.identifier } });
      // setMyBetData(res.data);
    } catch (error) {
      setMyBetData([]);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleClickRow = (row: Row<any>) => {
    const betId = row?.getVisibleCells?.()[0].row.original.betId;
    setBetIdDetail(Number(betId));
    setSelBetDetail(row.original);
    setIsShowDetailBet(true);
  };

  const myBetDataFilter = useMemo(() => {
    if (isShowMore) return myBetData;
    else return myBetData.slice(0, 10);
  }, [myBetData, isShowMore]);

  const myBetColumns = useMemo(() => {
    const innerWidth = window.innerWidth;
    const myBetColumnsDefault: ColumnDef<any>[] = [
      {
        accessorKey: 'betId',
        header: () => <div className="text-left dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:betId')}</div>,
        cell: ({ row }) => <div className="dark:text-[#98A7B5] text-[#31373d] truncate">{row.original.betId}</div>,
      },
      {
        accessorKey: 'betAmount',
        header: () => <div className="text-center dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:bet')}</div>,
        cell: ({ row }) => (
          <>
            {row.original.betAmount !== null && (
              <div className="flex items-center justify-center gap-[5px] truncate">
                <div className="font-bold dark:text-white text-black truncate">
                  {localeFiat
                    ? `${handleLocaleSymbol(String(localeFiat?.currency))} ${currencyFormat(
                        exchangeByLocaleFiat(
                          row.original.currency,
                          String(localeFiat?.currency),
                          row.original.betAmount,
                        ),
                        2,
                      )}`
                    : `${formatLengthNumber(row.original.betAmount)}`}
                </div>
                <Image
                  height={15}
                  width={15}
                  src={`/img/fiats/${row.original.sourceAccount}.png`}
                  onError={(e) => {
                    e.currentTarget.src = '/img/fiats/USD.png';
                  }}
                  alt=""
                />
              </div>
            )}
          </>
        ),
      },
      {
        accessorKey: 'time',
        header: () => <div className="text-center dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:time')}</div>,
        cell: ({ row }) => (
          <div className="dark:text-[#98A7B5] text-[#31373d] truncate text-center">
            {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_SECOND)}
          </div>
        ),
      },
      {
        accessorKey: 'payout',
        header: () => <div className="text-center dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:payout')}</div>,
        cell: ({ row }) => (
          <div className="dark:text-[#98A7B5] text-[#31373d] font-bold truncate text-center">{row.original.payout}</div>
        ),
      },
      {
        accessorKey: 'profit',
        header: () => <div className="text-right dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:profit')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-end gap-[5px]')}>
            <div
              className={cn('font-bold text-end truncate', {
                'text-green-500': row.original.profit >= 0,
                'text-red-500': row.original.profit < 0,
              })}
            >
              {row.original.profit > 0 && '+'}
              {localeFiat
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
    if (innerWidth > 961) return myBetColumnsDefault;
    else {
      myBetColumnsDefault.splice(2, 1);
      return myBetColumnsDefault;
    }
  }, [localeFiat?.currency, userId]);

  useEffect(() => {
    if (isLogin) {
      handleGetMyBet();
    }
  }, [isLogin]);

  useEffect(() => {
    if (!userId) return;
    // const socket = io(String(process.env.SOCKET_URL), socketConfig);
    // socket.on(`create_bet_user_id_${userId}`, (data) => {
    //   console.log(`create_bet_user_id_${userId}`, data);
    //   const camelizeKeysData = camelizeKeys(data) as BetTableDetailType;
    //   setMyBetData((oldArray) => {
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
  }, [userId]);

  return (
    <>
      <div>
        <RankingTableComponent
          containerClassName="w-full"
          isLoading={isLoadingTable}
          data={myBetDataFilter}
          columns={myBetColumns}
          onRowClick={handleClickRow}
        />
        {!!myBetDataFilter.length && (
          <div className="flex justify-center mt-[20px] pb-[8px] md:pb-[23px]">
            <div
              className="flex items-center dark:bg-[#25262B] bg-[#f5f6fa] py-[9px] px-[10px] rounded-[5px]"
              role="button"
              onClick={() => {
                setIsShowMore(!isShowMore);
              }}
            >
              <div className="text-[10px] dark:text-[#FFFFFF] text-[#31373d] font-bold mr-[6px]">
                {!isShowMore ? t('homePage:showMore') : t('homePage:showLess')}
              </div>
              {!isShowMore ? (
                <ArrowDown2 size={12} className="dark:text-white text-black" />
              ) : (
                <ArrowUp2 size={12} className="dark:text-white text-black" />
              )}
            </div>
          </div>
        )}
      </div>
      {isShowDetailBet && (
        <ModalDetailBets
          show={isShowDetailBet}
          betDetail={selBetDetail}
          onClose={() => {
            setIsShowDetailBet(false);
          }}
          betId={betIdDetail}
        />
      )}
    </>
  );
};

export default MyBetsTableComponent;
