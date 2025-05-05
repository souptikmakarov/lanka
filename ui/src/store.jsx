import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  playerId: null,
  gameState: null,
  view: "lobby"
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setPlayerId: (state, action) => {
      state.playerId = action.payload;
    },
    setGameState: (state, action) => {
      state.gameState = action.payload;
    },
    setView: (state, action) => {
      state.view = action.payload;
    }
  }
});

export const { setPlayerId, setGameState, setView } = gameSlice.actions;

const store = configureStore({
  reducer: {
    game: gameSlice.reducer
  }
});
export default store;