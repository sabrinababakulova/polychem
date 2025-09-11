import { createAsyncThunk } from "@reduxjs/toolkit";
import { CATEGORY, SUBCATEGORY } from "../../constants";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { isArray } from "lodash";

export const fetchCategory = createAsyncThunk(
  `fetch ${CATEGORY}`,
  async (data, thunk) => {
    try {
      const response = await api.get("/category").catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });
      const selectData = response.data?.map(
        (category) =>
          category?.active && {
            id: category?.id,
            name: category?.name,
          }
      );
      return selectData;
    } catch (e) {
      return e;
    }
  }
);
export const fetchSubcategory = createAsyncThunk(
  `fetch ${SUBCATEGORY}`,
  async (data, thunk) => {
    try {
      const response = await api.get(`/subcategory`).catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });
      const selectData = response.data?.map(
        (subcategory) =>
          subcategory?.active && {
            id: subcategory?.id,
            name: subcategory?.name,
            category_id: subcategory?.category_id,
          }
      );
      return selectData;
    } catch (e) {
      return e;
    }
  }
);
