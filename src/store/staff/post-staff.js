import { createAsyncThunk } from "@reduxjs/toolkit";
import { STAFF } from "../../constants";
import { authorizationAPI, formDataApi } from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { isArray } from "lodash";

const isDateValid = (dateStr) => {
  return !isNaN(new Date(dateStr));
};

export const postStaff = createAsyncThunk(
  `post ${STAFF}`,
  async (data, thunk) => {
    const {
      firstName,
      lastName,
      dateOfBirth,
      password,
      position,
      startDate,
      phoneNumber,
      email,
      file,
    } = data;
    try {
      if (
        firstName &&
        lastName &&
        email &&
        dateOfBirth &&
        phoneNumber &&
        password &&
        position
      ) {
        const { staff: getStaff } = thunk.getState();
        const { data: staff } = getStaff;
        const existingEmployee = staff.find(
          (employee) =>
            employee?.first_name?.toLowerCase() === firstName?.toLowerCase() &&
            employee?.last_name?.toLowerCase() === lastName?.toLowerCase() &&
            employee?.email?.toLowerCase() === email?.toLowerCase()
        );
        if (existingEmployee) {
          thunk.dispatch(setError("Employee already exists"));
          throw new Error("Employee already exists");
        } else {
          const actualData = {
            first_name: firstName,
            last_name: lastName,
            email,
            date_of_birth: isDateValid(dateOfBirth) && dateOfBirth,
            password,
            position: position?.toLowerCase()?.replace(" ", "_"),
            start_date: isDateValid(startDate) && startDate,
            phone_number: phoneNumber,
          };
          const response = await authorizationAPI
            .post("/auth/register", actualData)
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
          if (file) {
            const formData = new FormData();
            formData.append("image", file);
            await formDataApi
              .post(`/logo-staff/${response?.data?.id}`, formData)
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
            ...actualData,
            id: response?.data?.id,
            logo: file?.preview,
            customers: [],
            secondTable: [
              `${firstName} ${lastName}`,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              "On",
            ],
            table: [`${firstName} ${lastName}`, position, 0, 0, 0, "On"],
            insiderData: {
              id: response?.data?.id,
              name: firstName + " " + lastName,
              "Sales amount": 0,
              "Customers Amount": 0,
              "Customers Demand": 0,
              "Actual Sales": 0,
              performance: 0,
              "Days worker": 0,
              "Hours worked": 0,
              "Days off": 0,
              Status: "On",
              "Phone number": phoneNumber,
              "E-mail": email,
            },
          };
          thunk.dispatch(setSuccess("Successfuly created user " + firstName));
          return {
            data: responseData,
          };
        }
      }
    } catch (e) {
      return e;
    }
  }
);
