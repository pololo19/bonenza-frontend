import cn from 'classnames';
import { ArrangeHorizontalCircle, EmptyWallet, HambergerMenu, Message, TrendUp } from 'iconsax-react';
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
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo } from '@/base/libs/utils';
import { convertToUrlCase } from '@/base/libs/utils/convert';
import { initialSocketConnection } from '@/base/libs/utils/socket-helpers';
import { logoutState, saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { addBetHistory } from '@/base/redux/reducers/game.reducer';
import {
  changeIsShowAuthenticationModal,
  changeIsShowBonusHistory,
  changeIsShowCropAvatar,
  changeIsShowCryptoOnlineModal,
  changeIsShowDepositModal,
  changeIsShowInformation,
  changeIsShowMultiLanguageModal,
  changeIsShowRakeBack,
  changeIsShowRakeBackDetail,
  changeIsShowReferAndEarn,
  changeIsShowResetPassword,
  changeIsShowUpdateAvatar,
  changeIsShowUpdateInformation,
  changeIsShowVipClubModal,
  changeIsShowVipLevelModal,
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
  setFiatSymbols,
} from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { BetTableDataType, FiatType } from '@/base/types/common';
import { CurrencyType } from '@/base/types/wallet';
import ScrollToTop from '@/components/scrollToTop/ScrollToTop';

import ChattingComponent from '../chatting/chattingComponent';
import Loader from '../common/preloader/loader';
import LoginGoogleOneTap from '../loginGoogleOneTap/loginGoogleOneTap';
import ModalAuthentication from '../modal/authentication/authenticationModal';
import ModalCropAvatar from '../modal/cropAvatar/cropAvatar';
import ModalCryptoOnline from '../modal/cryptoOnlineCasino/cryptoOnlineCasino';
import ModalDeposit from '../modal/depositModal/depositModal';
import ModalMultiLanguage from '../modal/multiLanguage/MultiLanguage';
import ModalProfile from '../modal/profile/profile';
import ModalBonusHistory from '../modal/rakeBack/bonusHistory/bonusHistory';
import ModalRakeBack from '../modal/rakeBack/rakeBack';
import ModalRakeBackDetail from '../modal/rakeBack/rakeBackDetail/rakeBackDetail';
import ModalReferAndEarn from '../modal/referAndEarn/referAndEarn';
import ModalResetPassword from '../modal/resetPassword/resetPassword';
import ModalUpdateAvatar from '../modal/updateAvatar/updateAvatar';
import ModalUpdateProfile from '../modal/updateProfile/updateProfile';
import ModalVipClub from '../modal/vipClub/vipClub';
import ModalVipLevel from '../modal/vipLevel/vipLevel';
import Footer from './footer.layout';
import HeaderStats from './header.layout';
import SidebarMobileLayout from './sidebarMobile.layout';
import SidebarToggle from './sidebarToggle.layout';
import WrapperBody from './wapperBody';

type BaseLayoutProps = {
  children: JSX.Element;
  isDetailPage?: boolean;
  contentClass?: string;
};

const BaseLayout: React.FC<BaseLayoutProps> = ({ children, isDetailPage, contentClass }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation('');

  const [isShowSidebar, setIsShowSidebar] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cryptoLocked, setCryptoLocked] = useState<FiatType>({});
  const baseBodyRef = useRef<HTMLDivElement>(null);
  const { query } = router;
  const { gameId } = query;

  useEffect(() => {
    setIsShowSidebar(false);
  }, [router]);

  const {
    isLogin,
    isShowInformation,
    isShowReferAndEarn,
    isShowUpdateInformation,
    isShowCropAvatar,
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
    cryptoArray,
    userId,
    walletSocket,
    gameSocket,
  } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
      isShowInformation: state.modal.isShowInformation,
      isShowReferAndEarn: state.modal.isShowReferAndEarn,
      isShowUpdateInformation: state.modal.isShowUpdateInformation,
      isShowCropAvatar: state.modal.isShowCropAvatar,
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

      userId: state.auth.user.userId,
      cryptoArray: state.common.cryptoArray,
      walletSocket: state.socket.walletSocket,
      gameSocket: state.socket.gameSocket,
      depositTime: state.wallet.depositTime,
    }),
    shallowEqual,
  );

  const loadInitData = async () => {
    try {
      const res = await api_getInitData();
      const tempFiatSymbols: CurrencyType[] =
        res.data?.fiatSymbols?.map((item: any) => ({
          id: item.id,
          name: item.symbol,
          alias: item.name,
          logo: `/img/fiats/${item.symbol}.png`,
          iso_currency: item.iso_currency,
          iso_decimals: item.iso_decimals,
          availableNetworks: item.availableNetworks,
          price: Number(item.price),
        })) || [];
      dispatch(setFiatSymbols(tempFiatSymbols));
    } catch (error) {
      dispatch(setFiatSymbols([]));
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

      if (accessToken) {
        const res = await api_validateToken(accessToken);
        if (!walletSocket?.connected) {
          const newSocket = await initialSocketConnection(SOCKET_WALLET_URL ?? '');
          dispatch(setSocket(newSocket));
        }

        dispatch(saveUserInfo({ ...convertUserInfo(res.data) }));
        dispatch(initWalletInfo());
      } else {
        await loadInitData();
      }
    } catch (error) {
      wrappedError();
      await loadInitData();
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
    // connectAccount();
    // handleUsdtNetwork();
    // handleGetExchangeRate();
    gameConnect();

    if (window.innerWidth < 1280) {
      dispatch(changeToggleSidebar(false));
    }
  }, []);

  useEffect(() => {
    if (!isLogin) {
      connectAccount();
      // getBonus();
    }
    // handleGet();
  }, [isLogin]);

  useEffect(() => {
    if (walletSocket) {
      walletSocket.on(`${userId}`, (data: any) => {
        const action = data?.action || '';
        const amount = data?.amount || 0;
        const currency = data?.currency || 'USDT';
        switch (action) {
          case 'Pending':
            toast.success(t('deposit:depositprogress'), { containerId: TOAST_ENUM.COMMON });
            dispatch(getBalance());
            break;
          case 'Complete':
            toast.success(`${t('deposit:depositComplete')} ${amount} ${currency}`, {
              containerId: TOAST_ENUM.COMMON,
            });
            dispatch(getBalance());
            dispatch(addDepositTime(1));
            break;

          default:
            break;
        }
      });
    }

    return () => {
      if (walletSocket) {
        walletSocket.off(`${userId}`);
      }
    };
  }, [walletSocket]);

  useEffect(() => {
    if (gameSocket) {
      gameSocket.on(`bets`, (item: any) => {
        const data = JSON.parse(item);
        const tempData: BetTableDataType = {
          game: data.game_name ?? '',
          gameIdenfiter: data.game_identifier ?? '',
          player: data.player_name || 'Hidden',
          playerId: data.player_id ?? '',
          playerAvatar: data.playerAvatar ?? '',
          betAmount: Number(data.bet_amount || 0),
          betAmountUsd: Number(data.bet_amount_usd || 0),
          multiplier: Number(data.multiplier || 0),
          profitAmount: Number(data.profit_amount || 0),
          profitAmountUsd: Number(data.profit_amount_usd || 0),
          currency: data.currency ?? 'USD',
          betId: data.id ?? '',
          time: data.time ?? new Date(),
        };
        dispatch(addBetHistory(tempData));
      });
    }

    return () => {
      if (gameSocket) {
        gameSocket.off(`bets`);
      }
    };
  }, [gameSocket, gameId]);

  useEffect(() => {
    if (router.query['forgot-pass-token']) {
      dispatch(changeIsShowResetPassword(true));
    }
    baseBodyRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [router]);

  useEffect(() => {
    cryptoArray && setCryptoLocked(cryptoArray[0]);
  }, [cryptoArray]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="min-h-screen h-full w-full overflow-hidden font-dayOne bg-[#25262B]">
        {isToggleSidebar && (
          <div
            className="xl:hidden sm:block hidden fixed xl:w-0 w-[calc(100vw)] h-screen right-0  dark:bg-black/60 z-[20]"
            onClick={() => dispatch(changeToggleSidebar(!isToggleSidebar))}
          ></div>
        )}
        <div className="md:pt-0 h-full w-full relative">
          <HeaderStats />
          <div className="flex h-full w-full max-h-[calc(100vh-67px)] mt-[67px]">
            <div
              className={cn(
                'z-[50] dark:bg-[#1D1E22] bg-[#fff] shadow-[0px_9px_17px_0px_#00000040] overflow-y-hidden sm:block hidden h-[calc(100vh)] mt-[-67px] drop-shadow-lg',
                {
                  'xl:relative fixed': isToggleSidebar,
                },
              )}
            >
              <SidebarToggle />
            </div>
            <div
              className="w-full overflow-y-auto flex-1 bg-[#f6f7fa] dark:bg-[#25262B] flex flex-col"
              ref={baseBodyRef}
              id="base-layout"
            >
              <WrapperBody
                contentClassName={cn('dark:bg-[#25262B] bg-[#f6f7fa]', contentClass)}
                wrapperClassName="dark:bg-[#25262B] md:bg-[#f6f7fa]"
              >
                {children}
              </WrapperBody>
              <WrapperBody
                wrapperClassName="bg-[#f6f7fa] dark:bg-[#1B1C20] min-[1786px]:max-w-full"
                contentClassName="bg-white dark:bg-[#1B1C20]"
              >
                <Footer isDetailPage={isDetailPage} />
              </WrapperBody>
              <ScrollToTop />
            </div>

            {showChatType && (
              <div
                className={cn(
                  'xl:relative fixed right-0 h-[calc(100vh)] mt-[-67px] z-10 duration-500 drop-shadow-md transition-opacity',
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
            <SidebarMobileLayout isShowSidebar={isShowSidebar} setIsShowSidebar={setIsShowSidebar} />
            <div
              className={cn(
                'text-gray-400 sm:hidden block fixed z-50 w-screen h-[60px] dark:bg-[#24262B] bg-[#f5f6fa] shadow-[17px_9px_17px_0px_#00000040] border border-gray-200 rounded-t-xl bottom-0',
                {
                  hidden: showChatType,
                },
              )}
            >
              <div className="w-full h-full flex gap-[5px] items-center justify-evenly text-[12px] relative">
                <div
                  role="button"
                  onClick={() => setIsShowSidebar(true)}
                  className={cn(
                    'hover:text-white flex-1 min-w-[calc(20%-4px)] flex flex-col items-center justify-between h-full rounded',
                  )}
                >
                  <div className="pt-2">
                    <HambergerMenu className="dark:text-[#9ca3af] text-[#31373d]" size={22} />
                  </div>
                  <div className="pb-2 dark:text-[#9ca3af] text-[#31373d] text-center truncate w-full">
                    {t('sidebar:menu')}
                  </div>
                </div>
                <Link
                  href={ROUTER.Casino}
                  className={cn(
                    'dark:hover:text-white hover-text-black flex-1 min-w-[calc(20%-4px)] flex flex-col items-center justify-between h-full rounded',
                    {
                      'dark:text-white text-black': router.route.includes(ROUTER.Casino),
                    },
                  )}
                >
                  <div className="pt-2">
                    <ArrangeHorizontalCircle className="dark:text-[#9ca3af] text-[#31373d]" size={22} />
                  </div>
                  <div className="pb-2 text-center dark:text-[#9ca3af] text-[#31373d] truncate w-full">
                    {t('sidebar:casino')}
                  </div>
                </Link>
                <Link
                  href={ROUTER.Deposit}
                  className={cn(
                    'hover:text-white flex-1 min-w-[calc(20%-4px)] flex flex-col items-center justify-between h-full rounded relative',
                    {
                      'dark:text-white text-black': router.route.includes(ROUTER.Deposit),
                    },
                  )}
                >
                  <div className="h-[48px] w-[60px] rounded-[50%] dark:bg-[#24262B] bg-[#f5f6fa] absolute top-[-15px] left-1/2 transform -translate-x-1/2 p-2">
                    <div className="m-auto h-[38px] w-[38px] bg-primary rounded-full text-white flex items-center justify-center">
                      <EmptyWallet className="dark:text-white text-[#31373d]" variant="Bold" size={22} />
                    </div>
                  </div>
                  <div className="pt-2 opacity-0">
                    <EmptyWallet className="dark:text-white text-[#31373d]" variant="Bold" size={22} />
                  </div>
                  <div className="pb-2 dark:text-[#9ca3af] text-[#31373d] text-center truncate w-full">
                    {t('sidebar:wallet')}
                  </div>
                </Link>
                <Link
                  href={ROUTER.Sports}
                  className={cn(
                    'hover:text-white flex-1 min-w-[calc(20%-4px)] flex flex-col items-center justify-between h-full rounded',
                    {
                      'dark:text-white text-black': router.route.includes(ROUTER.Sports),
                    },
                  )}
                >
                  <div className="pt-2">
                    <TrendUp className="dark:text-[#9ca3af] text-[#31373d]" size={22} />
                  </div>
                  <div className="pb-2 dark:text-[#9ca3af] text-[#31373d] text-center truncate w-full">
                    {t('sidebar:sports')}
                  </div>
                </Link>
                <div
                  role="button"
                  className={cn(
                    'hover:text-white flex-1 min-w-[calc(20%-4px)] flex flex-col items-center justify-between h-full rounded',
                    {
                      'dark:text-white text-black': router.route.includes(ROUTER.Sports),
                    },
                  )}
                  onClick={() => {
                    dispatch(changeShowChatType(!showChatType));
                    dispatch(changeShowFullChat(!showFullChat));
                  }}
                >
                  <div className="pt-2">
                    <Message className="dark:text-[#9ca3af] text-[#31373d]" size={22} />
                  </div>
                  <div className="pb-2 dark:text-[#9ca3af] text-[#31373d] text-center truncate w-full">
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
      {isShowInformation && (
        <ModalProfile show={isShowInformation} onClose={() => dispatch(changeIsShowInformation(false))} />
      )}
      {isShowReferAndEarn && (
        <ModalReferAndEarn show={isShowReferAndEarn} onClose={() => dispatch(changeIsShowReferAndEarn(false))} />
      )}
      {isShowUpdateInformation && (
        <ModalUpdateProfile
          show={isShowUpdateInformation}
          onClose={() => dispatch(changeIsShowUpdateInformation(false))}
        />
      )}
      {isShowCropAvatar && (
        <ModalCropAvatar show={isShowCropAvatar} onClose={() => dispatch(changeIsShowCropAvatar(false))} />
      )}
      {isShowUpdateAvatar && (
        <ModalUpdateAvatar show={isShowUpdateAvatar} onClose={() => dispatch(changeIsShowUpdateAvatar(false))} />
      )}
      {isShowMultiLanguage && (
        <ModalMultiLanguage
          show={isShowMultiLanguage}
          onClose={() => dispatch(changeIsShowMultiLanguageModal(false))}
        />
      )}
      {isShowAuthenticationModal && (
        <ModalAuthentication
          show={isShowAuthenticationModal}
          onClose={() => dispatch(changeIsShowAuthenticationModal(false))}
        />
      )}
      {isShowVipClubModal && (
        <ModalVipClub
          show={isShowVipClubModal}
          onClose={() => {
            dispatch(changeIsShowVipClubModal(false));
          }}
        />
      )}
      {isShowRakeBackModal && (
        <ModalRakeBack
          show={isShowRakeBackModal}
          cryptoLocked={cryptoLocked}
          onClose={() => {
            dispatch(changeIsShowRakeBack(false));
          }}
          setShowModalRakeBackDetail={() => dispatch(changeIsShowRakeBackDetail(true))}
          setShowModalBonusHistory={() => dispatch(changeIsShowBonusHistory(true))}
        />
      )}
      {isShowRakeBackDetailModal && (
        <ModalRakeBackDetail
          show={isShowRakeBackDetailModal}
          cryptoLocked={cryptoLocked}
          onClose={() => {
            dispatch(changeIsShowRakeBackDetail(false));
          }}
          setShowModalRakeBack={() => dispatch(changeIsShowRakeBack(true))}
        />
      )}
      {isShowModalBonusHistory && (
        <ModalBonusHistory
          show={isShowModalBonusHistory}
          cryptoLocked={cryptoLocked}
          onClose={() => {
            dispatch(changeIsShowBonusHistory(false));
          }}
          setShowModalRakeBack={() => dispatch(changeIsShowRakeBack(true))}
        />
      )}
      {isShowVipLevelModal && (
        <ModalVipLevel
          show={isShowVipLevelModal}
          onClose={() => {
            dispatch(changeIsShowVipLevelModal(false));
            dispatch(changeIsShowVipClubModal(true));
          }}
        />
      )}
      {isShowDepositModal && (
        <ModalDeposit show={isShowDepositModal} onClose={() => dispatch(changeIsShowDepositModal(false))} />
      )}
      {isShowCryptoOnlineModal && (
        <ModalCryptoOnline
          show={isShowCryptoOnlineModal}
          onClose={() => {
            dispatch(changeIsShowCryptoOnlineModal(false));
          }}
        />
      )}
      {isShowResetPassword && (
        <ModalResetPassword
          show={isShowResetPassword}
          onClose={() => {
            dispatch(changeIsShowResetPassword(false));
            router.replace(ROUTER.Home);
          }}
        />
      )}
      {/* Google One Tap */}
      {!isLogin && <LoginGoogleOneTap key={String(isLogin)} />}
    </>
  );
};

export default BaseLayout;
