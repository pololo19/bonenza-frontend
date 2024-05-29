import { KYC_ENUM } from '../constants/common';
import { TRANSACTION_TYPE } from './requestTypes';
import { CurrencySymbolType } from './wallet';

export enum AuthenticationModeEnum {
  SIGN_IN = 'SIGN_IN',
  SIGN_UP = 'SIGN_UP',
  FORGOT_PASS = 'FORGOT_PASS',
  VERIFY = 'VERIFY',
}

export enum VerifyModeEnum {
  MAIL = 'mail',
  PHONE = 'phone',
}

export enum EnumCSVValidateResult {
  CSV_ERROR_EXTENSION = 'CSV_ERROR_EXTENSION',
  CSV_ERROR_MAX_SIZE = 'CSV_ERROR_MAX_SIZE',
  CSV_ERROR_LIMIT = 'CSV_ERROR_LIMIT',
  CSV_ERROR_FILE_EMPTY_DATA = 'CSV_ERROR_FILE_EMPTY_DATA',
  CSV_ERROR_COLUMN = 'CSV_ERROR_COLUMN',
  CSV_ERROR_DATA = 'CSV_ERROR_DATA',
}

export enum EnumTypeInput {
  EMAIL = 'email',
  TEXT = 'text',
  PASSWORD = 'password',
}

export enum EnumVerificationDocumentType {
  PASSPORT = 'PASSPORT',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  ID_CARD = 'ID_CARD',
  RESIDENCE_PERMIT = 'RESIDENCE_PERMIT',
  VISA = 'VISA',
}

export type ObjectLiteral = {
  [key: string]: any;
};

export type BasicColorsData = {
  backgroundColorPicked?: string;
  textColorPicked?: string;
};

export type SessionType = {
  lastUsedAt: Date;
  ipAddress: string;
  location: string;
  id: string;
  browser: string;
  active: boolean;
};

export type PaginationResponse = {
  total?: number;
  limit?: number;
  offset?: number;
  prev?: number | null;
  current?: number;
  next?: number;
  last?: number | null;
  first?: number;
};

export type SignUpEmailFormRef = {
  emitData?: () => void;
};

export type SignUpPhoneFormRef = {
  emitData?: () => void;
  countryCallingCode?: any;
};

export type BasicFormRef = {
  emitData?: () => void;
};

export type ReferralCodeDetail = {
  id?: number;
  referralCode?: string;
  commissionRate?: string;
  createdAt?: Date;
  updatedAt?: Date;
  totalMemberRegister?: number;
  totalCommissionRewards?: string;
  userId: number;
};

export type UploadAreaRef = {
  openFileDialog: VoidFunction;
};

export enum EnumErrorCommon {
  THUMBNAIL_UPLOAD_ERROR = 'THUMBNAIL_UPLOAD_ERROR',
}

export enum PromiseStatus {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}

export type DepositAddress = {
  image?: string;
  id?: number;
  symbol?: 'All assets' | 'USDT' | 'BNB' | 'ETH' | 'GOD' | 'DRON' | 'BTC' | 'BCH';
  balance?: string | number;
  balanceLocked?: string | number;
  network?: string;
  depositAddress?: string;
  depositAmount?: number;
  deposit_amount?: number;
  privateKey?: string;
  isFavorite?: string | number;
};

export type FavoriteCoin = {
  id?: number;
  code: string;
  name: string;
  type?: string;
  symbol: string | any;
  isLike?: string;
};

export type MoonpayDepositAddress = {
  name?: string;
  moonpaySymbol?: string;
} & DepositAddress;

export type FiatType = {
  currency?: string;
  currencyOld?: string;
  currencyAlias?: string;
  amount?: number;
  cryptoLocked?: FiatType;
  amountLocked?: number;
  id?: number;
  isFavorite?: 0 | 1 | boolean;
  minDepositAmount?: Number;
  maxDepositAmount?: Number;
};

export type MoonpayFiatType = {
  code?: string;
  name?: string;
  fiatSymbol?: string;
  id?: number;
};

