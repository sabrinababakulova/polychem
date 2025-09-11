import { createSlice } from "@reduxjs/toolkit";
import { fetchWagon } from "./fetch-wagons";
import { postWagon } from "./post-wagons";
import { deleteWagon } from "./delete-wagons";
import { deleteMultiple } from "./delete-multiple";
import { editWagon } from "./edit-wagon";
import { postFile } from "./post-files";
import { fetchWagonHistory } from "./fetch-history";

const initialState = {
  data: [],
  filters: {},
  search: "",
  fetched: false,
  loading: false,
  loadsData: [],
  loadsFetched: false,
  loadsLoading: false,
};

const wagonSlice = createSlice({
  name: "wagon",
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = action.payload;
    },
    fixWagon: (state, action) => {
      const { id, data } = action.payload;
      const chosenDataIndex = state.data.findIndex((item) => item?.id === id);
      state.data[chosenDataIndex] = data;
    },
    updateSearch: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchWagon.fulfilled, (state, action) => {
      state.loading = false;
      const { data } = action.payload;
      state.data = data;
      state.fetched = true;
    });
    builder.addCase(fetchWagon.pending, (state, action) => {
      state.loading = true;
      state.fetched = false;
    });
    builder.addCase(fetchWagon.rejected, (state, action) => {
      state.loading = false;
      state.error = true;

      state.fetched = true;
    });
    builder.addCase(fetchWagonHistory.fulfilled, (state, action) => {
      state.loadsLoading = false;
      const { data } = action.payload;
      state.loadsData = data;
      state.loadsFetched = true;
    });
    builder.addCase(fetchWagonHistory.pending, (state, action) => {
      state.loadsLoading = true;
      state.loadsFetched = false;
    });
    builder.addCase(fetchWagonHistory.rejected, (state, action) => {
      state.loadsLoading = false;
      state.error = true;
      state.loadsFetched = true;
    });
    builder.addCase(postWagon.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.data.unshift(dataPayload?.data);
    });
    builder.addCase(postWagon.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(postWagon.rejected, (state, action) => {
      state.loading = false;
      state.error = true;

      state.error = action.payload;
    });
    builder.addCase(deleteWagon.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.data = state.data.filter((wagon) => wagon?.id !== dataPayload);
    });
    builder.addCase(deleteWagon.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteWagon.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(deleteMultiple.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.data = state.data.filter(
        (item) => !dataPayload?.includes(item?.id),
      );
    });
    builder.addCase(deleteMultiple.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteMultiple.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(editWagon.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      const chosenDataIndex = state.data.findIndex(
        (item) => item?.id === dataPayload?.data?.id,
      );
      state.data[chosenDataIndex] = dataPayload?.data;
      state.loading = false;
    });
    builder.addCase(editWagon.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(editWagon.rejected, (state, action) => {
      state.loading = false;
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
  },
});

export const { fixWagon, updateSearch, updateFilters } = wagonSlice.actions;

export default wagonSlice.reducer;
