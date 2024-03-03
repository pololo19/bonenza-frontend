import { ColumnDef, Row } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowDown2, ArrowUp2 } from 'iconsax-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { api_highRollers } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, formatLengthNumber } from '@/base/libs/utils';
import { changeIsShowInformation } from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState } from '@/base/redux/store';
import { BetTableDataType, BetTableDetailType } from '@/base/types/common';

import ModalDetailBets from '../modal/detailBets/detailBets';
import RankingTableComponent from '../table/rankingTable';

const cryptoDecimals = 8;
const fiatDecimals = 2;

const HighRollerTableComponent = () => {
  const exchangeRate = useExchange();
  const [hightRollerData, setHightRollerData] = useState<BetTableDetailType[]>([]);
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
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const { localFiat, userId, userName, viewInFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      userId: state.auth.user.userId,
      userName: state.auth.user.userName,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const handleWindowResize = useCallback((event: any) => {
    setWindowSize(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);

  const handleGetHighRoller = async () => {
    try {
      setIsLoadingTable(true);
      const res = await api_highRollers();
      setHightRollerData(res.data);
    } catch (error) {
      setHightRollerData([]);
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
    setBetIdDetail(Number(betId));
    setSelBetDetail(row.original);
    setIsShowDetailBet(true);
  };

  const hightRollerDataFilter = useMemo(() => {
    if (isShowMore) return hightRollerData.slice(0, 20);
    else return hightRollerData.slice(0, 10);
  }, [hightRollerData, isShowMore]);

  const highRollerColumns = useMemo(() => {
    const innerWidth = window.innerWidth;
    const columnsDefault: ColumnDef<BetTableDataType>[] = [
      {
        accessorKey: 'betId',
        header: () => (
          <div className="text-left dark:text-color-text-primary text-color-light-text-primary">
            {t('gameTable:game')}
          </div>
        ),
        cell: ({ row }) => (
          <div
            className={cn(
              'flex items-center dark:text-color-text-primary text-color-light-text-primary justify-start gap-[5px] truncate',
            )}
          >
            <Image
              height={25}
              width={25}
              src={`https://cdn.softswiss.net/i/s4/${row.original.gameIdenfiter.replace(':', '/')}.png`}
              alt=""
              className="object-cover sm:h-[25px] h-[16px] sm:w-[25px] w-[16px]"
            />
            <div className="font-bold truncate">{row.original.game}</div>
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
            onClick={() => handleModalProfile(row)}
          >
            {row.original.playerId !== userId && !row.original.player ? (
              <div className="dark:text-color-text-primary text-color-light-text-primary">{t('homePage:hidden')}</div>
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
        header: () => (
          <div className="text-center dark:text-color-text-primary text-color-light-text-primary">
            {t('gameTable:betAmount')}
          </div>
        ),
        cell: ({ row }) => (
          <>
            {row.original.betAmount !== null && (
              <div className="flex items-center dark:text-color-text-primary text-color-light-text-primary justify-center gap-[5px] truncate">
                <div className="font-bold truncate">
                  {viewInFiat
                    ? currencyFormat1(row.original.betAmountUsd * exchangeRate, fiatDecimals, localFiat?.name)
                    : currencyFormat1(row.original.betAmount, cryptoDecimals, '', false)}
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
        accessorKey: 'payout',
        header: () => (
          <div className="text-center dark:text-color-text-primary text-color-light-text-primary">
            {t('gameTable:multiplier')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="dark:text-color-text-primary text-color-light-text-primary truncate font-bold text-center">
            {`${formatLengthNumber(row.original.multiplier, 2)}x`}
          </div>
        ),
      },
      {
        accessorKey: 'profit',
        header: () => (
          <div className="text-right dark:text-color-text-primary text-color-light-text-primary">
            {t('gameTable:profitAmount')}
          </div>
        ),
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-end gap-[5px]  sm:p-2 p-[5px]')}>
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
              className="sm:h-[15px] h-[10px] sm:w-[15px] w-[10px]"
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
    if (innerWidth > 640) return columnsDefault;
    else {
      columnsDefault.splice(2, 1);
      return columnsDefault;
    }
  }, [localFiat, userId, windowSize]);

  useEffect(() => {
    handleGetHighRoller();
  }, []);

  return (
    <>
      <div>
        <RankingTableComponent
          containerClassName="w-full"
          isLoading={isLoadingTable}
          data={hightRollerDataFilter}
          columns={highRollerColumns}
          onRowClick={handleClickRow}
        />
        {!!hightRollerDataFilter.length && (
          <div className="flex justify-center mt-[20px] pb-[8px] md:pb-[23px]">
            <div
              className="flex items-center dark:bg-[#25262B] bg-[#f6f7fa] py-[9px] px-[10px] rounded-[5px]"
              role="button"
              onClick={() => {
                setIsShowMore(!isShowMore);
              }}
            >
              <div className="text-[10px] dark:text-[#FFFFFF] text-color-light-text-primary font-bold mr-[6px]">
                {!isShowMore ? t('homePage:showMore') : t('homePage:showLess')}
              </div>
              {!isShowMore ? (
                <ArrowDown2 size={12} className="dark:text-white text-color-light-text-primary" />
              ) : (
                <ArrowUp2 size={12} className="text-white text-color-light-text-primary" />
              )}
            </div>
          </div>
        )}
      </div>
      {isShowDetailBet && (
        <ModalDetailBets
          betDetail={selBetDetail}
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

export default HighRollerTableComponent;
