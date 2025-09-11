import { createAsyncThunk } from "@reduxjs/toolkit";
import { SALES } from "../../constants";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { isArray } from "lodash";

export const deleteSaleLoad = createAsyncThunk(
  `delete ${SALES} loads`,
  async (data, thunk) => {
    const { id } = data;
    try {
      await api.delete(`/saleload/${id}`).catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });
      thunk.dispatch(setSuccess("Successfuly deleted sale load"));
      return id;
    } catch (e) {
      return e;
    }
  }
);
