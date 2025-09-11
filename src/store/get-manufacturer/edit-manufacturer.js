import { createAsyncThunk } from "@reduxjs/toolkit";
import { MANUFACTURER } from "../../constants";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { isArray } from "lodash";

export const editManufacturer = createAsyncThunk(
  `edit ${MANUFACTURER}`,
  async (data, thunk) => {
    try {
      const { country, city, email, address, phoneNumber, name, itemId } = data;
      const { manufacturers: getManufacturers, purchases } = thunk.getState();
      const { data: manufacturers } = getManufacturers;
      const chosenPurchases = purchases?.data?.filter(
        (item) => item?.manufacturer_id === itemId
      );
      const existingManufacturer = manufacturers.find(
        (manufacturer) =>
          manufacturer?.name?.toLowerCase() === name?.toLowerCase() &&
          manufacturer?.email === email
      );
      await api
        .put(`/manufacturer/${itemId}`, {
          country_id: country?.value || existingManufacturer?.country_id,
          city: city || existingManufacturer?.city,
          email: email || existingManufacturer?.email,
          address: address || existingManufacturer?.address,
          phone_number: phoneNumber || existingManufacturer?.phone_number,
          name: name || existingManufacturer?.name,
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
      const responseData = {
        address: address || existingManufacturer?.address,
        city: city || existingManufacturer?.city,
        country_name: country?.label || existingManufacturer?.country,
        country_id: country?.value || existingManufacturer?.country_id,
        email: email || existingManufacturer?.email,
        files: existingManufacturer?.files,
        id: itemId,
        name: name || existingManufacturer?.name,
        phone_number: phoneNumber || existingManufacturer?.phone_number,
        products: existingManufacturer?.products,
        activeDealsQuantity: chosenPurchases?.reduce(
          (acc, purchase) => acc + purchase?.quantity,
          0
        ),
        activeDeals: chosenPurchases?.map((purchase) => ({
          id: purchase?.id,
          insiderTable: [
            purchase?.pi,
            purchase?.product_name,
            purchase?.quantity,
            purchase?.price,
            (Number(purchase?.quantity) * Number(purchase?.price)).toFixed(2),
          ],
        })),
        table: [name, country?.label, city, address, phoneNumber, email],
        insiderData: {
          id: itemId,
          name: name,
          country: country?.label,
          city: city,
          address: address,
          "Phone Number": phoneNumber,
          "E-mail": email,
        },
      };
      thunk.dispatch(setSuccess("Successfuly edited manufacturer"));

      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
