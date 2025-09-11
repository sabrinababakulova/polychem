import { createAsyncThunk } from "@reduxjs/toolkit";
import { setError, setSuccess } from ".";
import api from "../../constants/api";
import { isArray } from "lodash";

export const answerRequest = createAsyncThunk(
  "answer request",
  async (data, thunk) => {
    try {
      const { approveId, isApprove } = data;
      if (isApprove) {
        await api.post(`/staff/approve_edit/${Number(approveId)}`).catch((e) => {
        if(e?.response?.status === 403){
          thunk.dispatch(
            setError(
              "You do not have permission to edit this user"
            )
          );
          throw new Error(
            "You do not have permission to edit this user"
          );
        
        }
          thunk.dispatch(
            setError(
              isArray(e?.response?.data)
                ? e?.response?.data?.[0]
                : `${e.message} from ${e?.config?.url}`
            )
          );
          throw new Error(e);
        });
        thunk.dispatch(setSuccess("Successfuly accepted the edit request"));
      } else {
        await api.post(`/staff/reject_edit/${Number(approveId)}`).catch((e) => {
        if(e?.response?.status === 403){
          thunk.dispatch(
            setError(
              "You do not have permission to edit this user"
            )
          );
          throw new Error(
            "You do not have permission to edit this user"
          );
        
        }
          thunk.dispatch(
            setError(
              isArray(e?.response?.data)
                ? e?.response?.data?.[0]
                : `${e.message} from ${e?.config?.url}`
            )
          );
          throw new Error(e);
        });
        thunk.dispatch(setSuccess("Successfuly rejected the edit request"));
      }
    } catch (e) {
      return e;
    }
  }
);
