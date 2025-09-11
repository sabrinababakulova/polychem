import { createAsyncThunk } from "@reduxjs/toolkit";
import { ACTION_LOG } from "../../constants";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { isArray } from "lodash";

export const fetchActionLog = createAsyncThunk(
  `fetch ${ACTION_LOG}`,
  async (data, thunk) => {
    try {
      const response = await api.get("/actionlog").catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });
      const responseData = response.data?.map((item) => ({
        ...item,
        table: [
          item?.staff_name,
          item?.created_at,
          item?.action_type,
          item?.change_object,
          item?.related_object,
          item?.object_id,
          item?.related_object_id,
        ],
      }));
      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
