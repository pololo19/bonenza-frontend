import {
  ArrangeHorizontalCircle,
  Card,
  Category,
  DocumentText,
  Setting2,
  Shop,
  StatusUp,
  TrendUp,
} from 'iconsax-react';
import { Settings } from 'react-slick';

import { convertGameIdentifierToUrl, convertToUrlCase } from '../libs/utils/convert';
import resources from '../public/locales';
import { DepositAddress, FiatType, MoonpayDepositAddress, NetworkType } from '../types/common';
import { TRANSACTION_TYPE } from '../types/requestTypes';

export const CookieKey = {
  accessToken: 'accessToken',
  auth: 'auth',
  userId: 'userId',
  refreshToken: 'refreshToken',
  referralCode: 'referralCode',
  currentRoles: 'currentRoles',
  lang: 'lang',
  localeFiat: 'localeFiat',
  localeFiatData: 'localeFiatData',
  activeFiat: 'activeFiat',
  activeFiatData: 'activeFiatData',
  previousUrl: 'previousUrl',
  networkError: 'networkError',
  companyId: 'companyId',
  exchangeRate: 'exchangeRate',
  email: 'email',
  user: 'user',
  accountInvalidCode: 'accountInvalidCode',
  usdtNetwork: 'usdtNetwork',
  session: 'session',
  level: 'level',
  redeem: 'redeem',
  redeemDate: 'redeemDate',
};

export const AUTH_KEY = process.env.AUTHKEY;

export type TagType =
  | 'slots'
  | 'live-casino'
  | 'hot-games'
  | 'new-releases'
  | 'blackjack'
  | 'feature-buy-in'
  | 'table-games'
  | 'top-picks'
  | 'racing';

export const Tags: TagType[] = [
  'slots',
  'live-casino',
  'hot-games',
  'new-releases',
  'blackjack',
  'feature-buy-in',
  'table-games',
  'top-picks',
  'racing',
];

export const ROUTER = {
  Home: '/',
  REFERRAL_CODE: (code: string) => `https://bonenza.com/?referral=${code}`,
  Dashboard: '/dashboard',
  Master: '/tournament',
  Sports: '/sports',
  Slots: '/casino/slots',
  Racing: '/racing',
  PageNotAllowed: '/403',
  PageNotFound: '/404',
  DepositCrypto: '/deposit/crypto',
  DepositFiat: '/deposit/fiat',
  BuyCrypto: '/buy-crypto',
  Swap: '/swap',
  VaultPro: '/vault-pro',
  WithdrawCrypto: '/withdraw/crypto',
  WithdrawFiat: '/withdraw/fiat',
  Transaction: '/transaction',
  Rollover: '/rollover',
  Balance: '/balance',
  PrivacyPolicy: '/privacy-policy',
  TermOfUse: '/term-of-use',
  Bonus: '/bonus',
  Casino: '/casino/',
  Lottery: '/lottery',
  Bingo: '/bingo',
  Promotion: '/promotion',
  Setting: '/settings',
  Exclusive: '/exclusive',
  Affiliate: '/affiliate',
  Forum: '/forum',
  ProvablyFair: '/helper-center/privacy',
  Blog: '/blog',
  LiveSupport: '/live-support',
  Sponsorships: '/sponsorships',
  SettingGeneral: '/setting/general',
  SettingPrivacy: '/setting/privacy',
  SettingEmail: '/setting/email',
  SettingSecurity: '/setting/security',
  SettingSession: '/setting/session',
  SettingVerify: '/setting/verify',
  HelperPrivacy: '/helper-center/privacy',
  HelperProvablyFair: '/helper-center/provably-fair',
  HelperTermsOfService: '/helper-center/terms-of-service',
  HelperTermsOfSports: '/helper-center/terms-of-sports',
  HelperDepositBonusTerms: '/helper-center/deposit-bonus-terms',
  HelperCoinAccuracyLimit: '/helper-center/coin-accuracy-limit',
  HelperSupport: '/helper-center/support',
  HelperFee: '/helper-center/fee',
  HelperGoogleAuthenticator: '/helper-center/google-authenticator',
  HelperFAQ: '/helper-center/faq',
  HelperCurrency: '/helper-center/currency',
  HelperRegistrationAndLogin: '/helper-center/registration-and-login',
  HelperSwapPolicy: '/helper-center/bc-swap-policy',
  HelperGambleAware: '/helper-center/gamble-aware',
  HelperProtectingMinors: '/helper-center/protecting-minors',
  HelperProviders: '/helper-center/providers',
  HelperAML: '/helper-center/aml',
  HelperSelfExclusion: '/helper-center/self-exclusion',
  HelperResponsibleGambling: '/helper-center/responsible-gambling',
  History: '/history',
  HomeBest: '/gamelist/home-best',
  HomeRecommend: '/gamelist/home-recommend',
  Recent: '/recent',
  Favorite: '/favorite',
  PicksForYou: '/gamelist/picks-for-you',
  Providers: '/providers',
  GameDetail: (gameIdentifier2: string) => `/game/${gameIdentifier2}`,
  Provider: (providerId: string) => `/provider/${providerId}`,
  Themes: '/themes',
  Theme: (themeId: string) => `/theme/${themeId}`,
  Tagname: (tagname: TagType) => `/casino/${tagname}`,
  ProviderLogo: (providerId: string) => `https://cdn.softswiss.net/logos/providers/color/${providerId}.svg`,
  AdminRewards: '/admin/mycasino/rewards/',
  AdminReferral: '/admin/mycasino/referral/',
  AdminFriends: '/admin/mycasino/friends/',
  AdminCommissions: '/admin/mycasino/commissions/',
};

