import { createAsyncThunk } from "@reduxjs/toolkit";
import { SALES } from "../../constants";
import api, { formDataApi } from "../../constants/api";
import Cookies from "js-cookie";
import { setError, setSuccess } from "../get-notif";
import { cloneDeep, isArray } from "lodash";
import { fixCustomer } from "../customers";

export const postSale = createAsyncThunk(
  `post ${SALES}`,
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
      pis,
      country,
      file,
      createdAt,
    } = data;
    try {
      const { customers } = thunk.getState();
      const piObject = {};
      pis.forEach((item) => {
        piObject[String(`${item?.piNumber?.label}`)] = Number(item?.quantity);
      });
      const userId = Cookies.get("userId");
      const response = await api
        .post("/sale", {
          customer_id: customerId?.value,
          delivery_condition: deliveryCondition,
          created_at: createdAt,
          // paid: "FLOAT",
          payment_condition: paymentConditions,
          payment_date: paymentDate,
          payment_type: paymentType,
          price: Number(pricePerTon),
          purchase_id: purchaseId?.value,
          sale_type: saleType,
          staff_id: Number(userId),
          pis: piObject,
          out_of_stock_reminder: outOfStockReminder,
          order_number: orderNumber,
          country_id: country?.value,
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
      const salesId = response?.data?.data?.id;
      if (file?.length !== 0) {
        const formData = new FormData();
        file?.forEach((eachFile, index) => {
          formData.append(`file${index + 1}`, eachFile);
        });
        formData.append("sale_id", salesId);
        await formDataApi.post(`/file`, formData).catch((e) => {
          thunk.dispatch(
            setError(
              isArray(e?.response?.data)
                ? e?.response?.data?.[0]
                : `${e.message} from ${e?.config?.url}`
            )
          );
        });
      }
      const chosenCustomer = customers?.data?.find(
        (item) => item?.id === customerId?.value
      );
      const chosenCustomerCopy = cloneDeep(chosenCustomer);
      chosenCustomerCopy.activeDeals?.push({
        id: salesId,
        insiderTable: [
          orderNumber,
          purchaseId?.label,
          quantity,
          pricePerTon,
          pis?.length,
          paymentType,
          paymentConditions,
          deliveryCondition,
          paymentDate,
        ],
      });
      thunk.dispatch(
        fixCustomer({ data: chosenCustomerCopy, id: customerId?.value })
      );

      const responseData = {
        ...response?.data?.data,
        table: [
          orderNumber,
          customerId?.label,
          purchaseId?.label,
          quantity,
          pricePerTon,
          (Number(quantity) * Number(pricePerTon)).toFixed(2),
          paymentType,
          paymentConditions,
          deliveryCondition,
          paymentDate,
          response?.data?.data?.staff_name,
        ],
        insiderData: {
          id: salesId,
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
          "sales amount": (Number(quantity) * Number(pricePerTon)).toFixed(2),
          paid: 0,
          "to be paid": (Number(quantity) * Number(pricePerTon)).toFixed(2) - 0,
          pis: pis,
        },
      };
      thunk.dispatch(setSuccess("Successfuly created sale"));

      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
