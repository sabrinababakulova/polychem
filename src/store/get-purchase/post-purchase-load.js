import { createAsyncThunk } from "@reduxjs/toolkit";
import { LOAD } from "../../constants";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { isArray } from "lodash";

export const postPurchaseLoad = createAsyncThunk(
  `post ${LOAD}`,
  async (data, thunk) => {
    try {
      const { quantity, location, purchaseId, loss } = data;
      const { purchases, products } = thunk.getState();
      const { data: purchasesData } = purchases;
      const chosenPurchase = purchasesData?.find(
        (item) => item?.id === purchaseId
      );
      const chosenProduct = products?.data?.find(
        (item) => item?.id === chosenPurchase?.product_id
      );
      const response = await api
        .post("/purchaseload", {
          quantity: Number(quantity),
          purchase_id: Number(purchaseId),
          pick_up_location: location,
          status: "Not Loaded",
          transportation_loss: Number(loss),
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
        ...response?.data?.data,
        product: chosenPurchase?.product_name,
        manufacturer: chosenPurchase?.manufacturer_name,
        category: chosenProduct?.category_name,
        subcategory: chosenProduct?.subcategory_name,
        load: response?.data?.data?.load,
        quantity: Number(quantity),
        purchase_id: Number(purchaseId),
        pick_up_location: location,
        status: "Not Loaded",
        transportation_loss: Number(loss),
        totalPrice: 0,
        table: [
          response?.data?.data?.load,
          chosenPurchase?.pi,
          chosenPurchase?.product_name,
          chosenPurchase?.manufacturer_name,
          quantity,
          chosenPurchase?.price,
          (Number(quantity) * Number(chosenPurchase?.price))?.toFixed(2),
          location,
          loss,
          "Not Loaded",
        ],
        secondTable: [
          chosenProduct?.name,
          chosenProduct?.category_name,
          chosenProduct?.subcategory_name,
          quantity,
        ],
        thirdTable: [
          new Date().toLocaleDateString(),
          0,
          chosenPurchase?.product_name,
          quantity,
          chosenPurchase?.price,
          0,
          loss,
        ],
        insiderTable: [
          response?.data?.data?.load,
          location,
          quantity,
          0,
          0,
          loss,
          "Not Loaded",
        ],
      };
      thunk.dispatch(setSuccess("Successfuly created load"));
      return {
        data: responseData,
      };
    } catch (e) {
      return e;
    }
  }
);