export const LANGUAGE_DATA: {
  language: string;
  key: keyof typeof resources;
  href: string;
  currency: string;
  currencyAlias: string;
}[] = [
  {
    language: 'English',
    key: 'en',
    href: '#',
    currency: 'USD',
    currencyAlias: 'US Dollar',
  },
  {
    language: 'Tiếng việt',
    key: 'vi',
    href: '#',
    currency: 'VND',
    currencyAlias: 'Vietnam',
  },
  {
    language: '한국어',
    key: 'ko',
    href: '#',
    currency: 'KRW',
    currencyAlias: 'Korea',
  },
  {
    language: '汉语',
    key: 'zh',
    href: '#',
    currency: 'RMB',
    currencyAlias: 'China',
  },
  {
    language: 'Indonesian',
    key: 'id',
    href: '#',
    currency: 'IDR',
    currencyAlias: 'Indonesia',
  },
  {
    language: '日本語',
    key: 'ja',
    href: '#',
    currency: 'JPY',
    currencyAlias: 'Japan',
  },
  {
    language: 'Français',
    key: 'fr',
    href: '#',
    currency: 'EUR',
    currencyAlias: 'Euro',
  },
  {
    language: 'Español',
    key: 'es',
    href: '#',
    currency: 'EUR',
    currencyAlias: 'Euro',
  },
  {
    language: 'عربى',
    key: 'ar',
    href: '#',
    currency: 'SAR',
    currencyAlias: 'Saudi Arabia',
  },
  {
    language: 'हिन्दी',
    key: 'hi',
    href: '#',
    currency: 'INR',
    currencyAlias: 'Indian Rupee',
  },
  {
    language: 'Türkçe',
    key: 'tr',
    href: '#',
    currency: 'TRY',
    currencyAlias: 'Turkish Lira',
  },
  {
    language: 'Português',
    key: 'pt',
    href: '#',
    currency: 'EUR',
    currencyAlias: 'Euro',
  },
  {
    language: 'Deutsch',
    key: 'de',
    href: '#',
    currency: 'EUR',
    currencyAlias: 'Euro',
  },
  {
    language: 'ภาษาไทย',
    key: 'th',
    href: '#',
    currency: 'THB',
    currencyAlias: 'Thai Baht',
  },
  {
    language: 'Italiano',
    key: 'it',
    href: '#',
    currency: 'EUR',
    currencyAlias: 'Euro',
  },
  {
    language: 'Українська',
    key: 'uk',
    href: '#',
    currency: 'UAH',
    currencyAlias: 'Ukrainian Hryvnia',
  },
  {
    language: 'Melayu',
    key: 'ms',
    href: '#',
    currency: 'MYR',
    currencyAlias: 'Malaysian Ringgit',
  },
  {
    language: 'বাংলা',
    key: 'bn',
    href: '#',
    currency: 'BDT',
    currencyAlias: 'Bangladeshi Taka',
  },
  {
    language: 'Marathi',
    key: 'mr',
    href: '#',
    currency: 'INR',
    currencyAlias: 'Indian Rupee',
  },
];

