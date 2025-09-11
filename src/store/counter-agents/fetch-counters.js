import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { fetchNotes } from "./fetch-notes";
import { isArray } from "lodash";

export const fetchCounters = createAsyncThunk(
  "counters",
  async (data, thunk) => {
    try {
      const response = await api.get("/counteragent").catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });
      const notes = await thunk.dispatch(fetchNotes());
      const correctData = response?.data?.map((item) => {
        const filteredNotes = notes?.payload?.data?.filter(
          (counter) => counter?.counter_agent_id === item?.id
        );
        return {
          ...item,
          table: [
            item?.name,
            item?.city,
            item?.country_name,
            item?.email,
            item?.phone_number,
            item?.notes?.[0]?.message,
          ],
          insiderData: {
            id: item?.id,
            name: item?.name,
            country: item?.country_name,
            city: item?.city,
            email: item?.email,
            phone: item?.phone_number,
            notes: filteredNotes?.[0]?.message,
          },
          notes: filteredNotes,
          accounting_balances: item?.accounting_balances?.map((balance) => ({
            ...balance,
            insiderTable: [
              balance?.transaction_amount,
              balance?.transaction_type,
              balance?.balance_type
                ?.replace("_", " ")
                ?.replace("uzb", "Uzbekistan"),
              balance?.created_at,
              balance?.staff_name,
            ],
          })),
        };
      });
      return { data: correctData };
    } catch (e) {
      return e;
    }
  }
);
