import { createAsyncThunk } from "@reduxjs/toolkit";
import { STAFF } from "../../constants";
import { formDataApi } from "../../constants/api";
import Cookies from "js-cookie";
import { cloneDeep, isArray } from "lodash";
import { setError, setSuccess } from "../get-notif";

export const postStaffFile = createAsyncThunk(
  `post ${STAFF} files`,
  async (data, thunk) => {
    const { file } = data;
    try {
      const userId = Cookies.get("userId");
      const { staff } = thunk.getState();
      const employee = staff?.data?.find((user) => user?.id === Number(userId));
      const employeeCopy = cloneDeep(employee);
      employeeCopy.files = [...file, ...employeeCopy?.files];
      if (file?.length !== 0) {
        const formData = new FormData();
        file?.forEach((eachFile, index) => {
          formData.append(`file${index + 1}`, eachFile);
        });
        formData.append("staff_id", userId);
        try {
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
        } catch (e) {
          throw new Error(e?.response?.data);
        }
      }
      thunk.dispatch(setSuccess("Successfuly added file"));

      return { newData: employeeCopy, id: employeeCopy?.id };
    } catch (e) {
      return e;
    }
  }
);
