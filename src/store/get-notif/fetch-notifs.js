import { createAsyncThunk } from "@reduxjs/toolkit";
import { setError } from ".";
import api, { authorizationAPI } from "../../constants/api";
import { isArray } from "lodash";

export const fetchNotifs = createAsyncThunk(
  "fetch notifs",
  async (data, thunk) => {
    try {
      const response = await authorizationAPI
        .get("/api/get-my-notifications")
        .catch((e) => {
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
export const fetchUserEdit = createAsyncThunk(
  "fetch user edit",
  async (data, thunk) => {
    try {
      const { itemId } = data;
      const response = await api
        .get(`/staff/edit/approval/${itemId}`)
        .catch((e) => {
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
