import { createAsyncThunk } from "@reduxjs/toolkit";
import { MANUFACTURER } from "../../constants";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { isArray } from "lodash";

export const fetchManufacturer = createAsyncThunk(
  `fetch ${MANUFACTURER}`,
  async (data, thunk) => {
    try {
      const { purchases } = thunk.getState();
      const response = await api.get("/manufacturer").catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(
          e
        );
      });
      const responseData = response?.data?.map((manufacturer) => {
        const chosenPurchases = purchases?.data?.filter(
          (item) => item?.manufacturer_id === manufacturer?.id
        );
        return {
          ...manufacturer,
          activeDealsQuantity: chosenPurchases?.reduce(
            (acc, purchase) => acc + purchase?.quantity,
            0
          ).toFixed(2),
          table: [
            manufacturer?.name,
            manufacturer?.country_name,
            manufacturer?.city,
            manufacturer?.address,
            manufacturer?.phone_number,
            manufacturer?.email,
          ],
          products: chosenPurchases?.map((purchase) => ({
            id: purchase?.id,
            insiderTable: [
              purchase?.product?.name,
              purchase?.product?.category_name,
              purchase?.product?.subcategory_name,
              purchase?.price
            ],
          })),
          activeDeals: chosenPurchases?.map((purchase) => ({
            id: purchase?.id,
            insiderTable: [
              purchase?.pi,
              purchase?.product_name,
              purchase?.quantity,
              purchase?.price,
              (purchase?.quantity * purchase?.price).toFixed(2),
            ],
          })),
          insiderData: {
            id: manufacturer?.id,
            name: manufacturer?.name,
            country: manufacturer?.country_name,
            city: manufacturer?.city,
            address: manufacturer?.address,
            "Phone Number": manufacturer?.phone_number,
            "E-mail": manufacturer?.email,
          },
        };
      });

      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
