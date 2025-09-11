import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import Cookies from "js-cookie";
import { isArray } from "lodash";

export const postCounter = createAsyncThunk(
  `post counter`,
  async (data, thunk) => {
    try {
      const { info } = data;
      const userId = Cookies.get("userId");
      const counterAgent = {
        name: info?.name,
        city: info?.city,
        country_id: info?.country?.value,
        email: info?.email,
        phone_number: info?.phoneNumber,
      };
      const response = await api
        .post("/counteragent", counterAgent)
        .catch((e) => {
          thunk.dispatch(
            setError(
              isArray(e?.response?.data)
                ? e?.response?.data?.[0]
                : `${e.message} from ${e?.config?.url}`
            )
          );
          throw new Error(e);
        });
      if (info?.notes) {
        await api
          .post("/note", {
            counter_agent_id: response?.data?.data?.id,
            staff_id: Number(userId),
            message: info?.notes,
          })
          .catch((e) => {
            thunk.dispatch(
              setError(
                isArray(e?.response?.data)
                  ? e?.response?.data?.[0]
                  : `${e.message} from ${e?.config?.url}`
              )
            );
            throw new Error(e);
          });
      }
      const responseData = {
        ...counterAgent,
        country_name: info?.country?.label,
        id: response?.data?.data?.id,
        table: [
          info?.name,
          info?.city,
          info?.country?.label,
          info?.email,
          info?.phoneNumber,
          info?.notes,
        ],
        insiderData: {
          id: response?.data?.data?.id,
          name: info?.name,
          country: info?.country?.label,
          city: info?.city,
          email: info?.email,
          phone: info?.phoneNumber,
          notes: info?.notes,
        },
      };
      thunk.dispatch(setSuccess("Successfuly added counteragent"));
      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
