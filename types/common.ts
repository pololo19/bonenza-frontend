import { Path } from 'react-hook-form';
import { ParseResult } from 'papaparse';
import { type } from 'os';

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

export enum AuthenticationModeEnum {
  SIGN_IN = 'SIGN_IN',
  SIGN_UP = 'SIGN_UP',
  FORGOT_PASS = 'FORGOT_PASS',
}

export type ObjectLiteral = {
  [key: string]: any;
};

export type BasicColorsData = {
  backgroundColorPicked?: string;
  textColorPicked?: string;
};

export type SessionType = {
  lastUsedAt?: Date;
  ipAddress?: string;
  location?: string;
  id?: number;
  browser?: string;
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

export type ParamsRequest = {
  q?: string | number;
  limit?: string | number;
  page?: string | number;
};

export type BasicFormRef = {
  emitData?: () => void;
};

export type SignUpEmailFormRef = {
  emitData?: () => void;
};
export type SignUpEmailFormRequest = {
  email?: string;
  password?: string;
  referralCode?: string;
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

export type SignUpPhoneFormRef = {
  emitData?: () => void;
  countryCallingCode?: any;
};
export type SignUpPhoneFormRequest = {
  phone?: string;
  password?: string;
  referralCode?: string;
};

export type CSVReaderResult = {
  error: EnumCSVValidateResult | undefined;
  result: ParseResult<ObjectLiteral> | undefined;
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
  id?: number;
  rank?: number;
  userId?: number;
  wagered?: string | number;
  prizePercent?: string | number;
  prize?: string | number;
  dateReceive?: string;
  currency?: string;
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

export type UserDetail = {
  username?: string;
  userId?: number;
  isHideNamePublicList?: boolean;
  isHideGamingData?: boolean;
  uuid?: string;
  avatar?: string;
  id?: number;
  email?: string;
  betCount?: string;
  winCount?: string;
  totalWager?: number;
  totalWagerUSD?: number;
};

export type GameProviderDetail = {
  id: string;
  name?: string;
  image?: string;
  introduction?: string;
  isSelect?: boolean;
  totalGames?: number | string;
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
