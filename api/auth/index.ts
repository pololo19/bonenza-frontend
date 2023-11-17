import { AxiosResponse } from 'axios';

import { URL_LOGIN, URL_LOGIN_WITH_EMAIL, URL_SIGNUP_WITH_EMAIL } from '@/base/constants/endpoints';
import { LoginRequest, LoginRequestWithoutCaptcha, LoginResponse } from '@/base/types/auth';
import api from '../api';

export function login(data: LoginRequest): Promise<AxiosResponse<LoginResponse>> {
  return api.post(URL_LOGIN, data);
}

export function loginWithEmail(data: LoginRequestWithoutCaptcha): Promise<AxiosResponse<LoginResponse>> {
  return api.post(URL_LOGIN_WITH_EMAIL, data);
}

export function signUpWithEmail(data: LoginRequestWithoutCaptcha): Promise<AxiosResponse<LoginResponse>> {
  return api.post(URL_SIGNUP_WITH_EMAIL, data);
}
