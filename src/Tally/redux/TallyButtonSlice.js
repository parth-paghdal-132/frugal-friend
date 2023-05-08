import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showTallyView: false,
};

const tallyButtonSlice = createSlice({
  name: "tallyButton",
  initialState,
  reducers: {
    setShowTallyView: (state) => {
      state.showTallyView = !state.showTallyView;
    },
  },
});

export const { setShowTallyView } = tallyButtonSlice.actions;
export default tallyButtonSlice.reducer;
