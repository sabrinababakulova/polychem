import { createAsyncThunk } from "@reduxjs/toolkit";
import { CUSTOMER } from "../../constants";
import { authorizationAPI } from "../../constants/api";
import { setError } from "../get-notif";
import { cloneDeep, isArray } from "lodash";
import { fixCustomer } from ".";
import { format } from "date-fns";

export const fetchCustomerHistory = createAsyncThunk(
  `fetch ${CUSTOMER} history`,
  async (data, thunk) => {
    try {
      const { customers } = thunk.getState();
      const { itemId } = data;
      const chosenCustomer = customers?.data?.find(
        (customer) => customer?.id === Number(itemId)
      );
      const chosenCustomerCopy = cloneDeep(chosenCustomer);
      const response = await authorizationAPI
        .get(`/api/history/customer/${itemId}`)
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
      const normalizedHistory = Object.values(response?.data)?.[0]?.map(
        (item) => [
          format(item?.created_at, "MMMM, yyyy"),
          item?.load,
          item?.pick_up_location,
          item?.quantity,
          item?.wagon_number,
          item?.shipping_date,
          item?.p_loads?.[0]?.transportation_loss,
          item?.delivery_loss,
          item?.status,
        ]
      );
      chosenCustomerCopy.history = normalizedHistory;
      thunk.dispatch(
        fixCustomer({
          data: chosenCustomerCopy,
          id: Number(itemId),
        })
      );
      return { data: response?.data };
    } catch (e) {
      return e;
    }
  }
);
