import { ColumnDef, Row } from '@tanstack/react-table';
import cn from 'classnames';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { useCountdown } from '@/base/constants/useCountdown';
import { currencyFormat, exchangeByLocaleFiat, formatDate, handleLocaleSymbol } from '@/base/libs/utils';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowInformation,
} from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';

import ModalWagerRules from '../modal/wagerRules/wagerRules';
import RankingTableComponent from '../table/rankingTable';
import styles from './index.module.scss';

const WagerContestComponent = () => {
  const dispatch = useDispatch();
  const [wagerContestData, setWagerContestData] = useState<any>({ data: [] });
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [isShowWagerRules, setIsShowWagerRules] = useState<boolean>(false);

  const { t } = useTranslation('');

  const { localeFiat, userName, avatar, userId } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
      userName: state.auth.userName,
      avatar: state.auth.avatar,
      userId: state.auth.userId,
    }),
    shallowEqual,
  );

  const getNextDay = () => {
    let currentDate = new Date();
    return currentDate.setDate(currentDate.getDate() + 1);
  };

  const [timeCoundown] = useState(formatDate(getNextDay(), 'LL/dd/yyyy'));
  const [days, hours, minutes, seconds] = useCountdown(timeCoundown);
  const handleGetWagerContest = async () => {
    try {
      setIsLoadingTable(true);
      const res = await api.get('game/get-wager-contest-list');
      setWagerContestData(res.data);
    } catch (error) {
      setWagerContestData({});
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleClickRow = (row: Row<any>) => {
    return;
  };

  const getExchangeRateLocalFiat = (valueRate: number) => {
    return localeFiat
      ? `${handleLocaleSymbol(String(localeFiat?.currency))} ${currencyFormat(
          exchangeByLocaleFiat('USD', String(localeFiat?.currency), valueRate),
          2,
        )}`
      : `${handleLocaleSymbol('USD')} ${currencyFormat(Number(valueRate || 0), 2)}`;
  };

  const openModalProfileUser = (user: any) => {
    const userData = {
      userId: user?.original ? user?.original?.userId : user?.userId,
      isHideNamePublicList: user?.original ? user?.original?.isHideNamePublicList : user?.isHideNamePublicList,
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    dispatch(changeIsShowInformation(true));
  };

  const handleTotalPrize = async () => {
    try {
      const res = await api.get('game/get-total-prize');
      setWagerContestData((prev: any) => {
        return { ...prev, totalPrize: res.data.totalPrize };
      });
    } catch (error) {}
  };

  const checkPosition = (position: number, getValue: string) => {
    let wager = '';
    let rank = 1;
    if (position > 10) {
      wager = getExchangeRateLocalFiat(wagerContestData?.data[wagerContestData?.data?.length - 1]?.wagered);
      rank = 10;
    } else if (position > 1 && position <= 10) {
      wager = getExchangeRateLocalFiat(wagerContestData?.data[position - 2]?.wagered);
      rank = position - 1;
    } else {
      wager = getExchangeRateLocalFiat(wagerContestData?.data[position - 1]?.wagered);
    }
    return getValue === 'wager' ? wager : rank;
  };

  const getRank = (rank: number) => {
    let rankReturn = '';
    if (rank >= 50) {
      rankReturn = '50th+';
    } else if (rank > 3) {
      rankReturn = rank + 'th+';
    } else {
      switch (Number(rank)) {
        case 1:
          rankReturn = '1st';
          break;
        case 2:
          rankReturn = '2nd';
          break;
        default:
          rankReturn = '3rd';
          break;
      }
    }
    return rankReturn;
  };

  const WagerContestColumns = useMemo(() => {
    const innerWidth = window.innerWidth;
    const columnsDefault: ColumnDef<any>[] = [
      {
        accessorKey: 'betId',
        header: () => <div className="dark:text-[#98A7B5] text-[#31373D]">#</div>,
        minSize: 30,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start gap-[5px] truncate')}>
            {row.index === 0 && (
              <Image
                height={25}
                width={25}
                src="/img/icon/gold.png"
                alt=""
                className="object-cover sm:h-[25px] h-[16px] sm:w-[25px] w-[16px]"
              />
            )}
            {row.index === 1 && (
              <Image
                height={25}
                width={25}
                src="/img/icon/sliver.png"
                alt=""
                className="object-cover sm:h-[25px] h-[16px] sm:w-[25px] w-[16px]"
              />
            )}
            {row.index === 2 && (
              <Image
                height={25}
                width={25}
                src="/img/icon/bronze.png"
                alt=""
                className="object-cover sm:h-[25px] h-[16px] sm:w-[25px] w-[16px]"
              />
            )}
            {row.index !== 0 && row.index !== 1 && row.index !== 2 && (
              <div className="dark:text-[#98A7B5] text-[#31373D] font-bold truncate">{row.index + 1}th</div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'player',
        header: () => <div className="dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:player')}</div>,
        minSize: 30,
        cell: ({ row }) => (
          <div
            onClick={() => openModalProfileUser(row)}
            className={`${
              row.original?.userId !== userId && row.original?.isHideNamePublicList && 'pointer-events-none cursor-text'
            } dark:text-[#98A7B5] text-[#31373D] flex items-center justify-start gap-[10px] truncate'`}
          >
            {row.original?.userId !== userId && row.original?.isHideNamePublicList ? (
              <Image
                width={25}
                height={25}
                className="object-cover max-w-full rounded-full"
                src="/img/avatar-hidden.png"
                alt=""
              />
            ) : (
              <Image
                height={25}
                width={25}
                src={String(process.env.API_AVATAR) + row.original?.avatar}
                onError={(e) => {
                  e.currentTarget.src = '/img/avatar-1.png';
                }}
                alt=""
                className="object-cover sm:h-[25px] rounded-full h-[16px] sm:w-[25px] w-[16px]"
              />
            )}
            <div className="font-bold truncate">
              {row.original?.userId !== userId && row.original?.isHideNamePublicList
                ? t('homePage:hidden')
                : row.original.username}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'betAmount',
        header: () => <div className="dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:wagered')}</div>,
        minSize: 30,
        cell: ({ row }) => (
          <div className="text-[#0DFDE4] truncate">{getExchangeRateLocalFiat(Number(row.original?.wagered) || 0)}</div>
        ),
      },
      {
        accessorKey: 'payout',
        header: () => <div className="dark:text-[#98A7B5] text-[#31373D]">{t('gameTable:prize')}</div>,
        minSize: 30,
        cell: ({ row }) => (
          <div className="dark:text-[#98A7B5] text-[#31373D] truncate flex justify-end">
            <span className=" text-[#0DFDE4]">{getExchangeRateLocalFiat(Number(row.original?.prize) || 0)}</span>
            <span className="ml-[5px] hidden sm:block">({row.original?.percentPrize}%)</span>
          </div>
        ),
      },
    ];
    return columnsDefault;
  }, [localeFiat?.currency]);

  const startTime = useMemo(() => {
    let date = new Date();
    return formatDate(date, 'LL/dd/yyyy');
  }, []);

  const endTime = useMemo(() => {
    return formatDate(getNextDay(), 'LL/dd/yyyy');
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleTotalPrize();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    handleGetWagerContest();
  }, []);

  return (
    <>
      <div className="flex gap-2 mb-3 flex-wrap">
        <div className="rounded-[5px] dark:bg-[#24262B] bg-[#f6f7fa] p-3 pt-0 h-[8.313rem] justify-center flex gap-[0.75rem] sm:gap-[1.5rem] lg:gap-[2rem] min-w-fit grow">
          <Image
            width={125}
            height={110}
            className="object-cover md:ml-3 w-full h-auto max-w-[108px] md:max-w-[125px]"
            src="/img/cup.png"
            alt=""
          />
          <div className="flex">
            <div className="flex flex-col gap-2 justify-end">
              <span className="text-[0.813rem] text-[#0DFDE4]">{t('wagerContest:daily')}</span>
              <span className="text-[0.75rem]">{t('wagerContest:contestPrizePool')}</span>
              <div className="rounder-[5px] dark:bg-[#2D3035] bg-white text-[0.875rem] md:text-[1.125rem] font-black h-[37px] px-2 flex items-center justify-center">
                <p className={`${styles.textGradient}`}>
                  {getExchangeRateLocalFiat(Number(wagerContestData?.totalPrize))}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`min-[830px]:max-w-[380px] rounded-[5px] dark:bg-[#24262B] bg-[#f6f7fa] ${styles.boxCenter}  h-[8.313rem] flex-col gap-4 px-3 grow`}
        >
          <p className="text-[#8E8E90] text-center">
            {userId ? t('wagerContest:timeRemaining') : t('wagerContest:timeRemainingBeforeLogin')}
          </p>
          {userId ? (
            <div className="flex gap-2">
              <div
                className={`dark:bg-[#191B1E] dark:border-0 bg-white border border-solid border-[#d3d3d366] rounded-[8px] ${styles.boxTime}`}
              >
                <p className="font-bold text-[18px] dark:text-white text-[#000]">{hours}</p>
                <p className="text-[#8E8E90] text-[8px]">{t('wagerContest:hours')}</p>
              </div>
              <div
                className={`dark:bg-[#191B1E] dark:border-0 bg-white border border-solid border-[#d3d3d366] rounded-[8px] ${styles.boxTime}`}
              >
                <p className="font-bold text-[18px] dark:text-white text-[#000]">{minutes}</p>
                <p className="text-[#8E8E90] text-[8px]">{t('wagerContest:minute')}</p>
              </div>
              <div
                className={`dark:bg-[#191B1E] dark:border-0 bg-white border border-solid border-[#d3d3d366] rounded-[8px] ${styles.boxTime}`}
              >
                <p className="font-bold text-[18px] dark:text-white text-[#000]">{seconds}</p>
                <p className="text-[#8E8E90] text-[8px]">{t('wagerContest:second')}</p>
              </div>
            </div>
          ) : (
            <div
              className="bg-[#F61B4F] h-[48px] hover:opacity-90 cursor-pointer max-w-[280px] rounded-[4px] text-white font-bold text-[14px] w-full flex items-center justify-center"
              onClick={() => {
                dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
                dispatch(changeIsShowAuthenticationModal(true));
              }}
            >
              {t('wagerContest:participateNow')}
            </div>
          )}
        </div>
        <div className={`rounded-[5px] relative ${styles.boxCenter}  h-[8.313rem] flex-col gap-4 grow`}>
          <Image
            width={48}
            height={48}
            className="object-cover h-[3rem] w-[3rem] absolute left-0 top-0"
            src="/img/icon/winner.png"
            alt=""
          />
          <div className={`dark:bg-[#24262B] bg-[#f6f7fa] h-full w-full ${styles.boxCenter} px-3`}>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-[14px] w-full pl-[66px]">
                <Image
                  width={16}
                  height={13}
                  className="object-cover h-[13px] w-[16px]"
                  src="/img/icon/crown.png"
                  alt=""
                />
                <span className="text-[10px] text-[#8E8E90] leading-[18px]">{t('wagerContest:lastChampion')}</span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="relative border-solid border-2 rounded-full border-[#F39717]">
                  <Image
                    width={16}
                    height={13}
                    className="absolute -top-[13px] -translate-x-2/4 left-1/2 object-cover h-[13px] w-[16px]"
                    src="/img/icon/crown.png"
                    alt=""
                  />
                  {wagerContestData?.lastUserChampion?.userId !== userId &&
                  wagerContestData?.lastUserChampion?.isHideNamePublicList ? (
                    <Image
                      width={46}
                      height={59}
                      className="object-cover max-w-full rounded-full"
                      src="/img/avatar-hidden.png"
                      alt=""
                    />
                  ) : (
                    <Image
                      width={46}
                      height={59}
                      className="object-cover"
                      src={String(process.env.API_AVATAR) + wagerContestData?.lastUserChampion?.avatar}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.src = '/img/avatar-1.png';
                      }}
                    />
                  )}
                </div>
                <div className="">
                  <p
                    className={`${
                      wagerContestData?.lastUserChampion?.userId !== userId &&
                      wagerContestData?.lastUserChampion?.isHideNamePublicList
                        ? 'pointer-events-none'
                        : 'hover:underline cursor-pointer'
                    } dark:text-white text-[#000]`}
                    onClick={() => openModalProfileUser(wagerContestData?.lastUserChampion)}
                  >
                    {wagerContestData?.lastUserChampion?.userId !== userId &&
                    wagerContestData?.lastUserChampion?.isHideNamePublicList
                      ? t('homePage:hidden')
                      : wagerContestData?.lastUserChampion?.username}
                  </p>
                  <div className="text-[12px] leading-[18px] text-[#8E8E90] mt-3 flex gap-[3px] flex-col md:flex-row">
                    <span>{t('wagerContest:profit')}</span>
                    <div className="flex items-center gap-[3px] ml-2">
                      <Image
                        width={16}
                        height={16}
                        className="object-cover w-[1rem] h-[1rem]"
                        src={`/img/fiats/${wagerContestData?.lastUserChampion?.symbol}.png`}
                        onError={(e) => {
                          e.currentTarget.src = '/img/fiats/USD.png';
                        }}
                        alt=""
                      />
                      <span className="text-[#0DFDE4] ml-1">{wagerContestData?.lastUserChampion?.profit}</span>
                      <span className="dark:text-white text-[#000]">
                        ({wagerContestData?.lastUserChampion?.prizePercent})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Image
                onClick={() => setIsShowWagerRules(true)}
                width={22}
                height={22}
                className="cursor-pointer object-cover h-[18px] mt-3 w-[18px] absolute top-0 right-[16px]"
                src="/img/question-cricle.svg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      {userId && (
        <div className="flex md:items-center flex-col md:flex-row md:px-4 p-2 md:h-[3.5rem] dark:bg-[#24262B] bg-[#f6f7fa] gap-y-4 text-[#8E8E90] text-[0.625rem]">
          <div
            className={`flex ${styles.boxBorder} gap-3 w-full md:w-auto grow-[3] border-r items-center border-[#3E4349]`}
          >
            <Image
              width={28}
              height={28}
              className="object-cover h-[1.75rem] w-[1.75rem]"
              src={String(process.env.API_AVATAR) + avatar}
              alt=""
              onError={(e) => {
                e.currentTarget.src = '/img/avatar-1.png';
              }}
            />
            <span className="text-[0.75rem] dark:text-[#fff] text-[#000] font-bold">{userName}</span>
          </div>
          <div
            className={`grow-[8] flex max-md:mx-auto max-md:gap-[8.5rem] pb-3 md:p-0 border-b md:border-b-0 border-solid border-[#3E4349] ${styles.boxBorderCenter}`}
          >
            <div className={`grow ${styles.boxBorder}`}>
              <p>{t('wagerContest:myPosition')}</p>
              <p className="text-[#F39717] text-[0.75rem] font-bold">
                {getRank(Number(wagerContestData?.currentUserRank?.position))}
              </p>
            </div>
            <div className={`grow ${styles.boxBorder}`}>
              <p>{t('wagerContest:wagered')}</p>
              <p className="text-[#F39717] text-[0.75rem] font-bold">
                {getExchangeRateLocalFiat(Number(wagerContestData?.currentUserRank?.wagered))}
              </p>
            </div>
          </div>
          <div className="grow-[2] flex gap-[0.313rem] min-w-fit justify-center md:justify-start items-center">
            {Number(wagerContestData?.currentUserRank?.position) > 1 ? (
              <>
                <span>{t('wagerContest:wager')}</span>
                <p className="dark:text-[#fff] text-[#000] text-[0.75rem] font-bold">
                  {checkPosition(wagerContestData?.currentUserRank?.position, 'wager')}
                </p>
                <span>{t('wagerContest:toReach')}</span>
                <div className="bg-[#f397174d] min-w-fit rounded-[3px] flex items-center h-[1.25rem] px-[0.313rem] font-semibold text-[#F39717] uppercase">
                  top {checkPosition(wagerContestData?.currentUserRank?.position, 'top')}
                </div>
              </>
            ) : (
              <p className="text-white text-[12px] font-bold m-auto">{t('wagerContest:youAreTop')}</p>
            )}
          </div>
        </div>
      )}
      <div className="text-[0.813rem] flex items-center gap-4 mt-8 mb-4">
        <p className="dark:text-[#fff] text-[#000]">{t('wagerContest:active')}</p>
        <p className="text-[#939699]">
          {startTime} ~ {endTime}
        </p>
      </div>
      <div>
        <RankingTableComponent
          containerClassName="w-full"
          isLoading={isLoadingTable}
          data={wagerContestData.data}
          columns={WagerContestColumns}
          onRowClick={handleClickRow}
        />
      </div>
      {isShowWagerRules && <ModalWagerRules show={isShowWagerRules} onClose={() => setIsShowWagerRules(false)} />}
    </>
  );
};

export default WagerContestComponent;
