import { createAsyncThunk } from "@reduxjs/toolkit";
import { setError, setSuccess } from "../get-notif";
import api from "../../constants/api";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { UNIVERSAL_TIME } from "../../constants";
import { cloneDeep, isArray } from "lodash";
import { editUser } from "../staff";

export const postWorkingTime = createAsyncThunk(
  `post `,
  async (data, thunk) => {
    try {
      const { staff } = thunk.getState();
      const { workedDifference } = data;
      const userId = Cookies.get("userId");
      const chosenUser = staff.data.find((user) => user.id === Number(userId));
      const startTime = format(
        new Date(Cookies.get("start_time")),
        UNIVERSAL_TIME
      );
      const endTime = format(new Date(), UNIVERSAL_TIME);
      const responsePayload = {
        start_time: startTime,
        end_time: endTime,
        staff_id: Number(userId),
      };
      await api
        .post("/worktime", responsePayload)
        .then(() => {
          Cookies.set("worked_time_difference", workedDifference, {
            expires: 1,
          });
          Cookies.remove("start_time");
        })
        .catch((e) => {
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
      const chosenUserCopy = cloneDeep(chosenUser);
      chosenUserCopy.totalWorkedTime.push({
        start_time: startTime,
        end_time: endTime,
        staff_id: Number(userId),
        id: Math.random(),
      });
      thunk.dispatch(setSuccess("Successfuly added worked time"));
      thunk.dispatch(editUser({ id: chosenUserCopy.id, data: chosenUserCopy }));
      return { data: responsePayload, workedDifference };
    } catch (e) {
      return e;
    }
  }
);