export const FIAT_DATA: FiatType[] = [
  {
    currency: 'USD',
    currencyAlias: 'US Dollar',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'BRL',
    currencyAlias: 'Brazil',
    minDepositAmount: 5,
    maxDepositAmount: 900000,
  },
  {
    currency: 'INR',
    currencyAlias: 'India',
    minDepositAmount: 100,
    maxDepositAmount: 900000,
  },
  {
    currency: 'EUR',
    currencyAlias: 'Euro',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'RUB',
    currencyAlias: 'Russia',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'NGN',
    currencyAlias: 'Nigeria',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'RMB',
    currencyAlias: 'China',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'IDR',
    currencyAlias: 'Indonesia',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'BDT',
    currencyAlias: 'Bangladesh',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'PHP',
    currencyAlias: 'Philippine',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'VND',
    currencyAlias: 'Vietnam',
    minDepositAmount: 50000,
    maxDepositAmount: 90000000,
  },
  {
    currency: 'THB',
    currencyAlias: 'Thailand',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'KZT',
    currencyAlias: 'Kazakhstani tenge',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'MAD',
    currencyAlias: 'Morocco',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'ZAR',
    currencyAlias: 'South Africa',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'PLN',
    currencyAlias: 'Poland',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'CUP',
    currencyAlias: 'Cuba',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'KRW',
    currencyAlias: 'Korea',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'JPY',
    currencyAlias: 'Japan',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'GBP',
    currencyAlias: 'United Kingdom',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'HRK',
    currencyAlias: 'Croatia',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'ISK',
    currencyAlias: 'Iceland',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'HUF',
    currencyAlias: 'Hungary',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'NOK',
    currencyAlias: 'Norwegian',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'NZD',
    currencyAlias: 'New Zealand Dollar',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'ARS',
    currencyAlias: 'Argentina Peso',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'MXN',
    currencyAlias: 'Mexico Peso',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'AUD',
    currencyAlias: 'Australia Dollar',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'TRY',
    currencyAlias: 'Turkey Lira',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'IRR',
    currencyAlias: 'Iran Rial',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'AED',
    currencyAlias: 'UAE-Dirham',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'CAD',
    currencyAlias: 'Canada Dollar',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'UAH',
    currencyAlias: 'Ukraine Hryvnia',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'CZK',
    currencyAlias: 'Czech Republic Koruna',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'LKR',
    currencyAlias: 'Sri Lanka Rupee',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'ILS',
    currencyAlias: 'Israel Shekel',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'EGP',
    currencyAlias: 'Egypt Pound',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'PKR',
    currencyAlias: 'Pakistan Rupee',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'GHS',
    currencyAlias: 'Ghana Cedi',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'VEF',
    currencyAlias: 'Venezuela Bolívar',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'PEN',
    currencyAlias: 'Peru Sol',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'BGN',
    currencyAlias: 'Bulgaria Lev',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'RSD',
    currencyAlias: 'Serbia Dinar',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
  {
    currency: 'CLP',
    currencyAlias: 'Chile Peso',
    minDepositAmount: 1,
    maxDepositAmount: 900000,
  },
];

export const ERROR_CODE_IGNORE_REFRESH: string[] = [];
export const ERROR_CODE_INVALID_ACCOUNT: string[] = [
  'SIS-COMPANY-001',
  'SIS-COMPANY-002',
  'SIS-USER-001',
  'SIS-USER-99',
];

export const UNICODE_NORMALIZATION = 'NFKC';
export const DATE_FORMAT_VALIDATE = 'Y/m/d';
export const TIME_FORMAT_VALIDATE = 'H:i';
export const MONTH_PICKER_FORMAT = 'Y/m';
export const DATE_TIME_PICKER_FORMAT = 'Y/m/d H:i';
export const DATE_FORMAT_DEFAULT = 'yyyy/MM/dd';
export const DATE_TIME_SUBMIT_FORMAT = 'yyyy-MM-dd HH:mm';
export const DATE_TIME_TRANSACTION_FORMAT = 'yyyy-MM-dd';
export const DATE_TIME_SUBMIT_FORMAT_WITH_SECOND = 'yyyy-MM-dd HH:mm:ss';
export const TIME_DATE_SUBMIT_FORMAT = 'HH:mm:ss yyyy-MM-dd';
export const TIME_SUBMIT_FORMAT_WITH_SECOND = 'HH:mm:ss';
export const TIME_SUBMIT_FORMAT_WITH_MARKER = 'yyyy-MM-dd hh:mm:ss a';
export const TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER = 'MM/dd/yyyy, hh:mm:ss a';
export const DATE_TIME_FORMAT_DEFAULT = 'yyyy/MM/dd HH:mm';
export const DATE_TIME_FORMAT_CSV = 'yyyyMMdd_HHmmss';
export const DATE_TIME_TRASH_FORMAT = 'yyyy/MM/dd - HH:mm';
export const DATE_TIME_CHAT_DATE = 'EEE, MMM dd, yyyy';

export const SELECT_BOX_BORDER_COLOR = '#d1d5db';
export const SELECT_BOX_BORDER_COLOR_FOCUSED = '#4F46E5';
export const INPUT_PLACEHOLDER_COLOR = '#9ca3af';
export const SELECT_BOX_MENU_PORTAL_Z_INDEX = 5;

export const TEXTAREA_ROWS_NUM_DEFAULT = 3;
export const TEXT_SHOW_MORE_LINE_DEFAULT = 1;

export const BASIC_COLOR_DEFAULT = {
  Background: '#005AAA',
  Text: '#FFFFFF',
};

export const LIST_PER_PAGE = [10, 20, 50, 100];

export const LIST_PER_PAGE_SELECT = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];

