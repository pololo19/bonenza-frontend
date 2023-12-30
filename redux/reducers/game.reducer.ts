import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { BetTableDataType } from '@/base/types/common';
import { GameState } from '@/base/types/reducer-states';

const initialState: GameState = {
  betHistory: [],
};

export const gameReducer = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setBetHistory: (state: GameState, action: PayloadAction<BetTableDataType[]>) => {
      state.betHistory = [...action.payload].slice(0, 40);
    },
    addBetHistory: (state: GameState, action: PayloadAction<BetTableDataType>) => {
      state.betHistory = [action.payload, ...state.betHistory].slice(0, 40);
    },
  },
});

export const { setBetHistory, addBetHistory } = gameReducer.actions;
export default gameReducer.reducer;
