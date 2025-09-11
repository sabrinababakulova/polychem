import { createAsyncThunk } from "@reduxjs/toolkit";
import { WAGON } from "../../constants";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { isArray } from "lodash";

export const fetchWagon = createAsyncThunk(
  `fetch ${WAGON}`,
  async (data, thunk) => {
    try {
      const response = await api.get("/wagon").catch((e) => {
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
      const responseData = response?.data?.map((wagon) => {
        const purchaseProducts = wagon?.purchase_loads_products?.map(
          (item) => item?.product
        );
        const salesProducts = wagon?.sales_loads_products?.map(
          (item) => item?.products
        );
        const purchaseProductsQuantity = wagon?.purchase_loads_products?.reduce(
          (acc, item) => acc + item?.quantity,
          0
        );
        const salesProductsQuantity = wagon?.sales_loads_products?.reduce(
          (acc, item) => acc + item?.quantity,
          0
        );
        return {
          ...wagon,
          table: [
            wagon?.number,
            wagon?.type,
            wagon?.shipping_date,
            wagon?.location,
            wagon?.updated_at || wagon?.created_at,
            new Set([...purchaseProducts, ...salesProducts?.flat()]).size,
          ],
          history: [],
          insiderData: {
            id: wagon?.id,
            "Wagon Number": wagon?.number,
            "Wagon Type": wagon?.type,
            "Shipping Date": wagon?.shipping_date,
            location: wagon?.location,
            "Last Update": wagon?.updated_at || wagon?.created_at,
            Products: new Set([...purchaseProducts, ...salesProducts?.flat()])
              .size,
            "Overall Quantity (Tons)": Number(
              purchaseProductsQuantity + salesProductsQuantity
            ).toFixed(2),
            "Attached Documents": wagon?.files?.length || 0,
          },
        };
      });
      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
