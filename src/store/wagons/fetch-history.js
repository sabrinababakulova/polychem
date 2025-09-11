import { createAsyncThunk } from "@reduxjs/toolkit";
import { WAGON } from "../../constants";
import { authorizationAPI } from "../../constants/api";
import { setError } from "../get-notif";
import { cloneDeep, isArray } from "lodash";
import { fixWagon } from ".";
import { format } from "date-fns";

export const fetchWagonHistory = createAsyncThunk(
  `fetch ${WAGON} history`,
  async (data, thunk) => {
    try {
      const { itemId } = data;
      const { wagons } = thunk.getState();
      const chosenWagon = wagons?.data?.find(
        (wagon) => wagon?.id === Number(itemId)
      );
      const chosenWagonCopy = cloneDeep(chosenWagon);
      const response = await authorizationAPI
        .get(`/api/history/wagon/${itemId}`)
        .catch((e) => {
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
      const normalizedHistory = Object.values(response?.data)
        ?.map((item) => Object?.values(item)?.[0])
        ?.flat();
      const tabledHistory = normalizedHistory?.map((item) => [
        format(item?.created_at, "MMMM, yyyy"),
        item?.load,
        item?.pick_up_location,
        item?.quantity,
        item?.wagon_number,
        item?.shipping_date,
        item?.transportation_loss || item?.p_loads?.[0]?.transportation_loss,
        item?.delivery_loss,
        item?.status,
      ]);
      chosenWagonCopy.history = tabledHistory;
      thunk.dispatch(fixWagon({ data: chosenWagonCopy, id: Number(itemId) }));
      return { data: response?.data };
    } catch (e) {
      return e;
    }
  }
);
