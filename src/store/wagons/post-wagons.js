import { createAsyncThunk } from "@reduxjs/toolkit";
import { WAGON } from "../../constants";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { isArray } from "lodash";

export const postWagon = createAsyncThunk(
  `post ${WAGON}`,
  async (data, thunk) => {
    const { wagonNumber, wagonType, location } = data;
    try {
      if (wagonNumber && wagonType && location) {
        const { wagons: getWagons } = thunk.getState();
        const { data: wagons } = getWagons;
        const existingWagon = wagons.find(
          (wagon) =>
            wagon?.location?.toLowerCase() === location.toLowerCase() &&
            wagon?.type?.toLowerCase() === wagonType?.toLowerCase() &&
            Number(wagon?.number) === Number(wagonNumber)
        );
        if (existingWagon) {
          return thunk.dispatch(setError("Wagon already exists"));
        } else {
          const actualData = {
            number: wagonNumber,
            type: wagonType,
            location,
          };
          const response = await api.post("/wagon", actualData).catch((e) => {
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
          const responseData = {
            id: response?.data?.data?.id,
            ...actualData,
            table: [
              wagonNumber,
              wagonType,
              0,
              location,
              response?.data?.data?.updated_at ||
                response?.data?.data?.created_at,
              0,
            ],
            insiderData: {
              id: response?.data?.data?.id,
              name: wagonNumber,
              "Wagon Number": wagonNumber,
              "Wagon Type": wagonType,
              "Shipping Date": response?.data?.data?.shipping_date,
              location: location,
              "Last Update":
                response?.data?.data?.updated_at ||
                response?.data?.data?.created_at,
              Products: response?.data?.data?.products,
              "Overall Quantity (Tons)": 0,
              "Attached Documents": 0,
            },
          };
          thunk.dispatch(
            setSuccess("Successfuly created wagon " + wagonNumber)
          );
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
