import { createSlice } from "@reduxjs/toolkit";
import { fetchCountry } from "./fetch-countries";

const initialState = {
  data: [],
  fetched: false,
  loading: false,
};

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchCountry.fulfilled, (state, action) => {
      state.data = action.payload;
      state.fetched = true;
      state.loading = false;
    });
    builder.addCase(fetchCountry.pending, (state, action) => {
      state.fetched = false;
      state.loading = true;
    });
    builder.addCase(fetchCountry.rejected, (state, action) => {
      state.fetched = false;
      state.loading = false;
    });
  },
});

export default countrySlice.reducer;
