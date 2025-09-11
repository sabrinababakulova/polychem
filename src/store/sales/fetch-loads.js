import { createAsyncThunk } from "@reduxjs/toolkit";
import { SALES_LOADS } from "../../constants";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { isArray } from "lodash";

export const fetchSalesLoads = createAsyncThunk(
  `fetch ${SALES_LOADS}`,
  async (payload, thunk) => {
    try {
      const response = await api.get("/saleload").catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });
      const { sales } = thunk.getState();
      const { data } = sales;
      const responseData = response?.data?.map((load) => {
        const chosenSale = data?.find((sale) => sale?.id === load?.sale_id);
        return {
          ...load,
          product: chosenSale?.pis?.[0]?.product_name,
          manufacturer: chosenSale?.customer_company_name,
          customer: chosenSale?.customer_company_name,
          manager: chosenSale?.staff_name,
          table: [
            load?.load,
            load?.pis?.map((pi) => pi).join(", "),
            chosenSale?.order_number,
            chosenSale?.pis?.[0]?.product_name,
            chosenSale?.customer_company_name,
            Number(load?.quantity),
            chosenSale?.price,
            load?.pis?.length,
            load?.pick_up_location || 0,
            load?.delivery_loss,
          ],
          secondTable: [
            load?.created_at,
            load?.pis?.map((pi) => pi).join(", "),
            chosenSale?.order_number,
            chosenSale?.pis?.[0]?.product_name,
            load?.quantity,
            chosenSale?.price,
            (load?.quantity * chosenSale?.price)
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
            chosenSale?.total_cost.toFixed(2),
            chosenSale?.customer_company_name,
            chosenSale?.staff_name,
          ],
          insiderTable: [
            load?.load,
            load?.pick_up_location,
            load?.quantity,
            load?.wagon_number,
            load?.shipping_date,
            load?.delivery_loss,
            load?.status,
          ],
        };
      });
      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
