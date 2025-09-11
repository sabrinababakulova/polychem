import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { isArray } from "lodash";

export const deleteMultiple = createAsyncThunk(
  `delete accounting multiple`,
  async (data, thunk) => {
    const { items } = data;
    try {
      await api
        .post("/accountingbalance", {
          del_ids: items,
        })
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
      thunk.dispatch(setSuccess("Successfuly deleted transactions"));

      return items;
    } catch (e) {
      return e;
    }
  }
);
