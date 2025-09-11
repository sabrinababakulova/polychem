import { createAsyncThunk } from "@reduxjs/toolkit";
import { WAGON } from "../../constants";
import { formDataApi } from "../../constants/api";
import { cloneDeep, isArray } from "lodash";
import { setError, setSuccess } from "../get-notif";

export const postFile = createAsyncThunk(
  `post ${WAGON} files`,
  async (data, thunk) => {
    try {
      const { file, itemId } = data;
      const { wagons } = thunk.getState();
      const wagon = wagons?.data?.find((item) => item?.id === Number(itemId));
      const wagonCopy = cloneDeep(wagon);
      wagonCopy.files = [...file, ...wagonCopy?.files];
      if (file?.length !== 0) {
        const formData = new FormData();
        file?.forEach((eachFile, index) => {
          formData.append(`file${index + 1}`, eachFile);
        });
        formData.append("wagon_id", itemId);
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
      return { newData: wagonCopy, id: wagonCopy?.id };
    } catch (e) {
      return e;
    }
  }
);
