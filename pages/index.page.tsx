import cn from 'classnames';
import { ArrowRight } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import { toast } from 'react-toastify';

import { api_getChatHistory } from '@/api/chat';
import {
  api_getCasinoWithKey,
  api_getFavoriteGames,
  api_getPickGames,
  api_getRecentGames,
  api_getTopRelatedGames,
} from '@/api/game';
import { api_checkDeposit } from '@/api/vip';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowCryptoOnlineModal,
  changeIsShowDepositModal,
  changeIsShowVipClubModal,
} from '@/base/redux/reducers/modal.reducer';
import { AuthenticationModeEnum, GameListType } from '@/base/types/common';
import CardPlay from '@/components/cards/cardPlay';
import CasinoSS from '@/components/casino/casinoSS';
import Loader from '@/components/common/preloader/loader';
import GameCard from '@/components/gameCard/gameCard';
import withAuth from '@/components/hoc/withAuth';
import HomepageSession from '@/components/homepage/homepageSession/homepageSession';
import LatestBetRace from '@/components/homepage/latestBetRace';
import RecentBigWinComponent from '@/components/homepage/recentBigWin';
import RecommendedGamesComponent from '@/components/homepage/recommendedGames';
import TopRateGameComponent from '@/components/homepage/topRateGame';
import BaseLayout from '@/components/layouts/base.layout';
import LoginWalletDashboard from '@/components/loginWalletDashboard/loginWalletDashboard';
import { NoDataComponent } from '@/components/noData/noData';
import GameBannerSlider from '@/components/sliders/gameSliders';
import TabGames from '@/components/tabGames/tabGames';
import VipProgressComponent from '@/components/vipProgress/vipProgress';

import { useTranslation } from '../config/i18next';
import { ROUTER, TOAST_ENUM } from '../constants/common';
import { useExchange } from '../hooks/useExchange';
import { CookiesStorage } from '../libs/storage/cookie';
import { currencyFormat1 } from '../libs/utils';
import { convert2Url } from '../libs/utils/convert';
import { setIsNewMessage } from '../redux/reducers/common.reducer';
import { AppState } from '../redux/store';

