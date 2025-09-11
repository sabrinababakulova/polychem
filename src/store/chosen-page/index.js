import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chosenPage: "Dashboard",
};

const chosenPageSlide = createSlice({
  name: "chosenPage",
  initialState,
  reducers: {
    setPage: (state, action) => {
      const { page } = action.payload;
      state.chosenPage = page;
    },
  },
});

export const { setPage } = chosenPageSlide.actions;
export default chosenPageSlide.reducer;
