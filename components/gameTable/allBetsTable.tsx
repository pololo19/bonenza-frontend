import { ColumnDef, Row } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowDown2, ArrowUp2 } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { api_getLatestBetsForGame } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { TIME_SUBMIT_FORMAT_WITH_SECOND } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { useWidth } from '@/base/hooks/useWidth';
import { currencyFormat1, formatDate, formatLengthNumber } from '@/base/libs/utils';
import { changeIsShowInformation } from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState } from '@/base/redux/store';
import { BetTableDataType, GameListType } from '@/base/types/common';

import ModalDetailBets from '../modal/detailBets/detailBets';
import RankingTableComponent from '../table/rankingTable';

const cryptoDecimals = 8;
const fiatDecimals = 2;

const AllBetsTableComponent = ({ gameDetail }: { gameDetail?: GameListType }) => {
  const [newBetData, setNewBetData] = useState<BetTableDataType>({
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
  const [betData, setbetData] = useState<BetTableDataType[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  const [isShowDetailBet, setIsShowDetailBet] = useState<boolean>(false);
  const [betIdDetail, setBetIdDetail] = useState<number>();
  const [selBetDetail, setSelBetDetail] = useState<BetTableDataType>({
    game: '',
    gameIdenfiter: '',
    player: '',
    playerId: '',
    betAmount: 0,
    betAmountUsd: 0,
    multiplier: 0,
    profitAmount: 0,
    profitAmountUsd: 0,
    currency: '',
    betId: '',
    playerAvatar: '',
    time: new Date(),
  });
  const [isPublicProfile, setIsPublicProfile] = useState<boolean>(false);

  const innerWidth = useWidth();
  const exchangeRate = useExchange();
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const { localFiat, userId, gameSocket, userName, isLogin } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      userId: state.auth.user.userId,
      userName: state.auth.user.userName,
      betHistory: state.game.betHistory,
      gameSocket: state.socket.gameSocket,
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const betHistoryFilter = useMemo(() => {
    if (!betData.length) return [];
    if (isShowMore) return betData.slice(0, 40);
    return betData.slice(0, 10);
  }, [betData, isShowMore]);

  const handleGetAllBet = async () => {
    try {
      if (!gameDetail) return;
      setbetData([]);
      setIsLoadingTable(true);
      const res = await api_getLatestBetsForGame(gameDetail.id);
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
      setbetData(tempBetData);
    } catch (error) {
      setbetData([]);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const openModalProfileUser = (row: Row<any>) => {
    const userData = {
      username: row.original.player,
      userId: row.original.playerId,
    };
    dispatch(setUserData(userData));
    if (!row.original.isHideNamePublicList) {
      dispatch(changeIsShowInformation(true));
    }
  };

  const handleClickRow = (row: Row<any>) => {
    const betId = row?.getVisibleCells?.()[0].row.original.betId;
    setBetIdDetail(Number(betId));
    setSelBetDetail(row.original);
    setIsShowDetailBet(true);
    setIsPublicProfile(row.original?.isHideNamePublicList);
  };

  const allBetColumns = useMemo(() => {
    const allBetColumnsDefault: ColumnDef<any>[] = [
      {
        accessorKey: 'betId',
        header: () => <div className="dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:betId')}</div>,
        cell: ({ row }) => (
          <div className="dark:text-[#98A7B5] text-[#31373D] truncate sm:p-2 p-[5px] sm:w-auto w-[30vw]">
            {row.original.betId}
          </div>
        ),
      },
      {
        accessorKey: 'player',
        header: () => <div className="text-center dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:player')}</div>,
        cell: ({ row }) => (
          <div
            className={`${
              row.original.playerId !== userId && !row.original.player && 'pointer-events-none'
            } font-bold truncate text-center  sm:p-2 p-[5px]`}
            onClick={() => openModalProfileUser(row)}
          >
            {row.original.playerId !== userId && !row.original.player ? (
              <div className="dark:text-[#98A7B5] text-[#31373d]">{t('homePage:hidden')}</div>
            ) : (
              <div className="dark:text-white text-black">
                {row.original.playerId === userId ? userName : row.original.player}
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'time',
        header: () => <div className="text-center dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:time')}</div>,
        cell: ({ row }) => (
          <div className="dark:text-[#98A7B5] text-[#31373D] truncate text-center  sm:p-2 p-[5px]">
            {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_SECOND)}
          </div>
        ),
      },
      {
        accessorKey: 'payout',
        header: () => <div className="text-center dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:payout')}</div>,
        cell: ({ row }) => (
          <div className="dark:text-[#98A7B5] text-[#31373D] truncate text-center font-bold  sm:p-2 p-[5px]">
            {`${formatLengthNumber(row.original.multiplier, 2)}x`}
          </div>
        ),
      },
      {
        accessorKey: 'profit',
        header: () => <div className="dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:profit')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-end gap-[5px]  sm:p-2 p-[5px]')}>
            <div
              className={cn('font-bold text-end truncate', {
                'text-color-primary': row.original.profitAmount >= 0,
                'text-color-red-primary': row.original.profitAmount < 0,
              })}
            >
              {row.original.profitAmount > 0 ? '+' : '-'}
              {localFiat
                ? `${currencyFormat1(
                    Math.abs(row.original.profitAmountUsd * exchangeRate),
                    fiatDecimals,
                    localFiat.name,
                  )}`
                : `${currencyFormat1(Math.abs(row.original.profitAmount), cryptoDecimals, '', false)} `}
            </div>
            <Image
              className="sm:h-[15px] h-[10px] sm:w-[15px] w-[10px]"
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
    if (innerWidth > 961) return allBetColumnsDefault;
    else {
      allBetColumnsDefault.splice(2, 1);
      return allBetColumnsDefault;
    }
  }, [localFiat, userId, innerWidth]);

  useEffect(() => {
    handleGetAllBet();
  }, [gameDetail]);

  useEffect(() => {
    if (gameSocket) {
      gameSocket.on(`bets`, (item: any) => {
        console.log(item, '---------all bet Table');
        const data = JSON.parse(item);
        console.log(data);
        const gameId = data.game_id;
        if (gameId !== gameDetail?.id) {
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
        setNewBetData(tempData);
        // setbetData((prev) => [tempData, ...prev]);
      });
    }

    return () => {
      if (gameSocket) {
        gameSocket.off(`bets`);
      }
    };
  }, [gameSocket, gameDetail, isLogin]);

  useEffect(() => {
    if (newBetData.betId) {
      let preBetDatas = [...betData];
      if (preBetDatas.findIndex((item) => item.betId === newBetData.betId) !== -1) {
        const upBetDatas = preBetDatas.map((item) => {
          if (item.betId === newBetData.betId) {
            return { ...newBetData };
          } else {
            return { ...item };
          }
        });
        setbetData(upBetDatas);
      } else {
        setbetData((prev) => [newBetData, ...prev]);
      }
    }
  }, [newBetData]);

  return (
    <>
      <div>
        <RankingTableComponent
          containerClassName="w-full"
          isLoading={isLoadingTable}
          data={betHistoryFilter}
          columns={allBetColumns}
          onRowClick={handleClickRow}
        />
        {!!betHistoryFilter.length && (
          <div className="flex justify-center mt-[20px] pb-[8px] md:pb-[23px]">
            <div
              className="flex items-center dark:bg-[#25262B] bg-[#f6f7fa] py-[9px] px-[10px] rounded-[5px]"
              role="button"
              onClick={() => {
                setIsShowMore(!isShowMore);
              }}
            >
              <div className="text-[10px] dark:text-[#FFFFFF] text-[#31373d] font-bold mr-[6px]">
                {!isShowMore ? t('homePage:showMore') : t('homePage:showLess')}
              </div>
              {!isShowMore ? (
                <ArrowDown2 size={12} className="dark:text-[#FFFFFF] text-[#31373d]" />
              ) : (
                <ArrowUp2 size={12} className="dark:text-[#FFFFFF] text-[#31373d]" />
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
          isPublicProfile={isPublicProfile}
        />
      )}
    </>
  );
};

export default AllBetsTableComponent;
