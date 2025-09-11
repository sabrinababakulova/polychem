import { createAsyncThunk } from "@reduxjs/toolkit";
import { SALES } from "../../constants";
import api from "../../constants/api";
import Cookies from "js-cookie";
import { setError, setSuccess } from "../get-notif";
import { isArray } from "lodash";

export const editSale = createAsyncThunk(
  `edit ${SALES}`,
  async (data, thunk) => {
    const {
      orderNumber,
      customerId,
      quantity,
      saleType,
      pricePerTon,
      paymentType,
      paymentConditions,
      deliveryCondition,
      paymentDate,
      outOfStockReminder,
      purchaseId,
      country,
      pis,
      itemId,
      createdAt,
    } = data;
    try {
      const userId = Cookies.get("userId");
      const piObject = {};
      pis.forEach((item) => {
        piObject[`${item?.piNumber?.label}`] = Number(item?.quantity);
      });
      const { sales } = thunk.getState();
      const { data } = sales;
      const chosenProduct = data.find((item) => item.id === itemId);
      await api
        .put(`/sale/${itemId}`, {
          customer_id: customerId?.value || chosenProduct?.customer_id,
          delivery_condition:
            deliveryCondition || chosenProduct?.delivery_condition,
          // paid: "FLOAT",
          created_at: createdAt,
          country_id: country?.value,
          payment_condition:
            paymentConditions || chosenProduct?.payment_condition,
          payment_date: paymentDate || chosenProduct?.payment_date,
          payment_type: paymentType || chosenProduct?.payment_type,
          price: Number(pricePerTon) || chosenProduct?.price,
          purchase_id: purchaseId?.value,
          sale_type: saleType || chosenProduct?.sale_type,
          staff_id: Number(userId),
          pis: piObject,
          out_of_stock_reminder:
            outOfStockReminder || chosenProduct?.out_of_stock_reminder,
          order_number: orderNumber || chosenProduct?.order_number,
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
        id: itemId,
        country_name: country?.label || chosenProduct?.country_name,
        created_at:new Date( createdAt),
        country_id: country?.value || chosenProduct?.country_id,
        customer_company_name:
          customerId?.label || chosenProduct?.customer_company_name,
        customer_id: customerId?.value || chosenProduct?.customer_id,
        delivery_condition:
          deliveryCondition || chosenProduct?.delivery_condition,
        files: chosenProduct?.files,
        order_number: orderNumber || chosenProduct?.order_number,
        out_of_stock_reminder:
          outOfStockReminder || chosenProduct?.out_of_stock_reminder,
        paid: chosenProduct?.paid,
        paid_left: chosenProduct?.paid_left,
        payment_condition:
          paymentConditions || chosenProduct?.payment_condition,
        payment_date: paymentDate || chosenProduct?.payment_date,
        payment_type: paymentType || chosenProduct?.payment_type,
        product: chosenProduct?.pis?.[0]?.product_name,
        quantity: quantity,
        pis:
          pis?.map((item) => ({
            pi: item?.piNumber?.label,
            quantity: item?.quantity,
            product_name: chosenProduct?.pis?.[0]?.product_name,
          })) ||
          chosenProduct?.pis?.map((item) => ({
            pi: item?.pi,
            quantity: item?.quantity,
            product_name: item?.product_name,
          })),
        price: Number(pricePerTon) || chosenProduct?.price,
        sale_type: saleType || chosenProduct?.sale_type,
        staff_id: Number(userId),
        staff_name: chosenProduct?.staff_name,
        uploaded_at: new Date(createdAt),
        table: [
          orderNumber,
          customerId?.label,
          purchaseId?.label,
          quantity,
          pricePerTon,
          (
            pis?.reduce((acc, item) => acc + item?.quantity, 0) *
            (Number(pricePerTon) || Number(chosenProduct?.price))
          ).toFixed(2),
          paymentType,
          paymentConditions,
          deliveryCondition,
          paymentDate,
        ],
        insiderData: {
          id: itemId,
          "Order Number": orderNumber,
          customer: customerId?.label,
          country: country?.label,
          product: purchaseId?.label,
          "Quantity (Tons)": quantity,
          "Sale Type": saleType,
          "Price per ton": pricePerTon,
          "Payment Type": paymentType,
          "Payment Condition": paymentConditions,
          "Delivery Condition": deliveryCondition,
          "Payment Date": paymentDate,
          "sales amount": (
            pis?.reduce((acc, item) => acc + item?.quantity, 0) *
            (Number(pricePerTon) || Number(chosenProduct?.price))
          ).toFixed(2),
          paid: 0,
          "to be paid": (
            pis?.reduce((acc, item) => acc + item?.quantity, 0) *
              Number(pricePerTon) -
            0
          ).toFixed(2),
          pis: pis,
        },
      };
      thunk.dispatch(setSuccess("Successfuly edited sale"));

      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