export type MoonpayCurrencyType = {
  code?: string;
  minBuyAmount?: number;
  maxBuyAmount?: number;
};

export type NetworkType = {
  image?: string;
  symbol?: 'ERC20' | 'BEP20' | 'Binance Coin(BEP20)' | 'Ethereum' | 'BEP20' | 'BEP20';
};

export enum CurrencyEnum {
  FIAT = 'fiat',
  CRYPTO = 'crypto',
}

export type GameListType = {
  id: string;
  title: string;
  description: string;
  identifier: string;
  payout: number;
  multiplier: number;
  releasedAt: Date | string;

  provider?: string;
  providerName: string;
  isExpiration?: boolean;
  gameCnt?: number;
  allowedLocation?: boolean;
  allowedDemo?: boolean;
  favorites?: number;
};

export type GameDetail = {
  id?: number;
  title?: string;
  identifier?: string;
  identifier2?: string;
  provider?: string;
  producer?: string;
  category?: string;
  theme?: string;
  hasFreespins?: string;
  featureGroup?: string;
  customised?: string;
  devices?: string;
  licenses?: string;
  line?: string;
  payout?: string;
  description?: string;
  volatilityRating?: string;
  hd?: string;
  multiplier?: string;
  restrictions?: string;
  releasedAt?: Date;
  profit?: number;
  wagered?: string;
  currency?: string;
  betId?: string;
  username?: string;
  userId?: number;
  isHideNamePublicList?: boolean;
  uuid?: string;
  avatar?: string;
  isExpiration?: boolean;
};

export type WagerDetail = {
  date: string;
  position: number;
  prize: number;
  prizeUsd: number;
  currencyLogo: string;
};

export type RankDetail = {
  id?: number;
  iconUrl?: string;
  rank?: string;
  level?: string | number;
  description?: string | null;
  xp: number;
  levelUpBonus: number;
  type: string;
  totalLevelUpBonus: number;
  vips: any[];
};

export type UserSettingGeneralType = {
  settingReceiveMarketPromotion: boolean;
  settingShowFullNameCrypto: boolean;
  settingLanguage: string;
  settingCurrency: string;
  settingViewInFiat: boolean;
};

export type UserSettingPrivacyType = {
  settingHideUserName: boolean;
  settingHideGamingData: boolean;
  settingRefuseTipFromStrangers: boolean;
};

export type UserSettingVerifiedType = {
  emailVerified: boolean;
  phoneVerified: boolean;
};

