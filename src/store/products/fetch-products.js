import { createAsyncThunk } from "@reduxjs/toolkit";
import { PRODUCT } from "../../constants";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { fetchPriceAnalytics } from "./fetch-price-analytics";
import { isArray } from "lodash";

export const fetchProduct = createAsyncThunk(
  `fetch ${PRODUCT}`,
  async (info, thunk) => {
    try {
      const response = await api.get("/product").catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });
      const prices = await thunk.dispatch(fetchPriceAnalytics());

      const responseData = response.data?.map((product) => {
        const chosenProductPrices = prices?.payload?.filter(
          (item) => item?.product_id === product?.id
        );
        return {
          ...product,
          prices: chosenProductPrices,
          table: [
            product?.name,
            product?.category_name,
            product?.subcategory_name,
            product?.files?.length,
          ],
          insiderData: {
            id: product?.id,
            name: product?.name,
            category: product?.category_name,
            subcategory: product?.subcategory_name,
          },
        };
      });

      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