export const CompanyNotifications = 'companyNotifications';
export const RelationshipOfCompany = ['manager', 'companyRole'];
export const RelationshipOfProduct = ['folder', 'productAttributes'];
export const RELATIONSHIP_PARAMS = {
  permissions: 'permissions',
  roles: 'roles',
  role: 'role',
};

export const STATUS_CODE_NOTFOUND = 404;
export const STATUS_CODE_UNPROCESSABLE_CONTENT = 422;

export const DELIVERY_AUDIENCE = [
  { value: 'ALL', titleKey: 'deliveryAudienceAll' },
  { value: 'TARGET_SELECTION', titleKey: 'deliveryAudienceSelect' },
];

export const TYPE_IMG_AFTER_CROP = 'image/png';
export const EXTENSION_IMG_AFTER_CROP = 'png';

export const FILE_CHUNK_SIZE = 50 * 1024 * 1024; // 50MB
export const DEFAULT_FILE_CHUNK_SIZE = 10 * 1024 * 1024; // 10MB

export const PRODUCT_MAX_FILE_UPLOAD_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
export const PRODUCT_MAX_THUMBNAIL_UPLOAD_SIZE = 15 * 1024 * 1024; // 15MB
export const PRODUCT_MAX_FILE = 500;
export const SINGLE_PRODUCT_MAX_FILE = 100;

