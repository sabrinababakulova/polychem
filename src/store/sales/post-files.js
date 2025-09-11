import { createAsyncThunk } from "@reduxjs/toolkit";
import { SALES } from "../../constants";
import { formDataApi } from "../../constants/api";
import { cloneDeep, isArray } from "lodash";
import { setError, setSuccess } from "../get-notif";

export const postFile = createAsyncThunk(
  `post ${SALES} files`,
  async (data, thunk) => {
    const { file, itemId } = data;
    try {
      const { sales } = thunk.getState();
      const sale = sales?.data?.find((user) => user?.id === Number(itemId));
      const saleCopy = cloneDeep(sale);
      saleCopy.files = [...file, ...saleCopy?.files];
      if (file?.length !== 0) {
        const formData = new FormData();
        file?.forEach((eachFile, index) => {
          formData.append(`file${index + 1}`, eachFile);
        });
        formData.append("sale_id", itemId);
        await formDataApi.post(`/file`, formData).catch((e) => {
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
      }
      thunk.dispatch(setSuccess("Successfuly added file"));

      return { newData: saleCopy, id: saleCopy?.id };
    } catch (e) {
      return e;
    }
  }
);
