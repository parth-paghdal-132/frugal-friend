import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";
const initialState = {
  value: "0",
  decimal: false,
  category: "",
  describe: "",
  sentence: { er: false, en: "Happy Talling" },
  allData: {},
  isloading: false,
  hasError: false,
};
export const loadAllData = createAsyncThunk(
  "tally/loadSessionData",
  async () => {
    const sessionDate = await axiosInstance.get("/api/session");
    const budgetData = await axiosInstance.post("/api/budget-data", {
      userId: sessionDate.data._id,
    });
    return { sessionDate: sessionDate.data, budgetData: budgetData.data };
  }
);

export const budgetData = createAsyncThunk(
  "tally/budgetData",
  async (sessionData) => {
    const response = await axiosInstance.post("/api/budget-data", {
      userId: sessionData._id,
    });
    return response.data;
  }
);

const numberPadSlice = createSlice({
  name: "tally",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setDescribe: (state, action) => {
      state.describe = action.payload;
    },
    setSentence: (state, action) => {
      state.sentence = action.payload;
    },
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
  extraReducers: {
    [loadAllData.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [loadAllData.fulfilled]: (state, action) => {
      state.allData = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [loadAllData.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },
  },
});

export const {
  setInput,
  setDecimal,
  setBackspace,
  setEnter,
  setCategory,
  setDescribe,
  setSentence,
} = numberPadSlice.actions;

export default numberPadSlice.reducer;
