import { createSlice } from "@reduxjs/toolkit";
import { fetchNotifs, fetchUserEdit } from "./fetch-notifs";

const initialState = {
  message: "",
  data: [],
  isError: false,
  isSuccess: false,
  loading: false,
  error: null,
  fetched: false,
  userEdit: null,
  loadsFetched: false,
  loadsLoading: false,
};

const topStatusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    setSuccess: (state, action) => {
      state.message = action.payload;
      state.isSuccess = true;
    },
    setError: (state, action) => {
      state.message = action.payload;
      state.isError = true;
    },
    removeStatus: (state) => {
      state.message = "";
      state.isError = false;
      state.isSuccess = false;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifs.fulfilled, (state, action) => {
      state.loading = false;
      const { data } = action.payload;
      state.data = data;
      state.fetched = true;
    });
    builder.addCase(fetchNotifs.pending, (state, action) => {
      state.loading = true;
      state.fetched = false;
    });
    builder.addCase(fetchNotifs.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.fetched = false;
    });
    builder.addCase(fetchUserEdit.fulfilled, (state, action) => {
      state.loadsLoading = false;
      const { data } = action.payload;
      state.userEdit = data;
      state.loadsFetched = true;
    });
    builder.addCase(fetchUserEdit.pending, (state, action) => {
      state.loadsLoading = true;
      state.loadsFetched = false;
    });
    builder.addCase(fetchUserEdit.rejected, (state, action) => {
      state.loadsLoading = false;
      state.error = true;
      state.loadsFetched = false;
    });
  },
});

export const { setSuccess, setError, removeStatus } = topStatusSlice.actions;

export default topStatusSlice.reducer;
