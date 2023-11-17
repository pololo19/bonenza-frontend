const URL_REFRESH_TOKEN = '/refresh';
const URL_COMPANIES = '/admin/companies';

const URL_LOGIN = '/admin-auth/login';
const URL_LOGIN_WITH_EMAIL = '/auth/login';
const URL_UPDATE_PROFILE = '/auth/edit-profile';
const URL_UPLOAD_AVATAR = '/auth/upload-avatar';
const URL_SIGNUP_WITH_EMAIL = '/auth/sign-up-with-email';
const URL_SIGNUP_WITH_PHONE = '/auth/sign-up-with-phone';
const URL_AUTH_COMPANIES = '/auth/companies';
const URL_LOGIN_COMPANY = (companyId: number) => `/companies/${companyId}/login`;
const URL_FORGOT_PASS = '/forgot-password';
const URL_RESET_PASS = '/reset-password';
const URL_VERIFY_TOKEN = '/verify-token';
const URL_UPDATE_PASS = 'update-password';
const URL_LOGOUT = '/logout';

const URL_FIAT_EXCHANGE_RATE = 'exchange/get-fiat-exchange-rate';
const URL_CRYPTO_EXCHANGE_RATE = 'exchange/get-crypto-exchange-rate';
const URL_EXCHANGE_RATE = 'exchange/get-exchange-rate';

export {
  URL_SIGNUP_WITH_PHONE,
  URL_EXCHANGE_RATE,
  URL_FIAT_EXCHANGE_RATE,
  URL_CRYPTO_EXCHANGE_RATE,
  URL_AUTH_COMPANIES,
  URL_COMPANIES,
  URL_FORGOT_PASS,
  URL_LOGIN,
  URL_LOGIN_COMPANY,
  URL_LOGIN_WITH_EMAIL,
  URL_LOGOUT,
  URL_REFRESH_TOKEN,
  URL_RESET_PASS,
  URL_SIGNUP_WITH_EMAIL,
  URL_UPDATE_PASS,
  URL_VERIFY_TOKEN,
  URL_UPDATE_PROFILE,
  URL_UPLOAD_AVATAR,
};
