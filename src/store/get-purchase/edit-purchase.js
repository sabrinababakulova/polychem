import { createAsyncThunk } from "@reduxjs/toolkit";
import { PURCHASE } from "../../constants";
import api from "../../constants/api";
import Cookies from "js-cookie";
import { setError, setSuccess } from "../get-notif";
import { isArray } from "lodash";

export const editPurchase = createAsyncThunk(
  `edit ${PURCHASE}`,
  async (data, thunk) => {
    const { purchaseItem, productsCount, itemId } = data;
    try {
      const userId = Cookies.get("userId");

      const { purchases: getPurchases } = thunk.getState();
      const { data: purchases } = getPurchases;
      const chosenPurchase = purchases.find(
        (purchase) => purchase.id === itemId
      );
      const purchaseObject = {
        staff_id: Number(userId),
        pi: purchaseItem?.pi || chosenPurchase?.pi,
        product_id: purchaseItem?.product?.value,
        prods: productsCount?.map((item) => item?.value),
        manufacturer_id: purchaseItem?.manufacturer?.value,
        price: Number(purchaseItem?.price) || chosenPurchase?.price,
        quantity: Number(purchaseItem?.quantity) || chosenPurchase?.quantity,
        created_at: chosenPurchase?.created_at,
      };
      await api.put(`/purchase/${itemId}`, purchaseObject).catch((e) => {
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
        available_quantity: chosenPurchase?.available_quantity,
        created_at: purchaseItem?.created_at,
        files: chosenPurchase?.files,
        id: itemId,
        manufacturer_id:
          purchaseItem?.manufacturer?.value || chosenPurchase?.manufacturer_id,
        manufacturer_name:
          purchaseItem?.manufacturer?.label ||
          chosenPurchase?.manufacturer_name,
        paid: chosenPurchase?.paid,
        pay_left: chosenPurchase?.pay_left,
        pi: purchaseItem?.pi || chosenPurchase?.pi,
        price: Number(purchaseItem?.price) || chosenPurchase?.price,
        product_id: purchaseItem?.product?.value || chosenPurchase?.product_id,
        prods:
          productsCount?.map((item) => item?.label) || chosenPurchase?.product,
        quantity: Number(purchaseItem?.quantity) || chosenPurchase?.quantity,
        staff_id: Number(userId),
        staff_name: chosenPurchase?.staff_name,
        uploaded_at: chosenPurchase?.uploaded_at,
        table: [
          purchaseItem?.pi,
          chosenPurchase?.created_at,
          productsCount.map((item) => item?.label).join(", "),
          purchaseItem?.product?.label,
          purchaseItem?.manufacturer?.label,
          purchaseItem?.quantity,
          purchaseItem?.price,
          Number(purchaseItem?.quantity) * Number(purchaseItem?.price),
        ],
        insiderData: {
          id: itemId,
          "pi#": purchaseItem?.pi,
          Product: productsCount.map((item) => item?.label).join(", "),
          Manufacturer: purchaseItem?.manufacturer?.label,
          "Quantity (tons)": Number(purchaseItem?.quantity),
          "Available quantity": Number(
            chosenPurchase?.available_quantity
          ).toFixed(2),
          "Price per ton": purchaseItem?.price,
          "Total price": (
            Number(purchaseItem?.quantity) * Number(purchaseItem?.price)
          )?.toFixed(2),
          Paid: chosenPurchase?.paid,
          "To be paid": chosenPurchase?.pay_left,
        },
      };
      thunk.dispatch(setSuccess("Successfuly edited purchase"));
      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
