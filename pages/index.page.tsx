import cn from 'classnames';
import { ArrowRight } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';

import api from '@/api/api';
import {
  api_getCasinoWithKey,
  api_getFavoriteGames,
  api_getPickGames,
  api_getRecentGames,
  api_getTopRelatedGames,
} from '@/api/game';
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
import CasinoBoldIcon from '@/components/icons/CasinoBoldIcon';
import SportBoldIcon from '@/components/icons/SportBoldIcon';
import BaseLayout from '@/components/layouts/base.layout';
import LoginWalletDashboard from '@/components/loginWalletDashboard/loginWalletDashboard';
import { NoDataComponent } from '@/components/noData/noData';
import GameBannerSlider from '@/components/sliders/gameSliders';
import TabGames from '@/components/tabGames/tabGames';
import VipProgressComponent from '@/components/vipProgress/vipProgress';
import styles from '@/styles/dashboard/index.module.scss';

import { useTranslation } from '../config/i18next';
import { ROUTER } from '../constants/common';
import { useExchange } from '../hooks/useExchange';
import { useWidth } from '../hooks/useWidth';
import { currencyFormat1 } from '../libs/utils';
import { convert2Url, convertToUrlCase } from '../libs/utils/convert';
import { AppState } from '../redux/store';

function IndexPage() {
  const width = useWidth();
  const exchangeRate = useExchange();
  const { t } = useTranslation('');
  const { query } = useRouter();
  const { key } = query;

  const { isLogin, userName, localFiat } = useSelector(
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
        href: ROUTER.Casino,
        icon: <CasinoBoldIcon className="text-color-primary w-[27px] h-[27px]" />,
      },
      {
        imgBackGround: '/img/page/sports.png',
        title: t('homePage:introduceCardTitle2'),
        description: t('homePage:introduceCardDes2'),
        textButton: t('homePage:introduceCardButton2'),
        href: ROUTER.Sports,
        icon: <SportBoldIcon className="text-color-primary w-[27px] h-[27px]" />,
      },
      {
        imgBackGround: '/img/page/liveholdem.png',
        title: t('homePage:introduceCardTitle3'),
        description: t('homePage:introduceCardDes3'),
        textButton: t('homePage:introduceCardButton3'),
        href: 'https://cmd23.com/room/games.php',
        icon: (
          <Image
            width={20}
            height={20}
            className="max-w-[60px] sm:max-w-[107px] md:max-w-[none] md:max-h-[none] max-h-[40px] text-color-primary"
            src="/icon/liveholdem-green.png"
            alt="logo"
          />
        ),
        isClick: true,
      },
    ],
    [],
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

  const handleCheckDeposit = async () => {
    try {
      const res = await api.get('deposit/get-all-deposit');
      setCheckDeposit(res.data.deposited);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const router = useRouter();

  const handleClickDeposit = () => {
    if (isLogin) {
      router.push(ROUTER.BuyCrypto);
    } else {
      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
      dispatch(changeIsShowAuthenticationModal(true));
    }
  };

  const initDataLoad = async () => {
    try {
      setIsLoading(true);
      const [topRatedGames, recommendedGames] = await Promise.all([api_getTopRelatedGames(), api_getPickGames(1, 20)]);
      const tempListTopRatedGames: GameListType[] = topRatedGames.data.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.producerName ?? '',
        description: '',
        identifier: item?.identifier ?? '',
        payout: Number(item.payout || 0),
        multiplier: Number(item.profitMultiplier || 0),
        releasedAt: new Date(),
      }));

      const tempListRecommandedGames: GameListType[] = recommendedGames.data.games.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.producerName ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item.payout || 0),
        multiplier: Number(item.profitMultiplier || 0),
        releasedAt: item?.releasedAt ?? new Date(),
      }));
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
        releasedAt: item?.releasedAt ?? '',
      }));
      setListCasinoTabGame(tempGameListData);
    } catch (error) {
      setListCasinoTabGame([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDataAfterLogin = async () => {
    try {
      setIsLoading(true);
      const [picksforYou, recentGames, favoriteGames] = await Promise.all([
        api_getPickGames(1, 40),
        api_getRecentGames(1, 3),
        api_getFavoriteGames(1, 3),
      ]);
      const tempPicksForYou = picksforYou?.data?.games?.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item?.payout ?? 0),
        multiplier: Number(item?.profitMultiplier ?? 0),
        releasedAt: item?.releasedAt ?? '',
      }));
      const tempRecentGames = recentGames?.data?.games?.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item?.payout ?? 0),
        multiplier: Number(item?.profitMultiplier ?? 0),
        releasedAt: item?.releasedAt ?? '',
      }));
      const tempfavoriteGames: GameListType[] = favoriteGames.data.games.map((item: any) => ({
        id: item?.id ?? '',
        title: item?.title ?? '',
        description: item?.description ?? '',
        identifier: item?.identifier ?? '',
        payout: Number(item?.payout ?? 0),
        multiplier: Number(item?.profitMultiplier ?? 0),
        releasedAt: item?.releasedAt ?? '',
      }));
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

  useEffect(() => {
    initDataLoad();
  }, []);

  useEffect(() => {
    getGameList();
  }, [key]);

  useEffect(() => {
    if (isLogin && width < 600) {
      loadDataAfterLogin();
    }
  }, [width, isLogin]);

  return (
    <>
      {isLoading && <Loader />}

      <div className="w-full">
        <div className="w-full flex items-start xl:flex-row flex-col pb-[25px] bg-[#f6f7fa] dark:bg-color-bg-primary">
          <div className="flex-1 w-full">
            <div className="relative h-auto w-full mt-[20px] sm:mt-0">
              <div className="object-contain absolute right-0 h-full w-[40vw] sm:block hidden">
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
                    className="sm:object-cover object-contain absolute right-0 w-full"
                    style={{ width: '100% !important' }}
                    src="/img/homepage-bg-9.png"
                    alt=""
                  />
                </Slider>
              </div>

              <div className="absolute h-full right-0 w-[50vw] bg-gradient-default" />
              <div className="relative z-[2] h-auto sm:pt-[60px] sm:pb-[20px] w-full">
                {!isLogin && (
                  <div className="sm:text-start text-center font-semibold sm:block hidden">
                    <div>
                      <span className="text-white text-[20px]">{String(t('homePage:signUpUpper'))} & </span>
                      <span className="text-color-primary text-[20px]">{String(t('homePage:getReward'))}</span>
                    </div>
                    <div className={'lg:text-[56px] sm:text-[45px] text-[24px] font-semibold mt-0 tracking-tighter'}>
                      <span className="text-white font-bold">{String(t('homePage:upTo'))} </span>
                      <span className={`bg-gradient-text bg-clip-text text-transparent font-bold`}>
                        {currencyFormat1(20000 * exchangeRate, 2, String(localFiat?.name ?? 'USD'))}
                      </span>
                    </div>
                  </div>
                )}
                {isLogin && (
                  <div className="sm:text-start text-center hidden sm:block">
                    <div className="text-white text-[18px] font-semibold">
                      {String(t('homePage:hello'))} {userName}! {String(t('homePage:welcomeAboard'))}
                    </div>
                    {!checkDeposit && (
                      <div>
                        <div className="sm:text-[24px] text-[20px] text-white mt-[6px]">
                          {String(t('homePage:firstDepositBonus'))}
                        </div>
                        <div
                          className={`bg-gradient-text bg-clip-text text-transparent sm:text-[48px] text-[32px] font-bold`}
                        >
                          +180% <span className="font-bold">{String(t('homePage:reward'))}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="sm:flex hidden sm:flex-row flex-col items-center justify-start gap-[15px] sm:mt-[20px] mt-[10px]">
                  {!isLogin && (
                    <div className="flex flex-col sm:flex-row items-center gap-[10px]">
                      <button
                        type="button"
                        className="truncate text-white rounded-[5px] bg-gradient-btn-default flex items-center justify-center gap-[7px] px-[23px] py-[14px] lg:text-[16px] text-[12px]"
                        onClick={() => {
                          dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
                          dispatch(changeIsShowAuthenticationModal(true));
                        }}
                      >
                        {t('homePage:signUpNow')}
                      </button>
                      <div className="text-[16px] text-white">{t('homePage:or')}</div>
                    </div>
                  )}
                  {isLogin && (
                    <div>
                      {!checkDeposit && (
                        <div className="flex gap-[10px]">
                          <button
                            className="truncate text-white rounded-[5px] bg-gradient-btn-default flex items-center justify-center gap-[7px] px-[23px] py-[14px] lg:text-[16px] text-[12px]"
                            onClick={() => dispatch(changeIsShowDepositModal(true))}
                          >
                            {String(t('homePage:depositAndPlay'))}
                          </button>
                          {/* <button
                            type="button"
                            className="truncate text-white rounded-[5px] bg-color-primary flex items-center justify-center gap-[7px] sm:p-[7px] p-[10px] xl:text-[14px] text-[12px] font-bold"
                          >
                            {String(t('homePage:freePlay'))}
                            <div className="sm:p-[10px] p-[7px] items-center justify-center rounded-[5px] bg-white/20">
                              <Image height={14} width={14} src="/img/icon/arrow-right.png" alt="" />
                            </div>
                          </button> */}
                        </div>
                      )}
                      {checkDeposit && <VipProgressComponent />}
                    </div>
                  )}
                  {!isLogin && <LoginWalletDashboard onClose={() => {}} />}
                </div>
                <GameBannerSlider />
              </div>
            </div>

            <div className="flex flex-col items-start gap-[50px] mt-[15px] ">
              <div className="sm:grid md:grid-cols-3 grid-cols-1 gap-[16px] w-full hidden">
                {cardPlayData.map((item, index) => (
                  <CardPlay
                    key={index}
                    imgBackGround={item.imgBackGround}
                    title={item.title}
                    description={item.description}
                    textButton={item.textButton}
                    href={item.href}
                    icon={item.icon}
                    isClick={item.isClick}
                  />
                ))}
              </div>
              {(!isLogin || width > 600) && <RecentBigWinComponent />}
              {!isLogin && (
                <>
                  <div className="relative w-full sm:hidden block">
                    <div className="flex justify-between items-center gap-[10px]">
                      <div className="font-[600] dark:text-white text-[#000] sm:text-[18px] text-[16px]">
                        {String(t('layout:casino'))}
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
                      <div className="font-[600] dark:text-white text-[#000] sm:text-[18px] text-[16px]">
                        {String(t('layout:casino'))}
                      </div>
                      <div className="flex items-center justify-center">
                        <Link
                          href={selectedCasino === 'recent' ? ROUTER.Recent : ROUTER.Favorite}
                          role="button"
                          className="rounded-[5px] font-bold text-[10px] dark:text-color-primary text-[#000] px-[10px] py-[8px] hover:bg-[#6b7180] hover:text-white"
                        >
                          {t('gameDetail:viewAll')}
                        </Link>
                      </div>
                    </div>
                    <div className="flex gap-[10px] dark:text-color-text-primary text-[14px] mt-[10px] text-black">
                      <span
                        className={cn({ 'text-white': selectedCasino === 'recent' })}
                        onClick={() => setSelectedCasino('recent')}
                      >
                        {String(t('casino:recent'))}
                      </span>
                      <span
                        className={cn({ 'text-white': selectedCasino === 'favorite' })}
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
                              <div key={index} className="max-w-[185px]">
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
                              <div key={index} className="max-w-[185px]">
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
              <div className="bg-[url('/img/octopus.png')] relative w-full sm:flex hidden flex-col max-[857px]:pt-[20px] min-[858px]:flex-row items-center bg-no-repeat justify-between max-[857px]:bg-[length:100%_45%] bg-[length:100%_100%] rounded-[5px]">
                <div className="flex-1 flex items-center justify-center min-h-[105px]">
                  <Image
                    src={'/img/img-payment.png'}
                    width={382}
                    height={116}
                    className="max-[857px]:w-[60%] max-[857px]:py-[16px] min-[858px]:pr-5"
                    alt=""
                  />
                </div>
                <div className="py-[35px] max-sm:pt-[16px] w-full min-[858px]:pl-[56px] flex-1 min-[858px]:bg-[#1D1E2280] relative z-[1] md:backdrop-blur-[5px]">
                  <div className="min-[858px]:max-w-[362px] relative z-1 flex flex-col gap-[22px] max-[857px]:items-center">
                    <div className="sm:text-[20px] text-[16px] max-[857px]:max-w-[362px] max-[857px]:text-center">
                      {t('homePage:getStarted')} <span className="text-color-primary">300%</span>{' '}
                      {t('bonus:depositBonus')}
                    </div>
                    <div
                      className="bg-gradient-btn-default rounded-[5px] text-center text-white py-[11px] w-[176px] hover:opacity-[0.9] cursor-pointer"
                      onClick={() => {
                        handleClickDeposit();
                      }}
                    >
                      {t('layout:deposit')}
                    </div>
                  </div>
                </div>
                <div className="max-[857px]:block hidden absolute top-[45%] left-0 w-full h-1/2 bg-[#1D1E22]"></div>
              </div>
              <div className="relative w-full sm:block hidden">
                <HomepageSession title={String(t('homePage:latestBetRace'))} showIcon={false} isHome={true}>
                  <LatestBetRace />
                </HomepageSession>
              </div>
              <div className="relative w-full sm:block hidden">
                <div className="md:hidden block absolute top-0 left-0 h-full w-full z-[1] bg-[#1D1E22]"></div>
                <div className="flex md:flex-row flex-col justify-between relative z-[2] min-[858px]:min-h-[270px] bg-no-repeat bg-[length:100%_50%] max-sm:bg-center sm:bg-[length:100%_100%] px-[20px] md:pl-[30px] md:bg-[url('/img/whale.png')]">
                  <div
                    className={`flex-col z-[2] md:items-start items-center py-[32px] md:py-[40px] pr-5 gap-[24px] md:gap-[30px] ${
                      isLogin ? 'flex' : 'md:flex'
                    }`}
                  >
                    {!isLogin && (
                      <div className="text-[20px] font-semibold text-white">
                        {String(t('homePage:unlockExclusive'))} <span className="text-color-primary">VIP</span>{' '}
                        {String(t('homePage:rewardsAtBONENZA'))}
                        <div className="text-[14px] text-color-text-secondary mt-5">
                          {String(t('homePage:onlyVIPClub'))}
                        </div>
                        <div className="mt-[50px]">
                          <button className="px-[60px] py-[8px] bg-gradient-btn-default text-[14px]">Sign Up</button>
                        </div>
                      </div>
                    )}
                    {isLogin && (
                      <div className="text-[20px] font-semibold text-white">
                        {String(t('homePage:unlockExclusive'))} <span className="text-color-primary">VIP</span>{' '}
                        {String(t('homePage:rewardsAtBONENZA'))}
                        <div className="text-[14px] text-color-text-secondary mt-5">
                          {String(t('homePage:onlyVIPClub'))}
                        </div>
                      </div>
                    )}
                    <Image
                      width={100}
                      height={100}
                      className="w-full h-auto md:hidden max-h-[220px]"
                      alt=""
                      src="/img/mermaid-nobg.png"
                    />

                    {isLogin && (
                      <div
                        onClick={() => {
                          dispatch(changeIsShowVipClubModal(true));
                        }}
                        className="cursor-pointer bg-gradient-btn-default  hover:opacity-[0.9] hover:text-white text-white text-[14px] font-bold text-center h-[44px] w-full sm:max-w-[162px] rounded-[5px] py-[13px] sm:w-[162px]"
                      >
                        {t('referAndEarn:learnMore')}
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-default" />
                </div>
              </div>
              <RecommendedGamesComponent listRecommendedGame={listRecommendedGame} />
              {isLogin && (
                <div className="relative w-full sm:hidden block">
                  <div className="flex items-center gap-[10px]">
                    <div className="font-[600] dark:text-white text-[#000] sm:text-[18px] text-[16px]">
                      {String(t('casino:pickForYou'))}
                    </div>
                  </div>
                  <div className="game-grid-parent mt-[20px]">
                    {listPicksForGame.map((game, index) => {
                      return (
                        <div key={index} className="max-w-[185px]">
                          <GameCard gameDetail={game} />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-center">
                    <Link
                      href={ROUTER.PicksForYou}
                      role="button"
                      className="dark:bg-[#2D3035] bg-white rounded-[5px] font-bold text-[10px] dark:text-white text-[#000] px-[10px] py-[8px] hover:bg-[#6b7180] hover:text-white"
                    >
                      {t('gameDetail:viewAll')}
                    </Link>
                  </div>
                </div>
              )}

              <div className="">
                <div className="sm:py-[35px] py-[20px] lg:flex gap-[60px] rounded-[15px]">
                  <div className="lg:w-[50%]">
                    <div className="text-black dark:text-white text-[14px] font-semibold ">
                      {String(t('homePage:cryptoOnlineCasino'))}
                    </div>
                    <div
                      className="text-color-text-secondary text-[13px] mt-5 text-justify"
                      dangerouslySetInnerHTML={{ __html: t('homePage:casinosOnlineHaveNot') }}
                    ></div>
                    <div
                      className="text-color-text-secondary text-[13px] mt-5 text-justify"
                      dangerouslySetInnerHTML={{ __html: t('homePage:playersAreAlways') }}
                    ></div>
                    <div
                      className="mt-5 cursor-pointer flex items-center gap-[10px] dark:text-color-primary text-amber-600"
                      onClick={() => {
                        dispatch(changeIsShowCryptoOnlineModal(true));
                      }}
                    >
                      <div className="text-13">{String(t('homePage:showMore'))}</div>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                  <div className="mt-[42px] lg:mt-0 lg:w-[50%]">
                    <div className="text-black dark:text-white text-center lg:text-left text-[14px] font-semibold mb-5">
                      {String(t('homePage:helpUsImproveYourExperience'))}
                    </div>
                    <textarea
                      className="rounded-[16px] dark:text-white bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-[#161D26] h-[100px] max-[414px]:placeholder:text-[10px] focus:outline-none w-full text-color-text-secondary text-[13px] p-[20px] resize-none placeholder:text-[13px] placeholder:text-[#53575C]"
                      placeholder={String(t('homePage:foundBug'))}
                    />
                    <div className="flex flex-col-reverse w-full lg:w-unset lg:flex-row items-center mt-5 gap-5">
                      <div className="hover:opacity-[0.9] bg-gradient-btn-default py-[10px] flex items-center justify-center text-white font-bold text-[14px] w-full lg:w-[162px] rounded-[5px] cursor-pointer">
                        {String(t('homePage:leaveAMessage'))}
                      </div>
                      <div className="text-color-text-secondary text-[12px]">{String(t('footer:nowGetReward'))}</div>
                    </div>
                    <div className="mt-5 text-center lg:text-left">
                      <span className="text-[13px] text-color-text-secondary mr-[10px]">
                        {String(t('homePage:orEmail'))}
                      </span>
                      <a
                        href="mailto:feedback@bonenza.com"
                        className="text-[13px] dark:text-color-primary text-amber-600 hover:text-color-primary cursor-pointer"
                      >
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
