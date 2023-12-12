import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { api_getWalletDepositInfo } from '@/api/wallet';
import { AppDispatch } from '@/base/redux/store';
import { WalletState } from '@/base/types/reducer-states';
import { BalanceType, CryptoNetWorkType, CurrencySymbolType, WalletType } from '@/base/types/wallet';

const initialState: WalletState = {
  networks: [],
  symbols: [],
  balances: [],
  depositAddress: [],
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
    setDepositAddress: (state: WalletState, action: PayloadAction<WalletType[]>) => {
      state.depositAddress = [...action.payload];
    },
  },
});

export const { setNetworks, setBalances, setDepositAddress, setSymbols } = walletReducer.actions;
export default walletReducer.reducer;

export const getDepositInfo = () => async (dispatch: AppDispatch) => {
  try {
    const result = await api_getWalletDepositInfo();
    const { wallets, balances, networks, symbols } = result.data;

    const tempWallets: WalletType[] = wallets.map((item: any) => ({
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

    const tempNetworks: CryptoNetWorkType[] = networks.map((item: any) => ({
      id: item.id,
      name: item.network,
      type: item.type,
    }));

    const tempSymbols: CurrencySymbolType[] = symbols.map((item: any) => ({
      id: item.id,
      name: item.symbol,
      logo: item.logo,
      iso_currency: item.iso_currency,
      iso_decimals: item.iso_decimals,
      availableNetworks: item.availableNetworks,
    }));
    // console.log(result.data);
    dispatch(setNetworks(tempNetworks));
    dispatch(setBalances(tempBalances));
    dispatch(setDepositAddress(tempWallets));
    dispatch(setSymbols(tempSymbols));
  } catch (error) {
    console.log(error);
    dispatch(setNetworks([]));
    dispatch(setBalances([]));
    dispatch(setDepositAddress([]));
    dispatch(setSymbols([]));
  }
};
