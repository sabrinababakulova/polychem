import { createAsyncThunk } from "@reduxjs/toolkit";
import { SALES } from "../../constants";
import api from "../../constants/api";
import { cloneDeep, isArray } from "lodash";
import { setError } from "../get-notif";

export const fetchAdditionalCost = createAsyncThunk(
  `additional cost ${SALES}`,
  async (data, thunk) => {
    try {
      const { saleId } = data;

      const { sales } = thunk.getState();
      const sale = sales?.data?.find((item) => item?.id === Number(saleId));
      const saleClone = cloneDeep(sale);
      function calculateTotal(data) {
        const values = Object.values(data);
        const total = values.reduce(
          (acc, currentValue) => acc + currentValue,
          0
        );
        return total;
      }
      const response = await api
        .get(`/additionalcost?sale_id=${saleId}`)
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
      const updatedAdditionalCost = Object.fromEntries(
        Object.entries(response?.data?.[response?.data?.length - 1]).filter(
          ([key, value]) => !key.includes("id")
        )
      );
      saleClone.additionalCost = updatedAdditionalCost;
      saleClone.totalCost = calculateTotal(updatedAdditionalCost);

      return {
        data: saleClone,
        id: Number(saleId),
      };
    } catch (e) {
      return e;
    }
  }
);
