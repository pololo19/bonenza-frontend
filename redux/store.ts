import { Action, configureStore, getDefaultMiddleware, ThunkAction } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { useDispatch } from 'react-redux';

import authReducer from './reducers/auth.reducer';
import commonReducer from './reducers/common.reducer';
import loadingReducer from './reducers/loading.reducer';
import modalReducer from './reducers/modal.reducer';
import userReducer from './reducers/user.reducer';
import walletReducer from './reducers/wallet.reducer';
const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
      modal: modalReducer,
      loading: loadingReducer,
      common: commonReducer,
      wallet: walletReducer,
    },
    devTools: process.env.NODE_ENV === 'development',
    middleware: customizedMiddleware,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const wrapper = createWrapper<AppStore>(makeStore);
