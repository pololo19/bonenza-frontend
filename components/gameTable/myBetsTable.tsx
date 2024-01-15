import { ColumnDef, Row } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowDown2, ArrowUp2 } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_getLatestBetForUser } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { TIME_SUBMIT_FORMAT_WITH_SECOND } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { useWidth } from '@/base/hooks/useWidth';
import { currencyFormat1, formatDate, formatLengthNumber } from '@/base/libs/utils';
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
  const innerWidth = useWidth();
  const exchangeRate = useExchange();

  const { isLogin, userId, localFiat, gameSocket } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      isLogin: state.auth.isLogin,
      userId: state.auth.user.userId,
      gameSocket: state.socket.gameSocket,
    }),
    shallowEqual,
  );

  const handleGetMyBet = async () => {
    try {
      setIsLoadingTable(true);
      setMyBetData([]);
      if (!gameDetail) return;
      const res = await api_getLatestBetForUser(gameDetail.id);
      const tempBetData = res.data.map((item: any) => ({
        game: item.gameName ?? '',
        gameIdenfiter: item.gameIdentifier ?? '',
        player: item.playerName || '',
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
      setMyBetData(tempBetData);
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

  const betHistoryFilter = useMemo(() => {
    if (!myBetData.length) return [];
    if (isShowMore) return myBetData.slice(0, 40);
    return myBetData.slice(0, 10);
  }, [myBetData, isShowMore]);

  const myBetColumns = useMemo(() => {
    const myBetColumnsDefault: ColumnDef<any>[] = [
      {
        accessorKey: 'betId',
        header: () => <div className="text-left dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:betId')}</div>,
        cell: ({ row }) => (
          <div className="dark:text-[#98A7B5] text-[#31373d] truncate sm:w-auto w-[30vw]">{row.original.betId}</div>
        ),
      },
      {
        accessorKey: 'betAmount',
        header: () => <div className="text-center dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:bet')}</div>,
        cell: ({ row }) => (
          <>
            {row.original.betAmount !== null && (
              <div className="flex items-center justify-center gap-[5px] truncate">
                <div className="font-bold dark:text-white text-black truncate">
                  {localFiat
                    ? `${currencyFormat1(row.original.betAmountUsd * exchangeRate, 8, localFiat.name)}`
                    : `${currencyFormat1(row.original.betAmount, 8, '', false)}`}
                </div>
                <Image
                  height={15}
                  width={15}
                  src={`/img/fiats/${row.original.currency}.png`}
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
          <div className="dark:text-[#98A7B5] text-[#31373d] font-bold truncate text-center">
            {`${formatLengthNumber(row.original.multiplier, 2)}x`}
          </div>
        ),
      },
      {
        accessorKey: 'profit',
        header: () => <div className="text-right dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:profit')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-end gap-[5px]')}>
            <div
              className={cn('font-bold text-end truncate', {
                'text-color-primary': row.original.profitAmount >= 0,
                'text-color-red-primary': row.original.profitAmount < 0,
              })}
            >
              {row.original.profitAmount > 0 ? '+' : '-'}
              {localFiat
                ? `${currencyFormat1(Math.abs(row.original.profitAmountUsd * exchangeRate), 8, localFiat.name)}`
                : `${currencyFormat1(Math.abs(row.original.profitAmount), 8, '', false)}`}
            </div>
            <Image
              className="sm:h-[15px] h-[15px] sm:w-[15px] w-[15px]"
              height={15}
              width={15}
              src={`/img/fiats/${row.original.currency}.png`}
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
  }, [localFiat, userId, innerWidth]);

  useEffect(() => {
    if (isLogin) {
      handleGetMyBet();
    }
  }, [isLogin]);

  useEffect(() => {
    if (!userId) return;
    if (gameSocket) {
      gameSocket.on(`bets`, (item: any) => {
        console.log(item, '------- my bet table ------');
        const data = JSON.parse(item);
        console.log(data, '------- my bet table data ------');
        const gameId = data.game_id;
        if (gameId !== gameDetail?.id && data.player_id !== userId) {
          return;
        }
        const tempData: BetTableDataType = {
          game: data.game_name ?? '',
          gameIdenfiter: data.game_identifier ?? '',
          player: data.player_name ?? '',
          playerId: data.player_id ?? '',
          playerAvatar: data.playerAvatar ?? '',
          betAmount: Number(data.bet_amount || 0),
          betAmountUsd: Number(data.bet_amount_usd || 0),
          multiplier: Number(data.multiplier || 0),
          profitAmount: Number(data.profit_amount || 0),
          profitAmountUsd: Number(data.profit_amount_usd || 0),
          currency: data.currency ?? 'USD',
          betId: data.id ?? '',
          time: data.time ?? new Date(),
        };
        setMyBetData((prev) => [tempData, ...prev]);
      });
    }

    return () => {
      if (gameSocket) {
        gameSocket.off(`bets`);
      }
    };
  }, [userId, gameDetail, gameSocket]);

  return (
    <>
      <div>
        <RankingTableComponent
          containerClassName="w-full"
          isLoading={isLoadingTable}
          data={betHistoryFilter}
          columns={myBetColumns}
          onRowClick={handleClickRow}
        />
        {!!betHistoryFilter.length && (
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
