import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type socketState = {
  walletSocket: any;
};

const initialStateSocket: socketState = {
  walletSocket: '',
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState: initialStateSocket,
  reducers: {
    setSocket: (state: socketState, action: PayloadAction<any>) => {
      state.walletSocket = action.payload;
    },
  },
});

export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;
