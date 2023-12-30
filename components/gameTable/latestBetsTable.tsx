import { ColumnDef, Row } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowDown2, ArrowUp2 } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_getLatestBets } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { setBetHistory } from '@/base/redux/reducers/game.reducer';
import { changeIsShowInformation } from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { BetTableDataType, GameDetail } from '@/base/types/common';

import ModalDetailBets from '../modal/detailBets/detailBets';
import RankingTableComponent from '../table/rankingTable';

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
  const dispatch = useAppDispatch();
  const { t } = useTranslation('');

  const { userId, localFiat, betHistory } = useSelector(
    (state: AppState) => ({
      userId: state.auth.user.userId,
      localFiat: state.wallet.localFiat,
      betHistory: state.game.betHistory,
    }),
    shallowEqual,
  );

  const betHistoryFilter = useMemo(() => {
    if (!betHistory.length) return betHistory;
    if (isShowMore) return betHistory.slice(0, 40);
    return betHistory.slice(0, 20);
  }, [betHistory, isShowMore]);

  const handleGetAllBet = async () => {
    try {
      setIsLoadingTable(true);
      const res = await api_getLatestBets();
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
      dispatch(setBetHistory(tempBetData));
    } catch (error) {
      dispatch(setBetHistory([]));
    } finally {
      setIsLoadingTable(false);
    }
  };

  const openModalProfileUser = (row: Row<any>) => {
    const userData = {
      username: row.original.player,
      userId: row.original.playerId,
    };
    console.log(userData, '----92');
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
    const innerWidth = window.innerWidth;
    const allBetColumnsDefault: ColumnDef<any>[] = [
      {
        accessorKey: 'betId',
        header: String(t('gameTable:game')),
        cell: ({ row }) => (
          <div className="dark:text-[#98A7B5] text-[#31373d] text-[16px] font-bold truncate flex items-center gap-[5px] p-2">
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
              row.original.playerId !== userId && row.original.isHideNamePublicList && 'pointer-events-none'
            } font-bold truncate text-center text-[16px] p-2`}
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
          <div className="dark:text-white text-[16px] text-[#31373d] font-bold truncate flex items-center justify-center gap-[5px]  p-2">
            {localFiat
              ? `${currencyFormat1(row.original.betAmountUsd * exchangeRate, 4, localFiat.name)}`
              : `${currencyFormat1(row.original.betAmount, 4, '', false)} `}
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
          <div className="dark:text-[#98A7B5] text-[16px] text-[#31373d] truncate text-center font-bold  p-2">
            {row.original.multiplier}
          </div>
        ),
      },
      {
        accessorKey: 'profit',
        header: String(t('gameTable:profitAmount')),
        minSize: 60,
        cell: ({ row }) => (
          <div className={cn('flex items-center text-[16px] justify-end gap-[5px] p-2')}>
            <div
              className={cn('font-bold text-end truncate', {
                'text-green-500': row.original.profitAmount >= 0,
                'text-red-500': row.original.profitAmount < 0,
              })}
            >
              {row.original.profit > 0 && '+'}
              {localFiat
                ? `${currencyFormat1(row.original.profitAmountUsd * exchangeRate, 4, localFiat.name)}`
                : `${currencyFormat1(row.original.profitAmount, 4, '', false)} `}
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
  }, [localFiat, userId]);

  useEffect(() => {
    handleGetAllBet();
  }, []);

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
