import { createSlice } from "@reduxjs/toolkit";
import { STAFF } from "../../constants";
import { fetchStaff } from "./fetch-staff";
import { postStaff } from "./post-staff";
import { deleteStaff } from "./delete-staff";
import { editStaff } from "./edit-staff";
import { postStaffFile } from "./post-files";
import { deleteMultiple } from "./delete-multiple";

const initialState = {
  data: [],
  filters: {},
  search: "",
  fetched: false,
  loading: false,
  error: null,
};

const staffSlice = createSlice({
  name: STAFF,
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = action.payload;
    },
    updateSearch: (state, action) => {
      state.search = action.payload;
    },
    editUser(state, action) {
      const { id, data } = action.payload;
      const userIndex = state.data.findIndex((item) => item?.id === id);
      state.data[userIndex] = data;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchStaff.fulfilled, (state, action) => {
      state.loading = false;
      const { data } = action.payload;
      state.data = data;
      state.fetched = true;
    });
    builder.addCase(fetchStaff.pending, (state, action) => {
      state.loading = true;
      state.fetched = false;
    });
    builder.addCase(fetchStaff.rejected, (state, action) => {
      state.loading = false;

      state.error = true;
      state.fetched = false;
    });
    builder.addCase(postStaff.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.data.unshift(dataPayload?.data);
    });
    builder.addCase(postStaff.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(postStaff.rejected, (state, action) => {
      state.loading = false;

      state.error = true;
    });
    builder.addCase(deleteStaff.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      state.data = state.data.filter((staff) => staff.id !== dataPayload);
    });
    builder.addCase(deleteStaff.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteStaff.rejected, (state, action) => {
      state.loading = false;

      state.error = true;
    });
    builder.addCase(editStaff.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      state.loading = false;
      const chosenDataIndex = state.data.findIndex(
        (item) => item?.id === dataPayload?.data?.id
      );
      state.data[chosenDataIndex] = dataPayload?.data;
    });
    builder.addCase(editStaff.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(editStaff.rejected, (state, action) => {
      state.loading = false;

      state.error = true;
    });
    builder.addCase(postStaffFile.fulfilled, (state, action) => {
      const dataPayload = action.payload;
      const user = state.data?.findIndex(
        (item) => item?.id === dataPayload?.id
      );
      state.data[user] = dataPayload?.newData;
    });
    builder.addCase(postStaffFile.rejected, (state, action) => {
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

export const { editUser, updateSearch, updateFilters } = staffSlice.actions;

export default staffSlice.reducer;
