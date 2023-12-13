import { io } from 'socket.io-client';

import { SOCKET_WALLET_URL, socketWalletConfig } from '@/base/constants/common';

export const initialSocketConnection = async () => {
  const socket = io(SOCKET_WALLET_URL || '', socketWalletConfig);
  return socket;
};
