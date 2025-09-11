import { createSlice } from "@reduxjs/toolkit";
import { ACTION_LOG } from "../../constants";
import { fetchActionLog } from "./fetch-log";

const initialState = {
  data: [],
  filters: {},
  search: "",
  fetched: false,
  loading: false,
};

const actionLogSlice = createSlice({
  name: ACTION_LOG,
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = action.payload;
    },
    updateSearch: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchActionLog.fulfilled, (state, action) => {
      state.loading = false;
      if (!state.fetched) {
        const { data } = action.payload;
        state.data = data;
        state.fetched = true;
      }
    });
    builder.addCase(fetchActionLog.pending, (state, action) => {
      if (!state.fetched) state.loading = true;
    });
  },
});

export const { updateFilters, updateSearch } = actionLogSlice.actions;

export default actionLogSlice.reducer;
