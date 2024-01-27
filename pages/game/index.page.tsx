import { StarIcon } from '@heroicons/react/24/solid';
import cn from 'classnames';
import { PlayCricle, Refresh, Send2 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { useWidth } from '@/base/hooks/useWidth';
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
import Tooltip from '@/components/tooltip';

import styles from './index.module.scss';

type LaunchUrlTye = {
  gameUrl: string;
  strategy: string;
};

function GamePage() {
  const width = useWidth();
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

  const dispatch = useDispatch();

  const { isLogin, localFiat, activeCurrency, balances, betHistory, language } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      activeCurrency: state.wallet.activeCurrency,
      balances: state.wallet.balances,
      isLogin: state.auth.isLogin,
      betHistory: state.game.betHistory,

      language: state.auth.user.generalSetting.settingLanguage,
    }),
    shallowEqual,
  );

  const balance = useMemo(() => {
    const tempBalances = [...balances];
    const selectedBalance = tempBalances.find((item) => item.symbolId === activeCurrency.id);
    return selectedBalance?.amount ?? 0;
  }, [balances, activeCurrency]);

  const isSatisfied = useMemo(() => {
    const tempBalances = [...balances];
    const selectedBalance = tempBalances.find((item) => item.symbolId === activeCurrency.id);
    const balance = selectedBalance?.amount ?? 0;
    return balance > 0;
  }, [balances, activeCurrency]);

  const handleGetGameDetail = async () => {
    try {
      if (!String(gameId)) {
        return;
      }
      setIsLoading(true);
      setIsNotFoundGame(false);

      const resGameDetail = await api_getGameDetail(String(gameId));

      const tempGameDetailData: GameListType = {
        id: resGameDetail.data?.id ?? '',
        title: resGameDetail.data?.title ?? '',
        provider: resGameDetail.data?.producerIdentifier ?? '',
        providerName: resGameDetail.data?.producerName ?? '',
        identifier: resGameDetail.data?.identifier ?? '',
        payout: Number(resGameDetail.data?.payout ?? 0),
        multiplier: Number(resGameDetail.data?.multiplier ?? 0),
        isExpiration: resGameDetail.data?.isExpiration ?? false,
        description: resGameDetail.data?.description ?? '',
        releasedAt: resGameDetail.data?.releasedAt ?? '',
        gameCnt: Number(resGameDetail.data?.producerDetails?.gameCount ?? 0),
        allowedLocation: resGameDetail.data?.allowLocation,
        allowedDemo: resGameDetail.data?.allowDemo,
        favorites: resGameDetail.data?.favoriteCount,
      };

      if (!resGameDetail.data?.allowLocation) {
        toast.error(t('errors:locationIsNotAllowed'), { containerId: TOAST_ENUM.COMMON });
      }

      setGameDetail(tempGameDetailData);
    } catch (error) {
      setIsNotFoundGame(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreePlay = async () => {
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
      const res = await api_startGameDemo(requestData);
      const lanuchGameOption: LaunchUrlTye = {
        gameUrl: res.data.gameUrl,
        strategy: res.data.strategy,
      };
      await launchGame(lanuchGameOption.gameUrl, lanuchGameOption.strategy);
    } catch (error) {
    } finally {
      setIsLoadingGame({
        request: 'demo',
        status: false,
      });
    }
  };

  const handlePlayRequest = async () => {
    try {
      if (!isSatisfied) return;
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
      const res = await api_startGameSession(requestData);
      const lanuchGameOption: LaunchUrlTye = {
        gameUrl: res.data.gameUrl,
        strategy: res.data.strategy,
      };
      await launchGame(lanuchGameOption.gameUrl, lanuchGameOption.strategy);
    } catch (error) {
      toast.error(t('notification:errors:gameLaunchedFailed'), { containerId: TOAST_ENUM.COMMON });
      setIsLoadingGame({
        request: 'real',
        status: false,
      });
    } finally {
      setIsLoadingGame({
        request: 'real',
        status: false,
      });
    }
  };

  const handleCurrentReactionGame = async () => {
    try {
      if (!gameDetail.id || !isLogin) return;
      const res = await api_getGameFavorite(gameDetail.id);
      const favorite = res.data.state;
      setReactionData({
        ...reactionData,
        isFavorite: favorite,
      });
    } catch {
      setReactionData({
        isFavorite: false,
        isLike: false,
      });
    }
  };

  const handleReactionGame = async (reaction: 'like' | 'favorite') => {
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
    } catch (error) {
      toast.error('Reaction Failed', { containerId: TOAST_ENUM.COMMON });
    } finally {
      if (reaction === 'like') {
        setIsLoadingLike(false);
      } else {
        setIsLoadingFavorite(false);
      }
    }
  };

  const launchGame = async (gameUrl: string, strategy: string) => {
    try {
      // Define the game launch options
      // setIsLoading(true);
      const list = document.getElementById('game_wrapper');
      if (list?.firstElementChild) {
        list?.removeChild(list?.firstElementChild);
      }

      const success = () => {
        setSuccessfullyLaunched(true);
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
          game_launcher_url: asPath, // URL to GameLauncher HTML page

          // Game parameters. Required.
          game_url: gameUrl,
          strategy: strategy,
          // The number of game parameters depends on 'strategy'.
        },
      };

      window.sg.launch(gameLaunchOptions, success, error);
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
    if (gameId) {
      handleGetGameDetail();
    } else {
      setIsNotFoundGame(true);
    }
  }, [gameId, language]);

  useEffect(() => {
    if (gameDetail.identifier) {
      handleCurrentReactionGame();
    }
  }, [gameDetail]);

  return (
    <>
      {isLoading && <Loader />}
      {!isNotFoundGame && (
        <div className="py-[24px]">
          <div className="flex w-full justify-between items-center">
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
          <div>
            {/* Game play */}
            <FullScreen handle={gameScreen} className="aspect-[2] w-full mt-[20px] relative">
              <div
                id="game_wrapper"
                key={String(gameId)}
                className={cn('h-full dark:bg-black bg-white', styles.gameWrapper)}
              />
              {
                <div
                  className={cn(
                    'flex items-center justify-center rounded h-full absolute z-[5] top-0 w-full transition-opacity duration-1000',
                    {
                      // hidden: !isPlayRequested,
                      'opacity-0': successfullyLaunched,
                      'opacity-100': !successfullyLaunched,
                      'pointer-events-none': successfullyLaunched,
                    },
                  )}
                >
                  <Image
                    src={`https://cdn.softswiss.net/b/${gameDetail.identifier.replace(':', '/')}.jpg`}
                    fill
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = '/img/game-background.png';
                    }}
                  />
                  <div className={cn('h-full bg-black/80 w-full absolute')} />
                  {isLogin && (
                    <div className="lg:p-[20px] p-[10px] sm:gap-[20px] gap-[10px] flex flex-col items-center z-1 sm:max-w-[500px] sm:w-full w-[90%] dark:bg-[#202226] bg-[#f6f7fa] rounded">
                      {gameDetail?.isExpiration ? (
                        <div className="min-h-[100px] flex items-center dark:text-white text-black text-[14px]">
                          {t('gameDetail:gameExpiration')}
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-row items-center md:gap-[30px] gap-[10px]">
                            {isSatisfied && (
                              <div className="text-start md:text-[18px] sm:text-[14px] text-[12px] dark:text-white text-black">
                                {t('gameDetail:playWithBalanceIn')}
                              </div>
                            )}
                            {!isSatisfied && (
                              <div className="text-start md:text-[18px] sm:text-[14px] text-[12px] dark:text-white text-black">
                                {t('gameDetail:insufficientBalanceIn')}
                              </div>
                            )}
                            <div className="bg-[#17191B] rounded-[5px]">
                              <FiatHeader inGamePage={true} wrapperClass="!right-0" buttonClass="min-w-[150px]" />
                            </div>
                          </div>

                          {isSatisfied && (
                            <div className="sm:text-[12px] text-[11px] dark:text-[#C2C2C2] text-[#31373D] text-center">
                              {t('gameDetail:theSelectedCurrencyWillBeDisplayedIn')}{' '}
                              <span className="!text-amber-500">{localFiat?.name ?? 'USD'}</span>,{' '}
                              {t('gameDetail:ifYouChangeCurrency')}
                            </div>
                          )}
                          {!isSatisfied && (
                            <div className="sm:text-[12px] text-[10px] text-[#C2C2C2] text-center">
                              <span className="!text-red-500">
                                {t('gameDetail:insufficient')} {localFiat?.name} {t('gameDetail:balance')},
                              </span>
                              {t('gameDetail:switchToAnotherAsset')}
                            </div>
                          )}

                          <div className="flex items-center gap-[20px]">
                            {isSatisfied && (
                              <button
                                type="button"
                                disabled={!gameDetail.allowedLocation || isLoadingGame.status}
                                className="truncate hover:bg-[red] text-white rounded-[5px] font-semibold bg-[#F61B4F] sm:py-[9px] sm:px-5 py-[5px] px-[5px] sm:text-[14px] text-[12px] flex items-center gap-[10px]"
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
                                className="truncate hover:bg-[red] text-white rounded-[5px] font-semibold bg-[#F61B4F] sm:py-[9px] py-[5px] sm:px-5 px-[5px] sm:text-[14px] text-[12px] flex items-center gap-[10px]"
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
                              className="truncate hover:bg-gray-400 text-white rounded-[5px] font-semibold bg-[#6B7180] sm:py-[9px] py-[5px] px-5 sm:text-[14px] text-[12px] flex items-center gap-[10px]"
                              disabled={!gameDetail.allowedDemo || isLoadingGame.status}
                              onClick={() => {
                                handleFreePlay();
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
                    <div className="lg:p-[20px] p-[10px] sm:gap-[20px] gap-[10px] flex flex-col items-center z-1 sm:max-w-[500px] sm:w-full w-[90%] dark:bg-[#202226] bg-[#f6f7fa] rounded">
                      {gameDetail?.isExpiration ? (
                        <div className="min-h-[100px] flex items-center dark:text-white text-black text-[14px]">
                          {t('gameDetail:gameExpiration')}
                        </div>
                      ) : (
                        <>
                          <div className="sm:text-[12px] text-[10px] dark:text-[#C2C2C2] text-[#31373D] text-center">
                            {t('gameDetail:theSelectedCurrencyWillBeDisplayedIn')}{' '}
                            <span className="!text-amber-500">{localFiat?.name ?? 'USD'}</span>{' '}
                            {t('gameDetail:ifYouChangeCurrency')}
                          </div>

                          <div className="flex items-center gap-[20px]">
                            <button
                              type="button"
                              className="truncate hover:bg-[red] text-white rounded-[5px] font-semibold bg-[#F61B4F] sm:py-[9px] py-[5px] px-5 sm:text-[14px] text-[12px] flex items-center gap-[10px]"
                              onClick={() => {
                                dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_UP));
                                dispatch(changeIsShowAuthenticationModal(true));
                              }}
                            >
                              <div>{t('gameDetail:signUp')}</div>
                            </button>
                            <button
                              type="button"
                              className="truncate hover:bg-gray-400 text-white rounded-[5px] font-semibold bg-[#6B7180] sm:py-[9px] py-[5px] px-5 sm:text-[14px] text-[12px] flex items-center gap-[10px]"
                              onClick={() => {
                                handleFreePlay();
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
              }
            </FullScreen>
            {/* Game actions */}
            <div className="p-[15px] dark:bg-[#17191B] bg-white flex items-center justify-between">
              <div className="text-[#929395] flex gap-[20px] items-center">
                {!isLoadingFavorite ? (
                  <div
                    role="button"
                    className={cn(
                      'dark:hover:bg-gray-700 dark:text-[#929395] dark:hover:text-white hover:bg-[#f5f6fa] text-black rounded p-2 flex gap-2 items-center',
                      {
                        '!text-amber-400': reactionData.isFavorite,
                      },
                    )}
                    onClick={() => handleReactionGame('favorite')}
                  >
                    <StarIcon width={20} />
                    <span className="text-[12px]">{gameDetail?.favorites ?? 0}</span>
                  </div>
                ) : (
                  <div className="w-[49px] flex items-center justify-center">
                    <ReactLoading type={'balls'} color={'white'} width={20} height={20} />
                  </div>
                )}
                {/* {!isLoadingLike ? (
                  <div
                    role="button"
                    className={cn(
                      'dark:hover:bg-gray-700 dark:text-[#929395] dark:hover:text-white hover:bg-[#f5f6fa] rounded p-2 flex gap-2 items-center',
                      {
                        '!text-[#ec4016]': reactionData.isLike,
                      },
                    )}
                    onClick={() => handleReactionGame('like')}
                  >
                    <Heart variant="Bold" size={20} />
                    <span className="text-[12px]">{0}</span>
                  </div>
                ) : (
                  <div className="w-[49px] flex items-center justify-center">
                    <ReactLoading type={'balls'} color={'white'} width={20} height={20} />
                  </div>
                )} */}
                <div
                  role="button"
                  className="dark:hover:bg-gray-700 dark:hover:text-white hover:bg-[#f5f6fa] hover:text-black rounded p-2"
                  onClick={() => setOpenShareGame(true)}
                >
                  <Send2 size={20} variant="Bold" />
                </div>
              </div>
              <div className="text-[#929395] flex gap-[20px] items-center">
                <Tooltip
                  message="Fairness"
                  children={
                    <div
                      role="button"
                      className="dark:hover:bg-gray-700 dark:hover:text-white hover:bg-[#f5f6fa] hover:text-black rounded p-2"
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
                      className="dark:hover:bg-gray-700 dark:hover:text-white hover:bg-[#f5f6fa] hover:text-black rounded p-2"
                    >
                      <Image alt="" src={'/img/hierarchy.png'} width={18} height={18} />
                    </div>
                  }
                />

                <div
                  role="button"
                  className="dark:hover:bg-gray-700 dark:hover:text-white hover:bg-[#f5f6fa] hover:text-black rounded p-2"
                >
                  <Image alt="" src={'/img/monitor.png'} width={18} height={18} />
                </div>
                <div
                  role="button"
                  className="dark:hover:bg-gray-700 dark:hover:text-white hover:bg-[#f5f6fa] hover:text-black rounded p-2"
                  onClick={() => {
                    gameScreen.enter();
                  }}
                >
                  <Image alt="" src={'/img/expand.png'} width={18} height={18} />
                </div>
              </div>
            </div>
          </div>

          {gameDetail.id && (
            <div>
              <ul className="flex justify-center gap-[8px] w-fit rounded-full md:text-[13px] text-[11px] font-semibold p-[8px] md:pt-[16px] mb-[20px] md:mb-[25px] max-w-full">
                <div
                  role="button"
                  onClick={() => setTab(1)}
                  className={`${
                    tab === 1
                      ? 'dark:text-white dark:bg-[#2D3035] text-black bg-[#e3ecf3] font-semibold'
                      : 'dark:hover:text-white dark:bg-[#1D1E22] dark:text-[rgba(255,255,255,0.5)] text-[#31373D] bg-white hover:bg-[#EAECF3]'
                  } inline-block text-center min-w-[100px] p-[10px] rounded-[5px] truncate`}
                >
                  {gameDetail.title}
                </div>
                <div
                  role="button"
                  onClick={() => setTab(2)}
                  className={`${
                    tab === 2
                      ? 'dark:text-white dark:bg-[#2D3035] text-black bg-[#e3ecf3] font-semibold'
                      : 'dark:hover:text-white dark:bg-[#1D1E22] dark:text-[rgba(255,255,255,0.5)] text-[#31373D] bg-white hover:bg-[#EAECF3]'
                  } inline-block text-center min-w-[100px] p-[10px] rounded-[5px] truncate`}
                >
                  {t('gameDetail:description')}
                </div>
                <div
                  role="button"
                  onClick={() => setTab(3)}
                  className={`${
                    tab === 3
                      ? 'dark:text-white dark:bg-[#2D3035] text-black bg-[#e3ecf3] font-semibold'
                      : 'dark:hover:text-white dark:bg-[#1D1E22] dark:text-[rgba(255,255,255,0.5)] text-[#31373D] bg-white hover:bg-[#EAECF3]'
                  } inline-block text-center min-w-[100px] p-[10px] rounded-[5px] truncate`}
                >
                  {t('gameDetail:reviews')}
                </div>
              </ul>
              {
                <div className={cn({ hidden: tab !== 1 })}>
                  <GameDetailComponent gameDetail={gameDetail} gameProvider={providerDetail} />
                </div>
              }
              {
                <div className={cn({ hidden: tab !== 2 })}>
                  <GameDescriptionComponent gameDetail={gameDetail} />
                </div>
              }
              {
                <div className={cn({ hidden: tab !== 3 })}>
                  <GameReviewComponent gameDetail={gameDetail} gameProvider={providerDetail} />
                </div>
              }
            </div>
          )}
        </div>
      )}
      {isNotFoundGame && !isLoading && (
        <div
          className={cn(
            'aspect-[2] w-full my-[20px] text-[14px] dark:text-white text-black flex flex-col items-center justify-center gap-[20px]',
          )}
        >
          {t('gameDetail:theGameDoesNotExist')}
          <button
            type="button"
            className="truncate hover:bg-[red] text-white rounded-[5px] font-semibold bg-[#F61B4F] sm:py-[9px] py-[5px] px-5 sm:text-[14px] text-[12px] flex items-center gap-[10px]"
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
