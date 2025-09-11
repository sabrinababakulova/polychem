import { createSlice } from "@reduxjs/toolkit";
import { CATEGORY } from "../../constants";
import { fetchCategory, fetchSubcategory } from "./fetch-categories";
import { postCategory, postSubcategory } from "./post-category";

const initialState = {
  categories: [],
  subcategories: [],
  categoryFetched: false,
  categoryLoading: false,
  subcategoryFetched: false,
  subcategoryLoading: false,
  newCategoryFetched: false,
  newCategoryLoading: false,
  newSubcategoryFetched: false,
  newSubcategoryLoading: false,
};

const categorySlice = createSlice({
  name: CATEGORY,
  initialState,
  reducers: {
    setfetchingFalse: (state) => {
      state.newCategoryFetched = false;
    },
    setSubfetchingFalse: (state) => {
      state.newSubcategoryFetched = false;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchCategory.fulfilled, (state, action) => {
      state.categoryLoading = false;
      if (!state.categoryFetched) {
        const selectData = action.payload;
        state.categories = selectData;
        state.categoryFetched = true;
      }
    });
    builder.addCase(fetchCategory.pending, (state, action) => {
      if (!state.categoryFetched) state.categoryLoading = true;
    });
    builder.addCase(fetchSubcategory.fulfilled, (state, action) => {
      state.subcategoryLoading = false;
      if (!state.subcategoryFetched) {
        const selectData = action.payload;
        state.subcategories = selectData;
        state.subcategoryFetched = true;
      }
    });
    builder.addCase(fetchSubcategory.pending, (state, action) => {
      if (!state.subcategoryFetched) state.subcategoryLoading = true;
    });
    builder.addCase(postCategory.fulfilled, (state, action) => {
      const category = action.payload;
      if (category?.category) {
        state.categories.unshift(category?.category);
        state.newCategoryFetched = true;
      }
    });
    builder.addCase(postSubcategory.fulfilled, (state, action) => {
      const category = action.payload;
      if (category?.subcategory) {
        state.subcategories.unshift(category?.subcategory);
        state.newSubcategoryFetched = true;
      }
    });
  },
});

export const { setfetchingFalse, setSubfetchingFalse } = categorySlice.actions;

export default categorySlice.reducer;