function IndexPage() {
  const exchangeRate = useExchange();
  const { t, i18n } = useTranslation('');
  const { theme } = useTheme();
  const { query } = useRouter();
  const { key } = query;

  const { isLogin, userName, localFiat, user } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
      userName: state.auth.user.userName,
      localFiat: state.wallet.localFiat,
      user: state.auth.user,
    }),
    shallowEqual,
  );

  const cardPlayData = useMemo(
    () => [
      {
        imgBackGround: '/img/page/casino.png',
        title: t('homePage:introduceCardTitle1'),
        description: t('homePage:introduceCardDes1'),
        textButton: t('homePage:introduceCardButton1'),
        action: 'casino',
        href: ROUTER.Casino,
      },
      {
        imgBackGround: '/img/page/slots.png',
        title: t('homePage:introduceCardTitle3'),
        description: t('homePage:introduceCardDes3'),
        textButton: t('homePage:introduceCardButton3'),
        action: 'slots',
        href: ROUTER.Slots,
      },
      {
        imgBackGround: '/img/page/racing.png',
        title: t('homePage:introduceCardTitle4'),
        description: t('homePage:introduceCardDes4'),
        textButton: t('homePage:introduceCardButton4'),
        action: 'racing',
        href: ROUTER.Tagname('Racing'),
      },
      {
        imgBackGround: '/img/page/bitup.png',
        title: t('homePage:introduceCardTitle2'),
        description: t('homePage:introduceCardDes2'),
        textButton: t('homePage:introduceCardButton2'),
        isClick: true,
        action: 'bitup',
        href: 'https://bitup.game/trade',
      },
    ],
    [i18n.language],
  );

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [checkDeposit, setCheckDeposit] = useState(false);
  const [listRecommendedGame, setListRecommendedGame] = useState<GameListType[]>([]);
  const [listTopRated, setListTopRated] = useState<GameListType[]>([]);
  const [listPicksForGame, setListPicksForGame] = useState<GameListType[]>([]);

  const [selectedCasino, setSelectedCasino] = useState<string>('recent');
  const [listRecentGames, setListRecentGame] = useState<GameListType[]>([]);
  const [listFavoriteGames, setListFavoriteGames] = useState<GameListType[]>([]);

  const [listCasinoTabGame, setListCasinoTabGame] = useState<GameListType[]>([]);
  const [feedbackText, setFeedbackText] = useState<string>('');

  const handleClickDeposit = () => {
    if (isLogin) {
      dispatch(changeIsShowDepositModal(true));
    } else {
      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
      dispatch(changeIsShowAuthenticationModal(true));
    }
  };

  const checkNewUser = (created: Date | string = new Date()) => {
    const createdDate = new Date(created);
    const today = new Date();

    const timeDifference = today.getTime() - createdDate.getTime();

    return timeDifference < 1000 * 24 * 3600 * 7;
  };

  const initDataLoad = async () => {
    try {
      setIsLoading(true);
      const [_resTopRatedGames, _resRecommendedGames, _resChat] = await Promise.all([
        api_getTopRelatedGames(),
        api_getPickGames(1, 20),
        api_getChatHistory(0, 1),
      ]);
      const tempListTopRatedGames: GameListType[] = _resTopRatedGames.data.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: '',
        identifier: item?.identifier ?? '',
        payout: Number(item.payout || 0),
        multiplier: Number(item.profitMultiplier || 0),
        providerName: item?.producerName ?? '',
        releasedAt: new Date(),
      }));

      const tempListRecommandedGames: GameListType[] = _resRecommendedGames.data.games.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item.payout || 0),
        multiplier: Number(item.profitMultiplier || 0),
        providerName: item?.producerName ?? '',
        releasedAt: item?.releasedAt ?? new Date(),
      }));

      if (_resChat.data?.length > 0) {
        const tempLastMessageId = _resChat.data?.length > 0 ? _resChat.data[0].id : '';
        const localLastMessageId = CookiesStorage.getCookieData('last_message');
        dispatch(setIsNewMessage(tempLastMessageId !== localLastMessageId));
      }

      setListTopRated(tempListTopRatedGames);
      setListRecommendedGame(tempListRecommandedGames);
    } catch (error) {
      setListTopRated([]);
      setListRecommendedGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getGameList = async () => {
    const query = { sort: 'popular' };
    let tempGameListData: GameListType[] = [];
    let params: any = {
      pageSize: 20,
      page: 1,
    };
    try {
      setIsLoading(true);
      params = {
        ...params,
        ...query,
        providers: JSON.stringify([]),
      };
      const res = await api_getCasinoWithKey(convert2Url(String(key)), params);

      const games = res?.data?.games ?? [];
      tempGameListData = games?.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item?.payout ?? 0),
        multiplier: Number(item?.profitMultiplier ?? 0),
        providerName: item?.producerName ?? '',
        releasedAt: item?.releasedAt ?? '',
      }));
      setListCasinoTabGame(tempGameListData);
    } catch (error) {
      setListCasinoTabGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDataAfterLoginMobile = async () => {
    try {
      setIsLoading(true);
      const [_resPicksforYou, _resRecentGames, _resFavoriteGames, _resCheckDeposit] = await Promise.all([
        api_getPickGames(1, 40),
        api_getRecentGames(1, 3),
        api_getFavoriteGames(1, 3),
        api_checkDeposit(),
      ]);
      const tempPicksForYou: GameListType[] = _resPicksforYou?.data?.games?.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item?.payout ?? 0),
        multiplier: Number(item?.profitMultiplier ?? 0),
        providerName: item?.producerName ?? '',
        releasedAt: item?.releasedAt ?? '',
      }));
      const tempRecentGames: GameListType[] = _resRecentGames?.data?.games?.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item?.payout ?? 0),
        multiplier: Number(item?.profitMultiplier ?? 0),
        providerName: item?.producerName ?? '',
        releasedAt: item?.releasedAt ?? '',
      }));
      const tempfavoriteGames: GameListType[] = _resFavoriteGames.data.games.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item?.payout ?? 0),
        multiplier: Number(item?.profitMultiplier ?? 0),
        providerName: item?.producerName ?? '',
        releasedAt: item?.releasedAt ?? '',
      }));
      const tempCheckDeposit = _resCheckDeposit.data;
      if (tempCheckDeposit > 0) {
        setCheckDeposit(true);
      } else {
        setCheckDeposit(false);
      }
      setListPicksForGame(tempPicksForYou);
      setListRecentGame(tempRecentGames);
      setListFavoriteGames(tempfavoriteGames);
    } catch (error) {
      setListPicksForGame([]);
      setListRecentGame([]);
      setListFavoriteGames([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDataAfterLogin = async () => {
    try {
      setIsLoading(true);
      const result = await api_checkDeposit();
      if (result.data > 0) {
        setCheckDeposit(true);
      } else {
        setCheckDeposit(false);
      }
    } catch (error) {
      setCheckDeposit(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initDataLoad();
  }, []);

  useEffect(() => {
    getGameList();
  }, [key]);

  useEffect(() => {
    if (isLogin && isMobile) {
      loadDataAfterLoginMobile();
    }
    if (isLogin && !isMobile) {
      loadDataAfterLogin();
    }
  }, [isMobile, isLogin, user]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full">
        <div className="w-full flex items-start xl:flex-row flex-col pb-[25px]">
          <div className="flex-1 w-full">
            <div className="relative h-auto w-full mt-[15px] sm:mt-[20px] sm:mt-0 sm:min-h-[384px] min-h-[170px] block sm:hidden lg:block">
              <div className="rounded-large overflow-hidden absolute right-0 h-full w-full">
                <Slider
                  slidesToShow={1}
                  className={cn('h-full slide-header sm:mx-[auto] mx-[-12px]')}
                  arrows={false}
                  autoplay={false}
                  autoplaySpeed={3000}
                >
                  <Image
                    width={0}
                    height={0}
                    className="absolute right-[0px] bg-cover sm:bg-right bg-center overflow-hidden sm:min-h-[384px] min-h-[170px] object-cover"
                    src={theme === 'dark' ? '/img/homepage-bg-13.png' : '/img/homepage-bg-11.png'}
                    alt=""
                  />
                </Slider>
              </div>
              <div className="relative z-[2] w-full sm:min-h-[384px] min-h-[170px] pl-[5px] sm:pl-[15px] flex flex-col justify-center">
                {/* <div className="h-[134px] w-[646px] relative">
                  <Image
                    src="/img/page/grand_jackpot.png"
                    width={20}
                    height={20}
                    className="absolute top-0 left-0 w-[646px] h-[120px]"
                    alt=""
                  />
                  <div className="absolute top-12 left-12 right-6 bottom-10 flex">
                    <div className="text-m_default w-1/3 pl-2">
                      <div className="text-[#0DFDE4] font-extrabold">{t('homePage:jackpotGrand')}</div>
                      <div className={styles.goldText}>$ {`500, 000.00`}</div>
                    </div>
                    <div className="text-m_default w-1/3 pl-2">
                      <div className="text-[#0DFDE4] font-extrabold">{t('homePage:jackpotMajor')}</div>
                      <div className={styles.goldText}>$ {`100, 000.00`}</div>
                    </div>
                    <div className="text-m_default w-1/3 pl-2">
                      <div className="text-[#0DFDE4] font-extrabold">{t('homePage:jackpotMinor')}</div>
                      <div className={styles.goldText}>$ {`50, 000.00`}</div>
                    </div>
                  </div>
                </div> */}
                {!isLogin && (
                  <div className="text-start font-semibold">
                    <div>
                      <span className="dark:text-white text-black sm:text-[20px] text-[14px] font-bold">
                        {String(t('homePage:signUpUpper'))} &{' '}
                      </span>
                      <span className="text-color-primary font-bold sm:text-[20px] text-[14px]">
                        {String(t('homePage:getReward'))}
                      </span>
                    </div>
                    <div className={'lg:text-[56px] sm:text-[45px] text-[24px] font-semibold mt-0 tracking-tighter'}>
                      <span className="dark:text-white text-black font-bold">{String(t('homePage:upTo'))} </span>
                      <span className={`bg-gradient-text bg-clip-text text-transparent font-bold`}>
                        {currencyFormat1(20000 * exchangeRate, 2, String(localFiat?.name ?? 'USD'))}
                      </span>
                    </div>
                  </div>
                )}
                {isLogin && (
                  <div className="text-start">
                    {!checkNewUser(user.createdAt) || checkDeposit ? (
                      <div className="dark:text-white text-black text-[14px] sm:text-[24px] font-semibold">
                        {String(t('homePage:welcomeBack'))}
                        {String(', ')} {userName}
                      </div>
                    ) : (
                      <div className="text-start">
                        {`${String(t('homePage:hello'))} ${userName}! ${String(t('homePage:welcomeAboard'))}`}
                      </div>
                    )}

                    {!checkDeposit && (
                      <div>
                        <div className="sm:text-[24px] text-[16px] dark:text-white font-bold text-black mt-[6px]">
                          {String(t('homePage:firstDepositBonus'))}
                        </div>
                        <div
                          className={`bg-gradient-text bg-clip-text text-transparent sm:text-[48px] text-[24px] font-bold`}
                        >
                          +180% <span className="font-bold">{String(t('homePage:reward'))}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-start gap-[15px] mt-2">
                  {!isLogin && (
                    <div className="flex items-center gap-[10px]">
                      <button
                        type="button"
                        className="truncate text-white rounded-large bg-gradient-btn-play flex items-center justify-center gap-[7px] px-5 py-[9px] sm:px-[23px] sm:py-[14px] lg:text-[16px] text-[12px]"
                        onClick={() => {
                          dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
                          dispatch(changeIsShowAuthenticationModal(true));
                        }}
                      >
                        {t('homePage:signUpNow')}
                      </button>
                      <div className="sm:text-[16px] text-[12px] dark:text-white text-black">{t('homePage:or')}</div>
                    </div>
                  )}
                  {isLogin && (
                    <div>
                      {!checkDeposit && (
                        <div className="flex gap-[10px]">
                          <button
                            className="truncate text-white rounded-large bg-gradient-btn-play flex items-center justify-center gap-[7px] py-[9px] px-5 sm:px-[23px] sm:py-[14px] lg:text-[16px] text-[12px]"
                            onClick={() => dispatch(changeIsShowDepositModal(true))}
                          >
                            {String(t('homePage:depositAndPlay'))}
                          </button>
                        </div>
                      )}
                      {checkDeposit && <VipProgressComponent />}
                    </div>
                  )}
                  {!isLogin && <LoginWalletDashboard onClose={() => {}} />}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-[30px] sm:gap-[50px] mt-[12px] sm:-mt-[0px]">
              <GameBannerSlider className="w-full" />
              <div className="-mt-[20px] md:grid md:grid-cols-2 min-[900px]:grid-cols-4 grid-cols-1 gap-[20px] w-full hidden">
                {cardPlayData.map((item, index) => (
                  <CardPlay
                    key={index}
                    imgBackGround={item.imgBackGround}
                    title={item.title}
                    description={item.description}
                    textButton={item.textButton}
                    href={item.href}
                    isClick={item.isClick}
                    action={item.action}
                  />
                ))}
              </div>
              <RecentBigWinComponent />
              {!isLogin && (
                <>
                  <div className="relative w-full sm:hidden block">
                    <div className="flex justify-between items-center gap-[10px]">
                      <div className="font-[600] dark:text-white text-[#000] sm:text-[18px] text-[16px]">
                        {String(t('layout:casino'))}
                      </div>
                      <div className="flex items-center justify-center">
                        <Link
                          href={ROUTER.Casino}
                          role="button"
                          className="rounded-[5px] font-bold text-m_default text-color-primary px-[10px] py-[8px] hover:bg-[#6b7180] hover:text-white"
                        >
                          {t('gameDetail:viewAll')}
                        </Link>
                      </div>
                    </div>
                    <TabGames ishome={true} />
                    <CasinoSS
                      data={listCasinoTabGame}
                      renderItem={(item) => <GameCard gameDetail={item} />}
                      isShowArrow={false}
                    />
                  </div>
                </>
              )}
              {isLogin && (
                <>
                  <div className="relative w-full sm:hidden block">
                    <div className="flex justify-between items-center gap-[10px]">
                      {/* <CasinoBoldIcon className="w-[18px] h-[18px]" /> */}
                      <div className="font-[600] dark:text-white text-[#000] text-m_title">
                        {String(t('layout:casino'))}
                      </div>
                      <div className="flex items-center justify-center">
                        <Link
                          href={selectedCasino === 'recent' ? ROUTER.Recent : ROUTER.Favorite}
                          role="button"
                          className="rounded-[5px] font-bold text-m_default text-color-primary px-[10px] py-[8px] hover:bg-[#6b7180] hover:text-white"
                        >
                          {t('gameDetail:viewAll')}
                        </Link>
                      </div>
                    </div>
                    <div className="flex gap-[10px] dark:text-color-text-primary text-color-light-text-primary text-default mt-[10px]">
                      <span
                        className={cn({ 'dark:text-white text-black': selectedCasino === 'recent' })}
                        onClick={() => setSelectedCasino('recent')}
                      >
                        {String(t('casino:recent'))}
                      </span>
                      <span
                        className={cn({ 'dark:text-white text-black': selectedCasino === 'favorite' })}
                        onClick={() => setSelectedCasino('favorite')}
                      >
                        {String(t('casino:favorite'))}
                      </span>
                    </div>

                    {selectedCasino === 'recent' && (
                      <>
                        {!!listRecentGames.length ? (
                          <div className="game-grid-parent mt-[20px]">
                            {listRecentGames.map((game, index) => (
                              <div key={index} className="min-w-[100px] sm:min-w-[237px]">
                                <GameCard gameDetail={game} />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-[10px] w-full">
                            <NoDataComponent />
                          </div>
                        )}
                      </>
                    )}
                    {selectedCasino === 'favorite' && (
                      <>
                        {!!listFavoriteGames.length ? (
                          <div className="game-grid-parent mt-[20px]">
                            {listFavoriteGames.map((game, index) => (
                              <div key={index} className="min-w-[100px] sm:min-w-[237px]">
                                <GameCard gameDetail={game} />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-[10px] w-full">
                            <NoDataComponent />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
              <TopRateGameComponent listRecommendedGame={listTopRated} />
              <div className="relative w-full">
                <Image
                  src="/img/octopus.png"
                  width={20}
                  height={20}
                  className="inset w-full object-cover hidden lg:block rounded-large"
                  alt=""
                />
                <Image
                  src="/img/mobile-octopus.png"
                  width={20}
                  height={20}
                  className="inset w-full object-cover block lg:hidden rounded-large"
                  alt=""
                />
                <div className="absolute left-[8%] right-0 top-[10%] bottom-[10%] flex flex-col justify-between">
                  <div className="text-sm min-[390px]:text-lg min-[520px]:text-2xl sm:text-3xl min-[900px]:text-4xl lg:text-3xl min-[1400px]:text-4xl min-[1750px]:text-5xl w-[55%] text-left dark:text-white text-color-light-text-primary">
                    <span className="font-bold text-[#FF9E4F]">{t('homePage:fastEasyWay')}</span>
                    <span className="font-bold">
                      {` `}
                      {t('homePage:getStarted')}
                      {` `}300%{` `}
                    </span>
                    <span className="font-bold text-color-primary">{t('bonus:depositBonus')}</span>
                  </div>
                  <div
                    className={cn(
                      'text-[12px] min-[390px]:text-[16px] xl:text-title 2xl:text-m_title',
                      'font-bold bg-gradient-btn-play rounded-large text-center text-white h-[30%] w-[45%] lg:w-[35%] lg:max-w-[150px] 2xl:max-w-[200px]',
                      'hover:opacity-[0.9] cursor-pointer flex justify-center items-center',
                    )}
                    onClick={() => {
                      handleClickDeposit();
                    }}
                  >
                    <span className="font-bold">{t('layout:deposit')}</span>
                  </div>
                </div>
              </div>

              <div className="relative w-full sm:block hidden">
                <HomepageSession showIcon={false} isHome={true}>
                  <LatestBetRace />
                </HomepageSession>
              </div>
              <div className="relative w-full hidden sm:block">
                <div
                  onClick={() => {
                    if (isLogin) dispatch(changeIsShowVipClubModal(true));
                  }}
                  className="cursor-pointer"
                >
                  <Image
                    src="/img/whale.png"
                    width={20}
                    height={20}
                    className="hidden md:block w-full object-cover rounded-large"
                    alt=""
                  />
                  <Image
                    src="/img/mobile-whale.png"
                    width={20}
                    height={20}
                    className="block md:hidden w-full object-cover rounded-large"
                    alt=""
                  />
                </div>
              </div>
              <RecommendedGamesComponent listRecommendedGame={listRecommendedGame} />
              {isLogin && (
                <div className="relative w-full sm:hidden block">
                  <div className="flex items-center gap-[10px]">
                    <div className="font-[600] dark:text-white text-[#000] text-m_title">
                      {String(t('casino:pickForYou'))}
                    </div>
                  </div>
                  <div className="game-grid-parent mt-[20px]">
                    {listPicksForGame.map((game, index) => {
                      return (
                        <div key={index} className="max-w-[237px]">
                          <GameCard gameDetail={game} />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-center">
                    <Link
                      href={ROUTER.PicksForYou}
                      role="button"
                      className="mt-5 dark:bg-[#2D3035] bg-white rounded-[5px] font-bold text-default dark:text-white text-[#000] px-[10px] py-[8px] hover:bg-[#6b7180] hover:text-white"
                    >
                      {t('gameDetail:viewAll')}
                    </Link>
                  </div>
                </div>
              )}

              <div className="">
                <div className="sm:py-[35px] py-[20px] lg:flex gap-[60px] rounded-[15px]">
                  <div className="lg:w-[50%]">
                    <div className="text-black dark:text-white text-default font-semibold ">
                      {String(t('homePage:cryptoOnlineCasino'))}
                    </div>
                    <div
                      className="text-color-text-secondary text-default mt-5 text-justify"
                      dangerouslySetInnerHTML={{ __html: String(t('homePage:casinosOnlineHaveNot')) }}
                    ></div>
                    <div
                      className="text-color-text-secondary text-default mt-5 text-justify"
                      dangerouslySetInnerHTML={{ __html: String(t('homePage:playersAreAlways')) }}
                    ></div>
                    <div
                      className="mt-5 cursor-pointer flex items-center gap-[10px] text-color-primary"
                      onClick={() => {
                        dispatch(changeIsShowCryptoOnlineModal(true));
                      }}
                    >
                      <div className="text-default">{String(t('homePage:showMore'))}</div>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                  <div className="mt-[42px] lg:mt-0 lg:w-[50%] text-default">
                    <div className="text-black dark:text-white text-center lg:text-left text-default font-semibold mb-5">
                      {String(t('homePage:helpUsImproveYourExperience'))}
                    </div>
                    <textarea
                      className="rounded-[3px] dark:text-white bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-[#161D26] h-[100px] max-[414px]:placeholder:text-[10px] focus:outline-none w-full text-color-text-secondary text-default p-[20px] resize-none placeholder:text-[13px] dark:placeholder:text-[#53575C] placeholder:text-color-light-text-primary"
                      placeholder={String(t('homePage:foundBug'))}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                    />
                    <div className="flex flex-col-reverse w-full lg:w-unset lg:flex-row items-center mt-5 gap-5">
                      <div
                        className="hover:opacity-[0.9] bg-gradient-btn-play py-[10px] flex items-center justify-center text-white font-bold text-default w-full lg:w-[162px] rounded-[5px] cursor-pointer"
                        onClick={() => {
                          if (feedbackText === '') {
                            toast.error('Message content cannot be empty!', {
                              containerId: TOAST_ENUM.COMMON,
                              icon: true,
                              autoClose: 3000,
                            });
                            return;
                          }
                          toast.success(String(t('success:success')), { containerId: TOAST_ENUM.COMMON });
                        }}
                      >
                        {String(t('homePage:leaveAMessage'))}
                      </div>
                      <div className="text-color-text-secondary text-default">{String(t('footer:nowGetReward'))}</div>
                    </div>
                    <div className="mt-5 text-center lg:text-left">
                      <span className="text-default text-color-text-secondary mr-[10px]">
                        {String(t('homePage:orEmail'))}
                      </span>
                      <a href="mailto:feedback@bonenza.com" className="text-default text-color-primary cursor-pointer">
                        feedback@bonenza.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const IndexPageAuth = withAuth(IndexPage);

IndexPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default IndexPageAuth;
