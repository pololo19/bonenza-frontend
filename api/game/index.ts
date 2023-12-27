import {
  API_GAME_BLACKJACK,
  API_GAME_FAVORITE_GAMES,
  API_GAME_FEATURE_BUY_IN,
  API_GAME_HOT_GAMES,
  API_GAME_LIVE_CASINO,
  API_GAME_NEW_RELEASE,
  API_GAME_PICK_GAMES,
  API_GAME_PROVIDER,
  API_GAME_RECENT_GAMES,
  API_GAME_SLOT,
  API_GAME_TABLE_GAMES,
} from 'constants/endpoints';

import api from '../api';

type SortType = 'popular' | 'asc' | 'desc' | 'new' | 'a-z' | 'z-a';

type CasinoRequest = {
  page: number;
  pageSize: number;
  providers?: string;
  sort?: SortType;
  query?: string;
};

export const api_getPickGames = async (page: number, pageSize: number) => {
  return api.get(API_GAME_PICK_GAMES, { params: { page, pageSize } });
};

export const api_getFavoriteGames = async (page: number, pageSize: number) => {
  return api.get(API_GAME_FAVORITE_GAMES, { params: { page, pageSize } });
};

export const api_getRecentGames = async (page: number, pageSize: number) => {
  return api.get(API_GAME_RECENT_GAMES, { params: { page, pageSize } });
};

export const api_getCasinoWithKey = async (key: string, params: CasinoRequest) => {
  switch (key) {
    case 'slots':
      return api.get(API_GAME_SLOT, { params });
    case 'Live Casino':
      return api.get(API_GAME_LIVE_CASINO, { params });
    case 'Hot Games':
      return api.get(API_GAME_HOT_GAMES, { params });
    case 'New Releases':
      return api.get(API_GAME_NEW_RELEASE, { params });
    case 'Blackjack':
      return api.get(API_GAME_BLACKJACK, { params });
    case 'Feature Buy-in':
      return api.get(API_GAME_FEATURE_BUY_IN, { params });
    case 'Table Games':
      return api.get(API_GAME_TABLE_GAMES, { params });
    default:
      return api.get(API_GAME_SLOT, { params });
  }
};

export const api_getSlots = async (params: CasinoRequest) => {
  return api.get(API_GAME_SLOT, { params });
};

export const api_getProviders = async () => {
  return api.get(API_GAME_PROVIDER);
};

export const api_getLiveCasinos = async (params: CasinoRequest) => {
  return api.get(API_GAME_LIVE_CASINO, { params });
};

export const api_getHotGames = async (params: CasinoRequest) => {
  return api.get(API_GAME_HOT_GAMES, { params });
};
