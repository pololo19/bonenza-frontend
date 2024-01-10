import {
  API_GAME_BET_HISTORY,
  API_GAME_BET_HISTORY_FOR_GAME,
  API_GAME_BET_HISTORY_FOR_USER,
  API_GAME_BLACKJACK,
  API_GAME_CREATE_SESSION,
  API_GAME_DETAIL,
  API_GAME_FAVORITE_GAMES,
  API_GAME_FEATURE_BUY_IN,
  API_GAME_GAMES_BY_PROVIDER,
  API_GAME_HOT_GAMES,
  API_GAME_LIVE_CASINO,
  API_GAME_NEW_RELEASE,
  API_GAME_PICK_GAMES,
  API_GAME_PROVIDER,
  API_GAME_RECENT_BIG_WINS,
  API_GAME_RECENT_GAMES,
  API_GAME_SLOT,
  API_GAME_START_DEMO,
  API_GAME_TABLE_GAMES,
  API_GAME_THEME,
  API_GAME_TOP_RATED_GAMES,
} from 'constants/endpoints';

import { GameCreateSessionRequest, GameDemoRequest } from '@/base/types/requestTypes';

import api from '../api';

export type SortType = 'popular' | 'asc' | 'desc' | 'new' | 'a-z' | 'z-a' | 'like';

export type CasinoRequest = {
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

export const api_getGameDetail = async (identifier: string) => {
  return api.get(API_GAME_DETAIL, { params: { identifier } });
};

export const api_getCasinoWithKey = async (key: string, params: CasinoRequest) => {
  switch (key) {
    case 'slots':
      return api.get(API_GAME_SLOT, { params });
    case 'live-casino':
      return api.get(API_GAME_LIVE_CASINO, { params });
    case 'hot-games':
      return api.get(API_GAME_HOT_GAMES, { params });
    case 'new-releases':
      return api.get(API_GAME_NEW_RELEASE, { params });
    case 'blackjack':
      return api.get(API_GAME_BLACKJACK, { params });
    case 'feature-buy-in':
      return api.get(API_GAME_FEATURE_BUY_IN, { params });
    case 'table-games':
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

export const api_startGameDemo = async (data: GameDemoRequest) => {
  return api.post(API_GAME_START_DEMO, data);
};

export const api_startGameSession = async (data: GameCreateSessionRequest) => {
  return api.post(API_GAME_CREATE_SESSION, data);
};

export const api_getLatestBets = async () => {
  return api.get(API_GAME_BET_HISTORY);
};

export const api_getLatestBetsForGame = async (gameId: string) => {
  return api.get(API_GAME_BET_HISTORY_FOR_GAME, { params: { gameId } });
};

export const api_getLatestBetForUser = async (gameId: string) => {
  return api.get(API_GAME_BET_HISTORY_FOR_USER, { params: { gameId } });
};

export const api_getRecentBigWins = async () => {
  return api.get(API_GAME_RECENT_BIG_WINS);
};

export const api_getTopRelatedGames = async () => {
  return api.get(API_GAME_TOP_RATED_GAMES);
};

export const api_getGamesByProvider = async (providerName: string, sort: SortType, page: number, pageSize: number) => {
  return api.get(API_GAME_GAMES_BY_PROVIDER, { params: { providerName, sort, page, pageSize } });
};

export const api_getThemes = async () => {
  return api.get(API_GAME_THEME);
};