export type UserDetail = {
  userName: string;
  userId: string;
  email: string;
  phone: string;
  avatar: string;
  betCount: string;
  winCount: string;
  totalWager: number;
  referralCode: string;
  wallet: string;
  isKyc: KYC_ENUM;
  tfa: boolean;
  restrictedTo: number;
  generalSetting: UserSettingGeneralType;
  privacySetting: UserSettingPrivacyType;
  verifiedSetting: UserSettingVerifiedType;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type GameProviderDetail = {
  id: string;
  name: string;
  image?: string;
  introduction?: string;
  isSelect: boolean;
  totalGames: number | string;
};

export type GameThemeDetail = {
  theme?: string;
};

export type GameReactionDetail = {
  favorite?: boolean;
  identifier?: string;
  liked?: boolean;
  totalFavorite?: number;
  totalLike?: number;
};

export type BetTableDetailType = {
  game: string;
  gameId: string;
  betId: string;
  player: string;
  time: Date;
  payout: string;
  multiplier: string;
  profit: number;
  identifier2: string;
  provider: number;
  title: number;
};

export type BetTableDataType = {
  game: string;
  gameIdenfiter: string;
  player: string;
  playerId: string;
  playerAvatar: string;
  betAmount: number;
  betAmountUsd: number;
  multiplier: number;
  profitAmount: number;
  profitAmountUsd: number;
  currency: string;
  betId: string;
  time: Date;
  providerName: string;
};

export type BetDetail = {
  betAmount?: number;
  betId?: string;
  currency?: string;
  payoutRate?: string;
  payout?: string;
  player?: string;
  profit?: number;
  time?: Date;
  gameName?: string;
  id?: number;
  title?: string;
  identifier?: string;
  identifier2?: string;
  provider?: string;
  producer?: string;
  category?: string;
  theme?: string;
  hasFreespins?: string;
  featureGroup?: string;
  customised?: string;
  devices?: string;
  licenses?: string;
  line?: string;
  description?: string;
  volatilityRating?: string;
  hd?: string;
  multiplier?: string;
  restrictions?: string;
  releasedAt?: any;
  bonusBuy?: any;
  totalFavorite?: number;
  totalLike?: number;
  recalled?: any;
  recalledAt?: any;
  playerAvatar?: string;
  playerId?: number;
};

export type Rating = {
  avgRating?: number;
  countRating?: number;
  userRating?: number;
};

export type InformationWithdraw = {
  fee?: number;
  gasPrice?: number;
  min?: number;
  msg?: string;
  totalAmountWithdraw?: number;
  unitFee?: string;
  locked?: number;
  available?: number;
};

export type TransactionStatus =
  | 'processing'
  | 'pending'
  | 'refunding'
  | 'rejected'
  | 'complete'
  | 'approved'
  | 'failed';
export type TransactionStatusByNum = '';
export type RolloverStatus = 'all' | 'not_started' | 'ongoing' | 'done';
export type TransactionType = {
  amount: number;
  amountUsd: number;
  fee: number;
  feeUsd: number;
  id: string;
  orderId: string;
  status: TransactionStatus;
  symbolId: string;
  symbolName: string;
  symbolLogo: string;
  time: string | Date;
  txId: string;
  unitFee: string;
  userId: number;
  username: string;
  value: number;
  type: TRANSACTION_TYPE;
  withdrawalAddress: string;
};

export type TransactionBillType = {
  type: string;
  currency: string;
  amount: number;
  amountUsd: number;
  currencyType: CurrencySymbolType;
  time: string;
  balance: number;
  balanceUsd: number;
  gameId: string;
  gameName: string;
};

export type TransactionSwapType = {
  symbolFrom: string;
  swapFrom: number;
  swapFromLogo: string;
  swapFromUsd: number;
  symbolTo: string;
  swapTo: number;
  swapToUsd: number;
  swapToLogo: string;
  timeTransfer: string | Date;
};

export type BetDetailType = {
  id: string;
  game: string;
  identifier: string;
  amount: number;
  amountUsd: number;
  currency: string;
  currencyType: CurrencySymbolType;
  multiplier: number;
  profit: number;
  profitUsd: number;

  userId: string;
  userName: string;
  userAvatar: string;
  providerName: string;
};

export type TransactionBonusType = {
  type: string;
  balance: number;
  balanceUsd: number;
  amount: number;
  amountUsd: number;
  currency: string;
  currencyType: CurrencySymbolType;
  time: string;
};

export type RolloverType = {
  id: string;
  type: string;
  amount: number;
  amountUsd: number;
  pendingWagerRequiredAmount: number;
  pendingWagerRequiredUsdAmount: number;
  wagerCompletedAmount: number;
  wagerCompletedUsdAmount: number;
  withdrawableFundsAmount: number;
  withdrawableFundsUsdAmount: number;
  currency: string;
  currencyLogo: string;
  status: RolloverStatus;
  times: number;
  createdAt: Date;
};

export type CategoryType =
  | 'all'
  | 'live_casino'
  | 'slots'
  | 'table_games'
  | 'blackjack'
  | 'new_releases'
  | 'feature_Buy_In'
  | 'hot_games'
  | 'racing';

export type BonusTransactionType = {
  amount: number;
  amountUsd: number;
  type: string;
  time: string;
  symbol: string;
  symbolLogo: string;
};

export type MessageType = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  level: string;
  time: string;
  text: string;
  replyId: string;
  replyText: string;
  replyTime: string;
  replyUserId: string;
  replyUserName: string;
  replyUserLevel: string;
};

export type LiveRewardType = {
  amountUsd: number;
  logo: string;
  name: string;
};
