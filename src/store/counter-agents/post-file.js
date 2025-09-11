import { createAsyncThunk } from "@reduxjs/toolkit";
import { formDataApi } from "../../constants/api";
import { cloneDeep, isArray } from "lodash";
import { setError, setSuccess } from "../get-notif";

export const postFile = createAsyncThunk(
  `post counter files`,
  async (data, thunk) => {
    try {
      const { file, itemId } = data;
      const { counteragents } = thunk.getState();
      const counterAgent = counteragents?.data?.find(
        (item) => item?.id === Number(itemId)
      );
      const counterAgentCopy = cloneDeep(counterAgent);
      counterAgentCopy.files = [...file, ...counterAgentCopy?.files];
      if (file?.length !== 0) {
        const formData = new FormData();
        file?.forEach((eachFile, index) => {
          formData.append(`file${index + 1}`, eachFile);
        });
        formData.append("counter_agent_id", itemId);
        await formDataApi.post(`/file`, formData).catch((e) => {
          thunk.dispatch(
            setError(
              isArray(e?.response?.data)
                ? e?.response?.data?.[0]
                : `${e.message} from ${e?.config?.url}`
            )
          );
          throw new Error(
            e
          );
        });
      }
      thunk.dispatch(setSuccess("Successfuly added file"));

      return { newData: counterAgentCopy, id: counterAgentCopy?.id };
    } catch (e) {
      return e;
    }
  }
);
