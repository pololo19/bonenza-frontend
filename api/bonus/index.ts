import { API_AFFILIATE, API_BONUS_USDT_BONUS_HISTORY } from '@/base/constants/endpoints';

import api from '../api';

export const api_affiliate = async () => {
  return api.get(API_AFFILIATE);
};

export const api_bonusUsdtHistory = async (page: number, pageSize: number) => {
  return api.get(API_BONUS_USDT_BONUS_HISTORY, { params: { page, pageSize } });
};
