import {
  API_WALLET_INFO,
  API_WALLET_SWAP,
  API_WALLET_SWAP_RATE,
  API_WALLET_USER_BALANCE,
  API_WALLET_WITHDRAW,
} from 'constants/endpoints';

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

export const api_exchangeRate = async (from: string, to: string) => {
  return api.get(API_WALLET_SWAP_RATE, { params: { from, to } });
};

export const api_swap = async (from: string, to: string, amount: number) => {
  return api.post(API_WALLET_SWAP, { from, to, amount });
};
