import { API_WALLET_INFO, API_WALLET_USER_BALANCE } from 'constants/endpoints';

import api from '../api';

export const api_getWalletInfo = async () => {
  return api.get(API_WALLET_INFO);
};

export const api_getUserBalance = async () => {
  return api.get(API_WALLET_USER_BALANCE);
};
