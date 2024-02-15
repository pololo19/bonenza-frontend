import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';
import isNil from 'lodash.isnil';
import Router from 'next/router';

import i18n from '@/config/i18next';
import { CookieKey, ROUTER } from '@/constants/common';
import { URL_REFRESH_TOKEN } from '@/constants/endpoints';
import { CookiesStorage } from '@/libs/storage/cookie';
import { stringifyParams } from '@/libs/utils';

import { createAxios as createHttpClient } from './_http/axios';

export const baseURL = process.env.API_URL;

const defaultAxiosConfig: AxiosRequestConfig = {
  baseURL: baseURL,
  timeout: 30000,
  paramsSerializer: {
    serialize: (params: any) =>
      stringifyParams({
        params: decamelizeKeys({ ...params }),
        option: {
          encode: !isNil(params?.tags) || false,
        },
      }),
  },
};

let refreshAccessTokenRequest: Promise<unknown> | null = null;
export const getAccessToken = () => `Bearer ${CookiesStorage.getAccessToken()}`;
export const getRefreshToken = () => CookiesStorage.getRefreshToken();
export const getCompanyId = () => CookiesStorage.getCookieData(CookieKey.companyId);
export const refreshAccessToken = async () => {
  const httpClient = createHttpClient();
  const { data } = await httpClient.post(URL_REFRESH_TOKEN, {
    refresh_token: getRefreshToken(),
  });
  const accessTokenNew = data.data.access_token;
  const refreshTokenNew = data.data.refresh_token;
  CookiesStorage.setAccessToken(accessTokenNew);
  CookiesStorage.setRefreshToken(refreshTokenNew);
  return accessTokenNew;
};

const transformResponse = (response: AxiosResponse) => {
  if (response?.data) {
    return { ...response, data: camelizeKeys(response.data) };
  }
  return response;
};
/* eslint-disable no-underscore-dangle, no-param-reassign */
const wrapApiErrors = async (error: any, axiosInstance: AxiosInstance) => {
  const status = error.response?.status || error.status;
  if (!status) {
    throw new Error('Connection with API server is broken');
  }
  switch (status) {
    case 401:
      CookiesStorage.logout();
      return Promise.reject(error);
    case 403: {
      Router.push(ROUTER.PageNotAllowed);
      return Promise.reject(error);
    }
    default:
      return Promise.reject(error);
  }
};
/* eslint-enable */
const api = axios.create({
  ...defaultAxiosConfig,
  headers: {
    ...defaultAxiosConfig.headers,
  },
});
api.interceptors.request.use((config) => {
  const authorization = getAccessToken();
  if (!authorization.includes('null')) {
    config.headers!.Authorization = authorization;
  }
  if (config.data instanceof FormData) {
    return config;
  }
  config.headers['Content-Type'] = 'application/json';
  if (config.data) {
    config.data = decamelizeKeys(config.data);
  }
  if (config.params) {
    config.params = decamelizeKeys(config.params);
  }
  return config;
});
api.interceptors.response.use(transformResponse, (error) => {
  const errorResponse = error;

  return wrapApiErrors(errorResponse, api);
});

export default api;
