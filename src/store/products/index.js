import { createSlice } from "@reduxjs/toolkit";
import { PRODUCT } from "../../constants";
import { fetchProduct } from "./fetch-products";
import { postProduct } from "./post-products";
import { deleteProduct } from "./delete-product";
import { fetchAvailableProduct } from "./fetch-available-products";
import { editProduct } from "./edit-product";
import { deleteMultiple } from "./delete-multiple";
import { postFile } from "./post-file";
import { postProductPrice } from "./post-price-analytics";
import { deleteProductPrice } from "./delete-price-analytics";

const initialState = {
  data: [],
  filters: {},
  search: "",
  availableProducts: [],
  fetched: false,
  loading: false,
  availableProductsFetched: false,
  availableProductsLoading: false,
};

const productSlice = createSlice({
  name: PRODUCT,
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
    builder.addCase(fetchProduct.fulfilled, (state, action) => {
      state.loading = false;
      const { data } = action.payload;
      state.data = data;
      state.fetched = true;
    });
    builder.addCase(fetchProduct.pending, (state, action) => {
      state.loading = true;
      state.fetched = false;
    });
    builder.addCase(fetchProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.fetched = false;
    });
    builder.addCase(fetchAvailableProduct.fulfilled, (state, action) => {
      state.availableProductsLoading = false;
      const { data } = action.payload;
      state.availableProducts = data;
      state.availableProductsFetched = true;
    });
    builder.addCase(fetchAvailableProduct.pending, (state, action) => {
      state.availableProductsFetched = false;
      state.availableProductsLoading = true;
    });
    builder.addCase(fetchAvailableProduct.rejected, (state, action) => {
      state.availableProductsFetched = false;
      state.error = true;

      state.availableProductsLoading = true;
    });
    builder.addCase(postProduct.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.data.unshift(dataPayload?.data);
    });
    builder.addCase(postProduct.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(postProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.data = state.data.filter((product) => product.id !== dataPayload);
    });
    builder.addCase(deleteProduct.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(editProduct.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      const chosenDataIndex = state.data.findIndex(
        (item) => item?.id === dataPayload?.data?.id
      );
      state.data[chosenDataIndex] = dataPayload?.data;
    });
    builder.addCase(editProduct.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(editProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(deleteMultiple.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.fetched = true;
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
    builder.addCase(postFile.fulfilled, (state, action) => {
      state.loading = false;
      const dataPayload = action.payload;
      const itemIndex = state.data?.findIndex(
        (item) => item?.id === dataPayload?.id
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
    builder.addCase(postProductPrice.fulfilled, (state, action) => {
      state.loading = false;
      const dataPayload = action.payload;
      const itemIndex = state.data?.findIndex(
        (item) => item?.id === dataPayload?.id
      );
      state.data[itemIndex] = dataPayload?.data;
    });
    builder.addCase(postProductPrice.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(postProductPrice.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(deleteProductPrice.fulfilled, (state, action) => {
      state.loading = false;
      const dataPayload = action.payload;
      const itemIndex = state.data?.findIndex(
        (item) => item?.id === dataPayload?.id
      );
      state.data[itemIndex] = dataPayload?.data;
    });
    builder.addCase(deleteProductPrice.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteProductPrice.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
  },
});

export const { updateFilters, updateSearch } = productSlice.actions;

export default productSlice.reducer;