export const ACCEPT_IMAGE = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/bmp'];
export const ACCEPT_IMAGE_CROP = ['image/jpg', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/bmp'];
export const ACCEPT_IMAGE_THUMBNAIL = ['image/jpg', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/bmp'];

export const TYPE_IMAGE = 'image';
export const SIZE_IMAGE = '200';
export const SIZE_IMAGE_THUMBNAIL_RESIZE = '500';
export const IMAGE_THUMBNAIL = '/images/thumbImage.jpg';
export const IMAGE_THUMBNAIL_FILE = '/images/thumbFile.jpg';

export const IMAGE_SUFFIX = ['jpg', 'jpeg', 'bmp', 'png'];
export const MIN_CROP_HEIGHT = 50;
export const MIN_CROP_WIDTH = 50;

export const PRODUCT_ATTRIBUTE_NOT_EXIST = 'SIS-PRODUCT-312';

export const CHUNK_BATCH_CREATE_PRODUCT = 100;

export const API_AVATAR = `${process.env.STORAGE_URL}/avatar`;
export const API_GAME_IMAGE = `${process.env.STORAGE_URL}/game`;
export const API_NOTIFICATION_LOGO = `${process.env.API_AVATAR?.replace('avatar/', '')}notification/`;

export const STREAM_API_KEY = process.env.STREAM_CHAT_API_KEY;
export const STREAM_API_SECRET = process.env.STREAM_CHAT_API_SECRET;
export const SOCKET_WALLET_URL = process.env.SOCKET_WALLET_URL;
export const SOCKET_GAME_URL = process.env.SOCKET_GAME_URL;
export const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID;
export const SWAP_MIN = 5;
export const PROJECT_NAME = process.env.project;
export const PROJECT_ID = process.env.projectId;

export const DEFAULT_AVATAR = 'https://bonenza.com/img/avatar-1.png';

export const SIDEBAR_LIST = [
  {
    href: ROUTER.Bonus,
    name: 'sidebar:bonus',
    icon: Category,
  },
  {
    href: '...',
    name: 'sidebar:casino',
    icon: ArrangeHorizontalCircle,
  },
  {
    href: '...',
    name: 'sidebar:sports',
    icon: TrendUp,
  },
  {
    href: '...',
    name: 'sidebar:lottery',
    icon: Card,
  },
  {
    href: ROUTER.Promotion,
    name: 'sidebar:promotions',
    icon: Shop,
  },
  {
    href: '...',
    name: 'sidebar:vipClub',
    icon: StatusUp,
  },
  {
    href: '...',
    name: 'sidebar:settings',
    icon: Setting2,
  },
  {
    href: '...',
    name: 'sidebar:blog',
    icon: DocumentText,
  },
  {
    href: ROUTER.Affiliate,
    name: 'sidebar:affiliate',
    icon: DocumentText,
  },
];

export const USER_DEMO = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const LOGIN_REGISTRATION_METHOD = [
  {
    image: '/img/icon/MetaMask.png',
    name: 'MetaMask',
    href: '#',
  },
  {
    image: '/img/icon/WalletConnect.png',
    name: 'WalletConnect',
    href: '#',
  },
  {
    image: '/img/icon/trust.png',
    name: 'TrustWallet',
    href: '#',
  },
];

export const CRYPTO_DATA: DepositAddress[] = [
  {
    image: '/img/icon/USDT-logo.svg',
    symbol: 'USDT',
    network: 'BEP20',
  },
  {
    image: '/img/icon/USDT-logo.svg',
    symbol: 'USDT',
    network: 'ERC20',
  },
  {
    image: '/img/icon/BNB-logo.svg',
    symbol: 'BNB',
    network: 'Binance Coin(BEP20)',
  },
  {
    image: '/img/icon/ETH-logo.svg',
    symbol: 'ETH',
    network: 'Ethereum',
  },
  {
    image: '/img/icon/GOD-logo.svg',
    symbol: 'GOD',
    network: 'Binance Coin(BEP20)',
  },
  {
    image: '/img/icon/DRON-logo.png',
    symbol: 'DRON',
    network: 'Binance Coin(BEP20)',
  },
  {
    image: '/img/icon/DRON-logo.png',
    symbol: 'BTC',
    network: 'Binance Coin(BEP20)',
  },
  {
    image: '/img/icon/DRON-logo.png',
    symbol: 'BCH',
    network: 'Binance Coin(BEP20)',
  },
];

export const CRYPTO_NORMAL_DATA: DepositAddress[] = [
  {
    symbol: 'All assets',
  },
  {
    symbol: 'USDT',
  },
  {
    symbol: 'BNB',
  },
  {
    symbol: 'ETH',
  },
  {
    symbol: 'GOD',
  },
  {
    symbol: 'DRON',
  },
  {
    symbol: 'BTC',
  },
  {
    symbol: 'BCH',
  },
];

export const LIST_MOONPAY_COIN: MoonpayDepositAddress[] = [
  {
    image: '/img/icon/USDT-logo.svg',
    symbol: 'USDT',
    name: 'USDT (ERC-20)',
    network: '',
    moonpaySymbol: 'usdt',
  },
  {
    image: '/img/icon/BNB-logo.svg',
    symbol: 'BNB',
    name: 'BNB (BEP-20)',
    network: '',
    moonpaySymbol: 'bnb_bsc',
  },
  {
    image: '/img/icon/ETH-logo.svg',
    symbol: 'ETH',
    name: 'ETH',
    network: '',
    moonpaySymbol: 'eth',
  },
  {
    image: '/img/icon/GOD-logo.svg',
    symbol: 'GOD',
    name: 'GOD (ERC-20)',
    network: '',
    moonpaySymbol: 'gods',
  },
];

export const DEPOSIT_DEMO: DepositAddress[] = [
  {
    balance: '0',
    depositAddress: '0x9F0A1d21e888B00c4fB38B39de8F19e0B27933e1',
    network: 'ERC20',
    privateKey: '7fd7be42f70a9f15c18bdba59b73d75a8bd0641f98e7801d0df031c351f8c10b',
    symbol: 'USDT',
  },
];

export const LIST_NETWORK_WITHDRAW: NetworkType[] = [
  {
    image: '/img/icon/ETH-logo.svg',
    symbol: 'ERC20',
  },
  {
    image: '/img/icon/BNB-logo.svg',
    symbol: 'BEP20',
  },
];

export const LIST_COIN_BALANCE: DepositAddress[] = [
  {
    image: '/img/icon/GOD-logo.svg',
    symbol: 'GOD',
    balance: '0',
  },
  {
    image: '/img/icon/USDT-logo.svg',
    symbol: 'USDT',
    balance: '0',
  },
  {
    image: '/img/icon/BNB-logo.svg',
    symbol: 'BNB',
    balance: '0',
  },
  {
    image: '/img/icon/ETH-logo.svg',
    symbol: 'ETH',
    balance: '0',
  },
  {
    image: '/img/icon/DRON-logo.png',
    symbol: 'DRON',
    balance: '0',
  },
];

export enum TOAST_ENUM {
  COMMON = 'COMMON',
  MODAL = 'MODAL',
}

export enum KYC_ENUM {
  REQUIRED = 1,
  REJECT = 4,
  PENDING = 2,
  APPROVE = 3,
}

export const LIST_NETWORK_USDT = ['BEP20', 'ERC20'];

export const BASE_CURRENCY = 'EUR';
export const CONVERT_CURRENCIES =
  'USD,BRL,INR,EUR,RUB,NGN,IDR,BDT,PHP,VND,THB,KZT,MAD,ZAR,PLN,CUP,KRW,JPY,GBP,HRK,ISK,HUF,NOK,NZD,ARS,MXN,AUD,TRY,IRR,AED,CAD,UAH,CZK,LKR,ILS,EGP,PKR,GHS,VEF,PEN,RON,BGN,RSD,CLP';

export const BANNER_DATA = [
  {
    img: '/img/banners/PenaltyShootOut_PragmaticPlay.png',
    url: ROUTER.GameDetail(convertGameIdentifierToUrl('evoplay:PenaltyShootOut')),
  },
  {
    img: '/img/banners/GoldenChicken_SpadeGaming.png',
    url: ROUTER.GameDetail(convertGameIdentifierToUrl('spadegaming:GoldenChicken')),
  },
  {
    img: '/img/banners/RocketBlastMegaways _PragmaticPlay.png',
    url: ROUTER.GameDetail(convertGameIdentifierToUrl('pragmaticexternal:RocketBlastMegaways')),
  },
  {
    img: '/img/banners/GateofOlympus_PragmaticPlay.png',
    url: ROUTER.GameDetail(convertGameIdentifierToUrl('pragmaticexternal:GatesOfOlympus1')),
  },
  {
    img: '/img/banners/SugarSupreme_PragmaticPlay.png',
    url: ROUTER.GameDetail(convertGameIdentifierToUrl('pragmaticexternal:SugarSupremePowernudge')),
  },
  {
    img: '/img/banners/BigBassCrash_PragmaticPlay.png',
    url: ROUTER.GameDetail(convertGameIdentifierToUrl('pragmaticexternal:BigBassCrash')),
  },
  {
    img: '/img/banners/Spaceman_PragmaticPlay.png',
    url: ROUTER.GameDetail(convertGameIdentifierToUrl('pragmaticexternal:Spaceman')),
  },
  {
    img: '/img/banners/BuffaloKing_PragmaticPlay.png',
    url: ROUTER.GameDetail(convertGameIdentifierToUrl('pragmaticexternal:BuffaloKing')),
  },
  {
    img: '/img/banners/Baccarat_PragmaticLive.png',
    url: ROUTER.GameDetail(convertGameIdentifierToUrl('pragmaticexternal:Super8Baccarat')),
  },
  {
    img: '/img/banners/BigBass_PragmaticPlay.png',
    url: ROUTER.GameDetail(convertGameIdentifierToUrl('pragmaticexternal:BigBassChristmasBash')),
  },
  {
    img: '/img/banners/FuryofOdin_PragmaticPlay.png',
    url: ROUTER.GameDetail(convertGameIdentifierToUrl('pragmaticexternal:FuryofOdinMegaways')),
  },
  {
    img: '/img/banners/GrayhoundRacing_GoldenRace.png',
    url: ROUTER.GameDetail(convertGameIdentifierToUrl('infin:Dog6')),
  },
  {
    img: '/img/banners/Keno_TvBet.png',
    url: ROUTER.GameDetail(convertGameIdentifierToUrl('infin:tvbet_keno')),
  },
];

export const VIP_LEVEL_DATA = [
  {
    id: '1',
    img: '/img/bronze-medal.png',
    rank: 'Bronze',
    level: 'VIP 2-7',
    description: '',
    totalPrize: 1.04,
  },
  {
    id: '2',
    img: '/img/silver-medal.png',
    rank: 'Silver',
    level: 'VIP 8-21',
    description: '* Benefits from previous levels are all included',
    totalPrize: 18.9,
  },
  {
    id: '3',
    img: '/img/gold-medal.png',
    rank: 'Gold',
    level: 'VIP 22-37',
    totalPrize: 204,
    recharge: '10-16%',
    weeklyCashback: 'Wager*1%*5%',
    monthlyCashback: 'Wager*1%*3%',
    description: '* Benefits from previous levels are all included',
  },
  {
    id: '4',
    img: '/img/platinum-medal.png',
    rank: 'Platinum I',
    level: 'VIP 38-55',
    description: '* Benefits from previous levels are all included',
    totalPrize: 1905,
    recharge: '12-18%',
    weeklyCashback: 'Wager*1%*8%',
    monthlyCashback: 'Wager*1%*3.5%',
  },
  {
    id: '5',
    img: '/img/platinum-medal.png',
    rank: 'Platinum II',
    level: 'VIP 56-69',
    description: '* Benefits from previous levels are all included',
    totalPrize: 5850,
    recharge: '14-20%',
    weeklyCashback: 'Wager*1%*8%',
    monthlyCashback: 'Wager*1%*4%',
  },
  {
    id: '6',
    img: '/img/diamond-medal.png',
    rank: 'Diamond I',
    level: 'SVIP 1-15',
    description: '* Benefits from previous levels are all included',
    totalPrize: 30600,
    recharge: '16-22%',
    weeklyCashback: 'Wager*1%*8%',
    monthlyCashback: 'Wager*1%*5%',
  },
  {
    id: '7',
    img: '/img/diamond-medal.png',
    rank: 'Diamond II',
    level: 'SVIP 16-37',
    description: '* Benefits from previous levels are all included',
    totalPrize: 297800,
    recharge: '18-24%',
    weeklyCashback: 'Wager*1%*8%',
    monthlyCashback: 'Wager*1%*5%',
  },
  {
    id: '8',
    img: '/img/diamond-medal.png',
    rank: 'Diamond III',
    level: 'SVIP 38-55',
    description: '* Benefits from previous levels are all included',
    totalPrize: 1462000,
    recharge: '20-25%',
    weeklyCashback: 'Wager*1%*8%',
    monthlyCashback: 'Wager*1%*5%',
  },
];

export const SETTING_BANNER: Settings = {
  dots: true,
  infinite: true,
  speed: 1000,
  slidesToShow: 3,
  swipeToSlide: true,
  autoplay: true,
  arrows: false,
  className: 'banner-container',
  responsive: [
    {
      breakpoint: 540,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 873,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};

export const socketConfig = { transports: ['websocket', 'polling', 'flashsocket'], withCredentials: true };
export const socketWalletConfig = {
  transports: ['websocket'],
  reconnectionDelay: 10000,
  retries: 10,
  reconnectionAttempts: 50,
  withCredentials: true,
  // reconnection: false,
};

export const CHANNELS = [
  {
    id: '1',
    name: 'Global',
  },
  {
    id: '2',
    name: 'Sports',
  },
  {
    id: '3',
    name: 'English',
  },
  {
    id: '4',
    name: 'Português',
  },
  {
    id: '5',
    name: 'Indonesian',
  },
  {
    id: '6',
    name: 'Руccкий',
  },
  {
    id: '7',
    name: 'فارسی',
  },
  {
    id: '8',
    name: 'Español',
  },
  {
    id: '9',
    name: 'Filipino',
  },
  {
    id: '10',
    name: 'Deutsch',
  },
  {
    id: '11',
    name: 'हिन्दी',
  },
  {
    id: '12',
    name: 'မြန်မာ',
  },
  {
    id: '13',
    name: 'Français',
  },
  {
    id: '14',
    name: '한국어',
  },
  {
    id: '15',
    name: 'ภาษาไทย',
  },
  {
    id: '16',
    name: 'Urdu',
  },
  {
    id: '17',
    name: '日本語',
  },
  {
    id: '18',
    name: 'Tiếng Việt',
  },
];

export const billTypes = [
  { name: 'transaction:allType', value: -1 },
  { name: 'transaction:game', value: 1 },
  { name: 'transaction:swap', value: 2 },
  { name: 'transaction:affiliate', value: 3 },
  { name: 'mycasino:tip', value: 4 },
];

export const billType = {
  // VAULT: 'vault',
  GAME: 'game',
  SWAP: 'swap',
  AFFILIATE: 'affiliate',
  // BONUS: 'bonus',
};

export const DEPOSIT_BONUS = [
  {
    deposit: 1,
    percent: 180,
    minAmount: 10, // USD
    maxAmount: 20000, //USDT
  },
  {
    deposit: 2,
    percent: 240,
    minAmount: 50, // USD
    maxAmount: 40000, // USDT
  },
  {
    deposit: 3,
    percent: 300,
    minAmount: 100, // USD
    maxAmount: 60000, // USDT
  },
  {
    deposit: 4,
    percent: 360,
    minAmount: 200, // USD
    maxAmount: 100000, // USDT
  },
];

export const LIST_FILTER_TYPE = [
  { name: 'transaction:deposit', type: TRANSACTION_TYPE.Deposit },
  { name: 'transaction:withdraw', type: TRANSACTION_TYPE.Withdraw },
  { name: 'transaction:swap', type: TRANSACTION_TYPE.Swap },
  // { name: 'transaction:buyCrypto', type: TRANSACTION_TYPE.Buy_Crypto },
  { name: 'transaction:bill', type: TRANSACTION_TYPE.Bill },
  { name: 'transaction:bonus', type: TRANSACTION_TYPE.Bonus },
];
export const LIST_FILTER_DATE = [
  { name: 'transaction:past60Days', type: 60 },
  { name: 'transaction:past24Hours', type: 1 },
  { name: 'transaction:past7Days', type: 7 },
  { name: 'transaction:past90Days', type: 90 },
];
export const LIST_FILTER_STATUS = [
  { name: 'transaction:allStatus', type: '', flag: true },
  { name: 'transaction:complete', type: 'complete', flag: true },
  { name: 'transaction:processing', type: 'processing', flag: true },
  { name: 'transaction:pending', type: 'pending', flag: true },
  { name: 'transaction:failed', type: 'failed', flag: false },
  { name: 'transaction:canceled', type: 'rejected', flag: false },
];

export const groupMedal = [
  { img: '/img/medal-1.png', key: 'fearless_one', text: 'Fearless One', val: 'fearlessOne' },
  { img: '/img/medal-2.png', key: 'the_loaded_king', text: 'The Loaded King', val: 'theLoadedKing' },
  { img: '/img/medal-3.png', key: 'highest_contributor', text: 'Highest Contributor', val: 'highestContributor' },
  { img: '/img/medal-4.png', key: 'the_top_gun', text: 'The Top Gun', val: 'theTopGun' },
  { img: '/img/medal-5.png', key: 'invincible_lucky_dog', text: 'Invincible Lucky Dog', val: 'invincibleLuckyDog' },
  { img: '/img/medal-6.png', key: 'chicken_dinner', text: 'Chicken Dinner', val: 'chickenDinner' },
  { img: '/img/medal-7.png', key: 'loyal_player', text: 'Loyal Player', val: 'loyalPlayer' },
  { img: '/img/medal-1.png', key: 'call_me_richman', text: 'Call Me RichMan', val: 'callMeRichMan' },
  { img: '/img/medal-2.png', key: 'the_old_timer', text: 'The Old Timer', val: 'theOldTimer' },
  { img: '/img/medal-3.png', key: 'ethstop_1', text: 'Ethstop 1', val: 'ethStop1' },
];

export const dataMedal = [
  { img: '/img/bronze-medal.png', name: 'Bronze' },
  { img: '/img/silver-medal.png', name: 'Silver' },
  { img: '/img/gold-medal.png', name: 'Gold' },
  { img: '/img/platinum1-medal.png', name: 'Platinum I' },
  { img: '/img/platinum2-medal.png', name: 'Platinum II' },
  { img: '/img/diamond1-medal.png', name: 'Diamond I' },
  { img: '/img/diamond2-medal.png', name: 'Diamond II' },
  { img: '/img/diamond3-medal.png', name: 'Diamond III' },
];

export const dataRibbon = [
  { img: '/img/vip/bronze-ribbon.png', name: 'Bronze' },
  { img: '/img/vip/silver-ribbon.png', name: 'Silver' },
  { img: '/img/vip/gold-ribbon.png', name: 'Gold' },
  { img: '/img/vip/platinum-i-ribbon.png', name: 'Platinum I' },
  { img: '/img/vip/platinum-ii-ribbon.png', name: 'Platinum II' },
  { img: '/img/vip/diamond-i-ribbon.png', name: 'Diamond I' },
  { img: '/img/vip/diamond-ii-ribbon.png', name: 'Diamond II' },
  { img: '/img/vip/diamond-iii-ribbon.png', name: 'Diamond III' },
];
