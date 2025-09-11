import { createAsyncThunk } from "@reduxjs/toolkit";
import { PRODUCT } from "../../constants";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { isArray } from "lodash";

export const fetchPriceAnalytics = createAsyncThunk(
  `fetch ${PRODUCT} prices`,
  async (info, thunk) => {
    try {
      const response = await api.get("/productprice").catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });
      const responseData = response.data?.map((prices) => ({
        ...prices,
        table: [
          prices?.product_name,
          prices?.updated_at,
          `$ ${prices?.avg_stock_price}`,
          prices?.manufacturer_name,
          `$ ${prices?.manufacturer_price}`,
        ],
        insiderTable: [
          prices?.updated_at,
          `$ ${prices?.max_stock_price}`,
          `$ ${prices?.min_stock_price}`,
          `$ ${prices?.avg_stock_price}`,
          `${prices?.usd_to_uzs_rate} UZS`,
          prices?.manufacturer_name,
          `$ ${prices?.manufacturer_price}`,
        ],
      }));

      return responseData;
    } catch (e) {
      return e;
    }
  }
);
