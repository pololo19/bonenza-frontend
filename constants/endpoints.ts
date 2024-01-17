const URL_REFRESH_TOKEN = '/refresh';
const URL_COMPANIES = '/admin/companies';

/************************************ Verify **********************************/
const API_AUTH_SEND_MAIL = '/auth/send-mail';
const API_AUTH_SEND_SMS = '/auth/send-sms';
const API_AUTH_VERIFY_CODE = '/auth/verify-code';
const API_AUTH_VERIFY_QR_CODE = '/auth/send-verify-qr-code';

const API_AUTH_VALIDATE_TOKEN = (token: string) => `/auth/validate/${token}`;

/************************************ Authrization **********************************/
const API_ADMIN_LOGIN = '/admin-auth/login';
const API_AUTH_LOGIN = '/auth/login';
const API_AUTH_LOGIN_WITH_GOOGLE = '/auth/save-info-login-google';
const API_AUTH_SIGNUP_WITH_EMAIL = '/auth/sign-up-with-email';
const API_AUTH_SIGNUP_WITH_PHONE = '/auth/sign-up-with-phone';
const API_AUTH_FORGOT_PASSWORD = '/auth/forgot-password';
const API_AUTH_RESET_PASSWORD = '/auth/reset-password';
const API_AUTH_GENERATE_QR_CODE = '/auth/generate-secret';
const API_AUTH_SET_LOGIN = '/auth/get-set-login';
const API_AUTH_SET_LOGIN_PASSWORD = '/auth/set-login-password';
const API_AUTH_CHANGE_PASSWORD = '/auth/change-password';
const API_AUTH_GET_2FA_STATUS = '/auth/get-two-factor-auth-status';

/************************************ User Profile **********************************/
const API_USER_PROFILE_GET_PROFILE = `/user-profile/get-user-profile`;
const API_USER_PROFILE_EDIT_PROFILE = '/user-profile/edit-profile';
const API_USER_PROFILE_UPLOAD_AVATAR = '/user-profile/upload-avatar';

/************************************ User Setting **********************************/
const API_USER_SETTING_GENERAL_SETTING = '/user-setting/get-general-setting';
const API_USER_SETTING_PRIVACY_SETTING = '/user-setting/get-privacy-setting';
const API_USER_SETTING_EMAIL_AND_PHONE_VERIFY = '/user-setting/get-email-and-phone-verify';
const API_USER_SETTING_UPDATE = '/user-setting/edit-setting';
const API_USER_SETTING_ENABLE_TFA = '/user-setting/confirm-qr-code';
const API_USER_SETTING_DISABLE_TFA = '/user-setting/disable-two-factor-authentication';

/************************************ User Session **********************************/
const API_USER_SESSION_LIST_SESSIONS = '/user-session/get-list-user-session';
const API_USER_SESSION_DELETE_SESSION = `/user-session/delete-user-session`;

/************************************ Wallet **********************************/
const API_WALLET_USER_BALANCE = '/wallet/get-balance';
const API_WALLET_INFO = '/wallet/get-wallet-info';
const API_WALLET_WITHDRAW = '/wallet/withdraw';
const API_WALLET_SWAP_RATE = '/wallet/swap/prices';
const API_WALLET_SWAP = '/wallet/swap';
const API_WALLET_TRANSACTIONS = '/wallet/transaction';
const API_WALLET_DEPOSIT_TIME = '/wallet/get-deposit-time-for-this-week';
const API_WALLET_INIT_DATA = '/wallet/init-currency';
const API_WALLET_SET_FAVORITE = '/wallet/set-currency-favorite-status';

/************************************ Game **********************************/
const API_GAME_PICK_GAMES = '/game/get-pick-games-for-you';
const API_GAME_FAVORITE_GAMES = '/game/get-favorite-games';
const API_GAME_RECENT_GAMES = '/game/get-recent-games';
const API_GAME_PROVIDER = '/game/get-providers';

const API_GAME_SLOT = '/game/get-slots';
const API_GAME_LIVE_CASINO = '/game/get-live-casino';
const API_GAME_HOT_GAMES = '/game/get-hot-games';
const API_GAME_NEW_RELEASE = '/game/get-new-releases';
const API_GAME_FEATURE_BUY_IN = '/game/get-feature-buy-in';
const API_GAME_BLACKJACK = '/game/get-blackjack';
const API_GAME_TABLE_GAMES = '/game/get-table-games';
const API_GAME_DETAIL = '/game/get-game';

const API_GAME_START_DEMO = '/game/start-demo';
const API_GAME_CREATE_SESSION = '/game/create-session';
const API_GAME_PLAY = '/game/play';
const API_GAME_ROLLBACK = '/game/rollback';

