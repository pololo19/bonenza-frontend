import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { api_wagerContestHistory, api_wagerContestList, api_wagerContestPosition } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { DATE_TIME_SUBMIT_FORMAT_WITH_SECOND } from '@/base/constants/common';
import { useCountdown } from '@/base/constants/useCountdown';
import { useExchange } from '@/base/hooks/useExchange';
import { useUSDTPrice } from '@/base/hooks/useUSDTPrice';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowInformation,
  changeIsShowWagerContestHistory,
} from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';

import ModalWagerRules from '../modal/wagerRules/wagerRules';
import RankingTableComponent from '../table/rankingTable';
import styles from './index.module.scss';

type ContesterType = {
  playerId: string;
  playerName: string;
  playerAvatar: string;
  wageredAmountUsd: number;
  prizeAmountUsd: number;
  percentage: number;
};

type WagerContestType = {
  currentTime: number;
  endTime: number;
  totalPrizePoolAmountUsd: number;
  contesters: ContesterType[];
};

const WagerContestComponent = () => {
  const exchangeRate = useExchange();
  const usdtPrice = useUSDTPrice();
  const dispatch = useDispatch();
  const [wagerContestData, setWagerContestData] = useState<WagerContestType>({
    currentTime: 0,
    endTime: 0,
    totalPrizePoolAmountUsd: 0,
    contesters: [],
  });
  const [wagerHistory, setWagerHistory] = useState<ContesterType>({
    playerId: '',
    playerName: '',
    playerAvatar: '',
    wageredAmountUsd: 0,
    percentage: 0,
    prizeAmountUsd: 0,
  });
  const [positionData, setPositionData] = useState({
    position: 1,
    wageredAmountUsd: 0,
  });
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [isShowWagerRules, setIsShowWagerRules] = useState<boolean>(false);

  const { t } = useTranslation('');

  const { userName, avatar, userId, viewInFiat, localFiat, isLogin } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      userName: state.auth.user.userName,
      avatar: state.auth.user.avatar,
      userId: state.auth.user.userId,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      isLogin: state.auth.isLogin,
      cryptoPrices: state.wallet.symbols,
    }),
    shallowEqual,
  );

  const getNextDay = () => {
    let currentDate = new Date();
    return currentDate.setDate(currentDate.getDate() + 1);
  };

  const [timeCoundown, setTimeCount] = useState(formatDate(getNextDay(), 'LL/dd/yyyy'));
  const [days, hours, minutes, seconds] = useCountdown(timeCoundown);

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

  const getWagerContestData = async () => {
    try {
      setIsLoadingTable(true);
      const [wagerContestList, wagerContestHistory] = await Promise.all([
        api_wagerContestList(),
        api_wagerContestHistory(),
      ]);
      const tempContestData: WagerContestType = {
        currentTime: Number(wagerContestList?.data.currentTime * 1000 ?? 0),
        endTime: Number(wagerContestList?.data.endTime * 1000 ?? 0),
        totalPrizePoolAmountUsd: Number(wagerContestList?.data.totalPrizePoolAmountUsd ?? 0),
        contesters: wagerContestList?.data?.contesters?.map((item: any) => ({
          playerId: item?.playerId ?? '',
          playerName: item?.playerName ?? '',
          playerAvatar: item?.playerAvatar ?? '',
          wageredAmountUsd: Number(item?.wageredAmountUsd ?? 0),
          prizeAmountUsd: Number(item?.prizeAmountUsd ?? 0),
          percentage: Number(item?.percentage ?? 0),
        })),
      };

      if (wagerContestHistory?.data?.contest?.length > 0) {
        const tempTopContester = wagerContestHistory?.data?.contest[0];
        setWagerHistory({
          playerId: tempTopContester.playerId,
          playerName: tempTopContester.playerName,
          playerAvatar: tempTopContester.playerAvatar,
          wageredAmountUsd: tempTopContester.wageredAmountUsd,
          prizeAmountUsd: tempTopContester.prizeAmountUsd,
          percentage: tempTopContester.percentage,
        });
      }

      const timeCnt = wagerContestList.data.endTime - wagerContestList.data.currentTime;
      const currentDate = new Date();
      currentDate.setTime(currentDate.getTime() + timeCnt * 1000);
      setTimeCount(formatDate(currentDate, DATE_TIME_SUBMIT_FORMAT_WITH_SECOND));
      // reset(updatedValue);
      setWagerContestData(tempContestData);
    } catch (error) {
      setWagerContestData({
        currentTime: 0,
        endTime: 0,
        totalPrizePoolAmountUsd: 0,
        contesters: [],
      });
    } finally {
      setIsLoadingTable(false);
    }
  };

  const getUserPosition = async () => {
    try {
      const res = await api_wagerContestPosition();
      setPositionData({
        position: Number(res.data.position ?? 1),
        wageredAmountUsd: Number(res.data.wageredAmountUsd ?? 0),
      });
    } catch (error) {}
  };

  const wagerAndPostion = useMemo(() => {
    const position = positionData.position;
    let wagerAmount = 0;
    let nextPosition = '';
    if (position >= 1) {
      nextPosition = '1';
      wagerAmount = wagerContestData.contesters[0]?.wageredAmountUsd ?? 0;
    }
    if (position > 5) {
      nextPosition = '5';
      wagerAmount = wagerContestData.contesters[4]?.wageredAmountUsd ?? 0;
    }
    if (position > 10) {
      nextPosition = '10';
      wagerAmount = wagerContestData.contesters[9]?.wageredAmountUsd ?? 0;
    }
    return { position: nextPosition, wagerAmount };
  }, [positionData, wagerContestData]);

  const handleModalUserProfile = (user: any) => {
    dispatch(
      setUserData({
        userId: user.playerId || user.original.playerId || '',
        userName: user.playerName || user.original.playerName || '',
        avatar: user.playerAvatar || user.original.playerAvatar || '',
      }),
    );
    dispatch(changeIsShowInformation(true));
  };

  const WagerContestColumns = useMemo(() => {
    const columnsDefault: ColumnDef<ContesterType>[] = [
      {
        accessorKey: 'betId',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">#</div>
        ),
        minSize: 30,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start gap-[5px] truncate sm:px-2 px-[5px]')}>
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
              <div className="dark:text-color-text-primary text-color-light-text-primary font-bold truncate">
                {row.index + 1}th
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'player',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">
            {t('gameTable:player')}
          </div>
        ),
        minSize: 30,
        cell: ({ row }) => (
          <div
            onClick={() => handleModalUserProfile(row)}
            className={cn(
              'dark:text-white text-color-light-text-primary flex items-center justify-start gap-[10px] truncate sm:px-2 px-[5px]',
              {
                'pointer-events-none cursor-text': row.original?.playerId !== userId && !row.original?.playerName,
              },
            )}
          >
            {row.original?.playerId !== userId && !row.original?.playerName ? (
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
                src={String(process.env.API_AVATAR) + row.original?.playerAvatar}
                onError={(e) => {
                  e.currentTarget.src = '/img/avatar-1.png';
                }}
                alt=""
                className="object-cover sm:h-[25px] rounded-full h-[16px] sm:w-[25px] w-[16px]"
              />
            )}
            <div className="font-bold truncate">
              {row.original?.playerId !== userId && !row.original?.playerName
                ? t('homePage:hidden')
                : row.original.playerId === userId
                ? userName
                : row.original.playerName}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'betAmount',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">
            {t('gameTable:wagered')}
          </div>
        ),
        minSize: 30,
        cell: ({ row }) => (
          <div className="text-color-primary truncate sm:px-2 px-[5px] font-bold">
            {viewInFiat
              ? currencyFormat1(row.original.wageredAmountUsd * exchangeRate, 8, localFiat?.name)
              : currencyFormat1(row.original.wageredAmountUsd, 8)}
          </div>
        ),
      },
      {
        accessorKey: 'payout',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">
            {t('gameTable:prize')}
          </div>
        ),
        minSize: 30,
        cell: ({ row }) => (
          <div className="dark:text-color-text-primary text-color-light-text-primary truncate flex justify-end sm:px-2 px-[5px] font-bold">
            <span className="text-color-primary font-bold">
              {viewInFiat
                ? currencyFormat1(row.original.prizeAmountUsd * exchangeRate, 4, localFiat?.name)
                : currencyFormat1(row.original.prizeAmountUsd, 4)}
            </span>
            <span className="ml-[5px] hidden sm:block font-bold text-color-text-primary/70">{`${row.original.percentage}%`}</span>
          </div>
        ),
      },
    ];
    return columnsDefault;
  }, [localFiat, exchangeRate]);

  useEffect(() => {
    getWagerContestData();
  }, []);

  useEffect(() => {
    getUserPosition();
  }, [isLogin]);

  return (
    <>
      <div className="flex gap-2 mb-3 flex-wrap">
        <div className="rounded-[5px] dark:bg-color-card-body-primary bg-color-light-bg-primary p-3 pt-0 h-[8.313rem] justify-center flex gap-[12px] sm:gap-[1.5rem] lg:gap-[2rem] min-w-fit grow">
          <Image
            width={125}
            height={110}
            className="object-cover md:ml-3 w-full h-auto max-w-[108px] md:max-w-[125px]"
            src="/img/cup.png"
            alt=""
          />
          <div className="flex">
            <div className="flex flex-col gap-2 justify-end">
              <span className="text-[14px] text-color-primary font-bold">{t('wagerContest:daily')}</span>
              <span className="text-[12px] dark:text-color-text-primary text-color-light-text-primary">
                {t('wagerContest:contestPrizePool')}
              </span>
              <div className="rounder-[5px] dark:bg-[#2D3035] bg-white text-[14px] md:text-[20px] font-black h-[37px] px-2 flex items-center justify-center">
                <p className="text-color-secondary font-bold">
                  {viewInFiat
                    ? currencyFormat1(wagerContestData.totalPrizePoolAmountUsd * exchangeRate, 4, localFiat?.name)
                    : currencyFormat1(wagerContestData.totalPrizePoolAmountUsd, 4)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`min-[830px]:max-w-[380px] rounded-[5px] dark:bg-color-card-body-primary bg-color-light-bg-primary ${styles.boxCenter}  h-[8.313rem] flex-col gap-4 px-3 grow`}
        >
          <p className="text-color-text-primary text-center text-[14px]">
            {userId ? t('wagerContest:timeRemaining') : t('wagerContest:timeRemainingBeforeLogin')}
          </p>
          {userId ? (
            <div className="flex gap-2">
              <div
                className={`dark:bg-[#191B1E] dark:border-0 bg-white border border-solid border-[#d3d3d366] rounded-[8px] ${styles.boxTime}`}
              >
                <p className="font-bold text-[18px] dark:text-white text-[#000]">{Number(hours)}</p>
                <p className="text-color-text-primary text-[8px]">{t('wagerContest:hours')}</p>
              </div>
              <div
                className={`dark:bg-[#191B1E] dark:border-0 bg-white border border-solid border-[#d3d3d366] rounded-[8px] ${styles.boxTime}`}
              >
                <p className="font-bold text-[18px] dark:text-white text-[#000]">{Number(minutes)}</p>
                <p className="text-color-text-primary text-[8px]">{t('wagerContest:minute')}</p>
              </div>
              <div
                className={`dark:bg-[#191B1E] dark:border-0 bg-white border border-solid border-[#d3d3d366] rounded-[8px] ${styles.boxTime}`}
              >
                <p className="font-bold text-[18px] dark:text-white text-[#000]">{Number(seconds)}</p>
                <p className="text-color-text-primary text-[8px]">{t('wagerContest:second')}</p>
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
            className="object-cover h-[3rem] w-[3rem] absolute left-0 top-0 rounded-full"
            src="/img/icon/winner.png"
            alt=""
          />
          <div
            className={`dark:bg-color-card-body-primary bg-color-light-bg-primary h-full w-full ${styles.boxCenter} px-3`}
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-[14px] w-full pl-[66px]">
                <Image
                  width={16}
                  height={13}
                  className="object-cover h-[13px] w-[16px]"
                  src="/img/icon/crown.png"
                  alt=""
                />
                <span className="text-[12px] text-color-text-primary leading-[18px]">
                  {t('wagerContest:lastChampion')}
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="relative border-solid border-2 rounded-full border-color-secondary">
                  <Image
                    width={16}
                    height={13}
                    className="absolute -top-[13px] -translate-x-2/4 left-1/2 object-cover h-[13px] w-[16px]"
                    src="/img/icon/crown.png"
                    alt=""
                  />
                  {wagerHistory.playerId !== userId && !wagerHistory.playerName ? (
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
                      className="object-cover rounded-full"
                      src={String(process.env.API_AVATAR) + wagerHistory.playerAvatar}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.src = '/img/avatar-1.png';
                      }}
                    />
                  )}
                </div>
                <div className="">
                  <p
                    className={cn('dark:text-white text-[#000]', {
                      'pointer-events-none': wagerHistory.playerId !== userId && !wagerHistory.playerName,
                      'hover:underline cursor-pointer': !(wagerHistory.playerId !== userId && !wagerHistory.playerName),
                    })}
                    onClick={() => handleModalUserProfile(wagerHistory)}
                  >
                    {wagerHistory.playerId !== userId && !wagerHistory.playerName
                      ? t('homePage:hidden')
                      : wagerHistory.playerId === userId
                      ? userName
                      : wagerHistory.playerName}
                  </p>
                  <div className="text-[12px] leading-[18px] text-color-text-primary mt-3 flex gap-[3px] flex-col md:flex-row">
                    <span>{t('wagerContest:profit')}</span>
                    <div className="flex items-center gap-[3px] ml-2">
                      <Image
                        width={16}
                        height={16}
                        className="object-cover w-[1rem] h-[1rem]"
                        src={`/img/fiats/USDT.png`}
                        onError={(e) => {
                          e.currentTarget.src = '/img/fiats/USDT.png';
                        }}
                        alt=""
                      />
                      <span className="text-color-primary ml-1 font-bold">
                        {viewInFiat
                          ? currencyFormat1(wagerHistory.prizeAmountUsd * exchangeRate, 4, localFiat?.name)
                          : currencyFormat1(wagerHistory.prizeAmountUsd / usdtPrice, 4, '', false)}
                      </span>
                      <span className="dark:text-white text-[#000]">{`${wagerHistory.percentage}%`}</span>
                    </div>
                  </div>
                </div>
              </div>
              <QuestionMarkCircleIcon
                width={24}
                className="text-color-primary cursor-pointer object-cover h-[24px] mt-3 w-[24px] absolute top-0 right-[16px]"
                role="button"
                data-tooltip-id={'fee-tooltip'}
                onClick={() => setIsShowWagerRules(true)}
              />
            </div>
          </div>
        </div>
      </div>
      {userId && (
        <div className="flex md:items-center flex-col md:flex-row md:px-4 p-2 md:h-[3.5rem] dark:bg-color-card-body-primary bg-color-light-bg-primary gap-y-4 text-color-text-primary text-[0.625rem]">
          <div
            className={`flex ${styles.boxBorder} bg-transparent gap-3 w-full md:w-auto grow-[3] border-r items-center dark:border-color-border-primary border-color-light-border-primary`}
          >
            <Image
              width={28}
              height={28}
              className="object-cover h-[1.75rem] w-[1.75rem] rounded-full"
              src={String(process.env.API_AVATAR) + avatar}
              alt=""
              onError={(e) => {
                e.currentTarget.src = '/img/avatar-1.png';
              }}
            />
            <span className="text-[12px] sm:text-[14px] dark:text-[#fff] text-[#000] font-bold">{userName}</span>
          </div>
          <div
            className={`grow-[8] flex max-md:mx-auto max-md:gap-[8.5rem] pb-3 md:p-0 border-b md:border-b-0 border-solid dark:border-color-border-primary border-color-light-border-primary ${styles.boxBorderCenter}`}
          >
            <div className={`grow ${styles.boxBorder}`}>
              <p>{t('wagerContest:myPosition')}</p>
              <p className="text-color-secondary text-[12px] sm:text-[14px] font-bold">
                {getRank(positionData.position)}
              </p>
            </div>
            <div className={`grow ${styles.boxBorder}`}>
              <p>{t('wagerContest:wagered')}</p>
              <p className="text-color-secondary text-[12px] sm:text-[14px] font-bold">
                {viewInFiat
                  ? currencyFormat1(positionData.wageredAmountUsd * exchangeRate, 4, localFiat?.name)
                  : currencyFormat1(positionData.wageredAmountUsd, 4)}
              </p>
            </div>
          </div>
          <div
            className={cn(
              'grow-[2] flex gap-[0.313rem] min-w-fit justify-center md:justify-start items-center text-[12px]',
              {
                'text-color-secondary': wagerAndPostion.position === '1',
              },
            )}
          >
            {wagerAndPostion.position === '1' ? (
              t('wagerContest:youAreTop')
            ) : (
              <>
                <span className="dark:text-color-text-primary text-color-light-text-primary">
                  {t('wagerContest:wager')}
                </span>
                <span className="text-white">
                  {viewInFiat
                    ? currencyFormat1(wagerAndPostion.wagerAmount * exchangeRate, 4, localFiat?.name)
                    : currencyFormat1(wagerAndPostion.wagerAmount, 4)}
                </span>
                <span className="dark:text-color-text-primary text-color-light-text-primary">
                  {t('wagerContest:toReach')}
                </span>
                <span className="bg-color-secondary/20 text-color-secondary text-[10px] rounded-[2px] p-[5px]">
                  {`Top ${wagerAndPostion.position}`}
                </span>
              </>
            )}
          </div>
        </div>
      )}
      <div className="text-[0.813rem] flex items-center justify-between">
        <div className="flex  gap-4 mt-8 mb-4 items-center">
          <p className="dark:text-[#fff] text-[#000]">{t('wagerContest:active')}</p>
          <p className="dark:text-color-text-primary text-color-light-text-primary">
            {formatDate(new Date(wagerContestData.currentTime), 'LL/dd/yyyy')} ~{' '}
            {formatDate(new Date(wagerContestData.endTime), 'LL/dd/yyyy')}
          </p>
        </div>
        <div
          className="flex items-center gap-2 dark:bg-[#25262B] cursor-pointer bg-color-light-bg-primary mt-8 dark:text-white text-black text-[12px] font-bold px-[10px] py-2 rounded-[5px]"
          onClick={() => {
            if (isLogin) {
              dispatch(changeIsShowWagerContestHistory(true));
            } else {
              dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
              dispatch(changeIsShowAuthenticationModal(true));
            }
          }}
        >
          {t('wagerContest:history')}
          <ArrowRight2 size={12} />
        </div>
      </div>
      <div>
        <RankingTableComponent
          containerClassName="w-full"
          isLoading={isLoadingTable}
          data={wagerContestData.contesters}
          columns={WagerContestColumns}
        />
      </div>
      {isShowWagerRules && <ModalWagerRules show={isShowWagerRules} onClose={() => setIsShowWagerRules(false)} />}
    </>
  );
};

export default WagerContestComponent;
