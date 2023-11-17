import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ArrowDown2, ArrowUp2 } from 'iconsax-react';
import cn from 'classnames';

import { RootState } from '@/base/types/root-state';
import { useTranslation } from '@/base/config/i18next';
import { BetTableDetailType } from '@/base/types/common';
import api from '@/api/api';
import { currencyFormat, exchangeByLocaleFiat, formatLengthNumber, handleLocaleSymbol } from '@/base/libs/utils';
import { socketConfig } from '@/base/constants/common';

import RankingTableComponent from '../table/rankingTable';
import ModalDetailBets from '../modal/detailBets/detailBets';
import { io } from 'socket.io-client';
import { camelizeKeys } from 'humps';
import { changeIsShowInformation } from '@/base/redux/reducers/modal.reducer';
import { useDispatch } from 'react-redux';

const HighRollerTableComponent = () => {
  const [hightRollerData, setHightRollerData] = useState<BetTableDetailType[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  const [isShowDetailBet, setIsShowDetailBet] = useState<boolean>(false);
  const [betIdDetail, setBetIdDetail] = useState<number>();
  const [isPublicProfile, setIsPublicProfile] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const { localeFiat, userId } = useSelector(
    (state: RootState) => ({
      localeFiat: state.common.localeFiat,
      userId: state.auth.userId,
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
      const res = await api.get('game/high-roller');
      setHightRollerData(res.data);
    } catch (error) {
      setHightRollerData([]);
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

  const hightRollerDataFilter = useMemo(() => {
    if (isShowMore) return hightRollerData.slice(0, 20);
    else return hightRollerData.slice(0, 10);
  }, [hightRollerData, isShowMore]);

  const highRollerColumns = useMemo(() => {
    const innerWidth = window.innerWidth;
    const columnsDefault: ColumnDef<any>[] = [
      {
        accessorKey: 'betId',
        header: () => <div className="text-left dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:game')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center dark:text-[#98A7B5] text-[#31373D] justify-start gap-[5px] truncate')}>
            <Image
              height={25}
              width={25}
              src={`https://cdn.softswiss.net/i/s4/${row.original.provider}/${row.original.identifier2}.png`}
              alt=""
              className="object-cover sm:h-[25px] h-[16px] sm:w-[25px] w-[16px]"
            />
            <div className="font-bold truncate">{row.original.title}</div>
          </div>
        ),
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
        accessorKey: 'betAmount',
        header: () => <div className="text-center dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:betAmount')}</div>,
        cell: ({ row }) => (
          <>
            {row.original.betAmount !== null && (
              <div className="flex items-center dark:text-[#98A7B5] text-[#31373D] justify-center gap-[5px] truncate">
                <div className="font-bold truncate">
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
        accessorKey: 'payout',
        header: () => <div className="text-center dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:multiplier')}</div>,
        cell: ({ row }) => (
          <div className="dark:text-[#98A7B5] text-[#31373D] truncate font-bold text-center">{row.original.payout}</div>
        ),
      },
      {
        accessorKey: 'profit',
        header: () => (
          <div className="text-right dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:profitAmount')}</div>
        ),
        cell: ({ row }) => (
          <div className={cn('flex items-center dark:text-[#98A7B5] text-[#31373D] justify-end gap-[5px]')}>
            <div
              className={cn('font-bold text-end truncate', {
                'text-green-500': row.original.profit >= 0,
                'text-red-500': row.original.profit < 0,
              })}
            >
              {row.original.profit > 0 && '+'}
              {localeFiat
                ? `${handleLocaleSymbol(String(localeFiat?.currency))} ${currencyFormat(
                    exchangeByLocaleFiat(row.original.currency, String(localeFiat?.currency), row.original.profit),
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
    if (innerWidth > 640) return columnsDefault;
    else {
      columnsDefault.splice(2, 1);
      return columnsDefault;
    }
  }, [localeFiat?.currency, userId, windowSize]);

  useEffect(() => {
    handleGetHighRoller();
  }, []);

  useEffect(() => {
    const socket = io(String(process.env.SOCKET_URL), socketConfig);
    socket.on('high_roller', (data) => {
      const camelizeKeysData = camelizeKeys(data) as BetTableDetailType;
      setHightRollerData((oldArray) => {
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
              <div className="text-[10px] dark:text-[#FFFFFF] text-[#31373D] font-bold mr-[6px]">
                {!isShowMore ? t('homePage:showMore') : t('homePage:showLess')}
              </div>
              {!isShowMore ? (
                <ArrowDown2 size={12} className="dark:text-white text-[#31373D]" />
              ) : (
                <ArrowUp2 size={12} className="text-white text-[#31373D]" />
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

export default HighRollerTableComponent;
