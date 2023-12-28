import Image from 'next/image';
import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { KYC_ENUM } from '@/base/constants/common';
import { currencyFormat, exchangeByLocaleFiat, handleLocaleSymbol } from '@/base/libs/utils';
import { changeIsShowInformation } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { GameDetail, UserDetail } from '@/base/types/common';

import CasinoSwiper from '../casino/casinoSwiper';
import ModalDetailBets from '../modal/detailBets/detailBets';

type CardBigWinProps = {
  price?: string | number;
  imgCard: string;
  userData?: UserDetail;
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
  const { userId } = useSelector(
    (state: AppState) => ({
      userId: state.auth.user.userId,
    }),
    shallowEqual,
  );

  const openModalProfileUser = () => {
    localStorage.setItem('userData', JSON.stringify(userData));
    dispatch(changeIsShowInformation(true));
  };

  return (
    <>
      <div className="dark:bg-[#12181F] bg-white max-w-[150px] rounded-[5px] cursor-pointer">
        <div className="rounded-[5px] w-full">
          <Image
            height={150}
            width={150}
            src={imgCard}
            alt=""
            className="w-full h-auto object-contain rounded-[5px]"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(convertImage(150, 150))}`}
          />
        </div>
        <div className="p-[10px]">
          <div className="flex justify-between">
            <div
              onClick={openModalProfileUser}
              className={`${
                userData?.userId !== userId && userData?.privacySetting.settingHideUserName
                  ? 'dark:text-[#98A7B5] text-[#31373d] pointer-events-none cursor-text'
                  : 'dark:text-white text-[#000]'
              } font-medium text-[12px] truncate hover:underline min-h-[18px]`}
            >
              {userData?.userId !== userId && userData?.privacySetting.settingHideUserName
                ? String(t('homePage:hidden'))
                : userData?.userName}
            </div>
          </div>
          <div
            data-tooltip-id={'CardBigWinData' + price}
            className="flex justify-center items-center dark:bg-[#0DFDE4]/20 bg-[#3bc11780] cursor-text h-[28px] mt-[10px] px-[5px]"
          >
            <div className="dark:text-[#0DFDE4] text-[#3bc117] font-bold text-[14px] truncate">{price}</div>
          </div>
        </div>
      </div>
      <Tooltip id={'CardBigWinData' + price} place="bottom" content={String(price)} />
    </>
  );
}

function RecentBigWinComponent() {
  const { t } = useTranslation('');

  const [listBigWinGame, setListBigWinGame] = useState<GameDetail[]>([]);
  const [isShowDetailBet, setIsShowDetailBet] = useState<boolean>(false);
  const [betIdDetail, setBetIdDetail] = useState<number>();
  const [isPublicProfile, setIsPublicProfile] = useState<boolean>(false);

  const { localeFiat, userId } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
      userId: state.auth.user.userId,
    }),
    shallowEqual,
  );

  const getExchangeRateLocalFiat = (valueRate: number) => {
    return localeFiat
      ? `${handleLocaleSymbol(String(localeFiat?.currency))} ${currencyFormat(
          exchangeByLocaleFiat('USD', String(localeFiat?.currency), valueRate),
          2,
        )}`
      : `${handleLocaleSymbol('USD')} ${currencyFormat(Number(valueRate || 0), 2)}`;
  };

  useEffect(() => {
    handleGetListBigWin();
  }, [userId]);

  const handleGetListBigWin = async () => {
    try {
      const res = await api.get('game/get-recent-big-win-list', { params: { limit: 20 } });
      setListBigWinGame([...res.data.data, ...res.data.data]);
    } catch (error) {
      setListBigWinGame([]);
    } finally {
    }
  };

  const renderData = (item: GameDetail) => {
    const userData: UserDetail = {
      userName: item?.username || '',
      userId: String(item?.userId) || '',
      email: '',
      phone: '',
      avatar: '',
      betCount: '',
      winCount: '',
      totalWager: 0,
      referralCode: '',
      wallet: '',
      isKyc: KYC_ENUM.REQUIRED,
      tfa: false,
      privacySetting: {
        settingHideGamingData: false,
        settingRefuseTipFromStrangers: false,
        settingHideUserName: false,
      },
      generalSetting: {
        settingCurrency: 'usd',
        settingLanguage: 'en',
        settingReceiveMarketPromotion: false,
        settingShowFullNameCrypto: false,
      },
      verifiedSetting: {
        emailVerified: false,
        phoneVerified: false,
      },
    };
    return (
      <CardBigWin
        userData={userData}
        price={`${getExchangeRateLocalFiat(Number(item?.profit))}`}
        imgCard={`https://cdn.softswiss.net/i/s4/${item?.provider}/${item?.identifier2}.png`}
      />
    );
  };

  return (
    <>
      <CasinoSwiper
        title={String(t('homePage:recentBigWins'))}
        data={listBigWinGame}
        icon={<Image height={24} width={24} src={'/img/icon/live-stream.png'} alt="" />}
        renderItem={(item) => renderData(item)}
        onClickItem={(game) => {
          setIsPublicProfile(!!game?.isHideNamePublicList);
          setBetIdDetail(Number(game?.betId));
          setIsShowDetailBet(true);
        }}
      />
      {isShowDetailBet && (
        <ModalDetailBets
          show={isShowDetailBet}
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
