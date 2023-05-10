import { configureStore } from "@reduxjs/toolkit";
import tallyButtonReducer from "./TallyButtonSlice";
import NumberPadReducer from "./NumberPadSlice";
import pressButtonReducer from "./SingleButtonSlice";
const store = configureStore({
  reducer: {
    tallyButton: tallyButtonReducer,
    numberPad: NumberPadReducer,
    pressButton: pressButtonReducer,
  },
});

export default store;
