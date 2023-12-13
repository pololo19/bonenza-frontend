import { API_WALLET_INFO } from 'constants/endpoints';

import api from '../api';

export const api_getWalletInfo = async () => {
  return api.get(API_WALLET_INFO);
};
