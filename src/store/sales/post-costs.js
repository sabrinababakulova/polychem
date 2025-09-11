import { createAsyncThunk } from "@reduxjs/toolkit";
import { SALES } from "../../constants";
import api from "../../constants/api";
import { cloneDeep, isArray, some } from "lodash";
import { setError, setSuccess } from "../get-notif";

function calculateTotal(data) {
  const values = Object.values(data);
  const total = values.reduce((acc, currentValue) => acc + currentValue, 0);
  return total;
}
export const postCosts = createAsyncThunk(
  `post ${SALES} costs`,
  async (data, thunk) => {
    const { additionalCostItem, itemId } = data;
    try {
      let responseData = {};
      let saleId = itemId;

      if (some(additionalCostItem, (item) => !!item)) {
        const { sales } = thunk.getState();
        const sale = sales?.data?.find((item) => item?.id === Number(saleId));
        const saleCopy = cloneDeep(sale);
        await api
          .post("/additionalcost", {
            custom: Number(additionalCostItem?.custom),
            commission: Number(additionalCostItem?.commission),
            other: Number(additionalCostItem?.other),
            bukhara_expenses: Number(additionalCostItem?.bukhara),
            money_transfer: Number(additionalCostItem?.money),
            sale_id: Number(saleId),
            delivery: Number(additionalCostItem?.delivery),
            transportation: Number(additionalCostItem?.cost),
            uzb_expenses: Number(additionalCostItem?.uzbCost),
          })
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

        saleCopy.additionalCost = {
          custom: Number(additionalCostItem?.custom),
          commission: Number(additionalCostItem?.commission),
          other: Number(additionalCostItem?.other),
          bukhara_expenses: Number(additionalCostItem?.bukhara),
          money_transfer: Number(additionalCostItem?.money),
          delivery: Number(additionalCostItem?.delivery),
          transportation: Number(additionalCostItem?.cost),
          uzb_expenses: Number(additionalCostItem?.uzbCost),
        };
        saleCopy.totalCost = calculateTotal(saleCopy?.additionalCost);
        responseData = saleCopy;
      }
      thunk.dispatch(setSuccess("Successfuly added costs"));

      return {
        data: responseData,
        itemId: Number(itemId),
      };
    } catch (e) {
      return e;
    }
  }
);
