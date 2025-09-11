import { createAsyncThunk } from "@reduxjs/toolkit";
import { setError } from "../get-notif";
import api from "../../constants/api";
import { isArray } from "lodash";

export const fetchBalance = createAsyncThunk(
  `fetch balance`,
  async (data, thunk) => {
    try {
      const response = await api.get("/balance").catch((e) => {
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
