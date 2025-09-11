import { createSlice } from "@reduxjs/toolkit";
import { fetchPurchase } from "./fetch-purchase";
import { postPurchase } from "./post-purchase";
import { deletePurchase } from "./delete-purchase";
import { editPurchase } from "./edit-purchase";
import { fetchPurchaseLoad } from "./fetch-loads";
import { postPurchaseLoad } from "./post-purchase-load";
import { editPurchaseLoad } from "./edit-load";
import { postFile } from "./post-files";
import { fetchAdditionalCost } from "./fetch-additional-cost";
import { deletePurchaseLoad } from "./delete-loads";
import { deleteMultiple } from "./delete-multiple";

const initialState = {
  data: [],
  filters: {},
  search: "",
  loadsSearch: "",
  loadsData: [],
  warehouse: [],
  loadsFilters: {},
  loadsFetched: false,
  loadsLoading: false,
  fetched: false,
  loading: false,
  additionalCostLoading: false,
  additionalCostFetched: false,
};

const purchaseSlice = createSlice({
  name: "purchase",
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
    builder.addCase(fetchPurchase.fulfilled, (state, action) => {
      state.loading = false;
      const { data } = action.payload;
      state.data = data;
      state.fetched = true;
    });
    builder.addCase(fetchPurchase.pending, (state, action) => {
      state.loading = true;
      state.fetched = false;
    });
    builder.addCase(fetchPurchase.rejected, (state, action) => {
      state.loading = false;
      state.error = true;

      state.fetched = false;
    });
    builder.addCase(fetchPurchaseLoad.fulfilled, (state, action) => {
      state.loadsLoading = false;
      const { data, warehouse } = action.payload;
      state.loadsData = data;
      state.warehouse = warehouse;
      state.loadsFetched = true;
    });
    builder.addCase(fetchPurchaseLoad.pending, (state, action) => {
      state.loadsLoading = true;
      state.loadsFetched = false;
    });
    builder.addCase(fetchPurchaseLoad.rejected, (state, action) => {
      state.loadsLoading = false;
      state.error = true;

      state.loadsFetched = false;
    });
    builder.addCase(postPurchaseLoad.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loadsLoading = false;
      state.loadsData.unshift(dataPayload?.data);
    });
    builder.addCase(postPurchaseLoad.pending, (state, action) => {
      state.loadsLoading = true;
    });
    builder.addCase(postPurchaseLoad.rejected, (state, action) => {
      state.loadsLoading = false;
      state.error = true;
    });
    builder.addCase(editPurchaseLoad.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loadsLoading = false;
      const chosenLoadIndex = state.loadsData.findIndex(
        (item) => item?.load === dataPayload?.data?.load,
      );
      state.loadsData[chosenLoadIndex] = dataPayload?.data;
    });
    builder.addCase(editPurchaseLoad.pending, (state, action) => {
      state.loadsLoading = true;
    });
    builder.addCase(editPurchaseLoad.rejected, (state, action) => {
      state.loadsLoading = false;
      state.error = true;
    });
    builder.addCase(postPurchase.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      if (dataPayload?.data && !dataPayload?.itemId) {
        state.data.unshift(dataPayload?.data);
      }
      if (dataPayload?.itemId) {
        const chosenDataIndex = state.data.findIndex(
          (item) => item?.id === dataPayload?.itemId,
        );
        state.data[chosenDataIndex] = dataPayload?.data;
      }
      state.loading = false;
    });
    builder.addCase(postPurchase.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(postPurchase.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(editPurchase.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      const chosenDataIndex = state.data.findIndex(
        (item) => item?.id === dataPayload?.data?.id,
      );
      state.data[chosenDataIndex] = dataPayload?.data;
    });
    builder.addCase(editPurchase.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(editPurchase.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(deletePurchase.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.data = state.data.filter((purchase) => purchase.id !== dataPayload);
      state.loadsData = state.loadsData.filter(
        (item) => item?.purchase_id !== dataPayload,
      );
    });
    builder.addCase(deletePurchase.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deletePurchase.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(deletePurchaseLoad.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loadsLoading = false;
      state.loadsData = state.loadsData.filter(
        (load) => load.load !== dataPayload,
      );
    });
    builder.addCase(deletePurchaseLoad.pending, (state, action) => {
      state.loadsLoading = true;
    });
    builder.addCase(deletePurchaseLoad.rejected, (state, action) => {
      state.loadsLoading = false;
      state.error = true;
    });
    builder.addCase(postFile.fulfilled, (state, action) => {
      state.loading = false;
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
    builder.addCase(deleteMultiple.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.data = state.data.filter(
        (item) => !dataPayload?.includes(item?.id),
      );
      state.loadsData = state.loadsData.filter(
        (item) => !dataPayload?.includes(item?.purchase_id),
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

export const {
  updateFilters,
  updateLoadsFilters,
  updateSearch,
  updateLoadsSearch,
} = purchaseSlice.actions;

export default purchaseSlice.reducer;
