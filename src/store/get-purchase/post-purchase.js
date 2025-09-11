import { createAsyncThunk } from "@reduxjs/toolkit";
import { PURCHASE } from "../../constants";
import api, { formDataApi } from "../../constants/api";
import Cookies from "js-cookie";
import { cloneDeep, isArray, isEmpty, some } from "lodash";
import { setError, setSuccess } from "../get-notif";
import { fixManufacturer } from "../get-manufacturer";

function calculateTotal(data) {
  const values = Object.values(data);
  const total = values.reduce((acc, currentValue) => acc + currentValue, 0);
  return total;
}
export const postPurchase = createAsyncThunk(
  `post ${PURCHASE}`,
  async (data, thunk) => {
    try {
      const { manufacturers } = thunk.getState();
      const { purchaseItem, productsCount, additionalCostItem, file, itemId } =
        data;
      const chosenManufacturer = manufacturers?.data?.find(
        (item) => item?.id === Number(purchaseItem?.manufacturer?.value)
      );
      const chosenManufacturerCopy = cloneDeep(chosenManufacturer);
      const userId = Cookies.get("userId");
      let responseData = {};
      let purchaseId = itemId;
      if (!isEmpty(purchaseItem)) {
        const response = await api
          .post("/purchase", {
            pi: purchaseItem?.pi,
            // product_id: purchaseItem?.product?.value,
            prods: productsCount?.map((item) => item?.value),
            manufacturer_id: purchaseItem?.manufacturer?.value,
            price: Number(purchaseItem?.price),
            quantity: Number(purchaseItem?.quantity),
            staff_id: Number(userId),
            created_at: purchaseItem?.created_at,
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
        purchaseId = response?.data?.data?.id;

        responseData = {
          ...response?.data?.data,
          table: [
            purchaseItem?.pi,
            purchaseItem?.created_at,
            purchaseItem?.product?.label,
            purchaseItem?.manufacturer?.label,
            purchaseItem?.quantity,
            purchaseItem?.price,
            purchaseItem?.quantity * purchaseItem?.price,
          ],
          insiderData: {
            id: purchaseId,
            "pi#": purchaseItem?.pi,
            Product: purchaseItem?.product?.label,
            Manufacturer: purchaseItem?.manufacturer?.label,
            "Quantity (tons)": Number(purchaseItem?.quantity),
            "Available quantity": 0,
            "Price per ton": purchaseItem?.price,
            "Total price": (
              Number(purchaseItem?.quantity) * Number(purchaseItem?.price)
            )?.toFixed(2),
            Paid: 0,
            "To be paid": 0,
          },
        };
        if (file?.length !== 0) {
          const formData = new FormData();
          file?.forEach((eachFile, index) => {
            formData.append(`file${index + 1}`, eachFile);
          });
          formData.append("purchase_id", purchaseId);
          await formDataApi.post(`/file`, formData).catch((e) => {
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
      }

      if (some(additionalCostItem, (item) => !!item)) {
        const { purchases } = thunk.getState();
        const purchase = purchases?.data?.find(
          (item) => item?.id === Number(purchaseId)
        );
        const purchaseCopy = cloneDeep(purchase);
        await api
          .post("/additionalcost", {
            custom: Number(additionalCostItem?.custom),
            commission: Number(additionalCostItem?.commission),
            other: Number(additionalCostItem?.other),
            bukhara_expenses: Number(additionalCostItem?.bukhara),
            money_transfer: Number(additionalCostItem?.money),
            purchase_id: Number(purchaseId),
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
            throw new Error(e);
          });
        if (purchase) {
          purchaseCopy.additionalCost = {
            custom: Number(additionalCostItem?.custom),
            commission: Number(additionalCostItem?.commission),
            other: Number(additionalCostItem?.other),
            bukhara_expenses: Number(additionalCostItem?.bukhara),
            money_transfer: Number(additionalCostItem?.money),
            delivery: Number(additionalCostItem?.delivery),
            transportation: Number(additionalCostItem?.cost),
            uzb_expenses: Number(additionalCostItem?.uzbCost),
          };
          purchaseCopy.totalCost = calculateTotal(purchaseCopy?.additionalCost);
          responseData = purchaseCopy;
        } else {
          const newResponseData = {
            ...responseData,
            additionalCost: {
              custom: Number(additionalCostItem?.custom),
              commission: Number(additionalCostItem?.commission),
              other: Number(additionalCostItem?.other),
              bukhara_expenses: Number(additionalCostItem?.bukhara),
              money_transfer: Number(additionalCostItem?.money),
              delivery: Number(additionalCostItem?.delivery),
              transportation: Number(additionalCostItem?.cost),
              uzb_expenses: Number(additionalCostItem?.uzbCost),
            },

            totalCost: "updating",
          };
          responseData = newResponseData;
        }
      }
      chosenManufacturerCopy?.activeDeals?.push({
        id: purchaseId,
        insiderTable: [
          purchaseItem?.pi,
          purchaseItem?.product?.label,
          purchaseItem?.quantity,
          purchaseItem?.price,
          purchaseItem?.quantity * purchaseItem?.price,
        ],
      });
      thunk.dispatch(
        fixManufacturer({
          data: chosenManufacturerCopy,
          id: purchaseItem?.manufacturer?.value,
        })
      );
      thunk.dispatch(setSuccess("Successfuly created purchase"));
      return {
        data: responseData,
        itemId: Number(itemId),
      };
    } catch (e) {
      return e;
    }
  }
);
