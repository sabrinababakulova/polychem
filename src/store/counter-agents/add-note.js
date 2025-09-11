import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import Cookies from "js-cookie";
import { fixCustomer } from "../customers";
import { cloneDeep, isArray } from "lodash";
import { fixManufacturer } from "../get-manufacturer";

export const addNote = createAsyncThunk(`add Note`, async (data, thunk) => {
  try {
    const { note, manufacturerId, customerId } = data;
    const { customers, manufacturers } = thunk.getState();
    const chosenCustomer = customers?.data?.find(
      (item) => item?.id === customerId
    );
    const chosenManufacturer = manufacturers?.data?.find(
      (item) => item?.id === manufacturerId
    );
    const userId = Cookies.get("userId");
    const payload = {
      staff_id: Number(userId),
      message: note,
    };
    manufacturerId && (payload.manufacturer_id = Number(manufacturerId));
    customerId && (payload.customer_id = Number(customerId));
    await api.post("/note", payload).catch((e) => {
      thunk.dispatch(
        setError(
          isArray(e?.response?.data)
            ? e?.response?.data?.[0]
            : `${e.message} from ${e?.config?.url}`
        )
      );
      throw new Error(e);
    });
    if (customerId) {
      const chosenCustomerCopy = cloneDeep(chosenCustomer);
      chosenCustomerCopy?.notes?.push({
        staff_name: "You",
        message: note,
        created_at: new Date(),
      });
      thunk.dispatch(
        fixCustomer({ id: Number(customerId), data: chosenCustomerCopy })
      );
    }
    if (manufacturerId) {
      const chosenManufacturerCopy = cloneDeep(chosenManufacturer);
      chosenManufacturerCopy?.notes?.push({
        staff_name: "You",
        message: note,
        created_at: new Date(),
      });
      thunk.dispatch(
        fixManufacturer({ id: manufacturerId, data: chosenManufacturerCopy })
      );
    }

    thunk.dispatch(setSuccess("Successfuly added note"));
  } catch (e) {
    return e;
  }
});
