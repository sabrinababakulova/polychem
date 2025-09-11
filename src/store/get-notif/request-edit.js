import { createAsyncThunk } from "@reduxjs/toolkit";
import { setError, setSuccess } from ".";
import api from "../../constants/api";
import { isArray } from "lodash";

export const requestEdit = createAsyncThunk(
  "edit notifs",
  async (data, thunk) => {
    try {
      const {
        firstName,
        lastName,
        dateOfBirth,
        password,
        position,
        startDate,
        phoneNumber,
        email,
        status,
      } = data;
      const actualData = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        date_of_birth: dateOfBirth,
        position: position,
        start_date: startDate,
        phone_number: phoneNumber,
        status: status,
      };
      password && (actualData.password = password);
      await api.post("/staff/edit", actualData).catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });
      thunk.dispatch(
        setSuccess("Successfuly requested edit for your information")
      );
    } catch (e) {
      return e;
    }
  }
);
