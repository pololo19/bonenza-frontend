import { ColumnDef, Row } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowDown2, ArrowUp2, Ghost } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_getLatestBets } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { useWidth } from '@/base/hooks/useWidth';
import { currencyFormat1, formatLengthNumber } from '@/base/libs/utils';
import { setBetHistory } from '@/base/redux/reducers/game.reducer';
import { changeIsShowInformation } from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { BetTableDataType, GameDetail } from '@/base/types/common';

import ModalDetailBets from '../modal/detailBets/detailBets';
import RankingTableComponent from '../table/rankingTable';

const cryptoDecimals = 8;
const fiatDecimals = 2;

const LatestBetsTableComponent = ({ gameDetail }: { gameDetail?: GameDetail }) => {
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
  const [isPublicProfile, setIsPublicProfile] = useState<boolean>(false);

  const exchangeRate = useExchange();
  const innerWidth = useWidth();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('');

  const { userId, localFiat, betHistory, userName, viewInFiat } = useSelector(
    (state: AppState) => ({
      userId: state.auth.user.userId,
      userName: state.auth.user.userName,
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      betHistory: state.game.betHistory,
    }),
    shallowEqual,
  );

  const betHistoryFilter = useMemo(() => {
    if (!betHistory.length) return betHistory;
    if (isShowMore) return betHistory.slice(0, 40);
    return betHistory.slice(0, 10);
  }, [betHistory, isShowMore]);

  const getAllBetHistory = async () => {
    try {
      setIsLoadingTable(true);
      dispatch(setBetHistory([]));
      const res = await api_getLatestBets();
      console.log(res.data);
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
      dispatch(setBetHistory(tempBetData));
    } catch (error) {
      dispatch(setBetHistory([]));
    } finally {
      setIsLoadingTable(false);
    }
  };

  const openModalProfileUser = (row: Row<BetTableDataType>) => {
    const userData = {
      username: row.original.player,
      userId: row.original.playerId,
    };
    dispatch(setUserData(userData));
    if (row.original.player) {
      dispatch(changeIsShowInformation(true));
    }
  };

  const openModalBetDetail = (row: Row<BetTableDataType>) => {
    const betId = row?.getVisibleCells?.()[0].row.original.betId;
    setBetIdDetail(Number(betId));
    setSelBetDetail(row.original);
    setIsShowDetailBet(true);

    setIsPublicProfile(row.original.player == '' ? false : true);
  };

  const allBetColumns = useMemo(() => {
    const allBetColumnsDefault: ColumnDef<BetTableDataType>[] = [
      {
        accessorKey: 'betId',
        header: String(t('gameTable:game')),
        cell: ({ row }) => (
          <div className="dark:text-color-text-primary text-[#31373d] sm:text-[16px] text-[12px] font-bold truncate flex items-center gap-[5px] sm:p-2 p-[5px] sm:w-auto w-[20vw]">
            <Image
              height={24}
              width={24}
              src={`https://cdn.softswiss.net/i/s4/${row.original.gameIdenfiter?.replace(':', '/')}.png`}
              alt=""
              className="object-cover max-h-auto rounded-[5px]"
            />
            <span className="px-2">{row.original.game}</span>
          </div>
        ),
      },
      {
        accessorKey: 'player',
        header: () => <div className="text-center">{t('gameTable:player')}</div>,
        cell: ({ row }) => (
          <div
            className={`${
              row.original.playerId !== userId && !row.original.player && 'pointer-events-none'
            } font-bold truncate text-center sm:text-[16px] text-[12px] sm:p-2 p-[5px]`}
            onClick={() => openModalProfileUser(row)}
          >
            {row.original.playerId !== userId && !row.original.player ? (
              <div className="dark:text-color-text-primary text-[#31373d] flex justify-center items-center gap-[5px]">
                <Ghost width={12} height={12} variant="Bulk" className="w-5 h-5" /> 
                {t('homePage:hidden')}
              </div>
            ) : (
              <div className="dark:text-white text-black">
                {row.original.playerId === userId ? userName : row.original.player}
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'betAmount',
        header: () => <div className="text-center">{t('gameTable:betAmount')}</div>,
        cell: ({ row }) => (
          <div
            className="dark:text-white sm:text-[16px] text-[12px] text-[#31373d] font-bold truncate flex items-center justify-center gap-[5px] sm:p-2 px-[5px]"
            onClick={() => openModalBetDetail(row)}
          >
            {viewInFiat
              ? `${currencyFormat1(row.original.betAmountUsd * exchangeRate, fiatDecimals, localFiat?.name || 'USD')}`
              : `${currencyFormat1(row.original.betAmount, cryptoDecimals, '', false)} `}
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
      {
        accessorKey: 'multiplier',
        header: () => <div className="text-center">{t('gameTable:multiplier')}</div>,
        cell: ({ row }) => (
          <div className="dark:text-color-text-primary sm:text-[16px] text-[12px] text-[#31373d] truncate text-center font-bold sm:p-2 px-[5px]">
            {`${formatLengthNumber(row.original.multiplier, 2)}x`}
          </div>
        ),
      },
      {
        accessorKey: 'profit',
        header: String(t('gameTable:profitAmount')),
        minSize: 60,
        cell: ({ row }) => (
          <div className={cn('flex items-center sm:text-[16px] text-[12px] justify-end gap-[5px] sm:p-2 px-[5px]')}>
            <div
              className={cn('font-bold text-end truncate', {
                'text-color-primary': row.original.profitAmount >= 0,
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
              className="sm:h-[15px] h-[15px] sm:w-[15px] w-[15px]"
              height={15}
              width={15}
              src={`/img/fiats/${row.original.currency}.png`}
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
  }, [localFiat, userId, innerWidth, viewInFiat]);

  useEffect(() => {
    getAllBetHistory();
  }, []);

  return (
    <>
      <div>
        <RankingTableComponent
          containerClassName="w-full"
          isLoading={isLoadingTable}
          data={betHistoryFilter}
          columns={allBetColumns}
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
          betDetail={selBetDetail}
          betId={betIdDetail}
          isPublicProfile={isPublicProfile}
        />
      )}
    </>
  );
};

export default LatestBetsTableComponent;
