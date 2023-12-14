import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { api_getUserBalance, api_getWalletInfo } from '@/api/wallet';
import { AppDispatch } from '@/base/redux/store';
import { WalletState } from '@/base/types/reducer-states';
import {
  BalanceType,
  CryptoCurrencyType,
  CryptoNetWorkType,
  CurrencyType,
  DepositAddressType,
} from '@/base/types/wallet';

const initialState: WalletState = {
  networks: [],
  symbols: [],
  fiatSymbols: [],
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
    setSymbols: (state: WalletState, action: PayloadAction<CurrencyType[]>) => {
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
    setFiatSymbols: (state: WalletState, action: PayloadAction<CurrencyType[]>) => {
      state.fiatSymbols = [...action.payload];
    },
  },
});

export const { setNetworks, setBalances, setDepositAddress, setSymbols, setCryptoCurrencies, setFiatSymbols } =
  walletReducer.actions;
export default walletReducer.reducer;

export const initWalletInfo = () => async (dispatch: AppDispatch) => {
  try {
    const result = await api_getWalletInfo();
    const { wallets, balances, networks, symbols, currency, fiatSymbols } = result.data;

    const tempWallets: DepositAddressType[] =
      wallets?.map((item: any) => ({
        address: item.depositAddress,
        network: item.network.network,
        networkId: item.network.id,
      })) || [];

    const tempBalances: BalanceType[] =
      balances?.cryptoBalances.map((item: any) => ({
        amount: Number(item.balance),
        usdAmount: Number(item.balanceUsd),
        symbol: item.symbol,
        symbolId: item.symbolId,
      })) || [];

    const tempNetworks: CryptoNetWorkType[] =
      networks?.map((item: any) => ({
        id: item.id,
        name: item.network,
        type: item.type,
      })) || [];

    const tempSymbols: CurrencyType[] =
      symbols?.map((item: any) => ({
        id: item.id,
        name: item.symbol,
        alias: '',
        logo: item.logo,
        iso_currency: item.iso_currency,
        iso_decimals: item.iso_decimals,
        availableNetworks: item.availableNetworks,
        price: Number(item.price),
      })) || [];

    const tempCurrencies: CryptoCurrencyType[] =
      currency?.map((item: any) => ({
        id: item.id,
        networkId: item.network.id,
        symbolId: item.symbol.id,
        minWithdrawAmount: Number(item.minimumWithdrawAmountUsd),
      })) || [];

    const tempFiatSymbols: CurrencyType[] = fiatSymbols?.map((item: any) => ({
      id: item.id,
      name: item.symbol,
      alias: item.name,
      logo: '',
      iso_currency: item.iso_currency,
      iso_decimals: item.iso_decimals,
      availableNetworks: item.availableNetworks,
      price: Number(item.price),
    }));
    // console.log(result.data);
    dispatch(setNetworks(tempNetworks));
    dispatch(setBalances(tempBalances));
    dispatch(setDepositAddress(tempWallets));
    dispatch(setSymbols(tempSymbols));
    dispatch(setFiatSymbols(tempFiatSymbols));
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
