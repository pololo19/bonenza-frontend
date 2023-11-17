import { Action, configureStore, ThunkAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import authReducer from './reducers/auth.reducer';
import modalReducer from './reducers/modal.reducer';
import loadingReducer from './reducers/loading.reducer';
import commonReducer from './reducers/common.reducer';
const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      modal: modalReducer,
      loading: loadingReducer,
      common: commonReducer,
    },
    devTools: process.env.NODE_ENV === 'development',
    middleware: customizedMiddleware,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const wrapper = createWrapper<AppStore>(makeStore);
