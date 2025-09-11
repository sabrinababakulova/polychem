import { createAsyncThunk } from "@reduxjs/toolkit";
import { SALES } from "../../constants";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { isArray } from "lodash";

export const fetchSales = createAsyncThunk(SALES, async (data, thunk) => {
  try {
    const response = await api.get("/sale").catch((e) => {
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
    const responseData = response?.data?.map((item) => ({
      ...item,
      product: item?.pis?.[0]?.product_name,
      quantity: item?.pis?.reduce((acc, item) => acc + item?.quantity, 0),
      table: [
        item?.order_number,
        item?.customer_company_name,
        item?.pis?.[0]?.product_name,
        item?.pis?.reduce((acc, item) => acc + item?.quantity, 0),
        item?.price,
        (
          item?.pis?.reduce((acc, item) => acc + item?.quantity, 0) *
          Number(item?.price)
        ).toFixed(2),
        item?.payment_type,
        item?.payment_condition,
        item?.delivery_condition,
        item?.payment_date,
        item?.staff_name,
      ],
      insiderData: {
        id: item?.id,
        "Order Number": item?.order_number,
        customer: item?.customer_company_name,
        "Sales Person": item?.staff_name,
        country: item?.country_name,
        product: item?.pis?.[0]?.product_name,
        "Quantity (Tons)": item?.pis?.reduce(
          (acc, item) => acc + item?.quantity,
          0
        ),
        "Sale Type": item?.sale_type,
        "Price per ton": item?.price
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
        "Payment Type": item?.payment_type,
        "Payment Condition": item?.payment_condition,
        "Delivery Condition": item?.delivery_condition,
        "Payment Date": item?.payment_date,
        "sales amount": (
          item?.pis?.reduce((acc, item) => acc + item?.quantity, 0) *
          Number(item?.price)
        ).toFixed(2),
        paid: item?.paid,
        "to be paid": (
          item?.pis?.reduce((acc, item) => acc + item?.quantity, 0) *
            Number(item?.price) -
          Number(item?.paid)
        ).toFixed(2),
        pis: item?.pis,
      },
    }));

    return { data: responseData };
  } catch (e) {
    return e;
  }
});
