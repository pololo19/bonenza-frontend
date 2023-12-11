import { MultiLanguageTabEnum } from '@/components/modal/multiLanguage/MultiLanguage';

import { AuthenticationModeEnum, DepositAddress, FiatType, UserDetail } from './common';
import { VerifyRequestType } from './requestTypes';

export type TokenState = {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: string;
  expiresAt?: string;
};

export type AuthState = {
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
};

export type UserDataState = {
  userId: string;
  userName: string;
  avatar: string;
};
