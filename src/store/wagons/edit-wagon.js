import { createAsyncThunk } from "@reduxjs/toolkit";
import { WAGON } from "../../constants";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { isArray } from "lodash";

export const editWagon = createAsyncThunk(
  `edit ${WAGON}`,
  async (data, thunk) => {
    const { wagonNumber, wagonType, location, itemId } = data;
    try {
      const { wagons: getWagons } = thunk.getState();
      const { data: wagons } = getWagons;
      const existingWagon = wagons.find((wagon) => wagon?.id === itemId);

      const actualData = {
        number: wagonNumber || existingWagon?.number,
        type: wagonType || existingWagon?.type,
        location: location || existingWagon?.location,
      };
      await api.put(`/wagon/${itemId}`, actualData).catch((e) => {
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
      const purchaseProducts = existingWagon?.purchase_loads_products?.map(
        (item) => item?.product
      );
      const salesProducts = existingWagon?.sales_loads_products?.map(
        (item) => item?.products
      );
      const purchaseProductsQuantity =
        existingWagon?.purchase_loads_products?.reduce(
          (acc, item) => acc + item?.quantity,
          0
        );
      const salesProductsQuantity = existingWagon?.sales_loads_products?.reduce(
        (acc, item) => acc + item?.quantity,
        0
      );
      const responseData = {
        id: itemId,
        ...actualData,
        table: [
          wagonNumber,
          wagonType,
          0,
          location,
          new Date().toISOString(),
          new Set([...purchaseProducts, ...salesProducts?.flat()]).size,
        ],
        history: existingWagon?.history,
        insiderData: {
          id: itemId,
          "Wagon Number": wagonNumber,
          "Wagon Type": wagonType,
          "Shipping Date": 0,
          location: location,
          "Last Update": new Date().toISOString(),
          Products: new Set([...purchaseProducts, ...salesProducts?.flat()])
            .size,
          "Overall Quantity (Tons)":
            purchaseProductsQuantity + salesProductsQuantity,
          "Attached Documents": existingWagon?.files?.length || 0,
        },
      };

      thunk.dispatch(setSuccess("Successfuly edited wagon " + wagonNumber));
      return {
        data: responseData,
      };
    } catch (e) {
      return e;
    }
  }
);
