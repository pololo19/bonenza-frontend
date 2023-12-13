import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { api_getUserBalance, api_getWalletInfo } from '@/api/wallet';
import { AppDispatch } from '@/base/redux/store';
import { WalletState } from '@/base/types/reducer-states';
import {
  BalanceType,
  CryptoCurrencyType,
  CryptoNetWorkType,
  CurrencySymbolType,
  DepositAddressType,
} from '@/base/types/wallet';

const initialState: WalletState = {
  networks: [],
  symbols: [],
  balances: [],
  depositAddress: [],
  cryptoCurrencies: [],
};

export const walletReducer = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setNetworks: (state: WalletState, action: PayloadAction<CryptoNetWorkType[]>) => {
      state.networks = [...action.payload];
    },
    setSymbols: (state: WalletState, action: PayloadAction<CurrencySymbolType[]>) => {
      state.symbols = [...action.payload];
    },
    setBalances: (state: WalletState, action: PayloadAction<BalanceType[]>) => {
      state.balances = [...action.payload];
    },
    setDepositAddress: (state: WalletState, action: PayloadAction<DepositAddressType[]>) => {
      state.depositAddress = [...action.payload];
    },
    setCryptoCurrencies: (state: WalletState, action: PayloadAction<CryptoCurrencyType[]>) => {
      state.cryptoCurrencies = [...action.payload];
    },
  },
});

export const { setNetworks, setBalances, setDepositAddress, setSymbols, setCryptoCurrencies } = walletReducer.actions;
export default walletReducer.reducer;

export const getWalletInfo = () => async (dispatch: AppDispatch) => {
  try {
    const result = await api_getWalletInfo();
    const { wallets, balances, networks, symbols, currency } = result.data;

    const tempWallets: DepositAddressType[] = wallets?.map((item: any) => ({
      address: item.depositAddress,
      network: item.network.network,
      networkId: item.network.id,
    }));

    const tempBalances: BalanceType[] = balances?.cryptoBalances.map((item: any) => ({
      amount: Number(item.balance),
      usdAmount: Number(item.balanceUsd),
      symbol: item.symbol,
      symbolId: item.symbolId,
    }));

    const tempNetworks: CryptoNetWorkType[] = networks?.map((item: any) => ({
      id: item.id,
      name: item.network,
      type: item.type,
    }));

    const tempSymbols: CurrencySymbolType[] = symbols?.map((item: any) => ({
      id: item.id,
      name: item.symbol,
      logo: item.logo,
      iso_currency: item.iso_currency,
      iso_decimals: item.iso_decimals,
      availableNetworks: item.availableNetworks,
      price: 0,
    }));

    const tempCurrencies: CryptoCurrencyType[] = currency?.map((item: any) => ({
      id: item.id,
      networkId: item.network.id,
      symbolId: item.symbol.id,
      minWithdrawAmount: Number(item.minimumWithdrawAmountUsd),
    }));
    // console.log(result.data);
    dispatch(setNetworks(tempNetworks));
    dispatch(setBalances(tempBalances));
    dispatch(setDepositAddress(tempWallets));
    dispatch(setSymbols(tempSymbols));
    dispatch(setCryptoCurrencies(tempCurrencies));
  } catch (error) {
    console.log(error);
    dispatch(setNetworks([]));
    dispatch(setBalances([]));
    dispatch(setDepositAddress([]));
    dispatch(setSymbols([]));
  }
};

export const getBalance = () => async (dispatch: AppDispatch) => {
  try {
    const result = await api_getUserBalance();
    const tempBalances: BalanceType[] = result.data?.cryptoBalances?.map((item: any) => ({
      amount: Number(item.balance),
      usdAmount: Number(item.balanceUsd),
      symbol: item.symbol,
      symbolId: item.symbolId,
    }));

    dispatch(setBalances(tempBalances));
  } catch (error) {
    console.log(error);
  }
};
