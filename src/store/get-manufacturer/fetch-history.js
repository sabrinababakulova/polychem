import { createAsyncThunk } from "@reduxjs/toolkit";
import { MANUFACTURER } from "../../constants";
import { authorizationAPI } from "../../constants/api";
import { setError } from "../get-notif";
import { cloneDeep, isArray } from "lodash";
import { format } from "date-fns";
import { fixManufacturer } from ".";

export const fetchManufacturerHistory = createAsyncThunk(
  `fetch ${MANUFACTURER} history`,
  async (data, thunk) => {
    try {
      const { itemId } = data;
      const { manufacturers } = thunk.getState();
      const chosenMan = manufacturers?.data?.find(
        (item) => item?.id === Number(itemId)
      );
      const chosenManCopy = cloneDeep(chosenMan);
      const response = await authorizationAPI
        .get(`/api/history/manufacturer/${itemId}`)
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
      const normalizedHistory = Object.values(response?.data)?.[0];
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
      chosenManCopy.history = tabledHistory;
      thunk.dispatch(
        fixManufacturer({ data: chosenManCopy, id: Number(itemId) })
      );
      return { data: response?.data };
    } catch (e) {
      return e;
    }
  }
);
