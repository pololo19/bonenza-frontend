import { ColumnDef, Row } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowDown2, ArrowUp2 } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { TIME_SUBMIT_FORMAT_WITH_SECOND, socketConfig } from '@/base/constants/common';
import {
  currencyFormat,
  exchangeByLocaleFiat,
  formatDate,
  formatLengthNumber,
  handleLocaleSymbol,
} from '@/base/libs/utils';
import { BetTableDetailType, GameDetail } from '@/base/types/common';
import { RootState } from '@/base/types/root-state';

import { changeIsShowInformation } from '@/base/redux/reducers/modal.reducer';
import { camelizeKeys } from 'humps';
import ModalDetailBets from '../modal/detailBets/detailBets';
import RankingTableComponent from '../table/rankingTable';

const AllBetsTableComponent = ({ gameDetail }: { gameDetail?: GameDetail }) => {
  const [allBetData, setAllBetData] = useState<BetTableDetailType[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  const [isShowDetailBet, setIsShowDetailBet] = useState<boolean>(false);
  const [betIdDetail, setBetIdDetail] = useState<number>();
  const [isPublicProfile, setIsPublicProfile] = useState<boolean>(false);

  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const { localeFiat, userId } = useSelector(
    (state: RootState) => ({
      localeFiat: state.common.localeFiat,
      userId: state.auth.userId,
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
        header: () => <div className="dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:betId')}</div>,
        cell: ({ row }) => <div className="dark:text-[#98A7B5] text-[#31373D] truncate">{row.original.betId}</div>,
      },
      {
        accessorKey: 'player',
        header: () => <div className="text-center dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:player')}</div>,
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
        accessorKey: 'time',
        header: () => <div className="text-center dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:time')}</div>,
        cell: ({ row }) => (
          <div className="dark:text-[#98A7B5] text-[#31373D] truncate text-center">
            {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_SECOND)}
          </div>
        ),
      },
      {
        accessorKey: 'payout',
        header: () => <div className="text-center dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:payout')}</div>,
        cell: ({ row }) => (
          <div className="dark:text-[#98A7B5] text-[#31373D] truncate text-center font-bold">{row.original.payout}</div>
        ),
      },
      {
        accessorKey: 'profit',
        header: () => <div className="dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:profit')}</div>,
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
    if (gameDetail) {
      const socket = io(String(process.env.SOCKET_URL), socketConfig);
      socket.on(`create_bet_game_identifier_${gameDetail.identifier}`, (data) => {
        const camelizeKeysData = camelizeKeys(data) as BetTableDetailType;
        setAllBetData((oldArray) => {
          const index = oldArray.findIndex((bet) => bet.gameId === camelizeKeysData.gameId);
          if (index >= 0) {
            const newData = oldArray.map((bet) => {
              if (bet.gameId === camelizeKeysData.gameId) {
                return camelizeKeysData;
              }
              return bet;
            });
            return newData;
          } else {
            return [camelizeKeysData, ...oldArray];
          }
        });
      });

      // Clean up the socket connection on unmount
      return () => {
        socket.disconnect();
      };
    } else {
      const socket = io(String(process.env.SOCKET_URL), socketConfig);
      socket.on('create_bet', (data) => {
        const camelizeKeysData = camelizeKeys(data) as BetTableDetailType;
        setAllBetData((oldArray) => [camelizeKeysData, ...oldArray]);
      });

      // Clean up the socket connection on unmount
      return () => {
        socket.disconnect();
      };
    }
  }, [gameDetail]);

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
