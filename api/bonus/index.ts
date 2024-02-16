import {
  API_AFFILIATE,
  API_AFFILIATE_COMMISSION_REWARDS,
  API_AFFILIATE_FRIENDS,
  API_AFFILIATE_REFERRAL_REWARDS,
  API_BONUS_BONUS_STATISTIC,
  API_BONUS_CLAIM,
  API_BONUS_CLAIM_LIST,
  API_BONUS_DETAILS,
  API_BONUS_USDT_BONUS_HISTORY,
} from '@/base/constants/endpoints';

import api from '../api';

type bonusCategoryType = 'all' | 'level_up' | 'weekly_cashback' | 'monthly_cashback' | 'deposit_bonus';

export const api_affiliate = async () => {
  return api.get(API_AFFILIATE);
};

export const api_affiliateFriends = async (
  page: number,
  pageSize: number,
  userName: string | undefined = undefined,
  userId: string | undefined = undefined,
  registrationStartDate: number | undefined = undefined,
  registrationEndDate: number | undefined = undefined,
  wagerStartDate: number | undefined = undefined,
  wagerEndDate: number | undefined = undefined,
) => {
  return api.get(API_AFFILIATE_FRIENDS, {
    params: {
      page,
      pageSize,
      userName,
      userId,
      registrationStartDate,
      registrationEndDate,
      wagerStartDate,
      wagerEndDate,
    },
  });
};

export const api_affiliateCommissionRewards = async (page: number, pageSize: number) => {
  return api.get(API_AFFILIATE_COMMISSION_REWARDS, { params: { page, pageSize } });
};

export const api_affiliateReferralRewards = async (
  page: number,
  pageSize: number,
  userName: string | undefined = undefined,
  registrationStartDate: number | undefined = undefined,
  registrationEndDate: number | undefined = undefined,
) => {
  return api.get(API_AFFILIATE_REFERRAL_REWARDS, {
    params: { userName, registrationStartDate, registrationEndDate, page, pageSize },
  });
};

export const api_bonusUsdtHistory = async (page: number, pageSize: number) => {
  return api.get(API_BONUS_USDT_BONUS_HISTORY, { params: { page, pageSize } });
};

export const api_bonusClaimList = async () => {
  return api.get(API_BONUS_CLAIM_LIST);
};

export const api_bonusClaim = async (bonusId: string, type: string = 'level_up') => {
  return api.post(API_BONUS_CLAIM, { type, bonusId });
};

export const api_bonusStatistics = async () => {
  return api.get(API_BONUS_BONUS_STATISTIC);
};

export const api_bonusDetail = async (category: bonusCategoryType = 'all') => {
  return api.get(API_BONUS_DETAILS, { params: { category } });
};
