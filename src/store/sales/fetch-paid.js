// /crud/sale/<int:sale_id>/accounting
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SALES } from "../../constants";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { isArray } from "lodash";

export const fetchSalesPaid = createAsyncThunk(
  `fetch ${SALES} paid`,
  async (data, thunk) => {
    try {
      const { itemId } = data;
      // const { manufacturers } = thunk.getState();
      // const chosenMan = manufacturers?.data?.find(
      //   (item) => item?.id === Number(itemId)
      // );
      // const chosenManCopy = cloneDeep(chosenMan);
      const response = await api
        .get(`/sale/${itemId}/accounting`)
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
      // const normalizedHistory = Object.values(response?.data)?.[0];
      // const tabledHistory = normalizedHistory?.map((item) => [
      //   format(item?.created_at, "MMMM, yyyy"),
      //   item?.load,
      //   item?.pick_up_location,
      //   item?.quantity,
      //   item?.wagon_number,
      //   item?.shipping_date,
      //   item?.transportation_loss || item?.p_loads?.[0]?.transportation_loss,
      //   item?.delivery_loss,
      //   item?.status,
      // ]);
      // chosenManCopy.history = tabledHistory;
      // thunk.dispatch(
      //   fixManufacturer({ data: chosenManCopy, id: Number(itemId) })
      // );
      return { data: response?.data };
    } catch (e) {
      return e;
    }
  }
);
