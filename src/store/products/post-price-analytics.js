import { createAsyncThunk } from "@reduxjs/toolkit";
import { PRODUCT } from "../../constants";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { cloneDeep, isArray } from "lodash";

export const postProductPrice = createAsyncThunk(
  `post ${PRODUCT} prices`,
  async (data, thunk) => {
    const { chosenPrices, manufacturersPrices, itemId } = data;
    const { products } = thunk.getState();
    try {
      const chosenProduct = products?.data?.find(
        (item) => item?.id === Number(itemId)
      );
      const chosenProductCopy = cloneDeep(chosenProduct);
      const allPrices = [];
      const prices = {
        max_stock_price: Number(chosenPrices?.maxStock),
        min_stock_price: Number(chosenPrices?.minStock),
        product_id: Number(itemId),
        usd_to_uzs_rate: chosenPrices?.conversionRate,
        updated_at: new Date(chosenPrices?.date),
      };
      for (const eachPrice of manufacturersPrices) {
        const response = await api
          .post("/productprice", {
            ...prices,
            manufacturer_id: Number(eachPrice?.manufacturer?.value),
            manufacturer_price: Number(eachPrice?.price),
          })
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
        const responseData = {
          product_id: Number(itemId),
          id: response?.data?.data?.id,
          product_name: chosenProductCopy?.name,
          manufacturer_name: eachPrice?.manufacturer?.label,
          manufacturer_id: Number(eachPrice?.manufacturer?.value),
          table: [
            chosenProductCopy?.name,
            chosenPrices?.date,
            `$ ${
              (Number(chosenPrices?.maxStock) +
                Number(chosenPrices?.minStock)) /
              2
            }`,
            eachPrice?.manufacturer?.label,
            `$ ${eachPrice?.price}`,
          ],
          insiderTable: [
            chosenPrices?.date,
            `$ ${chosenPrices?.maxStock}`,
            `$ ${chosenPrices?.minStock}`,
            `$ ${
              (Number(chosenPrices?.maxStock) +
                Number(chosenPrices?.minStock)) /
              2
            }`,
            `${chosenPrices?.conversionRate} UZS`,
            eachPrice?.manufacturer?.label,
            `$ ${eachPrice?.price}`,
          ],
        };
        allPrices?.push(responseData);
      }
      chosenProductCopy.prices = [...allPrices, ...chosenProductCopy?.prices];
      thunk.dispatch(setSuccess("Successfuly added price analytics"));
      return { data: chosenProductCopy, id: itemId };
    } catch (e) {
      return e;
    }
  }
);
