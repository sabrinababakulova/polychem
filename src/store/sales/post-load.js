import { createAsyncThunk } from "@reduxjs/toolkit";
import { LOAD } from "../../constants";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { isArray } from "lodash";

export const postSalesLoad = createAsyncThunk(
  `post ${LOAD}`,
  async (data, thunk) => {
    const { quantity, location, salesId, loss } = data;
    try {
      const { sales } = thunk.getState();
      const { data } = sales;
      const chosenSale = data?.find((sale) => sale?.id === salesId);
      const response = await api
        .post("/saleload", {
          quantity: Number(quantity),
          sale_id: Number(salesId),
          pick_up_location: location,
          status: "Not Loaded",
          delivery_loss: Number(loss),
        })
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
      const responseData = {
        load: response?.data?.data?.load,
        quantity: Number(quantity),
        sale_id: Number(salesId),
        pick_up_location: location,
        status: "Not Loaded",
        delivery_loss: Number(loss),
        product: chosenSale?.pis?.[0]?.product_name,
        manufacturer: chosenSale?.customer_company_name,
        customer: chosenSale?.customer_company_name,
        manager: chosenSale?.staff_name,
        table: [
          response?.data?.data?.load,
          response?.data?.data?.pi,
          chosenSale?.order_number,
          chosenSale?.pis?.[0]?.product_name,
          chosenSale?.customer_company_name,
          Number(quantity),
          chosenSale?.price,
          0,
          location,
          loss,
        ],
        secondTable: [
          new Date().toLocaleDateString(),
          0,
          chosenSale?.order_number,
          chosenSale?.pis?.[0]?.product_name,
          quantity,
          chosenSale?.price,
          0,
          0,
          chosenSale?.customer_company_name,
          chosenSale?.staff_name,
        ],
        insiderTable: [
          response?.data?.data?.load,
          location,
          quantity,
          0,
          0,
          loss,
          "Not Loaded",
        ],
      };
      thunk.dispatch(setSuccess("Successfuly created load"));

      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
