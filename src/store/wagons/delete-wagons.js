import { createAsyncThunk } from "@reduxjs/toolkit";
import { WAGON } from "../../constants";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { isArray } from "lodash";

export const deleteWagon = createAsyncThunk(
  `delete ${WAGON}`,
  async (data, thunk) => {
    const { id } = data;
    try {
      await api.delete(`/wagon/${id}`).catch((e) => {
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

      thunk.dispatch(setSuccess("Successfuly deleted wagon"));
      return id;
    } catch (e) {
      return e;
    }
  }
);
