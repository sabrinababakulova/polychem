import { createSlice } from "@reduxjs/toolkit";
import { CUSTOMER } from "../../constants";
import { fetchCustomers } from "./fetch-customers";
import { postCustomer } from "./post-customers";
import { deleteCustomer } from "./delete-customers";
import { editCustomer } from "./edit-customers";
import { deleteMultiple } from "./delete-multiple";

const initialState = {
  data: [],
  fetched: false,
  loading: false,
  filters: {},
  search: "",
};

const customerSlice = createSlice({
  name: CUSTOMER,
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = action.payload;
    },
    updateSearch: (state, action) => {
      state.search = action.payload;
    },
    fixCustomer: (state, action) => {
      const { data, id } = action.payload;
      const chosenDataIndex = state.data.findIndex((item) => item?.id === id);
      state.data[chosenDataIndex] = data;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.loading = false;
      const { data } = action.payload;
      state.data = data;
      state.fetched = true;
    });
    builder.addCase(fetchCustomers.pending, (state, action) => {
      state.loading = true;
      state.fetched = false;
    });
    builder.addCase(fetchCustomers.rejected, (state, action) => {
      state.loading = false;
      state.error = true;

      state.fetched = false;
    });
    builder.addCase(postCustomer.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.data.unshift(dataPayload?.data);
    });
    builder.addCase(postCustomer.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(postCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.data = state.data.filter((item) => item.id !== dataPayload);
    });
    builder.addCase(deleteCustomer.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(editCustomer.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      const chosenPurchaseIndex = state.data.findIndex(
        (item) => item?.id === dataPayload?.data?.id
      );
      state.data[chosenPurchaseIndex] = dataPayload?.data;
    });
    builder.addCase(editCustomer.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(editCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(deleteMultiple.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.data = state.data.filter(
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

export const { fixCustomer, updateFilters, updateSearch } = customerSlice.actions;

export default customerSlice.reducer;
