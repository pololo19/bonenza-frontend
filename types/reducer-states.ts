import { MultiLanguageTabEnum } from '@/components/modal/multiLanguage/MultiLanguage';

import {
  AuthenticationModeEnum,
  BetTableDataType,
  DepositAddress,
  FiatType,
  GameListType,
  UserDetail,
  VerifyModeEnum,
} from './common';
import { VerifyRequestType } from './requestTypes';
import { BalanceType, CryptoCurrencyType, CryptoNetWorkType, CurrencyType, DepositAddressType } from './wallet';

export type TokenState = {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: string;
  expiresAt?: string;
};

export type AuthState = {
  isLoading: {
    isCurrency: boolean;
    isLanguage: boolean;
  };
  isLogin: boolean;
  user: UserDetail;
  verifyRequest: VerifyRequestType;
  isPhoneVerifyRequested: boolean;
  isForgetPassword: boolean;
};

export type ModalState = {
  isShowDepositModal?: boolean;
  isShowReferAndEarn?: boolean;
  isShowInformation?: boolean;
  isShowUpdateInformation?: boolean;
  isShowUpdateAvatar?: boolean;
  isShowCropAvatar?: boolean;
  isShowMultiLanguage?: boolean;
  isShowAuthenticationModal?: boolean;
  isShowForgotPassModal?: boolean;
  authenticationType?: AuthenticationModeEnum;
  multiLanguageTab?: MultiLanguageTabEnum;
  selectedAvatar?: string;
  showChatType: boolean;
  isToggleSidebar?: boolean;
  showFullChat: boolean;
  isShowVipClubModal?: boolean;
  isShowVipLevelModal?: boolean;
  isShowCryptoOnlineModal?: boolean;
  isShowResetPassword?: boolean;
  isShowDetailBets?: boolean;
  isShowCasinoSearch?: boolean;
  isShowRakeBackModal?: boolean;
  isShowRakeBackDetailModal?: boolean;
  isShowModalBonusHistory?: boolean;
  isShowAccountPannel?: boolean;
  isShowMenuPannel?: boolean;
  isShowVerifyMailAndPhone?: boolean;
  verifyModeType?: VerifyModeEnum;
  isShowWagerContestHistory?: boolean;
  isShowLogOutConfirm?: boolean;
};

export type LoadingState = {
  isShowDetailLoading?: boolean;
};

export type CommonState = {
  fiatArray?: FiatType[];
  cryptoArray?: FiatType[];
  depositCryptoArray: DepositAddress[];
  localeFiat?: FiatType;
  prevLocaleFiat?: FiatType;
  activeFiat?: any;
  viewInFiat?: boolean;
  showFullNameCurrency?: boolean;
  usdtNetwork?: string;
  casinoTab?: boolean;
};

export type UserDataState = {
  userId: string;
  userName: string;
  avatar: string;
};

export type WalletState = {
  localFiat: CurrencyType | null;
  activeCurrency: CurrencyType;
  totalBalance: number;
  depositTime: number;
  realBalance: number;
  bonusBalance: number;
  networks: CryptoNetWorkType[];
  symbols: CurrencyType[];
  fiatSymbols: CurrencyType[];
  balances: BalanceType[];
  cryptoCurrencies: CryptoCurrencyType[];
  depositAddress: DepositAddressType[];
  lockedAmount: number;
  swapFee: number;
  activeTransactionStatus: {
    id: string;
    status: number; // 0 processing, 1 complete
  };
};

export type GameState = {
  betHistory: BetTableDataType[];
  recommandGames: GameListType[];
};
