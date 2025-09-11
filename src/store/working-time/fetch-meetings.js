import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { isArray } from "lodash";

export const fetchMeetings = createAsyncThunk(
  `fetch meeting time`,
  async (payload, thunk) => {
    try {
      const response = await api.get("/meeting").catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(
          e?.response?.data?.[0] || `${e.message} from ${e?.config?.url}`
        );
      });
      return response?.data;
    } catch (e) {
      return e;
    }
  }
);
