import { createSlice } from "@reduxjs/toolkit";
import { fetchSales } from "./fetch-sales";
import { deleteSale } from "./delete-sales";
import { postSale } from "./post-sales";
import { fetchSalesLoads } from "./fetch-loads";
import { editSaleLoad } from "./edit-load";
import { editSale } from "./edit-sale";
import { postFile } from "./post-files";
import { fetchAdditionalCost } from "./fetch-additional-cost";
import { postCosts } from "./post-costs";
import { deleteMultiple } from "./delete-multiple";
import { postSalesLoad } from "./post-load";
import { deleteSaleLoad } from "./delete-load";

const initialState = {
  data: [],
  loadsData: [],
  filters: {},
  search: "",
  loadsSearch: "",
  loadsFilters: {},
  fetched: false,
  loading: false,
  loadsFetched: false,
  loadsLoading: false,
  additionalCostLoading: false,
  additionalCostFetched: false,
  error: null,
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = action.payload;
    },
    updateLoadsFilters: (state, action) => {
      state.loadsFilters = action.payload;
    },
    updateSearch: (state, action) => {
      state.search = action.payload;
    },
    updateLoadsSearch: (state, action) => {
      state.loadsSearch = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchSales.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.data = data;
      state.loading = false;
      state.fetched = true;
    });
    builder.addCase(fetchSales.pending, (state, action) => {
      state.loading = true;
      state.fetched = false;
    });
    builder.addCase(fetchSales.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.fetched = false;
    });
    builder.addCase(fetchSalesLoads.fulfilled, (state, action) => {
      state.loadsLoading = false;
      const { data } = action.payload;
      state.loadsData = data;
      state.loadsFetched = true;
    });
    builder.addCase(fetchSalesLoads.pending, (state, action) => {
      state.loadsLoading = true;
      state.loadsFetched = false;
    });
    builder.addCase(fetchSalesLoads.rejected, (state, action) => {
      state.loadsLoading = false;
      state.error = true;

      state.loadsFetched = false;
    });
    builder.addCase(postSale.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      if (dataPayload?.data) {
        state.data.unshift(dataPayload?.data);
      }
      state.loading = false;
    });
    builder.addCase(postSale.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(postSale.rejected, (state, action) => {
      state.error = true;
      state.error = true;

      state.loading = false;
    });
    builder.addCase(deleteSale.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.data = state.data.filter((item) => item.id !== dataPayload);
      state.loadsData = state.loadsData.filter(
        (item) => item?.sale_id !== dataPayload,
      );
    });
    builder.addCase(deleteSale.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteSale.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(editSaleLoad.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loadsLoading = false;
      const chosenLoadIndex = state.loadsData.findIndex(
        (item) => item?.load === dataPayload?.id,
      );
      state.loadsData[chosenLoadIndex] = dataPayload?.data;
    });
    builder.addCase(editSaleLoad.pending, (state, action) => {
      state.loadsLoading = true;
    });
    builder.addCase(editSaleLoad.rejected, (state, action) => {
      state.loadsLoading = false;
      state.error = true;
    });
    builder.addCase(editSale.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      const chosenDataIndex = state.data.findIndex(
        (item) => item?.id === dataPayload?.data?.id,
      );
      state.data[chosenDataIndex] = dataPayload?.data;
    });
    builder.addCase(editSale.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(editSale.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(postFile.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      const itemIndex = state.data?.findIndex(
        (item) => item?.id === dataPayload?.id,
      );
      state.data[itemIndex] = dataPayload?.newData;
    });
    builder.addCase(postFile.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(postFile.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(fetchAdditionalCost.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      const itemIndex = state.data?.findIndex(
        (item) => item?.id === dataPayload?.id,
      );
      state.data[itemIndex] = dataPayload?.data;
      state.additionalCostLoading = false;
      state.additionalCostFetched = true;
    });
    builder.addCase(fetchAdditionalCost.pending, (state, action) => {
      state.additionalCostLoading = true;
      state.additionalCostFetched = false;
    });
    builder.addCase(fetchAdditionalCost.rejected, (state, action) => {
      state.additionalCostLoading = false;
      state.error = true;

      state.additionalCostFetched = false;
    });
    builder.addCase(postCosts.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.additionalCostLoading = false;
      const chosenDataIndex = state.data.findIndex(
        (item) => item?.id === dataPayload?.itemId,
      );
      state.data[chosenDataIndex] = dataPayload?.data;
    });
    builder.addCase(postCosts.pending, (state, action) => {
      state.additionalCostLoading = true;
    });
    builder.addCase(postCosts.rejected, (state, action) => {
      state.additionalCostLoading = false;
      state.error = true;
    });
    builder.addCase(deleteMultiple.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.newSalesLoading = false;
      state.newSalesFetched = true;
      state.data = state.data.filter(
        (item) => !dataPayload?.includes(item?.id),
      );
      state.loadsData = state.loadsData.filter(
        (item) => !dataPayload?.includes(item?.sale_id),
      );
    });
    builder.addCase(deleteMultiple.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteMultiple.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(postSalesLoad.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loadsLoading = false;
      state.loadsData.unshift(dataPayload?.data);
      state.loadsFetched = true;
    });
    builder.addCase(postSalesLoad.pending, (state, action) => {
      state.loadsLoading = true;
    });
    builder.addCase(postSalesLoad.rejected, (state, action) => {
      state.loadsLoading = false;
      state.error = true;
    });
    builder.addCase(deleteSaleLoad.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loadsLoading = false;
      state.loadsData = state.loadsData.filter(
        (load) => load.load !== dataPayload,
      );
    });
    builder.addCase(deleteSaleLoad.pending, (state, action) => {
      state.loadsLoading = true;
    });
    builder.addCase(deleteSaleLoad.rejected, (state, action) => {
      state.loadsLoading = false;
      state.error = true;
    });
  },
});

export const {
  updateFilters,
  updateSearch,
  updateLoadsSearch,
  updateLoadsFilters,
} = salesSlice.actions;

export default salesSlice.reducer;
