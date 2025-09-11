import { createAsyncThunk } from "@reduxjs/toolkit";
import { PURCHASE } from "../../constants";
import { formDataApi } from "../../constants/api";
import { cloneDeep, isArray } from "lodash";
import { setError, setSuccess } from "../get-notif";

export const postFile = createAsyncThunk(
  `post ${PURCHASE} files`,
  async (data, thunk) => {
    try {
      const { file, itemId } = data;
      const { purchases } = thunk.getState();
      const purchase = purchases?.data?.find(
        (item) => item?.id === Number(itemId)
      );
      const purchaseCopy = cloneDeep(purchase);
      purchaseCopy.files = [...file, ...purchaseCopy?.files];
      if (file?.length !== 0) {
        const formData = new FormData();
        file?.forEach((eachFile, index) => {
          formData.append(`file${index + 1}`, eachFile);
        });
        formData.append("purchase_id", itemId);
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

      return { newData: purchaseCopy, id: purchaseCopy?.id };
    } catch (e) {
      return e;
    }
  }
);
