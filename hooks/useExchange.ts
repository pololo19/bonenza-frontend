import { useSelector } from 'react-redux';

import { AppState } from '../redux/store';

export const useExchange = () => {
  const localFiat = useSelector((state: AppState) => state.wallet.localFiat);
  return localFiat?.price ? 1 / localFiat.price : 1;
};
