import { API_CHAT_ADD, API_CHAT_LATEST } from 'constants/endpoints';

import api from '../api';

export const api_getChatHistory = async (offset: number, limit: number) => {
  return api.get(API_CHAT_LATEST, { params: { offset, limit } });
};
