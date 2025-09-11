import { createSlice } from "@reduxjs/toolkit";
import { ACCOUNTING } from "../../constants";
import { fetchAccounting } from "./fetch-accounting";
import { fetchBalance } from "./fetch-balance";
import { postAccounting } from "./post-accounting";
import { deleteMultiple } from "./delete-multiple";
import { deleteAccounting } from "./delete-accounting";

const initialState = {
  data: [],
  filters: {},
  search: "",
  fetched: false,
  loading: false,
  accounting: [],
};

const accountingSlice = createSlice({
  name: ACCOUNTING,
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
    builder.addCase(fetchBalance.fulfilled, (state, action) => {
      state.loading = false;
      const { data } = action.payload;
      state.data = data;
      state.fetched = true;
    });
    builder.addCase(fetchBalance.pending, (state, action) => {
      state.loading = true;
      state.fetched = false;
    });
    builder.addCase(fetchBalance.rejected, (state, action) => {
      state.loading = false;
      state.fetched = false;
      state.error = true;
    });
    builder.addCase(fetchAccounting.fulfilled, (state, action) => {
      state.loading = false;
      const { data } = action.payload;
      state.accounting = data;
      state.fetched = true;
    });
    builder.addCase(fetchAccounting.pending, (state, action) => {
      state.loading = true;
      state.fetched = false;
    });
    builder.addCase(fetchAccounting.rejected, (state, action) => {
      state.loading = false;
      state.fetched = false;
      state.error = true;
    });
    builder.addCase(postAccounting.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.accounting.unshift(dataPayload?.data);
    });
    builder.addCase(postAccounting.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(postAccounting.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(deleteAccounting.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.accounting = state.accounting.filter(
        (acc) => acc.id !== dataPayload
      );
    });
    builder.addCase(deleteAccounting.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteAccounting.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(deleteMultiple.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.fetched = true;
      state.accounting = state.accounting.filter(
        (item) => !dataPayload?.includes(item?.id)
      );
    });
    builder.addCase(deleteMultiple.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteMultiple.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
  },
});
export const { updateFilters, updateSearch } = accountingSlice.actions;

export default accountingSlice.reducer;
