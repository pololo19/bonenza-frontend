import cn from 'classnames';
import { EmptyWallet, HambergerMenu, Message, User } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_validateToken } from '@/api/auth';
import { api_getInitData } from '@/api/wallet';
// import { getExchangeRate } from '@/api/exchangeRate';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER, SOCKET_GAME_URL, SOCKET_WALLET_URL, TOAST_ENUM } from '@/base/constants/common';
import { headerMenus } from '@/base/constants/config-menus';
import { useWidth } from '@/base/hooks/useWidth';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo } from '@/base/libs/utils';
import { initialSocketConnection } from '@/base/libs/utils/socket-helpers';
import { logoutState, saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { changeIsLoading, setIsNewMessage, setLastMessage } from '@/base/redux/reducers/common.reducer';
import { addBetHistory, setBetHistory } from '@/base/redux/reducers/game.reducer';
import {
  changeIsShowAccountPannel,
  changeIsShowAuthenticationModal,
  changeIsShowBonusDetail,
  changeIsShowBonusHistory,
  changeIsShowCasinoSearch,
  changeIsShowChatRule,
  changeIsShowCryptoOnlineModal,
  changeIsShowDepositModal,
  changeIsShowDepositProgress,
  changeIsShowDepositRule,
  changeIsShowDetailBets,
  changeIsShowInformation,
  changeIsShowLogOutConfirm,
  changeIsShowMenuPannel,
  changeIsShowMultiLanguageModal,
  changeIsShowQuest,
  changeIsShowRakeBack,
  changeIsShowRakeBackDetail,
  changeIsShowReferAndEarn,
  changeIsShowResetPassword,
  changeIsShowSelfExclusion,
  changeIsShowSpin,
  changeIsShowUpdateAvatar,
  changeIsShowUpdateInformation,
  changeIsShowVerifyMailAndPhone,
  changeIsShowVipClubModal,
  changeIsShowVipLevelModal,
  changeIsShowWagerContestHistory,
  changeShowChatType,
  changeShowFullChat,
  changeToggleSidebar,
} from '@/base/redux/reducers/modal.reducer';
import { setGameSocket, setSocket } from '@/base/redux/reducers/socket.reducer';
import {
  addDepositTime,
  getBalance,
  initWalletInfo,
  logoutWallet,
  setActiveTransactionStatus,
  setFiatSymbols,
  setLocalFiat,
  updateBalance,
  updateCryptoPrice,
  updatedFiatPrice,
} from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { BetTableDataType, FiatType, MessageType } from '@/base/types/common';
import { CurrencyType, PriceUpdateType } from '@/base/types/wallet';
import ScrollToTop from '@/components/scrollToTop/ScrollToTop';

import ChattingComponent from '../chatting/chattingComponent';
import Loader from '../common/preloader/loader';
import HomeIconOutline from '../icons/HomeIconOutline';
import LoginGoogleOneTap from '../loginGoogleOneTap/loginGoogleOneTap';
import ModalAuthentication from '../modal/authentication/authenticationModal';
import ModalBonusDetail from '../modal/bonusDetails/bonusDetails';
import ModalCasinoSearch from '../modal/casinoSearch/casinoSearch';
import ModalChatRules from '../modal/chatRules/chatRules';
import ModalCryptoOnline from '../modal/cryptoOnlineCasino/cryptoOnlineCasino';
import ModalDepositBonusRules from '../modal/depositBonusRules/depositBonusRules';
import ModalDeposit from '../modal/depositModal/depositModal';
import ModalDepositProgress from '../modal/depositModal/depositProgress';
import ModalDetailBets from '../modal/detailBets/detailBets';
import ModalLogOutConfirm from '../modal/logOutConfirm/LogOutConfirm';
import ModalMultiLanguage from '../modal/multiLanguage/MultiLanguage';
import ModalProfile from '../modal/profile/profile';
import ModalQuest from '../modal/quest/quest';
import ModalBonusHistory from '../modal/rakeBack/bonusHistory/bonusHistory';
import ModalRakeBack from '../modal/rakeBack/rakeBack';
import ModalRakeBackDetail from '../modal/rakeBack/rakeBackDetail/rakeBackDetail';
import ModalReferAndEarn from '../modal/referAndEarn/referAndEarn';
import ModalResetPassword from '../modal/resetPassword/resetPassword';
import ModalSelfExclusion from '../modal/selfExclusion/selfExclusion';
import ModalSpin from '../modal/spin/spin';
import ModalUpdateAvatar from '../modal/updateAvatar/updateAvatar';
import ModalUpdateProfile from '../modal/updateProfile/updateProfile';
import ModalVerificationMailAndPhone from '../modal/verification/verifyEmailAndPhone';
import ModalVipClub from '../modal/vipClub/vipClub';
import ModalVipLevel from '../modal/vipLevel/vipLevel';
import ModalWagerContestHistory from '../modal/wagerContestHistory/wagerContestHistory';
import AccountPannel from './accountBar.layout';
import Footer from './footer.layout';
import HeaderStats from './header.layout';
import SidebarMobileLayout from './sidebarMobile.layout';
import SidebarToggle from './sidebarToggle.layout';
import SubMobileMenu from './submobileMenu';
import WrapperBody from './wapperBody';

type BaseLayoutProps = {
  children: JSX.Element;
  isDetailPage?: boolean;
  contentClass?: string;
};

const activeHrefsToMobileSubMenu = [ROUTER.Home, ROUTER.Casino, ROUTER.Tagname('')];

const BaseLayout: React.FC<BaseLayoutProps> = ({ children, isDetailPage, contentClass }) => {
  const innerWidth = useWidth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation('');

  const [newBetData, setNewBetData] = useState<BetTableDataType>({
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
  const [isShowMobileSubMenu, setIsShowMobileSubMenu] = useState<boolean>(true);
  const [cryptoLocked, setCryptoLocked] = useState<FiatType>({});
  const baseBodyRef = useRef<HTMLDivElement>(null);
  const showChatTypeRef = useRef<boolean>(false);
  const { query } = router;
  const { gameId } = query;

  const walletServiceConnectedRef = useRef(true);
  const gameServiceConnectedRef = useRef(true);

  useEffect(() => {
    dispatch(changeIsShowMenuPannel(false));
    dispatch(changeIsShowAccountPannel(false));
    dispatch(changeIsShowCasinoSearch(false));
    if (activeHrefsToMobileSubMenu.some((path) => router.route.includes(path))) {
      setIsShowMobileSubMenu(true);
    } else {
      setIsShowMobileSubMenu(false);
    }
  }, [router.route]);

  const {
    isLogin,
    isShowInformation,
    isShowReferAndEarn,
    isShowUpdateInformation,
    isShowMultiLanguage,
    isShowAuthenticationModal,
    showChatType,
    isToggleSidebar,
    showFullChat,
    isShowDepositModal,
    isShowVipClubModal,
    isShowVipLevelModal,
    isShowCryptoOnlineModal,
    isShowUpdateAvatar,
    isShowResetPassword,
    isShowRakeBackModal,
    isShowRakeBackDetailModal,
    isShowModalBonusHistory,
    isShowAccount,
    isShowSidebar,
    isShowCasinoSearch,
    isShowVerifyMailAndPhone,
    isShowLogOutConfirm,
    isShowDetailBets,
    verifyModeType,
    isShowWagerContestHistory,
    isShowDepositProgress,
    cryptoArray,
    userId,
    walletSocket,
    gameSocket,
    betHistory,
    fiatSymbols,
    cryptoSymbols,
    isShowSpin,
    isShowQuest,
    isShowChatRule,
    isShowBonusDetail,
    isShowDepositRule,
    isShowSelfExclusion,
    isLoading,
  } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
      isShowInformation: state.modal.isShowInformation,
      isShowReferAndEarn: state.modal.isShowReferAndEarn,
      isShowUpdateInformation: state.modal.isShowUpdateInformation,
      isShowMultiLanguage: state.modal.isShowMultiLanguage,
      isShowAuthenticationModal: state.modal.isShowAuthenticationModal,
      isShowForgotPassModal: state.modal.isShowForgotPassModal,
      showChatType: state.modal.showChatType,
      isToggleSidebar: state.modal.isToggleSidebar,
      showFullChat: state.modal.showFullChat,
      isShowDepositModal: state.modal.isShowDepositModal,
      isShowVipClubModal: state.modal.isShowVipClubModal,
      isShowVipLevelModal: state.modal.isShowVipLevelModal,
      isShowRakeBackModal: state.modal.isShowRakeBackModal,
      isShowModalBonusHistory: state.modal.isShowModalBonusHistory,
      isShowRakeBackDetailModal: state.modal.isShowRakeBackDetailModal,
      isShowCryptoOnlineModal: state.modal.isShowCryptoOnlineModal,
      isShowUpdateAvatar: state.modal.isShowUpdateAvatar,
      isShowResetPassword: state.modal.isShowResetPassword,
      isShowCasinoSearch: state.modal.isShowCasinoSearch,
      isShowVerifyMailAndPhone: state.modal.isShowVerifyMailAndPhone,
      isShowLogOutConfirm: state.modal.isShowLogOutConfirm,
      verifyModeType: state.modal.verifyModeType,
      isShowWagerContestHistory: state.modal.isShowWagerContestHistory,
      isShowChatRule: state.modal.isShowChatRule,

      isLoading: state.common.isLoading,
      isShowSidebar: state.modal.isShowMenuPannel,
      isShowAccount: state.modal.isShowAccountPannel,
      userId: state.auth.user.userId,
      cryptoArray: state.common.cryptoArray,
      fiatSymbols: state.wallet.fiatSymbols,
      cryptoSymbols: state.wallet.symbols,
      walletSocket: state.socket.walletSocket,
      gameSocket: state.socket.gameSocket,
      depositTime: state.wallet.depositTime,
      betHistory: state.game.betHistory,
      isShowSpin: state.modal.isShowSpin,
      isShowQuest: state.modal.isShowQuest,
      isShowDepositProgress: state.modal.isShowDepositProgress,
      isShowDetailBets: state.modal.isShowDetailBets,
      isShowBonusDetail: state.modal.isShowBonusDetail,
      isShowDepositRule: state.modal.isShowDepositRule,
      isShowSelfExclusion: state.modal.isShowSelfExclusion,
    }),
    shallowEqual,
  );

  const loadInitData = async () => {
    try {
      // setIsLoading(true);
      const res = await api_getInitData();
      const tempFiatSymbols: CurrencyType[] =
        res.data?.fiatSymbols?.map((item: any) => ({
          id: item?.id ?? '',
          name: item?.symbol ?? 'USDT',
          alias: item?.name ?? '',
          logo: `/img/fiats/${item?.symbol ?? 'USDT'}.png`,
          iso_currency: item?.iso_currency ?? '',
          iso_decimals: item?.iso_decimals ?? 0,
          availableNetworks: item?.availableNetworks || [],
          price: Number(item.price),
        })) || [];
      dispatch(setFiatSymbols(tempFiatSymbols));
    } catch (error) {
      dispatch(setFiatSymbols([]));
    } finally {
      // setIsLoading(false);
    }
  };

  const wrappedError = () => {
    dispatch(logoutState());
    dispatch(logoutWallet());
    CookiesStorage.logout();
    return new Promise((resolve) => {
      if (router.pathname !== ROUTER.Home) {
        router.replace(ROUTER.Home);
      }
      resolve(true);
    });
  };

  const connectAccount = async () => {
    try {
      const accessToken = CookiesStorage.getAccessToken();
      dispatch(changeIsLoading(true));
      if (accessToken) {
        const res = await api_validateToken(accessToken);
        if (!walletSocket?.connected) {
          const newSocket = await initialSocketConnection(SOCKET_WALLET_URL ?? '');
          dispatch(setSocket(newSocket));
        }
        const localFiat: CurrencyType = {
          id: res.data.settingFiatCurrency.id ?? '',
          name: res.data.settingFiatCurrency.symbol ?? '',
          alias: res.data.settingFiatCurrency.name ?? '',
          logo: `/img/fiats/${res.data.settingFiatCurrency.symbol}.png`,
          iso_currency: res.data.settingFiatCurrency.iso_currency,
          iso_decimals: res.data.settingFiatCurrency.iso_decimals,
          availableNetworks: [],
          price: Number(res.data.settingFiatCurrency.price),
          type: 'fiat',
          favorite: res.data.settingFiatCurrency.favorite,
        };
        i18n.changeLanguage(res.data?.settingLanguage ?? 'en');
        dispatch(saveUserInfo({ ...convertUserInfo(res.data) }));
        dispatch(initWalletInfo());
        dispatch(setLocalFiat(localFiat));
      } else {
        await loadInitData();
      }
    } catch (error) {
      // wrappedError();
      await loadInitData();
    } finally {
      dispatch(changeIsLoading(false));
    }
  };

  useEffect(() => {
    const gameConnect = async () => {
      // game socket is connected without auth
      if (!gameSocket?.connected) {
        const newGameSocket = await initialSocketConnection(SOCKET_GAME_URL ?? '');
        dispatch(setGameSocket(newGameSocket));
      }
    };
    gameConnect();

    if (innerWidth < 1280) {
      dispatch(changeToggleSidebar(false));
    } else {
      dispatch(changeToggleSidebar(true));
    }
  }, [innerWidth]);

  useEffect(() => {
    if (!isLogin) {
      connectAccount();
      // getBonus();
    }
    // handleGet();
  }, [isLogin]);

  useEffect(() => {
    if (walletSocket && isLogin) {
      walletSocket.on(`${userId}:deposit`, (data: any) => {
        // const data = JSON.parse(item);
        const status = data?.status || '';
        const amount = data?.amount || 0;
        const amountUsd = data?.amount_usd || 0;
        const symbol = data?.symbol || 'USDT';
        const hash = data?.hash || '0x';
        const time = new Date();
        const id = data?.transaction_id || '0';
        const network = data?.network || '';

        switch (status) {
          case 'Processing':
            toast.success(t('deposit:depositprogress'), { containerId: TOAST_ENUM.COMMON });
            dispatch(changeIsShowDepositProgress(true));
            dispatch(
              setActiveTransactionStatus({
                id,
                status: 0,
                amount,
                amountUsd,
                symbol,
                hash,
                time,
                network,
              }),
            );
            dispatch(getBalance());
            break;
          case 'Complete':
            toast.success(`${t('deposit:depositComplete')} ${amount} ${symbol}`, {
              containerId: TOAST_ENUM.COMMON,
            });
            dispatch(changeIsShowDepositProgress(true));
            dispatch(
              setActiveTransactionStatus({
                id,
                status: 1,
                amount,
                amountUsd,
                symbol,
                hash,
                time,
                network,
              }),
            );
            dispatch(getBalance());
            dispatch(addDepositTime(1));
            break;

          default:
            break;
        }
      });

      walletSocket.on(`${userId}:withdraw`, (data: any) => {
        const status = data?.status || '';
        switch (status) {
          case 'Processing':
            setTimeout(() => {
              toast.success(`Withdrawal is in progress`, { containerId: TOAST_ENUM.COMMON });
              dispatch(
                setActiveTransactionStatus({
                  id: data?.id || '',
                  status: 0,
                  amount: data?.amount || 0,
                  amountUsd: data?.amount || 0,
                  symbol: data?.symbol || '',
                  hash: '',
                  time: new Date(),
                  network: '',
                }),
              );
              dispatch(getBalance());
            }, 2000);

            break;
          case 'Complete':
            setTimeout(() => {
              toast.success(`Withdrawal Successful`, { containerId: TOAST_ENUM.COMMON });
              dispatch(
                setActiveTransactionStatus({
                  id: data?.id || '',
                  status: 1,
                  amount: data?.amount || 0,
                  amountUsd: data?.amount || 0,
                  symbol: data?.symbol || '',
                  hash: '',
                  time: new Date(),
                  network: '',
                }),
              );
              dispatch(getBalance());
            }, 2500);
            break;

          default:
            break;
        }
      });

      // walletSocket.on(`connect_error`, (data: any) => {
      //   if (walletServiceConnectedRef.current) {
      //     toast.error('Network connection is not stable. Please refresh.', {
      //       containerId: TOAST_ENUM.COMMON,
      //       autoClose: false,
      //       position: 'top-center',
      //     });
      //     walletServiceConnectedRef.current = false;
      //   }
      // });
    }

    return () => {
      if (walletSocket) {
        walletSocket.off(`${userId}:deposit`);
        walletSocket.off(`${userId}:withdraw`);
        // walletSocket.off(`connect_error`);
      }
    };
  }, [walletSocket, isLogin, userId]);

  useEffect(() => {
    if (gameSocket) {
      gameSocket.on(`bets`, (item: any) => {
        const data = JSON.parse(item);
        const tempData: BetTableDataType = {
          game: data.game_name ?? '',
          gameIdenfiter: data.game_identifier ?? '',
          player: data.player_name ?? '',
          playerId: data.player_id ?? '',
          playerAvatar: data.playerAvatar ?? '',
          betAmount: Number(data.bet_amount || 0),
          betAmountUsd: Number(data.bet_amount_usd || 0),
          multiplier: Number(data.multiplier || 0),
          profitAmount: Number(data.profit_amount || 0),
          profitAmountUsd: Number(data.profit_amount_usd || 0),
          currency: data.currency ?? 'USDT',
          betId: data.id ?? '',
          time: data.time ?? new Date(),
        };
        setNewBetData(tempData);
      });

      if (isLogin) {
        gameSocket.on(`${userId}:balance`, (item: string) => {
          const data = JSON.parse(item);
          const currencyType = data.currency_type;
          dispatch(
            updateBalance({
              amount: Number(data.balance || 0),
              symbol: data.currency,
              symbolId: data.currency_id,
            }),
          );
        });
      }

      gameSocket.on(`prices`, (item: string) => {
        const data = JSON.parse(item);
        const cryptoDatas: PriceUpdateType[] =
          data?.cryptocurrency?.map((item: any) => ({
            id: item.id,
            price: item.price,
          })) || [];

        const fiatDatas: PriceUpdateType[] =
          data?.fiat?.map((item: any) => ({
            id: item.id,
            price: item.price,
          })) || [];

        dispatch(updatedFiatPrice(fiatDatas));
        dispatch(updateCryptoPrice(cryptoDatas));
      });

      gameSocket.on('chat', (data: any) => {
        try {
          const msgData = JSON.parse(data);
          const tempIncomingMesssage: MessageType = {
            id: msgData?.id ?? '',
            userId: msgData?.user_id ?? '',
            userName: msgData?.user_name ?? '',
            userAvatar: msgData?.user_avatar ?? '',
            level: msgData?.user_vip_level ?? '',
            time: msgData?.time ?? '',
            text: msgData?.text ?? '',
          };
          if (showChatTypeRef.current) {
            CookiesStorage.setCookieData('last_message', msgData.id);
            dispatch(setIsNewMessage(false));
          } else {
            dispatch(setIsNewMessage(true));
          }
          dispatch(setLastMessage({ ...tempIncomingMesssage }));
        } catch (error) {
          console.log(error, 'chat error');
        }
      });

      // gameSocket.on(`connect_error`, (data: any) => {
      //   if (gameServiceConnectedRef.current) {
      //     toast.error('Network connection is not stable. Please refresh.', {
      //       containerId: TOAST_ENUM.COMMON,
      //       autoClose: false,
      //       position: 'top-center',
      //     });
      //     gameServiceConnectedRef.current = false;
      //   }
      // });
    }

    return () => {
      if (gameSocket) {
        gameSocket.off(`bets`);
        gameSocket.off('prices');
        if (isLogin) {
          gameSocket.off(`${userId}:balance`);
        }
        gameSocket.off('chat');
      }
    };
  }, [gameSocket, isLogin, userId]);

  useEffect(() => {
    showChatTypeRef.current = showChatType;
  }, [showChatType]);

  useEffect(() => {
    if (router.query['forgot-pass-token']) {
      dispatch(changeIsShowResetPassword(true));
    }
    baseBodyRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [router]);

  useEffect(() => {
    cryptoArray && setCryptoLocked(cryptoArray[0]);
  }, [cryptoArray]);

  useEffect(() => {
    if (newBetData.betId) {
      let preBetDatas = [...betHistory];
      if (preBetDatas.findIndex((item) => item.betId === newBetData.betId) !== -1) {
        const upBetDatas = preBetDatas.map((item) => {
          if (item.betId === newBetData.betId) {
            return { ...newBetData };
          } else {
            return { ...item };
          }
        });
        dispatch(setBetHistory(upBetDatas));
      } else {
        dispatch(addBetHistory(newBetData));
      }
    }
  }, [newBetData]);

  return (
    <>
      {isLoading && <Loader isHomePage />}
      <div className="min-h-screen h-full w-full overflow-hidden font-dayOne dark:bg-color-bg-primary bg-color-light-bg-primary">
        {isToggleSidebar && (
          <div
            className="xl:hidden sm:block hidden fixed xl:w-0 w-[calc(100vw)] h-screen right-0  dark:bg-black/60 z-[20]"
            onClick={() => dispatch(changeToggleSidebar(!isToggleSidebar))}
          ></div>
        )}
        <div className="md:pt-0 h-full w-full relative">
          <HeaderStats />
          <div className="flex h-full w-full max-h-[calc(100vh-70px)] mt-[70px] sm:flex-row flex-col">
            <div
              className={cn(
                'z-[50] dark:bg-color-bg-primary bg-[#fff] sm:block hidden h-[calc(100vh)] mt-[-70px] border-solid border-[1px] border-color-bg-primary border-r-color-card-body-primary drop-shadow-lg shadow-bs-default',
                {
                  'xl:relative fixed': isToggleSidebar,
                },
              )}
            >
              <SidebarToggle />
            </div>
            <div
              className={cn(
                'w-full overflow-y-auto flex-1 bg-color-light-bg-primary dark:bg-color-bg-primary flex flex-col relative',
              )}
              ref={baseBodyRef}
              id="base-layout"
            >
              <SubMobileMenu datas={headerMenus} isShow={isShowMobileSubMenu} />

              <WrapperBody
                id="wrapperBody"
                contentClassName={cn(contentClass)}
                wrapperClassName={cn({
                  hidden: isShowSidebar || isShowAccount,
                  block: !isShowSidebar && !isShowAccount,
                  'pointer-events-none': isShowCasinoSearch,
                })}
              >
                {children}
              </WrapperBody>
              <WrapperBody
                id="wrapperfooter"
                wrapperClassName="min-[1786px]:max-w-full"
                contentClassName={cn('sm:block', {
                  hidden: isShowSidebar || isShowAccount,
                  block: !isShowSidebar && !isShowAccount,
                  'pointer-events-none': isShowCasinoSearch,
                })}
              >
                <Footer isDetailPage={isDetailPage} />
              </WrapperBody>
              {isShowCasinoSearch && (
                <ModalCasinoSearch
                  show={isShowCasinoSearch}
                  onClose={() => {
                    dispatch(changeIsShowCasinoSearch(false));
                  }}
                />
              )}
              <ScrollToTop />
            </div>

            {showChatType && (
              <div
                className={cn(
                  '2xl:relative fixed right-0 h-[calc(100vh)] mt-[-70px] z-10 duration-500 drop-shadow-md transition-opacity',
                  {
                    'opacity-100': showChatType,
                    'opacity-0': !showChatType,
                    'w-full': showFullChat,
                  },
                )}
              >
                <ChattingComponent />
              </div>
            )}

            {/*Start footer navigator */}
            <SidebarMobileLayout />
            <AccountPannel />
            <div
              className={cn(
                'text-gray-400 sm:hidden block fixed z-50 w-screen h-[60px] dark:bg-color-card-bg-primary bg-[#f5f6fa] shadow-[17px_9px_17px_0px_#00000040] border border-gray-200 bottom-0',
                {
                  hidden: showChatType,
                },
              )}
            >
              <div className="w-full h-full flex gap-[5px] items-center justify-evenly text-[12px] relative">
                <div
                  role="button"
                  onClick={() => {
                    dispatch(changeIsShowMenuPannel(!isShowSidebar));
                    if (!isShowSidebar) {
                      setIsShowMobileSubMenu(true);
                      dispatch(changeIsShowAccountPannel(false));
                    }
                    if (isShowSidebar) {
                      if (activeHrefsToMobileSubMenu.some((path) => router.route.includes(path))) {
                        setIsShowMobileSubMenu(true);
                      } else {
                        setIsShowMobileSubMenu(false);
                      }
                    }
                  }}
                  className={cn(
                    'flex-1 min-w-[calc(20%-4px)] flex flex-col items-center justify-between h-full rounded',
                    {
                      'text-color-text-primary': !isShowSidebar,
                      'dark:!text-white !text-color-light-text-primary': isShowSidebar,
                    },
                  )}
                >
                  <div className="pt-2">
                    <HambergerMenu size={22} />
                  </div>
                  <div className="pb-2  text-center truncate w-full">{t('sidebar:menu')}</div>
                </div>
                <Link
                  href={ROUTER.Home}
                  className={cn(
                    'flex-1 min-w-[calc(20%-4px)] flex flex-col items-center justify-between h-full rounded',
                    {
                      'text-color-text-primary': !router.route.includes(ROUTER.Home),
                      'dark:!text-white !text-black': router.route.includes(ROUTER.Home),
                    },
                  )}
                  onClick={() => {
                    dispatch(changeIsShowAccountPannel(false));
                    dispatch(changeIsShowMenuPannel(false));
                  }}
                >
                  <div className="pt-2">
                    <HomeIconOutline className="w-[21px] h-[21px]" size={22} />
                  </div>
                  <div className="pb-2 text-center truncate w-full">{t('layout:home')}</div>
                </Link>
                <Link
                  href={ROUTER.DepositCrypto}
                  className={cn(
                    'flex-1 min-w-[calc(20%-4px)] flex flex-col items-center justify-between h-full rounded relative',
                    {
                      'text-color-text-primary': !router.route.includes(ROUTER.DepositCrypto),
                      'dark:!text-white !text-black': router.route.includes(ROUTER.DepositCrypto),
                    },
                  )}
                  onClick={() => {
                    dispatch(changeIsShowAccountPannel(false));
                    dispatch(changeIsShowMenuPannel(false));
                  }}
                >
                  <div className="h-[48px] w-[60px] rounded-[50%] dark:bg-color-card-bg-primary bg-[#f5f6fa] absolute top-[-15px] left-1/2 transform -translate-x-1/2 p-2">
                    <div className="m-auto h-[38px] w-[38px] dark:bg-color-hover-primary rounded-full bg-color-light-hover-primary text-white flex items-center justify-center">
                      <EmptyWallet className="dark:text-white text-color-text-primary" variant="Bold" size={22} />
                    </div>
                  </div>
                  <div className="pt-2 opacity-0">
                    <EmptyWallet className="dark:text-white text-color-text-primary" variant="Bold" size={22} />
                  </div>
                  <div className="pb-2 dark:text-color-text-primary text-color-text-primary text-center truncate w-full">
                    {t('sidebar:wallet')}
                  </div>
                </Link>
                <div
                  role="button"
                  onClick={() => {
                    dispatch(changeIsShowAccountPannel(!isShowAccount));
                    if (!isShowAccount) {
                      dispatch(changeIsShowMenuPannel(false));
                      setIsShowMobileSubMenu(false);
                    } else {
                      if (activeHrefsToMobileSubMenu.some((path) => router.route.includes(path))) {
                        setIsShowMobileSubMenu(true);
                      } else {
                        setIsShowMobileSubMenu(false);
                      }
                    }
                  }}
                  className={cn(
                    'flex-1 min-w-[calc(20%-4px)] flex flex-col items-center justify-between h-full rounded ',
                    {
                      'dark:!text-white !text-black': isShowAccount,
                      'text-color-text-primary': !isShowAccount,
                    },
                  )}
                >
                  <div className="pt-2">
                    <User size={22} />
                  </div>
                  <div className="pb-2 text-center truncate w-full">{t('sidebar:account')}</div>
                </div>
                <div
                  role="button"
                  className={cn(
                    'flex-1 min-w-[calc(20%-4px)] flex flex-col items-center justify-between h-full rounded',
                  )}
                  onClick={() => {
                    dispatch(changeIsShowAccountPannel(false));
                    dispatch(changeIsShowMenuPannel(false));
                    dispatch(changeShowChatType(!showChatType));
                    dispatch(changeShowFullChat(!showFullChat));
                  }}
                >
                  <div className="pt-2">
                    <Message className="dark:text-color-text-primary text-color-text-primary" size={22} />
                  </div>
                  <div className="pb-2 dark:text-color-text-primary text-color-text-primary text-center truncate w-full">
                    {t('sidebar:chat')}
                  </div>
                </div>
              </div>
            </div>
            {/* End footer navigator */}
          </div>
        </div>
      </div>

      {/* Modal */}
      <ModalProfile show={isShowInformation || false} onClose={() => dispatch(changeIsShowInformation(false))} />

      <ModalReferAndEarn show={isShowReferAndEarn || false} onClose={() => dispatch(changeIsShowReferAndEarn(false))} />

      <ModalUpdateProfile
        show={isShowUpdateInformation || false}
        onClose={() => dispatch(changeIsShowUpdateInformation(false))}
      />

      <ModalUpdateAvatar show={isShowUpdateAvatar || false} onClose={() => dispatch(changeIsShowUpdateAvatar(false))} />

      <ModalMultiLanguage
        show={isShowMultiLanguage || false}
        onClose={() => dispatch(changeIsShowMultiLanguageModal(false))}
      />

      <ModalAuthentication
        show={isShowAuthenticationModal || false}
        onClose={() => dispatch(changeIsShowAuthenticationModal(false))}
      />

      <ModalVipClub
        show={isShowVipClubModal || false}
        onClose={() => {
          dispatch(changeIsShowVipClubModal(false));
        }}
      />

      <ModalRakeBack
        show={isShowRakeBackModal || false}
        onClose={() => {
          dispatch(changeIsShowRakeBack(false));
        }}
        setShowModalRakeBackDetail={() => dispatch(changeIsShowRakeBackDetail(true))}
        setShowModalBonusHistory={() => dispatch(changeIsShowBonusHistory(true))}
      />

      <ModalRakeBackDetail
        show={isShowRakeBackDetailModal || false}
        cryptoLocked={cryptoLocked}
        onClose={() => {
          dispatch(changeIsShowRakeBackDetail(false));
        }}
        setShowModalRakeBack={() => dispatch(changeIsShowRakeBack(true))}
      />

      <ModalBonusHistory
        show={isShowModalBonusHistory || false}
        cryptoLocked={cryptoLocked}
        onClose={() => {
          dispatch(changeIsShowBonusHistory(false));
        }}
        setShowModalRakeBack={() => dispatch(changeIsShowRakeBack(true))}
      />

      <ModalVipLevel
        show={isShowVipLevelModal || false}
        onClose={() => {
          dispatch(changeIsShowVipLevelModal(false));
          dispatch(changeIsShowVipClubModal(true));
        }}
      />

      <ModalDeposit show={isShowDepositModal || false} onClose={() => dispatch(changeIsShowDepositModal(false))} />

      <ModalCryptoOnline
        show={isShowCryptoOnlineModal || false}
        onClose={() => {
          dispatch(changeIsShowCryptoOnlineModal(false));
        }}
      />
      <ModalResetPassword
        show={isShowResetPassword || false}
        onClose={() => {
          dispatch(changeIsShowResetPassword(false));
          router.replace(ROUTER.Home);
        }}
      />
      <ModalVerificationMailAndPhone
        show={isShowVerifyMailAndPhone || false}
        onClose={() => {
          dispatch(changeIsShowVerifyMailAndPhone(false));
        }}
      />
      <ModalWagerContestHistory
        show={isShowWagerContestHistory || false}
        onClose={() => dispatch(changeIsShowWagerContestHistory(false))}
      />
      <ModalDepositProgress
        show={isShowDepositProgress || false}
        onClose={() => dispatch(changeIsShowDepositProgress(false))}
      />
      {isLogin && (
        <ModalLogOutConfirm
          show={isShowLogOutConfirm || false}
          onClose={() => dispatch(changeIsShowLogOutConfirm(false))}
        />
      )}
      {isShowDetailBets && (
        <ModalDetailBets show={isShowDetailBets || false} onClose={() => dispatch(changeIsShowDetailBets(false))} />
      )}
      {/* Google One Tap */}
      {!isLogin && <LoginGoogleOneTap key={String(isLogin)} />}
      <ModalSpin show={isShowSpin || false} onClose={() => dispatch(changeIsShowSpin(false))} />
      <ModalQuest show={isShowQuest || false} onClose={() => dispatch(changeIsShowQuest(false))} />
      <ModalChatRules
        show={isShowChatRule || false}
        onClose={() => {
          dispatch(changeIsShowChatRule(false));
        }}
      />
      <ModalBonusDetail show={isShowBonusDetail || false} onClose={() => dispatch(changeIsShowBonusDetail(false))} />
      <ModalDepositBonusRules
        show={isShowDepositRule || false}
        onClose={() => dispatch(changeIsShowDepositRule(false))}
      />
      <ModalSelfExclusion
        show={isShowSelfExclusion || false}
        onClose={() => dispatch(changeIsShowSelfExclusion(false))}
      />
    </>
  );
};

export default BaseLayout;
