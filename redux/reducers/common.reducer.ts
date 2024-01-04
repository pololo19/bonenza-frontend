import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CookieKey, CRYPTO_DATA, FIAT_DATA } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { DepositAddress, FiatType } from '@/base/types/common';
import { CommonState } from '@/base/types/reducer-states';

const initialCommonState: CommonState = {
  fiatArray: FIAT_DATA,
  cryptoArray: [],
  depositCryptoArray: CRYPTO_DATA,
  localeFiat: undefined,
  activeFiat: undefined,
  viewInFiat: false,
  showFullNameCurrency: true,
  usdtNetwork: 'BEP20',
  casinoTab: false,
};

export const queryDataSlice = createSlice({
  name: 'common',
  initialState: initialCommonState,
  reducers: {
    changeDepositCryptoArray: (state: CommonState, action: PayloadAction<DepositAddress[]>) => {
      state.depositCryptoArray = action.payload;
    },
    changeUsdtNetwork: (state: CommonState, action: PayloadAction<string>) => {
      state.usdtNetwork = action.payload.length ? action.payload : 'BEP20';
    },
    changeFiatArray: (state: CommonState, action: PayloadAction<FiatType[]>) => {
      state.fiatArray = action.payload;
    },
    changeCryptoArray: (state: CommonState, action: PayloadAction<FiatType[]>) => {
      state.cryptoArray = action.payload;
    },
    changeShowFullNameCurrency: (state: CommonState, action: PayloadAction<boolean>) => {
      state.showFullNameCurrency = action.payload;
    },
    changeLocaleFiat: (state: CommonState, action: PayloadAction<FiatType | undefined>) => {
      if (action.payload) {
        state.localeFiat = action.payload;
        CookiesStorage.setCookieData(CookieKey.localeFiat, String(action.payload.currency));
        CookiesStorage.setCookieData(CookieKey.localeFiatData, JSON.stringify(action.payload));
      } else {
        state.localeFiat = undefined;
        CookiesStorage.clearCookieData(CookieKey.localeFiat);
        CookiesStorage.clearCookieData(CookieKey.localeFiatData);
      }
    },
    changeActiveFiat: (state: CommonState, action: PayloadAction<FiatType | DepositAddress>) => {
      state.activeFiat = action.payload;
      CookiesStorage.setCookieData(CookieKey.activeFiatData, JSON.stringify(action.payload));
    },
    changeViewInFiat: (state: CommonState, action: PayloadAction<boolean>) => {
      state.viewInFiat = action.payload;
    },
    updateBalanceSocket: (state: CommonState, action: PayloadAction<any>) => {
      const depositCryptoArray: DepositAddress[] = JSON.parse(JSON.stringify(state.depositCryptoArray));
      const cryptoArray: FiatType[] = JSON.parse(JSON.stringify(state.cryptoArray));
      const fiatArray: FiatType[] = JSON.parse(JSON.stringify(state.fiatArray));
      const activeFiat: FiatType = JSON.parse(JSON.stringify(state.activeFiat));
      // Update Exchange Rate
      const exchangeRateData = CookiesStorage.getCookieData(CookieKey.exchangeRate);
      if (exchangeRateData && action.payload.activeFiat && action.payload.localeFiat) {
        const exchangeRateObj = JSON.parse(exchangeRateData);
        exchangeRateObj[action.payload.activeFiat] = Number(action.payload.activeRate);
        exchangeRateObj[action.payload.localeFiat] = Number(action.payload.localeRate);
        CookiesStorage.setCookieData(CookieKey.exchangeRate, JSON.stringify(exchangeRateObj).toUpperCase());
      }

      // Update Fiat Array
      const updateFiatArray = fiatArray?.map((fiatDetail) => {
        if (fiatDetail.currency === action.payload.activeFiat) {
          return { ...fiatDetail, ...crypto, amount: Number(action.payload.balance) };
        }
        return fiatDetail;
      });

      // Update Crypto Array
      const updateCryptoArray = cryptoArray?.map((cryptoDetail) => {
        if (cryptoDetail.currency === action.payload.symbol && cryptoDetail.currencyAlias === action.payload.network) {
          return { ...cryptoDetail, ...crypto, amount: Number(action.payload.balance) };
        }
        return cryptoDetail;
      });
      // Update Deposit Crypto Array
      const updateDepositCrypto = depositCryptoArray?.map((cryptoDetail) => {
        if (cryptoDetail.symbol === action.payload.symbol && cryptoDetail.network === action.payload.network) {
          return { ...cryptoDetail, ...crypto, balance: String(action.payload.balance) };
        }
        return cryptoDetail;
      });
      // Update Active Currency
      const updateActiveFiat: FiatType | undefined = [...updateFiatArray, ...updateCryptoArray].find(
        (currency) => currency.currency === activeFiat.currency,
      );
      state.depositCryptoArray = updateDepositCrypto;
      state.cryptoArray = updateCryptoArray;
      state.fiatArray = updateFiatArray;
      if (updateActiveFiat) state.activeFiat = updateActiveFiat;
    },
    updateCryptoSocket: (state: CommonState, action: PayloadAction<any>) => {
      const depositCryptoArray: DepositAddress[] = JSON.parse(JSON.stringify(state.depositCryptoArray));
      const cryptoArray: FiatType[] = JSON.parse(JSON.stringify(state.cryptoArray));
      const activeFiat: FiatType = JSON.parse(JSON.stringify(state.activeFiat));
      const fiatArray: FiatType[] = JSON.parse(JSON.stringify(state.fiatArray));

      // Update Crypto Array
      const updateCryptoArray = cryptoArray?.map((cryptoDetail) => {
        if (cryptoDetail.currency === action.payload.symbol && cryptoDetail.currencyAlias === action.payload.network) {
          return { ...cryptoDetail, ...crypto, amount: Number(action.payload.balance) };
        }
        return cryptoDetail;
      });
      // Update Deposit Crypto Array
      const updateDepositCrypto = depositCryptoArray?.map((cryptoDetail) => {
        if (cryptoDetail.symbol === action.payload.symbol && cryptoDetail.network === action.payload.network) {
          return { ...cryptoDetail, ...crypto, balance: String(action.payload.balance) };
        }
        return cryptoDetail;
      });
      // Update Active Currency
      const updateActiveFiat: FiatType | undefined = [...fiatArray, ...updateCryptoArray].find(
        (currency) => currency.currency === activeFiat.currency,
      );
      state.depositCryptoArray = updateDepositCrypto;
      state.cryptoArray = updateCryptoArray;
      if (updateActiveFiat) state.activeFiat = updateActiveFiat;
    },
    updateLockedAmountCryptoSocket: (state: CommonState, action: PayloadAction<any>) => {
      const depositCryptoArray: DepositAddress[] = JSON.parse(JSON.stringify(state.depositCryptoArray));
      const cryptoArray: FiatType[] = JSON.parse(JSON.stringify(state.cryptoArray));
      const activeFiat: FiatType = JSON.parse(JSON.stringify(state.activeFiat));
      const fiatArray: FiatType[] = JSON.parse(JSON.stringify(state.fiatArray));
      // Update Crypto Array
      const updateCryptoArray = cryptoArray?.map((cryptoDetail) => {
        if (cryptoDetail.currency === action.payload.symbol && cryptoDetail.currencyAlias === action.payload.network) {
          return { ...cryptoDetail, ...crypto, amountLocked: Number(action.payload.balance_locked) };
        }
        return cryptoDetail;
      });
      // Update Deposit Crypto Array
      const updateDepositCrypto = depositCryptoArray?.map((cryptoDetail) => {
        if (cryptoDetail.symbol === action.payload.symbol && cryptoDetail.network === action.payload.network) {
          return { ...cryptoDetail, ...crypto, balanceLocked: String(action.payload.balance_locked) };
        }
        return cryptoDetail;
      });
      // Update Active Currency
      const updateActiveFiat: FiatType | undefined = [...fiatArray, ...updateCryptoArray].find(
        (currency) => currency.currency === activeFiat.currency,
      );
      state.depositCryptoArray = updateDepositCrypto;
      state.cryptoArray = updateCryptoArray;
      if (updateActiveFiat) state.activeFiat = updateActiveFiat;
    },
    setCasinoTab: (state: CommonState, action: PayloadAction<boolean>) => {
      state.casinoTab = action.payload;
    },
  },
});

export const {
  updateLockedAmountCryptoSocket,
  changeShowFullNameCurrency,
  updateBalanceSocket,
  updateCryptoSocket,
  changeDepositCryptoArray,
  changeFiatArray,
  changeLocaleFiat,
  changeActiveFiat,
  changeCryptoArray,
  changeViewInFiat,
  changeUsdtNetwork,
  setCasinoTab,
} = queryDataSlice.actions;
export default queryDataSlice.reducer;
