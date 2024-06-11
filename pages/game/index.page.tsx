import { StarIcon } from '@heroicons/react/24/solid';
import cn from 'classnames';
import { LoginCurve, PlayCricle, Refresh, Send2 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import ReactLoading from 'react-loading';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  api_getGameDetail,
  api_getGameFavorite,
  api_setGameFavorite,
  api_startGameDemo,
  api_startGameSession,
} from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER, TOAST_ENUM } from '@/base/constants/common';
import { formatDate } from '@/base/libs/utils';
import { getErrorMesssage1 } from '@/base/libs/utils/notificationToast';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowDepositModal,
} from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum, GameListType, GameProviderDetail } from '@/base/types/common';
import { GameCreateSessionRequest, GameDemoRequest } from '@/base/types/requestTypes';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import Loader from '@/components/common/preloader/loader';
import GameDescriptionComponent from '@/components/game/gameDescription';
import GameDetailComponent from '@/components/game/gameDetail';
import GameReviewComponent from '@/components/game/gameReview';
import BaseLayout from '@/components/layouts/base.layout';
import FiatHeader from '@/components/layouts/header/fiatHeader';
import ModalShareGame from '@/components/modal/shareGame/shareGame';

import styles from './index.module.scss';

type LaunchUrlTye = {
  gameLauncherUrl: string;
  gameUrl: string;
  strategy: string;
  lobbyUrl: string;
  tokenId: string;
};

function GamePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState<boolean>(false);
  const [isLoadingLike, setIsLoadingLike] = useState<boolean>(false);

  const [isLoadingGame, setIsLoadingGame] = useState({
    request: '',
    status: false,
  });

  const [gameDetail, setGameDetail] = useState<GameListType>({
    id: '',
    title: '',
    provider: '',
    identifier: '',
    payout: 0,
    multiplier: 0,
    description: '',
    releasedAt: '',
    allowedLocation: false,
    allowedDemo: false,
    providerName: '',
    favorites: 0,
  });
  const [isNotFoundGame, setIsNotFoundGame] = useState<boolean>(false);
  const [openShareGame, setOpenShareGame] = useState<boolean>(false);
  const [reactionData, setReactionData] = useState({
    isFavorite: false,
    isLike: false,
  });
  const [successfullyLaunched, setSuccessfullyLaunched] = useState<boolean>(false);
  const [providerDetail, setProviderDetail] = useState<GameProviderDetail | any>();

  const [tab, setTab] = useState(1);

  const gameScreen = useFullScreenHandle();
  const { t } = useTranslation('');

  const { query, reload, route, pathname, asPath } = useRouter();
  const { gameId } = query;
  const [isSatisfied, setIsSatisfied] = useState<boolean>(true);
  const dispatch = useDispatch();

  const { isLogin, localFiat, activeCurrency, balances, betHistory, language, viewInFiat } = useSelector(
    (state: AppState) => ({
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      localFiat: state.wallet.localFiat,
      activeCurrency: state.wallet.activeCurrency,
      balances: state.wallet.balances,
      isLogin: state.auth.isLogin,
      betHistory: state.game.betHistory,

      language: state.auth.user.generalSetting.settingLanguage,
    }),
    shallowEqual,
  );

  const getGameDetail = async () => {
    try {
      if (!String(gameId)) {
        return;
      }
      setIsLoading(true);
      setIsNotFoundGame(false);

      const _res = await api_getGameDetail(String(gameId));

      const tempGameDetailData: GameListType = {
        id: _res.data?.id ?? '',
        title: _res.data?.title ?? '',
        provider: _res.data?.producerIdentifier ?? '',
        providerName: _res.data?.producerName ?? '',
        identifier: _res.data?.identifier ?? '',
        payout: Number(_res.data?.payout ?? 0),
        multiplier: Number(_res.data?.multiplier ?? 0),
        isExpiration: _res.data?.isExpiration ?? false,
        description: _res.data?.description ?? '',
        releasedAt: _res.data?.releasedAt ?? '',
        gameCnt: Number(_res.data?.producerDetails?.gameCount ?? 0),
        allowedLocation: _res.data?.allowLocation,
        allowedDemo: _res.data?.allowDemo,
        favorites: _res.data?.favoriteCount,
      };

      if (!_res.data?.allowLocation) {
        toast.error(t('errors:game:canDetectLocation'), { containerId: TOAST_ENUM.COMMON });
      }

      setGameDetail(tempGameDetailData);
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMesssage1(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
      setIsNotFoundGame(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreeplay = () => {
    try {
      setIsLoadingGame({
        request: 'demo',
        status: true,
      });
      const list = document.getElementById('game_wrapper');
      if (list?.firstElementChild) {
        list?.removeChild(list?.firstElementChild);
      }
      const requestData: GameDemoRequest = {
        gameId: gameDetail.id,
        locale: language,
      };
      // const res = await api_startGameDemo(requestData);
      let newWindow: any;
      if (isMobile) {
        newWindow = window.open('about:blank', '_blank');
      }

      api_startGameDemo(requestData)
        .then((res) => {
          const lanuchGameOption: LaunchUrlTye = {
            gameLauncherUrl: res.data.gameLauncherUrl,
            gameUrl: res.data.gameUrl,
            strategy: res.data.strategy,
            lobbyUrl: res.data.lobbyUrl,
            tokenId: res.data.tokenId,
          };

          if (isMobile && newWindow) {
            newWindow.location.href = lanuchGameOption.gameUrl;
          }
          if (!isMobile) {
            launchGame(
              lanuchGameOption.gameUrl,
              lanuchGameOption.gameLauncherUrl,
              lanuchGameOption.strategy,
              lanuchGameOption.lobbyUrl,
              lanuchGameOption.tokenId,
            );
          }
        })
        .catch((error: any) => {
          const errType = error.response?.data?.message ?? '';
          const errMessage = getErrorMesssage1(errType);
          toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
          setIsLoadingGame({
            request: 'demo',
            status: false,
          });
        })
        .finally(() => {});
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMesssage1(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    }
  };
  const handleSignUp = async () => {
    dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
    dispatch(changeIsShowAuthenticationModal(true));
  };
  const handlePlayRequest = () => {
    try {
      const tempBalances = [...balances];
      const selectedBalance = tempBalances.find((item) => item.symbolId === activeCurrency.id);
      const balance = selectedBalance?.amount ?? 0;
      const isBalanceSatisfied = balance > 0;
      setSuccessfullyLaunched(false);
      setIsSatisfied(isBalanceSatisfied);

      if (!isBalanceSatisfied) {
        setIsSatisfied(false);
        return;
      }
      setIsLoadingGame({
        request: 'real',
        status: true,
      });
      const list = document.getElementById('game_wrapper');
      if (list?.firstElementChild) {
        list?.removeChild(list?.firstElementChild);
      }
      const requestData: GameCreateSessionRequest = {
        gameId: gameDetail.id,
        currencyType: activeCurrency.type,
        currencyId: activeCurrency.id,
      };
      let newWindow: any;
      if (isMobile) {
        newWindow = window.open('about:blank', '_blank');
      }

      // const res = await api_startGameSession(requestData);
      api_startGameSession(requestData)
        .then((res) => {
          const lanuchGameOption: LaunchUrlTye = {
            gameLauncherUrl: res.data.gameLauncherUrl,
            gameUrl: res.data.gameUrl,
            strategy: res.data.strategy,
            lobbyUrl: res.data.lobbyUrl,
            tokenId: res.data.tokenId,
          };
          if (newWindow && isMobile) {
            newWindow.location.href = lanuchGameOption.gameUrl;
          }
          if (!isMobile) {
            launchGame(
              lanuchGameOption.gameUrl,
              lanuchGameOption.gameLauncherUrl,
              lanuchGameOption.strategy,
              lanuchGameOption.lobbyUrl,
              lanuchGameOption.tokenId,
            );
          }
        })
        .catch((error: any) => {
          const errType = error.response?.data?.message ?? '';
          const errMessage = getErrorMesssage1(errType);
          toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
          setIsLoadingGame({
            request: 'real',
            status: false,
          });
        })
        .finally(() => {});
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMesssage1(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
      setIsLoadingGame({
        request: 'real',
        status: false,
      });
    }
  };

  const getGameReactInfo = async () => {
    try {
      if (!gameDetail.id || !isLogin) return;
      const res = await api_getGameFavorite(gameDetail.id);
      const favorite = res.data.state;
      setReactionData({
        ...reactionData,
        isFavorite: favorite,
      });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMesssage1(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
      setReactionData({
        isFavorite: false,
        isLike: false,
      });
    }
  };

  const handleReactGame = async (reaction: 'like' | 'favorite') => {
    try {
      if (!isLogin) {
        dispatch(changeIsShowAuthenticationModal(true));
        dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
        return;
      }
      if (reaction === 'like') {
        setIsLoadingLike(true);
      } else {
        setIsLoadingFavorite(true);
      }

      const res = await api_setGameFavorite(gameDetail.id);
      const count = res.data?.count;
      const state = res.data?.state;
      setGameDetail({ ...gameDetail, favorites: count });
      setReactionData({ ...reactionData, isFavorite: state });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMesssage1(errType);
      toast.error(t(errMessage), { containerId: TOAST_ENUM.COMMON });
    } finally {
      if (reaction === 'like') {
        setIsLoadingLike(false);
      } else {
        setIsLoadingFavorite(false);
      }
    }
  };

  const launchGame = (gameUrl: string, launcherUrl: string, strategy: string, lobbyUrl: string, tokenId: string) => {
    try {
      // Define the game launch options
      // setIsLoading(true);
      const list = document.getElementById('game_wrapper');
      if (list?.firstElementChild) {
        list?.removeChild(list?.firstElementChild);
      }

      const loadingGameStatus = { ...isLoadingGame };

      const success = () => {
        setSuccessfullyLaunched(true);
        setIsLoadingGame({
          status: false,
          request: loadingGameStatus.request,
        });
      };
      const error = () => {
        setSuccessfullyLaunched(false);
      };
      const gameLaunchOptions = {
        target_element: 'game_wrapper',
        launch_options: {
          // IMPORTANT WARNING:
          // You will receive all these parameters as a response by launch demo / session request to the SOFTSWISS Game Aggregator.
          // Pass them directly here without any manual modifications, as this could disrupt the game launching process.

          // Required
          game_launcher_url: launcherUrl, // URL to GameLauncher HTML page

          // Game parameters. Required.
          game_url: gameUrl,
          strategy: strategy,
          lobby_url: lobbyUrl,
          token_id: tokenId,
          // The number of game parameters depends on 'strategy'.
        },
      };
      window.sg.launch(gameLaunchOptions, success, error);
      // if (isMobile) {
      //   var a = document.createElement('a');
      //   a.href = gameUrl;
      //   a.target = '_blank';
      //   document.body.appendChild(a);
      //   a.click();
      // } else {
      //   window.sg.launch(gameLaunchOptions, success, error);
      // }
    } catch (error) {
      console.log('error', error);
      setSuccessfullyLaunched(false);
      toast(t('notification:errors:gameLaunchedFailed'));
    } finally {
      // setTimeout(() => {
      //   setIsLoading(false);
      // }, 1000);
    }
  };

  useEffect(() => {
    setSuccessfullyLaunched(false);
    if (gameId) {
      getGameDetail();
    } else {
      setIsNotFoundGame(true);
    }
  }, [gameId, language]);

  useEffect(() => {
    setIsSatisfied(true);
    if (gameDetail.identifier) {
      getGameReactInfo();
    }
    if (localFiat?.id && activeCurrency.id !== '' && gameDetail.id && successfullyLaunched) {
      handlePlayRequest();
    }
  }, [localFiat?.id, activeCurrency.id, gameDetail]);

  return (
    <>
      {isLoading && <Loader />}
      {!isNotFoundGame && (
        <div className="py-[24px]">
          <div className="items-center justify-between hidden w-full sm:flex">
            <Breadcrumbs
              data={[{ title: 'Casino', href: ROUTER.Casino }]}
              endpoint={{ title: String(gameDetail.title), href: ROUTER.GameDetail(String(gameId)) }}
            />
            <div>
              <span className="text-gray-400">{t('gameDetail:by')}</span>{' '}
              <Link
                className="!underline dark:text-white/90 text-black/90 dark:hover:text-white hover:text-black"
                href={ROUTER.Provider(String(gameDetail.providerName))}
              >
                {gameDetail.providerName}
              </Link>
            </div>
          </div>
          <div className="w-full m-auto">
            {/* Game play */}
            <FullScreen handle={gameScreen} className="sm:aspect-[2] aspect-[4/3] w-full mt-[20px] relative">
              {/* for desktop, for load ifram data */}
              <div
                id="game_wrapper"
                key={String(gameId)}
                className={cn(
                  'h-full sm:dark:bg-black dark:bg-color-modal-bg-primary bg-white rounded-large',
                  styles.gameWrapper,
                )}
              />

              {/* for mobile version */}
              <div
                className={cn(
                  'sm:hidden flex flex-col rounded h-full absolute z-[5] top-0 w-full transition-opacity duration-1000 p-[15px] gap-[10px]',
                  {
                    // hidden: !isPlayRequested,
                    'opacity-0': successfullyLaunched,
                    'opacity-100': !successfullyLaunched,
                    'pointer-events-none': successfullyLaunched,
                  },
                )}
              >
                <div className="grid grid-cols-2 w-full h-fit gap-[10px]">
                  <div className="relative flex aspect-square">
                    <Image
                      src={
                        gameDetail.identifier
                          ? `https://cdn.softswiss.net/i/s4/${gameDetail.identifier.replace(':', '/')}.png`
                          : '/img/game-background.png'
                      }
                      fill
                      alt=""
                      className="rounded-default"
                      onError={(e) => {
                        e.currentTarget.src = '/img/game-background.png';
                      }}
                    />
                  </div>
                  <div className="flex flex-col aspect-square px-[10px] justify-between">
                    <div className="flex flex-col gap-[10px]">
                      <div className="font-bold text-black dark:text-white text-default">{gameDetail.title}</div>
                      <div className="text-black dark:text-white text-des">
                        <span className="text-gray-400">{t('gameDetail:by')}</span>{' '}
                        <Link
                          className="!underline dark:text-white/90 text-black/90 dark:hover:text-white hover:text-black"
                          href={ROUTER.Provider(String(gameDetail.providerName))}
                        >
                          {gameDetail.providerName}
                        </Link>
                      </div>
                      <div className="text-black dark:text-color-text-secondary text-des">
                        {`${formatDate(new Date(gameDetail.releasedAt), 'yyyy.MM.dd')}`}
                      </div>
                    </div>
                    <div className="flex text-color-text-primary">
                      {!isLoadingFavorite ? (
                        <div
                          role="button"
                          className={cn(
                            'dark:hover:bg-gray-700 dark:text-color-text-secondary dark:hover:text-white hover:bg-color-light-bg-primary rounded p-2 flex gap-2 items-center',
                            {
                              '!text-amber-400': reactionData.isFavorite,
                            },
                          )}
                          onClick={() => handleReactGame('favorite')}
                        >
                          <StarIcon width={20} />
                          <span className="text-des">{gameDetail?.favorites ?? 0}</span>
                        </div>
                      ) : (
                        <div className="w-[49px] flex items-center justify-center">
                          <ReactLoading type={'balls'} width={20} height={20} />
                        </div>
                      )}
                      <div
                        role="button"
                        className="p-2 rounded dark:hover:bg-gray-700 dark:hover:text-white hover:bg-color-light-bg-primary hover:text-black"
                        onClick={() => setOpenShareGame(true)}
                      >
                        <Send2 size={20} variant="Bold" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 w-full gap-[10px] mt-[15px]">
                  {isLogin ? (
                    <button
                      type="button"
                      disabled={!gameDetail.allowedLocation || isLoadingGame.status}
                      className="truncate hover:bg-color-red justify-center text-white rounded-default bg-gradient-btn-play py-[15px] text-default flex items-center gap-[10px] font-bold"
                      onClick={() => handlePlayRequest()}
                    >
                      {isLoadingGame.status && isLoadingGame.request === 'real' ? (
                        <ReactLoading type={'balls'} color={'white'} width={20} height={20} />
                      ) : (
                        <PlayCricle size={20} />
                      )}

                      <div className="font-bold">{t('gameDetail:realPlayMobile')}</div>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!gameDetail.allowedLocation || isLoadingGame.status}
                      className="truncate hover:bg-color-red justify-center text-white rounded-default font-semibold bg-gradient-btn-play py-[15px] text-default flex items-center gap-[10px]"
                      onClick={() => handleSignUp()}
                    >
                      {isLoadingGame.status && isLoadingGame.request === 'real' ? (
                        <ReactLoading type={'balls'} color={'white'} width={20} height={20} />
                      ) : (
                        <LoginCurve size={20} />
                      )}

                      <div>{t('layout:signUp')}</div>
                    </button>
                  )}

                  <button
                    type="button"
                    className={cn(
                      'truncate hover:bg-gray-400 text-white rounded-default font-semibold bg-[#6B7180] py-[15px] text-default items-center gap-[10px] justify-center',
                      {
                        flex: gameDetail.allowedDemo,
                        hidden: !gameDetail.allowedDemo,
                      },
                    )}
                    disabled={isLoadingGame.status}
                    onClick={() => {
                      handleFreeplay();
                    }}
                  >
                    {isLoadingGame.status && isLoadingGame.request === 'demo' ? (
                      <ReactLoading type={'balls'} color={'white'} width={20} height={20} />
                    ) : (
                      <PlayCricle size={20} />
                    )}

                    <div>{t('gameDetail:freePlayMobile')}</div>
                  </button>
                </div>

                <div
                  className={cn('absolute top-[50px] w-full z-10 flex left-0', { 'p-[15px]': !isSatisfied && isLogin })}
                >
                  {!isSatisfied && isLogin && (
                    <div className="lg:p-[20px] p-[10px] sm:gap-[20px] gap-[10px] sm:hidden flex flex-col items-center z-1 rounded-large sm:max-w-[500px] w-full dark:bg-[#202226] bg-color-light-bg-primary">
                      {gameDetail?.isExpiration ? (
                        <div className="min-h-[100px] flex items-center dark:text-white text-black text-default">
                          {t('gameDetail:gameExpiration')}
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-row items-center md:gap-[30px] gap-[10px]">
                            <div className="text-start md:text-[18px] sm:text-default text-[12px] dark:text-white text-black">
                              {t('gameDetail:insufficientBalanceIn')}
                            </div>
                            <div className="bg-[#17191B] rounded-default">
                              <FiatHeader inGamePage={true} wrapperClass="!right-0" buttonClass="min-w-[150px]" />
                            </div>
                          </div>
                          <div className="sm:text-[12px] text-[10px] text-[#C2C2C2] text-center">
                            <span className="!text-red-500">
                              {t('gameDetail:insufficient')} {activeCurrency?.name ?? 'USD'} {t('gameDetail:balance')},
                            </span>
                            {t('gameDetail:switchToAnotherAsset')}
                          </div>

                          <div className="flex items-center gap-[20px]">
                            <button
                              type="button"
                              className="truncate hover:bg-[red] text-white rounded-default font-semibold bg-[#F61B4F] sm:py-[9px] py-[5px] sm:px-5 px-[8px] sm:text-default text-[12px] flex items-center gap-[10px]"
                              onClick={() => {
                                dispatch(changeIsShowDepositModal(true));
                              }}
                            >
                              <PlayCricle size={20} />
                              <div>{t('gameDetail:depositAndPlay')}</div>
                            </button>
                            <button
                              type="button"
                              className={cn(
                                'truncate hover:bg-gray-400 text-white rounded-default font-semibold bg-[#6B7180] sm:py-[9px] py-[5px] sm:px-5 px-[8px] sm:text-default text-[12px] items-center gap-[10px]',
                                {
                                  flex: gameDetail.allowedDemo,
                                  hidden: !gameDetail.allowedDemo,
                                },
                              )}
                              disabled={isLoadingGame.status}
                              onClick={() => {
                                handleFreeplay();
                              }}
                            >
                              <PlayCricle size={20} />
                              <div>{t('gameDetail:freePlay')}</div>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {!isSatisfied && <div className="absolute z-[5] bg-[black]/80 w-full h-full left-0 top-0"></div>}
              </div>

              {/* for desktop version */}
              <div
                className={cn(
                  'hidden sm:flex items-center justify-center rounded h-full absolute z-[5] top-0 w-full transition-opacity duration-1000',
                  {
                    // hidden: !isPlayRequested,
                    'opacity-0': successfullyLaunched,
                    'opacity-100': !successfullyLaunched,
                    'pointer-events-none': successfullyLaunched,
                  },
                )}
              >
                {/* <LazyLoad width="100%" height="100%"> */}
                <Image
                  src={
                    gameDetail.identifier
                      ? `https://cdn.softswiss.net/b/${gameDetail.identifier.replace(':', '/')}.jpg`
                      : '/img/game-background.png'
                  }
                  fill
                  alt=""
                  className="hidden sm:block "
                  onError={(e) => {
                    e.currentTarget.src = '/img/game-background.png';
                  }}
                />
                {/* </LazyLoad> */}

                <div className={cn('h-full bg-black/80 w-full absolute')} />

                {isLogin && (
                  <div className="lg:p-[20px] p-[10px] sm:gap-[20px] gap-[10px] hidden sm:flex flex-col items-center z-1 sm:max-w-[500px] sm:w-full w-[90%] dark:bg-[#202226] bg-color-light-bg-primary rounded">
                    {gameDetail?.isExpiration ? (
                      <div className="min-h-[100px] flex items-center dark:text-white text-black text-default">
                        {t('gameDetail:gameExpiration')}
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-row items-center md:gap-[30px] gap-[10px]">
                          {isSatisfied && (
                            <div className="text-start md:text-[18px] sm:text-default text-[12px] dark:text-white text-black">
                              {t('gameDetail:playWithBalanceIn')}
                            </div>
                          )}
                          {!isSatisfied && (
                            <div className="text-start md:text-[18px] sm:text-default text-[12px] dark:text-white text-black">
                              {t('gameDetail:insufficientBalanceIn')}
                            </div>
                          )}
                          {!isMobile && (
                            <div className="bg-[#17191B] rounded-default">
                              <FiatHeader inGamePage={true} wrapperClass="!right-0" buttonClass="min-w-[150px]" />
                            </div>
                          )}
                        </div>

                        {isSatisfied && (
                          <div className="sm:text-[12px] text-[11px] dark:text-[#C2C2C2] text-color-light-text-primary text-center">
                            {t('gameDetail:theSelectedCurrencyWillBeDisplayedIn')}{' '}
                            <span className="!text-color-primary">{viewInFiat ? localFiat?.name ?? 'USD' : 'USD'}</span>
                            , {t('gameDetail:ifYouChangeCurrency')}
                          </div>
                        )}
                        {!isSatisfied && (
                          <div className="sm:text-[12px] text-[10px] text-[#C2C2C2] text-center">
                            <span className="!text-red-500">
                              {t('gameDetail:insufficient')} {activeCurrency?.name ?? 'USD'} {t('gameDetail:balance')},
                            </span>
                            {t('gameDetail:switchToAnotherAsset')}
                          </div>
                        )}

                        <div className="flex items-center gap-[20px]">
                          {isSatisfied && (
                            <button
                              type="button"
                              disabled={!gameDetail.allowedLocation || isLoadingGame.status}
                              className="truncate hover:bg-[red] text-white rounded-default font-semibold bg-[#F61B4F] sm:py-[9px] sm:px-5 py-[5px] px-[5px] sm:text-default text-[12px] flex items-center gap-[10px]"
                              onClick={() => handlePlayRequest()}
                            >
                              {isLoadingGame.status && isLoadingGame.request === 'real' ? (
                                <ReactLoading type={'balls'} color={'white'} width={20} height={20} />
                              ) : (
                                <PlayCricle size={20} />
                              )}

                              <div>{t('gameDetail:realPlay')}</div>
                            </button>
                          )}
                          {!isSatisfied && (
                            <button
                              type="button"
                              className="truncate hover:bg-[red] text-white rounded-default font-semibold bg-[#F61B4F] sm:py-[9px] py-[5px] sm:px-5 px-[5px] sm:text-default text-[12px] flex items-center gap-[10px]"
                              onClick={() => {
                                dispatch(changeIsShowDepositModal(true));
                              }}
                            >
                              <PlayCricle size={20} />
                              <div>{t('gameDetail:depositAndPlay')}</div>
                            </button>
                          )}
                          <button
                            type="button"
                            className={cn(
                              'truncate hover:bg-gray-400 text-white rounded-default font-semibold bg-[#6B7180] sm:py-[9px] py-[5px] px-5 sm:text-default text-[12px] items-center gap-[10px]',
                              {
                                flex: gameDetail.allowedDemo,
                                hidden: !gameDetail.allowedDemo,
                              },
                            )}
                            disabled={isLoadingGame.status}
                            onClick={() => {
                              handleFreeplay();
                            }}
                          >
                            {isLoadingGame.status && isLoadingGame.request === 'demo' ? (
                              <ReactLoading type={'balls'} color={'white'} width={20} height={20} />
                            ) : (
                              <PlayCricle size={20} />
                            )}

                            <div>{t('gameDetail:freePlay')}</div>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {!isLogin && (
                  <div className="lg:p-[20px] p-[10px] sm:gap-[20px] gap-[10px] hidden sm:flex flex-col items-center z-1 sm:max-w-[500px] sm:w-full w-[90%] dark:bg-[#202226] bg-color-light-bg-primary rounded">
                    {gameDetail?.isExpiration ? (
                      <div className="min-h-[100px] flex items-center dark:text-white text-black text-default">
                        {t('gameDetail:gameExpiration')}
                      </div>
                    ) : (
                      <>
                        <div className="sm:text-[12px] text-[10px] dark:text-[#C2C2C2] text-color-light-text-primary text-center">
                          {t('gameDetail:theSelectedCurrencyWillBeDisplayedIn')}{' '}
                          <span className="!text-color-primary">{localFiat?.name ?? 'USD'}</span>{' '}
                          {t('gameDetail:ifYouChangeCurrency')}
                        </div>

                        <div className="flex items-center gap-[20px]">
                          <button
                            type="button"
                            className="truncate hover:bg-[red] text-white rounded-default font-semibold bg-[#F61B4F] sm:py-[9px] py-[5px] px-5 sm:text-default text-[12px] flex items-center gap-[10px]"
                            onClick={() => {
                              dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
                              dispatch(changeIsShowAuthenticationModal(true));
                            }}
                          >
                            <div>{t('gameDetail:signUp')}</div>
                          </button>
                          <button
                            type="button"
                            className={cn(
                              'truncate hover:bg-gray-400 text-white rounded-default font-semibold bg-[#6B7180] sm:py-[9px] py-[5px] px-5 sm:text-default text-[12px] items-center gap-[10px]',
                              {
                                flex: gameDetail.allowedDemo,
                                hidden: !gameDetail.allowedDemo,
                              },
                            )}
                            disabled={isLoadingGame.status}
                            onClick={() => {
                              handleFreeplay();
                            }}
                          >
                            <PlayCricle size={20} />
                            <div>{t('gameDetail:freePlay')}</div>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </FullScreen>
            {/* Game actions */}
            <div className="p-[15px] dark:bg-[#17191B] bg-white items-center justify-between sm:flex hidden">
              <div className="text-color-text-secondary flex gap-[20px] items-center">
                {!isLoadingFavorite ? (
                  <div
                    role="button"
                    className={cn(
                      'dark:hover:bg-gray-700 dark:text-color-text-secondary dark:hover:text-white hover:bg-color-light-bg-primary rounded p-2 flex gap-2 items-center',
                      {
                        '!text-amber-400': reactionData.isFavorite,
                      },
                    )}
                    onClick={() => handleReactGame('favorite')}
                  >
                    <StarIcon width={20} />
                    <span className="text-[12px]">{gameDetail?.favorites ?? 0}</span>
                  </div>
                ) : (
                  <div className="w-[49px] flex items-center justify-center">
                    <ReactLoading type={'balls'} width={20} height={20} />
                  </div>
                )}
                {/* {!isLoadingLike ? (
                  <div
                    role="button"
                    className={cn(
                      'dark:hover:bg-gray-700 dark:text-color-text-secondary dark:hover:text-white hover:bg-color-light-bg-primary rounded p-2 flex gap-2 items-center',
                      {
                        '!text-[#ec4016]': reactionData.isLike,
                      },
                    )}
                    onClick={() => handleReactGame('like')}
                  >
                    <Heart variant="Bold" size={20} />
                    <span className="text-[12px]">{0}</span>
                  </div>
                ) : (
                  <div className="w-[49px] flex items-center justify-center">
                    <ReactLoading type={'balls'} color={'white'} width={20} height={20} />
                  </div>
                )} */}
                {/* Hiding Share game button */}
                {/* <div
                  role="button"
                  className="p-2 rounded dark:hover:bg-gray-700 dark:hover:text-white hover:bg-color-light-bg-primary hover:text-black"
                  onClick={() => setOpenShareGame(true)}
                >
                  <Send2 size={20} variant="Bold" /> 
              </div>*/}
              </div>
              <div className="text-color-text-secondary flex gap-[20px] items-center">
                {/* Hiding three Tooltips for Game */}
                {/* <Tooltip
                  message="Fairness"
                  children={
                    <div
                      role="button"
                      className="p-2 rounded dark:hover:bg-gray-700 dark:hover:text-white hover:bg-color-light-bg-primary hover:text-black"
                    >
                      <Image alt="" src={'/img/fairness.png'} width={18} height={18} />
                    </div>
                  }
                />
                <Tooltip
                  message="Live Stats"
                  children={
                    <div
                      role="button"
                      className="p-2 rounded dark:hover:bg-gray-700 dark:hover:text-white hover:bg-color-light-bg-primary hover:text-black"
                    >
                      <Image alt="" src={'/img/hierarchy.png'} width={18} height={18} />
                    </div>
                  }
                />

                <div
                  role="button"
                  className="p-2 rounded dark:hover:bg-gray-700 dark:hover:text-white hover:bg-color-light-bg-primary hover:text-black"
                >
                  <Image alt="" src={'/img/monitor.png'} width={18} height={18} />
                </div> */}
                <div
                  role="button"
                  className="p-2 rounded dark:hover:bg-gray-700 dark:hover:text-white hover:bg-color-light-bg-primary hover:text-black"
                  onClick={() => {
                    gameScreen.enter();
                  }}
                >
                  <Image alt="" src={'/img/expand.png'} width={18} height={18} />
                </div>
              </div>
            </div>
            {/* <div className="p-[8px] dark:bg-[#17191B] bg-white items-center justify-between sm:hidden grid grid-cols-2 gap-[10px] border-t-[1px] border-solid dark:border-color-border-primary border-color-light-border-primary">
              <div className="flex justify-center border-r-[1px] border-solid dark:border-color-border-primary border-color-light-border-primary">
                <Tooltip
                  message="Fairness"
                  children={
                    <div
                      role="button"
                      className="dark:hover:bg-gray-700 dark:text-color-text-primary text-color-light-text-primary flex gap-[10px] dark:hover:text-white hover:bg-color-light-bg-primary hover:text-black rounded p-2 text-default"
                    >
                      <Image className="w-[20px] h-[20px]" alt="" src={'/img/fairness.png'} width={14} height={14} />
                      Fairness
                    </div>
                  }
                />
              </div>
              <div className="flex justify-center">
                <Tooltip
                  message="Live Stats"
                  children={
                    <div
                      role="button"
                      className="dark:hover:bg-gray-700 dark:text-color-text-primary text-color-light-text-primary flex gap-[10px] dark:hover:text-white hover:bg-color-light-bg-primary hover:text-black rounded p-2 text-default"
                    >
                      <Image className="w-[20px] h-[20px]" alt="" src={'/img/hierarchy.png'} width={14} height={14} />
                      Live Stats
                    </div>
                  }
                />
              </div>
            </div> */}
          </div>

          {gameDetail.id && (
            <div>
              <ul className="sm:flex grid grid-cols-3 justify-center dark:bg-color-bg-secondary bg-white w-full sm:w-fit mt-[10px] md:text-[13px] text-[11px] font-semibold mb-[20px] md:mb-[25px] max-w-full">
                <div
                  role="button"
                  onClick={() => setTab(1)}
                  className={cn('inline-block text-center min-w-[100px] p-[10px] truncate', {
                    'dark:text-white dark:bg-color-panel-bg-primary text-black bg-[#e3ecf3]': tab === 1,
                    'dark:hover:text-white bg-transparent dark:text-[rgba(255,255,255,0.5)] text-color-light-text-primary dark:hover:bg-color-hover-primary hover:bg-color-light-hover-primary':
                      tab !== 1,
                  })}
                >
                  {gameDetail.title}
                </div>
                <div
                  role="button"
                  onClick={() => setTab(2)}
                  className={cn('inline-block text-center min-w-[100px] p-[10px] truncate', {
                    'dark:text-white dark:bg-color-panel-bg-primary text-black bg-[#e3ecf3]': tab === 2,
                    'dark:hover:text-white bg-transparent dark:text-[rgba(255,255,255,0.5)] text-color-light-text-primary dark:hover:bg-color-hover-primary hover:bg-color-light-hover-primary':
                      tab !== 2,
                  })}
                >
                  {t('gameDetail:description')}
                </div>
                <div
                  role="button"
                  onClick={() => setTab(3)}
                  className={cn('inline-block text-center min-w-[100px] p-[10px] truncate', {
                    'dark:text-white dark:bg-color-panel-bg-primary text-black bg-[#e3ecf3]': tab === 3,
                    'dark:hover:text-white bg-transparent dark:text-[rgba(255,255,255,0.5)] text-color-light-text-primary dark:hover:bg-color-hover-primary hover:bg-color-light-hover-primary':
                      tab !== 3,
                  })}
                >
                  {t('gameDetail:reviews')}
                </div>
              </ul>
              {tab === 1 && <GameDetailComponent gameDetail={gameDetail} gameProvider={providerDetail} />}
              {tab === 2 && <GameDescriptionComponent gameDetail={gameDetail} />}
              {tab === 3 && <GameReviewComponent gameDetail={gameDetail} gameProvider={providerDetail} />}
            </div>
          )}
        </div>
      )}
      {isNotFoundGame && !isLoading && (
        <div
          className={cn(
            'aspect-[2] w-full my-[20px] text-default dark:text-white text-black flex flex-col items-center justify-center gap-[20px]',
          )}
        >
          {t('gameDetail:theGameDoesNotExist')}
          <button
            type="button"
            className="truncate hover:bg-[red] text-white rounded-default font-semibold bg-[#F61B4F] sm:py-[9px] py-[5px] px-5 sm:text-default text-[12px] flex items-center gap-[10px]"
            onClick={() => reload()}
          >
            <Refresh size={20} />
            <div>{t('gameDetail:refreshNow')}</div>
          </button>
        </div>
      )}

      <ModalShareGame gameDetail={gameDetail} show={openShareGame} onClose={() => setOpenShareGame(false)} />
    </>
  );
}

GamePage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default GamePage;
