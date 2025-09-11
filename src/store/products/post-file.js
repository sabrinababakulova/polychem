import { createAsyncThunk } from "@reduxjs/toolkit";
import { PRODUCT } from "../../constants";
import { formDataApi } from "../../constants/api";
import { cloneDeep, isArray } from "lodash";
import { setError, setSuccess } from "../get-notif";

export const postFile = createAsyncThunk(
  `post ${PRODUCT} files`,
  async (data, thunk) => {
    const { file, itemId } = data;
    try {
      const { products } = thunk.getState();
      const product = products?.data?.find(
        (item) => item?.id === Number(itemId)
      );
      const productCopy = cloneDeep(product);
      productCopy.files = [...file, ...productCopy?.files];
      productCopy.table[3] = productCopy?.files?.length;
      if (file?.length !== 0) {
        const formData = new FormData();
        file?.forEach((eachFile, index) => {
          formData.append(`file${index + 1}`, eachFile);
        });
        formData.append("product_id", itemId);
        try {
          await formDataApi.post(`/file`, formData).catch((e) => {
            thunk.dispatch(
              setError(
                isArray(e?.response?.data)
                  ? e?.response?.data?.[0]
                  : `${e.message} from ${e?.config?.url}`
              )
            );
            throw new Error(e);
          });
        } catch (e) {
          throw new Error(e?.response?.data);
        }
      }
      thunk.dispatch(setSuccess("Successfuly added file"));
      return { newData: productCopy, id: productCopy?.id };
    } catch (e) {
      return e;
    }
  }
);
