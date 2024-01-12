import { StarIcon } from '@heroicons/react/24/solid';
import cn from 'classnames';
import { Heart, PlayCricle, Refresh, Send2 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import ReactLoading from 'react-loading';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import api from '@/api/api';
import { api_getGameDetail, api_getLatestBetsForGame, api_startGameDemo, api_startGameSession } from '@/api/game';
import { useTranslation } from '@/base/config/i18next';
import { CookieKey, ROUTER, TOAST_ENUM } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowDepositModal,
} from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum, GameListType, GameProviderDetail, GameReactionDetail } from '@/base/types/common';
import { GameCreateSessionRequest, GameDemoRequest } from '@/base/types/requestTypes';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import GameDescriptionComponent from '@/components/game/gameDescription';
import GameDetailComponent from '@/components/game/gameDetail';
import GameReviewComponent from '@/components/game/gameReview';
import BaseLayout from '@/components/layouts/base.layout';
import FiatHeader from '@/components/layouts/header/fiatHeader';
import ModalShareGame from '@/components/modal/shareGame/shareGame';

import styles from './index.module.scss';

type LaunchUrlTye = {
  gameUrl: string;
  strategy: string;
};

function GamePage() {
  const launchUrlRef = useRef<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState<boolean>(false);
  const [isLoadingLike, setIsLoadingLike] = useState<boolean>(false);
  const [isLoadingGame, setIsLoadingGame] = useState<boolean>(true);
  const [isSatisfied, setIsSatisfied] = useState<boolean>(true);
  const [launchUrl, setLaunchUrl] = useState<LaunchUrlTye | null>(null);
  const [gameDetail, setGameDetail] = useState<GameListType>({
    id: '',
    title: '',
    provider: '',
    identifier: '',
    payout: 0,
    multiplier: 0,
    description: '',
    releasedAt: '',
  });
  const [isNotFoundGame, setIsNotFoundGame] = useState<boolean>(false);
  const [openShareGame, setOpenShareGame] = useState<boolean>(false);
  const [reactionData, setReactionData] = useState<GameReactionDetail>({});
  const [providerDetail, setProviderDetail] = useState<GameProviderDetail | any>();
  const gameScriptRef = useRef<Node | null>(null);

  const [tab, setTab] = useState(1);

  const gameScreen = useFullScreenHandle();
  const { t } = useTranslation('');

  const { query, reload } = useRouter();
  const { gameId } = query;

  const dispatch = useDispatch();

  const { isLogin, localFiat, activeCurrency, balances, betHistory } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      activeCurrency: state.wallet.activeCurrency,
      balances: state.wallet.balances,
      isLogin: state.auth.isLogin,
      betHistory: state.game.betHistory,
    }),
    shallowEqual,
  );

  const balance = useMemo(() => {
    const tempBalances = [...balances];
    const selectedBalance = tempBalances.find((item) => item.symbolId === activeCurrency.id);
    return selectedBalance?.amount ?? 0;
  }, [balances, activeCurrency]);

  const handleGetGameDetail = async () => {
    try {
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
        allowedDemo: resGameDetail.data?.allowDemo,
      };
      setGameDetail(tempGameDetailData);
    } catch (error) {
      setIsNotFoundGame(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async () => {
    if (Number(balance) <= 0) {
      setIsSatisfied(false);
    } else {
      await handlePlayRequest();
    }
  };

  const handleFreePlay = async () => {
    try {
      const requestData: GameDemoRequest = {
        gameId: gameDetail.id,
      };
      const res = await api_startGameDemo(requestData);
      const lanuchGameOption: LaunchUrlTye = {
        gameUrl: res.data.gameUrl,
        strategy: res.data.strategy,
      };
      setLaunchUrl(lanuchGameOption);
    } catch (error) {}
  };

  const handlePlayRequest = async () => {
    try {
      setIsLoading(true);
      const requestData: GameCreateSessionRequest = {
        gameId: gameDetail.id,
        currencyType: 'crypto',
        currencyId: activeCurrency.id,
      };
      const res = await api_startGameSession(requestData);
      const lanuchGameOption: LaunchUrlTye = {
        gameUrl: res.data.gameUrl,
        strategy: res.data.strategy,
      };
      setLaunchUrl(lanuchGameOption);
      launchUrlRef.current = { ...lanuchGameOption };
    } catch (error) {
      toast.error('Game launch failed', { containerId: TOAST_ENUM.COMMON });
      setLaunchUrl(null);
      setIsLoadingGame(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentReactionGame = async () => {
    try {
      // const res = await api.get('game/get-total-reaction', { params: { gameIdentifier: gameDetail?.identifier } });
      // setReactionData(res.data);
    } catch {
      setReactionData((value) => value);
    }
  };

  const handleReactionGame = async (reaction: 'like' | 'favorite') => {
    try {
      if (reaction === 'like') {
        setIsLoadingLike(true);
      } else {
        setIsLoadingFavorite(true);
      }
      await api.post('game/reaction', {
        gameIdentifier: gameDetail?.identifier,
        userId: 6,
        reaction: reaction,
      });
      await handleCurrentReactionGame();
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

  const handleGameProvider = async () => {
    try {
      setIsLoading(true);
      // const res = await api.get('game/get-provider-detail', { params: { provider: gameDetail?.provider } });
      // setProviderDetail(res.data.data);
    } catch (error) {
      setProviderDetail({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (gameId) {
      setLaunchUrl(null);
      setIsLoadingGame(true);
      handleGetGameDetail();
    } else {
      setIsNotFoundGame(true);
    }
  }, [gameId]);

  useEffect(() => {
    if (gameDetail.identifier) {
      handleCurrentReactionGame();
      handleGameProvider();
    }
  }, [gameDetail]);

  useEffect(() => {
    try {
      if (!launchUrl) return;
      // Define the game launch options
      const list = document.getElementById('game_wrapper');
      if (list?.firstElementChild) {
        list?.removeChild(list?.firstElementChild);
      }

      const gameLaunchOptions = {
        target_element: 'game_wrapper',
        launch_options: {
          game_url: launchUrl.gameUrl,
          strategy: launchUrl.strategy,
        },
      };

      // Define success and error functions
      const success = async (gameDispatcher: any) => {
        console.log('gameDispatcher', gameDispatcher);
        setIsLoadingGame(false);
        // Handle success
        // ...
      };

      const error = (error: any) => {
        console.log('error', error);
        // Handle error
        // ...
      };

      // Load the game script and launch the game
      const script = document.createElement('script');
      script.src = 'https://casino.int.a8r.games/public/sg.js';
      script.async = true;
      script.onload = () => {
        window.sg.launch(gameLaunchOptions, success, error);
      };
      gameScriptRef.current = script;
      document.body.appendChild(script);
      // Cleanup function to remove the script when the component unmounts
      return () => {
        document.body.removeChild(script);
      };
    } catch (error) {
      console.log('error', error);
    }
  }, [launchUrl]);
  return (
    <>
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
            <FullScreen handle={gameScreen} className="aspect-[2] w-full mt-[20px]">
              <div
                id="game_wrapper"
                key={String(gameId)}
                className={cn('', styles.gameWrapper, {
                  'h-full': !isLoadingGame,
                  hidden: isLoadingGame,
                })}
              ></div>
              {isLoadingGame && (
                <div className="flex items-center justify-center rounded relative h-full">
                  <Image
                    src={`https://cdn.softswiss.net/b/${gameDetail.identifier.replace(':', '/')}.jpg`}
                    fill
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = '/img/game-background.png';
                    }}
                  />
                  <div className="h-full bg-black/80 w-full absolute"></div>
                  {isLoading && (
                    <div>
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 mr-2 text-gray-700 animate-spin fill-amber-500"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </div>
                  )}
                  {!isLoading && isLogin && (
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
                                className="truncate hover:bg-[red] text-white rounded-[5px] font-semibold bg-[#F61B4F] sm:py-[9px] sm:px-5 py-[5px] px-[5px] sm:text-[14px] text-[12px] flex items-center gap-[10px]"
                                onClick={() => handlePlay()}
                              >
                                <PlayCricle size={20} />
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
                              disabled={!gameDetail.allowedDemo}
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
                  {!isLoading && !isLogin && (
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
              )}
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
                        '!text-amber-400': reactionData.favorite,
                      },
                    )}
                    onClick={() => handleReactionGame('favorite')}
                  >
                    <StarIcon width={20} />
                    <span className="text-[12px]">{reactionData?.totalFavorite ?? 0}</span>
                  </div>
                ) : (
                  <div className="w-[49px] flex items-center justify-center">
                    <ReactLoading type={'balls'} color={'white'} width={20} height={20} />
                  </div>
                )}
                {!isLoadingLike ? (
                  <div
                    role="button"
                    className={cn(
                      'dark:hover:bg-gray-700 dark:text-[#929395] dark:hover:text-white hover:bg-[#f5f6fa] rounded p-2 flex gap-2 items-center',
                      {
                        '!text-[#ec4016]': reactionData?.liked,
                      },
                    )}
                    onClick={() => handleReactionGame('like')}
                  >
                    <Heart variant="Bold" size={20} />
                    <span className="text-[12px]">{reactionData?.totalLike ?? 0}</span>
                  </div>
                ) : (
                  <div className="w-[49px] flex items-center justify-center">
                    <ReactLoading type={'balls'} color={'white'} width={20} height={20} />
                  </div>
                )}
                <div
                  role="button"
                  className="dark:hover:bg-gray-700 dark:hover:text-white hover:bg-[#f5f6fa] hover:text-black rounded p-2"
                  onClick={() => setOpenShareGame(true)}
                >
                  <Send2 size={20} variant="Bold" />
                </div>
              </div>
              <div className="text-[#929395] flex gap-[20px] items-center">
                <div
                  role="button"
                  className="dark:hover:bg-gray-700 dark:hover:text-white hover:bg-[#f5f6fa] hover:text-black rounded p-2"
                >
                  <Image alt="" src={'/img/fairness.png'} width={18} height={18} />
                </div>
                <div
                  role="button"
                  className="dark:hover:bg-gray-700 dark:hover:text-white hover:bg-[#f5f6fa] hover:text-black rounded p-2"
                >
                  <Image alt="" src={'/img/hierarchy.png'} width={18} height={18} />
                </div>
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
      {isNotFoundGame && (
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
