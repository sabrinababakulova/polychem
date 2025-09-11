import { createAsyncThunk } from "@reduxjs/toolkit";
import { USER } from "../../constants";
import { authorizationAPI } from "../../constants/api";
import Cookies from "js-cookie";
import { setError } from "../get-notif";
import { isArray } from "lodash";

export const fetchUser = createAsyncThunk(USER, async (data, thunk) => {
  try {
    const { email, password } = data;
    const response = await authorizationAPI
      .post("/auth/login", {
        email,
        password,
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
    const { msg, token, position, public_id } = response.data;
    if (msg === "ok" && token) {
      Cookies.set("token", token, { expires: 1 });
      Cookies.set("userId", public_id, { expires: 1 });
      Cookies.set("position", position, { expires: 1 });
    }
    return { email, role: position };
  } catch (e) {
    return e;
  }
});
