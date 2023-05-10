import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showTallyView: false,
  reset: false,
};

const tallyButtonSlice = createSlice({
  name: "tallyButton",
  initialState,
  reducers: {
    setShowTallyView: (state) => {
      state.showTallyView = !state.showTallyView;
    },
    setReset: (state) => {
      state.reset = !state.reset;
    },
  },
});

export const { setShowTallyView, setReset } = tallyButtonSlice.actions;
export default tallyButtonSlice.reducer;
