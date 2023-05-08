import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "0",
  decimal: false,
};

const numberPadSlice = createSlice({
  name: "tally",
  initialState,
  reducers: {
    setInput: (state, action) => {
      state.value = action.payload;
    },
    setDecimal: (state, action) => {
      state.decimal = action.payload;
    },
    setBackspace: (state) => {
      state.value = state.value.toString().slice(0, -1);
    },
    setEnter: (state) => {},
  },
});

export const { setInput, setDecimal, setBackspace, setEnter } =
  numberPadSlice.actions;
export default numberPadSlice.reducer;
