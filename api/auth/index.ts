import {
  API_AUTH_CHANGE_PASSWORD,
  API_AUTH_FORGOT_PASSWORD,
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
} from 'constants/endpoints';

import {
  LoginRequest,
  ResetPasswordRequest,
  SignUpEmailRequest,
  SignUpPhoneRequest,
  VerifyCodeRequest,
  VerifyRequestType,
} from '@/base/types/requestTypes';

import api from '../api';

export const api_login = (data: LoginRequest) => {
  return api.post(API_AUTH_LOGIN, data);
};

export const api_loginWithGoogle = (code: string) => {
  return api.post(API_AUTH_LOGIN_WITH_GOOGLE, { code });
};

export const api_verify = (data: VerifyCodeRequest) => {
  return api.post(API_AUTH_VERIFY_CODE, data);
};

export const api_sendMail = (email: string, request: VerifyRequestType) => {
  return api.post(API_AUTH_SEND_MAIL, { email, request });
};

export const api_signupWithEmail = (data: SignUpEmailRequest) => {
  return api.post(API_AUTH_SIGNUP_WITH_EMAIL, data);
};

export const api_signupWithPhone = (data: SignUpPhoneRequest) => {
  return api.post(API_AUTH_SIGNUP_WITH_PHONE, data);
};

export const api_forgetPassword = (email: string) => {
  return api.post(API_AUTH_FORGOT_PASSWORD, { email });
};

export const api_sendSMS = (phone: string, request: VerifyRequestType) => {
  return api.post(API_AUTH_SEND_SMS, { phone, request });
};

export const api_sendVerifyQRCode = (email: string) => {
  return api.post(API_AUTH_VERIFY_QR_CODE, { email });
};

export const api_resetPassword = (data: ResetPasswordRequest) => {
  return api.post(API_AUTH_RESET_PASSWORD, data);
};

export const api_validateToken = (token: string) => {
  return api.get(API_AUTH_VALIDATE_TOKEN(token));
};

export const api_getSetLogin = () => {
  return api.get(API_AUTH_SET_LOGIN);
};

export const api_setLoginPassword = (password: string) => {
  return api.put(API_AUTH_SET_LOGIN_PASSWORD, { password });
};

export const api_changePassword = (oldPassword: string, newPassword: string, codeOtp: string = '') => {
  return api.post(API_AUTH_CHANGE_PASSWORD, { oldPassword, newPassword, codeOtp });
};
