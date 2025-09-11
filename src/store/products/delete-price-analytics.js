import { createAsyncThunk } from "@reduxjs/toolkit";
import { PRODUCT } from "../../constants";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { cloneDeep, isArray } from "lodash";

export const deleteProductPrice = createAsyncThunk(
  `delete ${PRODUCT} prices`,
  async (data, thunk) => {
    const { id, productId } = data;
    try {
      const { products } = thunk.getState();
      const chosenProduct = products?.data?.find(
        (item) => item?.id === Number(productId)
      );
      const chosenProductCopy = cloneDeep(chosenProduct);
      await api.delete(`/productprice/${id}`).catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });
      const filteredPrices = chosenProductCopy?.prices?.filter(
        (item) => Number(item?.id) !== Number(id)
      );
      chosenProductCopy.prices = filteredPrices;
      thunk.dispatch(setSuccess("Successfuly deleted price analytics"));
      return { data: chosenProductCopy, id: Number(productId) };
    } catch (e) {
      return e;
    }
  }
);
