import { MultiLanguageTabEnum } from '@/components/modal/multiLanguage/MultiLanguage';
import { AuthenticationModeEnum, DepositAddress, FiatType, ObjectLiteral } from './common';
import { KYC_ENUM } from '../constants/common';

type TokenState = {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: string;
  expiresAt?: string;
};

type AuthState = {
  isLogin?: boolean;
  isKyc?: KYC_ENUM;
  wallet?: string;
  userName?: string;
  userId?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  referralCode?: string;
  uuid?: string;
  winCount?: number;
  betCount?: number;
  totalWager?: number;
};

type ModalState = {
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
};

type LoadingState = {
  isShowDetailLoading?: boolean;
};

type CommonState = {
  fiatArray?: FiatType[];
  cryptoArray?: FiatType[];
  depositCryptoArray: DepositAddress[];
  localeFiat?: FiatType;
  prevLocaleFiat?: FiatType;
  activeFiat?: any;
  viewInFiat?: boolean;
  showFullNameCurrency?: boolean;
  usdtNetwork?: string;
};

export type { AuthState, TokenState, ModalState, LoadingState, CommonState };
