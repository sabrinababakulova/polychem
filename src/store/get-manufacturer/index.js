import { createSlice } from "@reduxjs/toolkit";
import { MANUFACTURER } from "../../constants";
import { fetchManufacturer } from "./fetch-manufacturer";
import { postManufacturer } from "./post-manufacturer";
import { deleteManufacturer } from "./delete-manufacturer";
import { editManufacturer } from "./edit-manufacturer";
import { deleteMultiple } from "./delete-multiple";

const initialState = {
  data: [],
  filters: {},
  search: "",
  fetched: false,
  loading: false,
  error: null,
};

const manufacturerSlice = createSlice({
  name: MANUFACTURER,
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = action.payload;
    },
    updateSearch: (state, action) => {
      state.search = action.payload;
    },
    fixManufacturer: (state, action) => {
      const { data, id } = action.payload;
      const chosenDataIndex = state.data.findIndex((item) => item?.id === id);
      state.data[chosenDataIndex] = data;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchManufacturer.fulfilled, (state, action) => {
      state.loading = false;
      const { data } = action.payload;
      state.data = data;
      state.fetched = true;
    });
    builder.addCase(fetchManufacturer.pending, (state, action) => {
      state.loading = true;
      state.fetched = false;
    });
    builder.addCase(fetchManufacturer.rejected, (state, action) => {
      state.loading = false;
      state.error = true;

      state.fetched = false;
    });
    builder.addCase(postManufacturer.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.data.unshift(dataPayload?.data);
    });
    builder.addCase(postManufacturer.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(postManufacturer.rejected, (state, action) => {
      state.loading = false;
      state.error = true;

      state.error = action.payload;
    });
    builder.addCase(deleteManufacturer.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.data = state.data.filter(
        (manufacturer) => manufacturer.id !== dataPayload
      );
    });
    builder.addCase(deleteManufacturer.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteManufacturer.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(editManufacturer.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      const chosenDataIndex = state.data.findIndex(
        (item) => item?.id === dataPayload?.data?.id
      );
      state.data[chosenDataIndex] = dataPayload?.data;
    });
    builder.addCase(editManufacturer.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(editManufacturer.rejected, (state, action) => {
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

export const { fixManufacturer, updateSearch, updateFilters } = manufacturerSlice.actions;

export default manufacturerSlice.reducer;
