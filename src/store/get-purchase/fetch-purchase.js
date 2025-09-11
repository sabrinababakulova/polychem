import { createAsyncThunk } from "@reduxjs/toolkit";
import { PURCHASE } from "../../constants";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { isArray } from "lodash";
import { format } from "date-fns";

export const fetchPurchase = createAsyncThunk(PURCHASE, async (data, thunk) => {
  try {
    const { products } = thunk.getState();
    const response = await api.get("/purchase").catch((e) => {
      thunk.dispatch(
        setError(
          isArray(e?.response?.data)
            ? e?.response?.data?.[0]
            : `${e.message} from ${e?.config?.url}`
        )
      );
      throw new Error(e);
    });
    const correctData = response?.data?.map((purchase) => {
      const chosenProducts = products?.data?.filter((item) =>
        purchase?.prods?.includes(item?.id)
      );
      return {
        ...purchase,
        totalPrice: Number((purchase?.quantity * purchase?.price)?.toFixed(2)),
        product: chosenProducts,
        created_at: format(new Date(purchase?.created_at), "yyyy-MM-dd"),
        table: [
          purchase?.pi,
          purchase?.created_at,
          chosenProducts.map((item) => item?.name).join(", "),
          purchase?.manufacturer_name,
          purchase?.quantity,
          purchase?.price,
          (purchase?.quantity * purchase?.price)
            ?.toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
        ],
        insiderData: {
          id: purchase?.id,
          "pi#": purchase?.pi,
          product: chosenProducts.map((item) => item?.name).join(", "),
          manufacturer: purchase?.manufacturer_name,
          "Quantity (tons)": purchase?.quantity,
          "Available quantity": Number(purchase?.available_quantity).toFixed(2),
          "Price per ton": purchase?.price
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
          "Total price": (purchase?.quantity * purchase?.price)
            ?.toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
          paid: purchase?.paid,
          "To be paid": purchase?.pay_left,
        },
      };
    });
    return { data: correctData };
  } catch (e) {
    return e;
  }
});
