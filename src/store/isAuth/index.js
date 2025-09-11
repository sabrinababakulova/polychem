import { createSlice } from "@reduxjs/toolkit";
import { fetchUser } from "./get-user";

const initialState = {
  email: "",
  role: "",
  userFetched: false,
  loading: false,
};

const isAuthSlide = createSlice({
  name: "isAuth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { email, role } = action.payload;
      state.email = email;
      state.role = role;
    },
    removeUser: (state) => {
      state.email = "";
      state.role = "";
      state.userFetched = false;
      state.loading = false;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      if (!state.userFetched) {
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.userFetched = true;
      }
    });
    builder.addCase(fetchUser.pending, (state, action) => {
      if (!state.userFetched) state.loading = true;
    });
  },
});

export const { setUser, removeUser } = isAuthSlide.actions;

export default isAuthSlide.reducer;
