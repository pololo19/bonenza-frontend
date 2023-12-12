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
  URL_REFRESH_TOKEN,
};
