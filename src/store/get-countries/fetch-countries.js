import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { isArray } from "lodash";

export const fetchCountry = createAsyncThunk(
  `fetch countries`,
  async (data, thunk) => {
    try {
      const response = await api.get("/country").catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });
      return response?.data;
    } catch (e) {
      return e;
    }
  }
);
