import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import Cookies from "js-cookie";
import { isArray } from "lodash";

export const editCounter = createAsyncThunk(
  `edit counter`,
  async (data, thunk) => {
    try {
      const { info, itemId } = data;
      const userId = Cookies.get("userId");
      const counterAgent = {
        name: info?.name,
        city: info?.city,
        country_id: info?.country?.value,
        email: info?.email,
        phone_number: info?.phoneNumber,
      };
      await api.put(`/counteragent/${itemId}`, counterAgent).catch((e) => {
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
            counter_agent_id: itemId,
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
        id: itemId,
        table: [
          info?.name,
          info?.city,
          info?.country?.label,
          info?.email,
          info?.phone_number,
          info?.notes,
        ],
        insiderData: {
          id: itemId,
          name: info?.name,
          country: info?.country?.label,
          city: info?.city,
          email: info?.email,
          phone: info?.phoneNumber,
          notes: info?.notes,
        },
      };
      thunk.dispatch(setSuccess("Successfuly edited counteragent"));
      return { data: responseData, id: itemId };
    } catch (e) {
      return e;
    }
  }
);
