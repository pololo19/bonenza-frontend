import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthState } from '@/base/types/reducer-states';
import { KYC_ENUM } from '@/base/constants/common';

const initialCommonState: AuthState = {
  isLogin: false,
  wallet: '',
  userName: '',
  userId: '',
  email: '',
  phone: '',
  avatar: '',
  uuid: '',
  betCount: 0,
  winCount: 0,
  totalWager: 0,
  referralCode: '',
  isKyc: KYC_ENUM.REQUIRED,
};

export const queryDataSlice = createSlice({
  name: 'auth',
  initialState: initialCommonState,
  reducers: {
    saveUserInfo: (state: AuthState, action: PayloadAction<AuthState>) => {
      state.isLogin = action.payload.isLogin;
      state.wallet = action.payload.wallet;
      state.userName = action.payload.userName;
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.avatar = action.payload.avatar;
      state.uuid = action.payload.uuid;
      state.betCount = action.payload.betCount;
      state.winCount = action.payload.winCount;
      state.totalWager = action.payload.totalWager;
      state.referralCode = action.payload.referralCode;
      state.isKyc = action.payload.isKyc;
    },
    logoutState: (state: AuthState) => {
      state.isLogin = false;
      state.wallet = '';
      state.userName = '';
      state.userId = '';
      state.email = '';
      state.phone = '';
      state.avatar = '';
      state.uuid = '';
      state.referralCode = '';
      state.betCount = 0;
      state.winCount = 0;
      state.totalWager = 0;
    },
  },
});

export const { saveUserInfo, logoutState } = queryDataSlice.actions;
export default queryDataSlice.reducer;
