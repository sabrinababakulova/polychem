import { createAsyncThunk } from "@reduxjs/toolkit";
import { PURCHASE } from "../../constants";
import api from "../../constants/api";
import { cloneDeep, isArray } from "lodash";
import { setError } from "../get-notif";

export const fetchAdditionalCost = createAsyncThunk(
  `additional cost ${PURCHASE}`,
  async (data, thunk) => {
    try {
      const { purchaseId } = data;
      const { purchases } = thunk.getState();
      const purchase = purchases?.data?.find(
        (item) => item?.id === Number(purchaseId)
      );
      const purchaseClone = cloneDeep(purchase);
      function calculateTotal(data) {
        const values = Object.values(data);
        const total = values.reduce(
          (acc, currentValue) => acc + currentValue,
          0
        );
        return total;
      }
      const response = await api
        .get(`/additionalcost?purchase_id=${purchaseId}`)
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
      purchaseClone.additionalCost = updatedAdditionalCost;
      purchaseClone.totalCost = calculateTotal(updatedAdditionalCost);
      return {
        data: purchaseClone,
        id: Number(purchaseId),
      };
    } catch (e) {
      return e;
    }
  }
);
