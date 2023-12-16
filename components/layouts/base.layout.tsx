import cn from 'classnames';
import { ArrangeHorizontalCircle, EmptyWallet, HambergerMenu, Message, TrendUp } from 'iconsax-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import api from '@/api/api';
// import { getExchangeRate } from '@/api/exchangeRate';
import { useTranslation } from '@/base/config/i18next';
import { CookieKey, ROUTER, TOAST_ENUM } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo } from '@/base/libs/utils';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { changeUsdtNetwork } from '@/base/redux/reducers/common.reducer';
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
import { getBalance } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { FiatType } from '@/base/types/common';
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
    }),
    shallowEqual,
  );

  const getBonus = async () => {
    if (isLogin) {
      try {
        const response = await api.get('auth/get-notifications-bonus');
        const dataPromotion = response.data.data;
        const listMessage = dataPromotion.map((item: any) => item.notification);
        if (listMessage.includes('success')) {
          let listCoin = dataPromotion.filter((item: any) => item.notification === 'success');
          listCoin.forEach((item: any) => {
            toast.success('You have received bonus of ' + item.symbol + ' coin');
          });
          return;
        } else if (listMessage.includes('You have not recharged yet.')) {
          setTimeout(getBonus, 60000);
        } else {
          return;
        }
      } catch (error) {}
    } else return;
  };

  // const handleGetFiat = async () => {
  //   try {
  //     // setIsLoading(true);
  //     const responseFiat = await api.get('stripe/get-fiat-amount');
  //     const responseCrypto = await api.get('deposit/get-all-deposit');
  //     const listCrypto = responseCrypto.data.data.depositAddress.map((crypto: DepositAddress) => {
  //       return {
  //         amount: Number(crypto?.balance),
  //         currency: crypto?.symbol,
  //         currencyAlias: crypto?.network,
  //         id: crypto?.id,
  //         isFavorite: crypto?.isFavorite,
  //         maxDepositAmount: undefined,
  //         minDepositAmount: undefined,
  //         type: CurrencyEnum.CRYPTO,
  //       };
  //     });

  //     const listFiat = responseFiat.data.data.map((fiat: DepositAddress) => {
  //       return {
  //         ...fiat,
  //         type: CurrencyEnum.FIAT,
  //       };
  //     });
  //     dispatch(
  //       changeDepositCryptoArray(
  //         responseCrypto.data.data.depositAddress.map((crypto: DepositAddress) => updateCoin(crypto)),
  //       ),
  //     );
  //     dispatch(changeFiatArray(listFiat));
  //     dispatch(changeCryptoArray(listCrypto));

  //     // handle Active Currency
  //     const currentActiveFiat: FiatType = responseFiat.data.data.find(
  //       (item: FiatType) => item.currency === CookiesStorage.getCookieData(CookieKey.activeFiat),
  //     );
  //     if (currentActiveFiat?.amount) {
  //       handleChangeActiveFiat(currentActiveFiat);
  //       if (currentActiveFiat?.currency === 'USDT') {
  //         dispatch(changeUsdtNetwork(String(currentActiveFiat?.currencyAlias) ?? 'BEP20'));
  //       }
  //     } else {
  //       const maxCurrencyAmount: FiatType = [...listCrypto, ...listFiat].reduce(function (p: FiatType, v: FiatType) {
  //         return exchangeByLocaleFiat(p?.currency, 'USD', p?.amount) >
  //           exchangeByLocaleFiat(v?.currency, 'USD', v?.amount)
  //           ? p
  //           : v;
  //       });
  //       if (maxCurrencyAmount?.amount) {
  //         if (maxCurrencyAmount?.currency === 'USDT') {
  //           dispatch(changeUsdtNetwork(String(maxCurrencyAmount?.currencyAlias) ?? 'BEP20'));
  //         }
  //         handleChangeActiveFiat(maxCurrencyAmount);
  //         const maxLocaleFiat: FiatType = responseFiat.data.data.find(
  //           (item: FiatType) => item.currency === maxCurrencyAmount.currency,
  //         );
  //         if (maxLocaleFiat) handleChangeLocaleFiat(maxLocaleFiat);
  //       } else {
  //         handleChangeActiveFiat(responseFiat.data.data[0]);
  //       }
  //     }

  //     // handle Locale Fiat
  //     const storageLocaleFiat: FiatType = responseFiat.data.data.find(
  //       (item: FiatType) => item.currency === CookiesStorage.getCookieData(CookieKey.localeFiat),
  //     );
  //     if (storageLocaleFiat) {
  //       handleChangeLocaleFiat(storageLocaleFiat);
  //     } else {
  //       handleChangeLocaleFiat(responseFiat.data.data[0]);
  //     }
  //   } catch (error) {
  //     handleChangeLocaleFiat(FIAT_DATA[0]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleGet = async () => {
  //   try {
  //     // setIsLoading(true);
  //     const [responseFiat, responseCrypto] = await Promise.all([
  //       api.get('stripe/get-fiat-amount'),
  //       api.get('deposit/get-all-deposit'),
  //     ]);

  //     const listCrypto = responseCrypto.data.data.depositAddress.map((crypto: DepositAddress) => {
  //       return {
  //         amount: Number(crypto?.balance),
  //         amountLocked: Number(crypto?.balanceLocked),
  //         currency: crypto?.symbol,
  //         currencyAlias: crypto?.symbol === 'USDT' ? 'BEP20' : crypto?.network,
  //         id: crypto?.id,
  //         maxDepositAmount: undefined,
  //         minDepositAmount: undefined,
  //         isFavorite: crypto?.isFavorite,
  //         type: CurrencyEnum.CRYPTO,
  //       };
  //     });
  //     const listFiat = responseFiat.data.data.map((fiat: DepositAddress) => {
  //       return {
  //         ...fiat,
  //         type: CurrencyEnum.FIAT,
  //       };
  //     });
  //     dispatch(
  //       changeDepositCryptoArray(
  //         responseCrypto.data.data.depositAddress.map((crypto: DepositAddress) => updateCoin(crypto)),
  //       ),
  //     );
  //     dispatch(changeFiatArray(listFiat));
  //     dispatch(changeCryptoArray(listCrypto));

  //     // handle Active Currency
  //     const currentActiveFiat: FiatType = [...listCrypto, ...listFiat].find(
  //       (item: FiatType) => item.currency === CookiesStorage.getCookieData(CookieKey.activeFiat),
  //     );
  //     if (currentActiveFiat?.amount) {
  //       handleChangeActiveFiat(currentActiveFiat);
  //       if (currentActiveFiat?.currency === 'USDT') {
  //         dispatch(changeUsdtNetwork(String(currentActiveFiat?.currencyAlias)));
  //       }
  //     } else {
  //       const maxCurrencyAmount: FiatType = [...listCrypto, ...listFiat].reduce(function (p: FiatType, v: FiatType) {
  //         return exchangeByLocaleFiat(p?.currency, 'USD', p?.amount) >
  //           exchangeByLocaleFiat(v?.currency, 'USD', v?.amount)
  //           ? p
  //           : v;
  //       });
  //       if (Number(maxCurrencyAmount?.amount)) {
  //         if (maxCurrencyAmount?.currency === 'USDT') {
  //           dispatch(changeUsdtNetwork(String(maxCurrencyAmount?.currencyAlias)));
  //         }

  //         handleChangeActiveFiat(maxCurrencyAmount);
  //         const maxLocaleFiat: FiatType = responseFiat.data.data.find(
  //           (item: FiatType) => item.currency === maxCurrencyAmount.currency,
  //         );
  //         if (maxLocaleFiat) handleChangeLocaleFiat(maxLocaleFiat);
  //       } else {
  //         handleChangeActiveFiat(responseFiat.data.data[0]);
  //       }
  //     }

  //     // handle Locale Fiat
  //     const storageLocaleFiat: FiatType = responseFiat.data.data.find(
  //       (item: FiatType) => item.currency === CookiesStorage.getCookieData(CookieKey.localeFiat),
  //     );
  //     if (storageLocaleFiat) {
  //       handleChangeLocaleFiat(storageLocaleFiat);
  //     } else {
  //       // handleChangeLocaleFiat(responseFiat.data.data[0]);
  //     }
  //   } catch (error) {
  //     handleChangeLocaleFiat(FIAT_DATA[0]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleChangeLocaleFiat = (item: FiatType) => {
  //   try {
  //     dispatch(changeLocaleFiat(item));
  //     CookiesStorage.setCookieData(CookieKey.localeFiat, String(item?.currency));
  //     CookiesStorage.setCookieData(CookieKey.localeFiatData, JSON.stringify(item));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleChangeActiveFiat = (item: FiatType) => {
  //   try {
  //     dispatch(changeActiveFiat(item));
  //     CookiesStorage.setCookieData(CookieKey.activeFiat, String(item?.currency));
  //     CookiesStorage.setCookieData(CookieKey.activeFiatData, JSON.stringify(item));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleGetExchangeRate = async () => {
    // try {
    //   const resExchangeRate = await getExchangeRate();
    //   let exchangeRateData: ObjectLiteral = {};
    //   resExchangeRate.data.forEach((element: { toCurrency: string; rate: any }) => {
    //     exchangeRateData[element.toCurrency.toUpperCase()] = element.rate;
    //   });
    //   CookiesStorage.setCookieData(CookieKey.exchangeRate, JSON.stringify(exchangeRateData).toUpperCase());
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const handleUsdtNetwork = () => {
    const usdtNetworkStorage = CookiesStorage.getCookieData(CookieKey.usdtNetwork);
    if (usdtNetworkStorage === 'BEP20' || usdtNetworkStorage === 'ERC20') {
      dispatch(changeUsdtNetwork(usdtNetworkStorage));
    } else {
      CookiesStorage.setCookieData(CookieKey.usdtNetwork, 'BEP20');
    }
  };

  const handleAccount = async () => {
    const accessToken = CookiesStorage.getAccessToken();
    if (accessToken) {
      const resUser = await api.get('auth/get-user-info');
      // if (!resUser.data.data.isDeposit) {
      //   await api.post('deposit/create-deposit-address');
      // }
      dispatch(
        saveUserInfo({
          ...convertUserInfo(resUser.data),
        }),
      );
    }
  };

  const handleUpdateSession = async () => {
    try {
      await api.put('/user-session/update-last-used-at', {
        session: CookiesStorage.getCookieData(CookieKey.session),
      });
    } catch (error) {}
  };

  useEffect(() => {
    // handleAccount();
    // handleUsdtNetwork();
    // handleGetExchangeRate();
    if (window.innerWidth < 1280) {
      dispatch(changeToggleSidebar(false));
    }
  }, []);

  useEffect(() => {
    if (isLogin) {
      // getBonus();
    }
    // handleGet();
  }, [isLogin]);

  useEffect(() => {
    if (walletSocket) {
      walletSocket.on(`${userId}`, (data: any) => {
        console.log(data);
        const action = data?.action || '';
        const amount = data?.amount || 0;
        const currency = data?.currency || 'USDT';
        switch (action) {
          case 'pending':
            toast.success(`Your ${amount} ${currency} deposit is pending now`, { containerId: TOAST_ENUM.COMMON });
            dispatch(getBalance());
            break;
          case 'complete':
            toast.success(`Your ${amount} ${currency} deposit is completed`, { containerId: TOAST_ENUM.COMMON });
            dispatch(getBalance());
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
    if (router.query['forgot-pass-token']) {
      dispatch(changeIsShowResetPassword(true));
    }
    baseBodyRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [router]);

  useEffect(() => {
    cryptoArray && setCryptoLocked(cryptoArray[0]);
  }, [cryptoArray]);

  useEffect(() => {
    if (!userId) return;
    // const interval = setInterval(() => {
    //   handleUpdateSession();
    // }, 60000);

    // return () => clearInterval(interval);
  }, [userId]);

  // Socket for deposit
  // useEffect(() => {
  //   if (!userId) return;
  //   const socketDeposit = io(String(process.env.SOCKET_URL), socketConfig);
  //   console.log('init socket');

  //   // Socket for deposit
  //   socketDeposit.on(`deposit_address_${userId}`, (crypto: DepositAddress[]) => {
  //     console.log(`deposit_address_${userId}`, crypto);
  //     dispatch(updateCryptoSocket(crypto?.[0]));
  //     toast.success(
  //       <div>
  //         {t('deposit:depositComplete')}
  //         <br /> {crypto[0].deposit_amount} {crypto[0].symbol}
  //       </div>,
  //       { containerId: TOAST_ENUM.COMMON },
  //     );
  //   });

  //   // Socket for deposit progress
  //   socketDeposit.on(`deposit_progress_user_id_${userId}`, () => {
  //     console.log('deposit_progress_user_id_   ' + `${userId}`);
  //     toast.success(<div>{t('deposit:depositprogress')}</div>, { containerId: TOAST_ENUM.COMMON });
  //   });

  //   // Socket for balance
  //   socketDeposit.on(`balance_update_${userId}`, (crypto: DepositAddress[]) => {
  //     console.log('update balance', userId, crypto);
  //     dispatch(updateBalanceSocket(crypto?.[0]));
  //   });

  //   // Socket for locked amount
  //   socketDeposit.on(`update_balance_locked_${userId}`, (crypto: DepositAddress[]) => {
  //     console.log('update_balance_locked_', userId, crypto);
  //     toast.success(
  //       <div
  //         className="w-full"
  //         onClick={() => {
  //           dispatch(changeIsShowRakeBack(true));
  //         }}
  //       >
  //         {t('deposit:getBonusSuccess')}
  //       </div>,
  //       { containerId: TOAST_ENUM.COMMON },
  //     );
  //     dispatch(updateLockedAmountCryptoSocket(crypto?.[0]));
  //   });

  //   return () => {
  //     socketDeposit.disconnect();
  //   };
  // }, [userId]);

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
