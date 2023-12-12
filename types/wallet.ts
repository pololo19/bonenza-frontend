export type CryptoNetWorkType = {
  id: string;
  name: string;
  type: number; // wallet type 1: erc/bsc 2: tron
};

export type BalanceType = {
  amount: number;
  usdAmount: number;
  symbol: string;
  symbolId: string;
};

export type CurrencySymbolType = {
  id: string;
  name: string;
  logo: string;
  iso_currency: string;
  iso_decimals: number;
  availableNetworks: string[];
  price?: number;
};

export type WalletType = {
  address: string;
  network: string;
  networkId: string;
};
