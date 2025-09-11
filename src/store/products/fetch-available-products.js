import { createAsyncThunk } from "@reduxjs/toolkit";
import { PRODUCT } from "../../constants";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { isArray } from "lodash";

export const fetchAvailableProduct = createAsyncThunk(
  `fetch available ${PRODUCT}`,
  async (data, thunk) => {
    try {
      const response = await api.get("/available-products").catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });
      return { data: response?.data };
    } catch (e) {
      return e;
    }
  }
);
