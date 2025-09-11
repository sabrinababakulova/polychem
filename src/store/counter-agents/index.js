import { createSlice } from "@reduxjs/toolkit";
import { fetchCounters } from "./fetch-counters";
import { deleteMultiple } from "./delete-multiple";
import { postCounter } from "./post-counter";
import { editCounter } from "./edit-counters";
import { deleteCounter } from "./delete-counters";
import { postFile } from "./post-file";

const initialState = {
  data: [],
  filters: {},
  fetched: false,
  loading: false,
};

const counteragentSlice = createSlice({
  name: "counteragents",
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = action.payload;
    },
    fixCounter(state, action) {
      const { id, data } = action.payload;
      const counterIndex = state.data.findIndex((item) => item?.id === id);
      state.data[counterIndex] = data;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchCounters.fulfilled, (state, action) => {
      state.loading = false;
      const { data } = action.payload;
      state.data = data;
      state.fetched = true;
    });
    builder.addCase(fetchCounters.pending, (state, action) => {
      state.loading = true;
      state.fetched = false;
    });
    builder.addCase(fetchCounters.rejected, (state, action) => {
      state.loading = false;
      state.error = true;

      state.fetched = false;
    });
    builder.addCase(postCounter.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.data.unshift(dataPayload?.data);
      state.loading = false;
    });
    builder.addCase(postCounter.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(postCounter.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(editCounter.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      const chosenDataIndex = state.data.findIndex(
        (item) => item?.id === dataPayload?.data?.id
      );
      state.data[chosenDataIndex] = dataPayload?.data;
    });
    builder.addCase(editCounter.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(editCounter.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(deleteCounter.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.data = state.data.filter((counter) => counter.id !== dataPayload);
    });
    builder.addCase(deleteCounter.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteCounter.rejected, (state, action) => {
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

export const { fixCounter, updateFilters } = counteragentSlice.actions;

export default counteragentSlice.reducer;
