import { createAsyncThunk } from "@reduxjs/toolkit";
import { ACCOUNTING } from "../../constants";
import { setError } from "../get-notif";
import api from "../../constants/api";
import { isArray } from "lodash";

export const fetchAccounting = createAsyncThunk(
  `fetch ${ACCOUNTING}`,
  async (data, thunk) => {
    try {
      const response = await api.get("/accountingbalance").catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });
      const responseData = response.data?.map((accounting) => {
        return {
          ...accounting,
          table: [
            accounting?.currency,
            accounting?._type?.toLowerCase() === "income"
              ? `+ ${accounting?.transaction_amount
                  ?.toString()
                  ?.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`
              : `- ${accounting?.transaction_amount
                  ?.toString()
                  ?.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`,
            accounting?.usd_to_uzs_rate
              ?.toString()
              ?.replace(/\B(?=(\d{3})+(?!\d))/g, " "),
            accounting?.transaction_type,
            accounting?.balance_type
              ?.replace("_", " ")
              ?.replace("uzb", "uzbekistan"),
            accounting?.created_at,
            accounting?.notes?.[0]?.message,
            accounting?.order_number,
            accounting?.staff_name,
          ],
        };
      });
      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
