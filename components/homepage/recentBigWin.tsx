import { ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import { api_getRecentBigWins } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1 } from '@/base/libs/utils';
import { changeIsShowInformation } from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState } from '@/base/redux/store';
import { BetDetailType, BetTableDataType } from '@/base/types/common';

import CasinoSwiper from '../casino/casinoSwiper';
import LiveStream from '../icons/LiveStream';
import ModalDetailBets from '../modal/detailBets/detailBets';
import { useWidth } from '@/base/hooks/useWidth';

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
      <div className="sm:dark:bg-color-card-bg-primary sm:bg-white max-w-full sm:max-w-[150px] rounded-[5px] cursor-pointer sm:block flex justify-between">
        <div className="rounded-[5px] sm:w-full w-[35px] sm:block flex items-center gap-[7px]">
          <Image
            height={150}
            width={150}
            src={imgCard}
            alt=""
            className="w-full h-auto object-contain rounded-[5px]"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(convertImage(150, 150))}`}
          />
          <div className="block sm:hidden">
            <div
              className={`text-color-text-primary font-medium sm:text-[12px] text-[14px] truncate hover:underline min-h-[18px]`}
            >
              {userData?.userId !== userId && !userData?.username
                ? String(t('homePage:hidden'))
                : userData.userId === userId
                ? userName
                : userData?.username}
            </div>
          </div>
        </div>
        <div className="sm:p-[10px] p-0 sm:block flex items-center">
          <div className="sm:flex hidden justify-between">
            <div
              onClick={openModalProfileUser}
              className={`${
                userData?.userId !== userId && !userData?.username
                  ? 'dark:text-[#98A7B5] text-[#31373d] pointer-events-none cursor-text'
                  : 'dark:text-white text-[#000]'
              } font-medium text-[12px] truncate hover:underline min-h-[18px]`}
            >
              {userData?.userId !== userId && !userData?.username
                ? String(t('homePage:hidden'))
                : userData.userId === userId
                ? userName
                : userData?.username}
            </div>
          </div>
          <div
            data-tooltip-id={'CardBigWinData' + price}
            className="flex justify-center items-center dark:bg-transparent sm:dark:bg-color-primary/20 bg-[#3bc11780] cursor-text h-[28px] mt-[10px] px-[5px] gap-[15px]"
          >
            <div className="dark:text-color-primary text-[#3bc117] font-bold text-[14px] sm:text-[14px] truncate">
              {price}
            </div>
            <div className="sm:hidden block">
              <ArrowRight2 size={15} />
            </div>
          </div>
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

  const { userId, localFiat } = useSelector(
    (state: AppState) => ({
      userId: state.auth.user.userId,
      localFiat: state.wallet.localFiat,
    }),
    shallowEqual,
  );

  useEffect(() => {
    handleGetListBigWin();
  }, [userId]);

  const getExchangeRateLocalFiat = (amount: number, currency: string) => {
    return localFiat
      ? `${currencyFormat1(amount * exchangeRate, 4, localFiat.name)}`
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

  const renderData = (item: BetDetailType) => {
    const userData = {
      userId: item.userId,
      username: item.userName,
    };
    return (
      <CardBigWin
        userData={userData}
        price={`${getExchangeRateLocalFiat(item.amount, item.currency)}`}
        imgCard={`https://cdn.softswiss.net/i/s4/${item.identifier.replace(':', '/')}.png`}
      />
    );
  };

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
