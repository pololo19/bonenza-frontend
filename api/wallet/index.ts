import { API_WALLET_DEPOSIT_INFO } from 'constants/endpoints';

import api from '../api';

export const api_getWalletDepositInfo = async () => {
  return api.get(API_WALLET_DEPOSIT_INFO);
};
