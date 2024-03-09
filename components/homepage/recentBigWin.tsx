import cn from 'classnames';
import { ArrowRight2, Ghost } from 'iconsax-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { api_getRecentBigWins } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { useWidth } from '@/base/hooks/useWidth';
import { currencyFormat1 } from '@/base/libs/utils';
import { changeIsShowInformation } from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState } from '@/base/redux/store';
import { BetDetailType, BetTableDataType } from '@/base/types/common';

import CasinoSwiper from '../casino/casinoSwiper';
import LiveStream from '../icons/LiveStream';
import ModalDetailBets from '../modal/detailBets/detailBets';

type CardBigWinProps = {
  price?: string | number;
  imgCard: string;
  userData?: { userId: string; username: string };
};

const convertImage = (w: number, h: number) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#333" offset="20%" />
        <stop stop-color="#222" offset="50%" />
        <stop stop-color="#333" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#333" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

export function CardBigWin({ price, imgCard, userData }: CardBigWinProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation('');
  const { userId, userName } = useSelector(
    (state: AppState) => ({
      userId: state.auth.user.userId,
      userName: state.auth.user.userName,
    }),
    shallowEqual,
  );

  const openModalProfileUser = () => {
    dispatch(setUserData(userData));
    if (userData?.username) {
      dispatch(changeIsShowInformation(true));
    }
  };

  return (
    <>
      <div className="sm:max-w-[96px] h-full max-w-full cursor-pointer flex sm:flex-col flex-row sm:gap-[5px] items-center justify-between bg-[#31373D77] pb-0 sm:pb-2 sm:rounded-large overflow-hidden px-1 sm:px-0">
        <div className="sm:w-full w-auto flex sm:flex-col items-center gap-[6px]">
          <Image
            height={96}
            width={96}
            src={imgCard}
            alt=""
            className="sm:w-full w-[36px] h-[auto] object-contain rounded-default"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(convertImage(96, 96))}`}
          />
          <div
            onClick={openModalProfileUser}
            className={cn('font-light text-[13px] sm:text-[13px] hover:underline min-h-[18px] text-center', {
              'dark:text-color-text-primary text-color-light-text-primary pointer-events-none cursor-text':
                userData?.userId !== userId && !userData?.username,
              'dark:text-white text-black': !(userData?.userId !== userId && !userData?.username),
            })}
          >
            {userData?.userId !== userId && !userData?.username ? (
              <span className="flex items-center">
                <Ghost width={12} height={12} variant="Bulk" className="w-4 h-4 mr-1" />
                {String(t('homePage:hidden'))}
              </span>
            ) : userData.userId === userId ? (
              <div className="w-[96px] truncate px-1 text-left sm:text-center">{userName}</div>
            ) : (
              <div className="w-[96px] truncate px-1 text-left sm:text-center">{userData?.username}</div>
            )}
          </div>
        </div>
        <div
          data-tooltip-id={'CardBigWinData' + price}
          className="cursor-pointer sm:w-full flex justify-center text-center sm:rounded-[5px]"
        >
          <div className="text-color-primary font-semibold text-[12px] sm:text-[10px] truncate">{price}</div>
        </div>
      </div>
      <Tooltip id={'CardBigWinData' + price} place="bottom" content={String(price)} />
    </>
  );
}

function RecentBigWinComponent() {
  const width = useWidth();
  const exchangeRate = useExchange();
  const { t } = useTranslation('');

  const [listBigWinGame, setListBigWinGame] = useState<BetDetailType[]>([]);
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

  const { userId, localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      userId: state.auth.user.userId,
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  useEffect(() => {
    handleGetListBigWin();
  }, [userId]);

  const getExchangeRateLocalFiat = (amount: number, currency: string) => {
    return viewInFiat
      ? `${currencyFormat1(amount * exchangeRate, 4, localFiat?.name || 'USD')}`
      : `${currencyFormat1(amount, 4, '', false)} ${currency}`;
  };

  const handleGetListBigWin = async () => {
    try {
      const res = await api_getRecentBigWins();
      const tempBetLists: BetDetailType[] = res.data.map((item: any) => ({
        id: item?.id ?? '',
        game: item?.title ?? '',
        identifier: item?.identifier ?? '',
        amount: Number(item.betAmount || 0),
        amountUsd: Number(item.betAmountUsd || 0),
        currency: item?.currency ?? 'USD',
        currencyType: 'crypto',
        multiplier: Number(item?.multiplier || 0),
        profit: Number(item?.profitAmount || 0),
        profitUsd: Number(item?.profitAmountUsd || 0),

        userId: item?.userId ?? '',
        userName: item?.userName ?? '',
      }));
      setListBigWinGame(tempBetLists);
    } catch (error) {
      setListBigWinGame([]);
    } finally {
    }
  };

  const renderData = useCallback(
    (item: BetDetailType) => {
      const userData = {
        userId: item.userId,
        username: item.userName,
      };
      return (
        <CardBigWin
          userData={userData}
          price={`${getExchangeRateLocalFiat(viewInFiat ? item.profitUsd : item.profit, item.currency)}`}
          imgCard={`https://cdn.softswiss.net/i/s4/${item.identifier.replace(':', '/')}.png`}
        />
      );
    },
    [localFiat, viewInFiat],
  );

  return (
    <>
      <CasinoSwiper
        title={String(t('homePage:recentBigWins'))}
        data={listBigWinGame}
        icon={width < 600 ? <LiveStream className="text-color-primary " /> : undefined}
        renderItem={(item) => renderData(item)}
        onClickItem={(game) => {
          setIsPublicProfile(!!game?.userName);
          setSelBetDetail({
            game: game.game,
            gameIdenfiter: game.identifier,
            player: game.userName,
            playerId: game.userId,
            playerAvatar: '',
            betAmount: game.amount,
            betAmountUsd: game.amountUsd,
            multiplier: game.multiplier,
            profitAmount: game.profit,
            profitAmountUsd: game.profitUsd,
            currency: game.currency,
            betId: game.id,
            time: new Date(),
          });
          setIsShowDetailBet(true);
        }}
      />
      {isShowDetailBet && (
        <ModalDetailBets
          show={isShowDetailBet}
          betDetail={selBetDetail}
          titleModal="Bet Slip"
          onClose={() => {
            setIsShowDetailBet(false);
          }}
          isPublicProfile={isPublicProfile}
          betId={betIdDetail}
        />
      )}
    </>
  );
}

export default RecentBigWinComponent;
