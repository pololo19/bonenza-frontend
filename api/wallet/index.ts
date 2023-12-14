import { API_WALLET_INFO, API_WALLET_USER_BALANCE, API_WALLET_WITHDRAW } from 'constants/endpoints';

import { WithdrawRequest } from '@/base/types/requestTypes';

import api from '../api';

export const api_getWalletInfo = async () => {
  return api.get(API_WALLET_INFO);
};

export const api_getUserBalance = async () => {
  return api.get(API_WALLET_USER_BALANCE);
};

export const api_withdraw = async (data: WithdrawRequest) => {
  return api.post(API_WALLET_WITHDRAW, data);
};
