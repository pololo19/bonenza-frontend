import { ColumnDef, Row } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowDown2, ArrowUp2, Ghost } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_getLatestBetsForGame } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { TIME_SUBMIT_FORMAT_WITH_SECOND, TOAST_ENUM } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { useWidth } from '@/base/hooks/useWidth';
import { currencyFormat1, formatDate, formatLengthNumber } from '@/base/libs/utils';
import { getErrorMesssage1 } from '@/base/libs/utils/notificationToast';
import { changeIsShowDetailBets, changeIsShowInformation, setDetailBets } from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState } from '@/base/redux/store';
import { BetTableDataType, GameListType } from '@/base/types/common';

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

  const innerWidth = useWidth();
  const exchangeRate = useExchange();
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const { localFiat, userId, gameSocket, userName, isLogin, viewInFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      userId: state.auth.user.userId,
      userName: state.auth.user.userName,
      betHistory: state.game.betHistory,
      gameSocket: state.socket.gameSocket,
      isLogin: state.auth.isLogin,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const betHistoryFilter = useMemo(() => {
    if (!betData.length) return [];
    if (isShowMore) return betData.slice(0, 40);
    return betData.slice(0, 10);
  }, [betData, isShowMore]);

  const getAllBetHistory = async () => {
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
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMesssage1(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
      setbetData([]);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleModalProfile = (row: Row<BetTableDataType>) => {
    const userData = {
      username: row.original.player,
      userId: row.original.playerId,
    };

    dispatch(setUserData(userData));
    if (row.original.player) {
      dispatch(changeIsShowInformation(true));
    }
  };

  const handleClickRow = (row: Row<BetTableDataType>) => {
    const betId = row?.getVisibleCells?.()[0].row.original.betId;
    dispatch(
      setDetailBets({
        betDetail: row.original,
        betId: Number(betId),
        isPublicProfile: row.original.player == '' ? false : true,
      }),
    );
    dispatch(changeIsShowDetailBets(true));
  };

  const allBetColumns = useMemo(() => {
    const allBetColumnsDefault: ColumnDef<BetTableDataType>[] = [
      {
        accessorKey: 'betId',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary">{t('gameTable:betId')}</div>
        ),
        cell: ({ row }) => (
          <div className="dark:text-color-text-primary text-color-light-text-primary truncate p-2 sm:w-auto w-[30vw]">
            {row.original.betId}
          </div>
        ),
      },
      {
        accessorKey: 'player',
        header: () => (
          <div className="text-center dark:text-color-text-primary text-color-light-text-primary">
            {t('gameTable:player')}
          </div>
        ),
        cell: ({ row }) => (
          <div
            className={`${
              row.original.playerId !== userId && !row.original.player && 'pointer-events-none'
            } font-bold truncate text-center  sm:p-2 p-[5px]`}
            onClick={(event) => {
              event.stopPropagation();
              handleModalProfile(row);
            }}
          >
            {row.original.playerId !== userId && !row.original.player ? (
              <div className="dark:text-color-text-primary text-[#31373d] flex justify-center items-center gap-[5px]">
                <Ghost width={12} height={12} variant="Bulk" className="w-5 h-5" />
                {t('homePage:hidden')}
              </div>
            ) : (
              <div className="text-black dark:text-white">
                {row.original.playerId === userId ? userName : row.original.player}
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'time',
        header: () => (
          <div className="text-center dark:text-color-text-primary text-color-light-text-primary">
            {t('gameTable:time')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="dark:text-color-text-primary text-color-light-text-primary truncate text-center  sm:p-2 p-[5px]">
            {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_SECOND)}
          </div>
        ),
      },
      {
        accessorKey: 'payout',
        header: () => (
          <div className="text-center dark:text-color-text-primary text-color-light-text-primary">
            {t('gameTable:payout')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="dark:text-color-text-primary text-color-light-text-primary truncate text-center font-bold  sm:p-2 p-[5px]">
            {`${formatLengthNumber(row.original.multiplier, 2)}x`}
          </div>
        ),
      },
      {
        accessorKey: 'profit',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary">{t('gameTable:profit')}</div>
        ),
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-end gap-[5px]  sm:p-2 p-[5px]')}>
            <div
              className={cn('font-bold text-end truncate', {
                'text-color-text-green': row.original.profitAmount >= 0,
                'text-color-red-primary': row.original.profitAmount < 0,
              })}
            >
              {row.original.profitAmount >= 0 ? '' : '-'}
              {viewInFiat
                ? `${currencyFormat1(
                    Math.abs(row.original.profitAmountUsd * exchangeRate),
                    fiatDecimals,
                    localFiat?.name || 'USD',
                  )}`
                : `${currencyFormat1(Math.abs(row.original.profitAmount), cryptoDecimals, '', false)} `}
            </div>
            <Image
              className="sm:h-[15px] h-[10px] sm:w-[15px] w-[10px]"
              height={15}
              width={15}
              src={row.original.currency ? `/img/fiats/${row.original.currency}.png` : '/img/fiats/USDT.png'}
              onError={(e) => {
                e.currentTarget.src = '/img/fiats/USDT.png';
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
  }, [localFiat, userId, innerWidth, viewInFiat, exchangeRate]);

  useEffect(() => {
    getAllBetHistory();
  }, [gameDetail]);

  useEffect(() => {
    if (gameSocket) {
      gameSocket.on(`bets`, (item: any) => {
        const data = JSON.parse(item);
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
              className="flex items-center py-[9px] px-[10px] rounded-[5px]"
              role="button"
              onClick={() => {
                setIsShowMore(!isShowMore);
              }}
            >
              <div className="text-default dark:text-[#FFFFFF] text-[#000] font-normal mr-[6px]">
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
    </>
  );
};

export default AllBetsTableComponent;
