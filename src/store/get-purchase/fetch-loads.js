import { createAsyncThunk } from "@reduxjs/toolkit";
import { PURCHASE } from "../../constants";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { isArray, random } from "lodash";

export const fetchPurchaseLoad = createAsyncThunk(
  `${PURCHASE} load`,
  async (data, thunk) => {
    try {
      const warehouse = await api.get("/warehouse/balance").catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });

      const response = await api.get("/purchaseload").catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });
      const { purchases: getPurchases, products } = thunk.getState();
      const { data: purchases } = getPurchases;
      const correctData = response?.data?.map((item) => {
        const chosenPurchase = purchases?.find(
          (pur) => pur?.id === item?.purchase_id
        );
        const chosenProduct = products?.data?.find(
          (item) => item?.id === chosenPurchase?.product_id
        );
        return {
          ...item,
          product: chosenPurchase?.product_name,
          manufacturer: chosenPurchase?.manufacturer_name,
          category: chosenProduct?.category_name,
          subcategory: chosenProduct?.subcategory_name,
          thirdTable: [
            item?.created_at || "No date",
            item?.pi,
            chosenPurchase?.product_name,
            item?.quantity,
            chosenPurchase?.price,
            (Number(item?.quantity) * Number(chosenPurchase?.price))
              ?.toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
            item?.transportation_loss,
          ],
          table: [
            item?.load,
            item?.pi,
            item?.created_at || "No date",
            chosenPurchase?.product_name,
            chosenPurchase?.manufacturer_name,
            item?.quantity,
            chosenPurchase?.price,
            (Number(item?.quantity) * Number(chosenPurchase?.price))
              ?.toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
            item?.pick_up_location,
            item?.transportation_loss,
          ],
          insiderTable: [
            item?.load,
            item?.pick_up_location,
            item?.quantity,
            item?.wagon_number,
            item?.shipping_date,
            item?.transportation_loss,
            item?.status,
          ],

          totalPrice: Number((item?.quantity * item?.price)?.toFixed(2)),
        };
      });

      return {
        data: correctData,
        warehouse: warehouse.data.map((item) => ({
          id: Math.random(),
          product_name: item?.product_name,
          category_name: item?.category_name,
          sub_category_name: item?.sub_category_name,
          remaining_quantity: item?.remaining_quantity,
          table: [
            item?.product_name,
            item?.category_name,
            item?.sub_category_name,
            item?.remaining_quantity,
            item?.loss,
          ],
        })),
      };
    } catch (e) {
      return e;
    }
  }
);
