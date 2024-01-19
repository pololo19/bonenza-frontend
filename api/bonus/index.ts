import { API_AFFILIATE } from '@/base/constants/endpoints';

import api from '../api';

export const api_affiliate = async () => {
  return api.get(API_AFFILIATE);
};
