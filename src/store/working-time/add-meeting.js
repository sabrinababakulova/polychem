import { createAsyncThunk } from "@reduxjs/toolkit";
import { setError, setSuccess } from "../get-notif";
import api from "../../constants/api";
import Cookies from "js-cookie";
import { UNIVERSAL_TIME } from "../../constants";
import { format } from "date-fns";
import { cloneDeep, isArray } from "lodash";
import { editUser } from "../staff";

export const postMeetingTime = createAsyncThunk(
  `post meeting time`,
  async (data, thunk) => {
    try {
      const { meetingWith, startTime, endTime } = data;
      const { staff } = thunk.getState();
      const userId = Cookies.get("userId");
      const chosenUser = staff.data.find((user) => user.id === Number(userId));
      const responseData = {
        start_time: format(startTime, UNIVERSAL_TIME),
        end_time: format(endTime, UNIVERSAL_TIME),
        staff_id: Number(userId),
        meeting_with: meetingWith?.label,
      };
      const response = await api.post("/meeting", responseData).catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error("got an error");
      });
      const chosenUserCopy = cloneDeep(chosenUser);
      chosenUserCopy.totalMeetingTime.push({
        start_time: startTime,
        end_time: endTime,
        staff_id: Number(userId),
        meeting_with: meetingWith?.label,
        id: response?.data?.data?.id,
      });
      thunk.dispatch(editUser({ id: chosenUserCopy.id, data: chosenUserCopy }));
      thunk.dispatch(setSuccess("Successfuly added meeting time"));
      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
