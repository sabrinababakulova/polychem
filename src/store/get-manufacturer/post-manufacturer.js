import { createAsyncThunk } from "@reduxjs/toolkit";
import { MANUFACTURER } from "../../constants";
import api, { formDataApi } from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { isArray } from "lodash";

export const postManufacturer = createAsyncThunk(
  `post ${MANUFACTURER}`,
  async (data, thunk) => {
    try {
      const { country, city, email, address, phoneNumber, name, file } = data;
      if (country && city && email && address && phoneNumber && name) {
        const { manufacturers: getManufacturers } = thunk.getState();
        const { data: manufacturers } = getManufacturers;
        const existingManufacturer = manufacturers.find(
          (manufacturer) =>
            manufacturer?.name?.toLowerCase() === name?.toLowerCase() &&
            manufacturer?.email === email
        );
        if (existingManufacturer) {
          throw new Error("Manufacturer already exists");
        } else {
          const response = await api
            .post("/manufacturer", {
              country_id: country?.value,
              city,
              email,
              address,
              phone_number: phoneNumber,
              name,
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
          if (file?.length !== 0) {
            const formData = new FormData();
            formData.append("file", file[0]);
            formData.append("manufacturer_id", response?.data?.data?.id);
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
          }
          const responseData = {
            id: response?.data?.data?.id,
            country_name: country?.label,
            country_id: country?.value,
            city,
            email,
            address,
            phone_number: phoneNumber,
            name,
            files: file,
            table: [name, country?.label, city, address, phoneNumber, email],
            insiderData: {
              id: response?.data?.data?.id,
              name: name,
              country: country?.label,
              city: city,
              address: address,
              "Phone Number": phoneNumber,
              "E-mail": email,
            },
          };
          thunk.dispatch(setSuccess("Successfuly created manufacturer"));

          return { data: responseData };
        }
      }
    } catch (e) {
      return e;
    }
  }
);