const API_GAME_BET_HISTORY = '/game/get-latest-bets';
const API_GAME_BET_HISTORY_FOR_GAME = '/game/get-latest-bets-for-game';
const API_GAME_BET_HISTORY_FOR_USER = '/game/get-latest-bets-for-user-game';
const API_GAME_RECENT_BIG_WINS = '/game/get-recent-big-wins';
const API_GAME_TOP_RATED_GAMES = '/game/get-top-rated-games';

const API_GAME_THEME = '/game/get-themes';
const API_GAME_GAMES_BY_PROVIDER = '/game/get-games-by-provider';
const API_GAME_GAMES_BY_THEME = '/game/get-games-by-theme';
const API_GAME_GAMES_BY_NAME_PROVIDER = '/game/get-game-by-name-and-provider';

const API_GAME_SET_FAVORITE = '/game/set-game-favorite-status';

const URL_AUTH_COMPANIES = '/auth/companies';
const URL_LOGIN_COMPANY = (companyId: number) => `/companies/${companyId}/login`;

const URL_SEND_VERIFY_QR_CODE = '/auth/send-verify-qr-code';
const URL_GET_USER_INFO = '/auth/get-user-info';

const URL_VERIFY_TOKEN = '/verify-token';
const URL_UPDATE_PASS = 'update-password';
const URL_LOGOUT = '/logout';

const URL_FIAT_EXCHANGE_RATE = 'exchange/get-fiat-exchange-rate';
const URL_CRYPTO_EXCHANGE_RATE = 'exchange/get-crypto-exchange-rate';
const URL_EXCHANGE_RATE = 'exchange/get-exchange-rate';

export {
  API_ADMIN_LOGIN,
  API_AUTH_CHANGE_PASSWORD,
  API_AUTH_FORGOT_PASSWORD,
  API_AUTH_GENERATE_QR_CODE,
  API_AUTH_GET_2FA_STATUS,
  API_AUTH_LOGIN,
  API_AUTH_LOGIN_WITH_GOOGLE,
  API_AUTH_RESET_PASSWORD,
  API_AUTH_SEND_MAIL,
  API_AUTH_SEND_SMS,
  API_AUTH_SET_LOGIN,
  API_AUTH_SET_LOGIN_PASSWORD,
  API_AUTH_SIGNUP_WITH_EMAIL,
  API_AUTH_SIGNUP_WITH_PHONE,
  API_AUTH_VALIDATE_TOKEN,
  API_AUTH_VERIFY_CODE,
  API_AUTH_VERIFY_QR_CODE,
  API_GAME_BET_HISTORY,
  API_GAME_BET_HISTORY_FOR_GAME,
  API_GAME_BET_HISTORY_FOR_USER,
  API_GAME_BLACKJACK,
  API_GAME_CREATE_SESSION,
  API_GAME_DETAIL,
  API_GAME_FAVORITE_GAMES,
  API_GAME_FEATURE_BUY_IN,
  API_GAME_GAMES_BY_NAME_PROVIDER,
  API_GAME_GAMES_BY_PROVIDER,
  API_GAME_GAMES_BY_THEME,
  API_GAME_HOT_GAMES,
  API_GAME_LIVE_CASINO,
  API_GAME_NEW_RELEASE,
  API_GAME_PICK_GAMES,
  API_GAME_PLAY,
  API_GAME_PROVIDER,
  API_GAME_RECENT_BIG_WINS,
  API_GAME_RECENT_GAMES,
  API_GAME_ROLLBACK,
  API_GAME_SET_FAVORITE,
  API_GAME_SLOT,
  API_GAME_START_DEMO,
  API_GAME_TABLE_GAMES,
  API_GAME_THEME,
  API_GAME_TOP_RATED_GAMES,
  API_USER_PROFILE_EDIT_PROFILE,
  API_USER_PROFILE_GET_PROFILE,
  API_USER_PROFILE_UPLOAD_AVATAR,
  API_USER_SESSION_DELETE_SESSION,
  API_USER_SESSION_LIST_SESSIONS,
  API_USER_SETTING_DISABLE_TFA,
  API_USER_SETTING_EMAIL_AND_PHONE_VERIFY,
  API_USER_SETTING_ENABLE_TFA,
  API_USER_SETTING_GENERAL_SETTING,
  API_USER_SETTING_PRIVACY_SETTING,
  API_USER_SETTING_UPDATE,
  API_WALLET_DEPOSIT_TIME,
  API_WALLET_INFO,
  API_WALLET_INIT_DATA,
  API_WALLET_SET_FAVORITE,
  API_WALLET_SWAP,
  API_WALLET_SWAP_RATE,
  API_WALLET_TRANSACTIONS,
  API_WALLET_USER_BALANCE,
  API_WALLET_WITHDRAW,
  URL_REFRESH_TOKEN,
};
