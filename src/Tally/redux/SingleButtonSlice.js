import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  1: false,
  2: false,
  3: false,
  Backspace: false,
  4: false,
  5: false,
  6: false,
  "-": false,
  7: false,
  8: false,
  9: false,
  "+": false,
  Enter: false,
  0: false,
  ".": false,
  "=": false,
};

const pressButtonSlice = createSlice({
  name: "pressButton",
  initialState,
  reducers: {
    setShowPress: (state, action) => {
      state[action.payload] = !state[action.payload];
    },
  },
});

export const { setShowPress } = pressButtonSlice.actions;
export default pressButtonSlice.reducer;
