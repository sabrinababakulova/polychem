import { createAsyncThunk } from "@reduxjs/toolkit";
import { PRODUCT } from "../../constants";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { isArray } from "lodash";

export const editProduct = createAsyncThunk(
  `edit ${PRODUCT}`,
  async (data, thunk) => {
    const { category, subcategory, name, itemId } = data;

    try {
      const { products } = thunk.getState();
      const chosenProduct = products?.data?.find(
        (item) => item?.id === Number(itemId)
      );
      const product = {
        name,
        category_id: category?.value,
        subcategory_id: subcategory?.value,
      };
      await api.put(`/product/${itemId}`, product).catch((e) => {
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
        ...product,
        category_name: category?.label,
        subcategory_name: subcategory?.label,
        id: itemId,
        insiderData: {
          id: itemId,
          name: name,
          category: category?.label,
          subcategory: subcategory?.label,
        },
        table: [
          name,
          category?.label,
          subcategory?.label,
          chosenProduct?.files?.length,
        ],
      };
      thunk.dispatch(setSuccess("Successfuly edited product"));

      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
