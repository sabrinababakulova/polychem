import { createAsyncThunk } from "@reduxjs/toolkit";
import { LOAD } from "../../constants";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { cloneDeep, isArray } from "lodash";
import { fixWagon } from "../wagons";

export const editPurchaseLoad = createAsyncThunk(
  `put ${LOAD}`,
  async (data, thunk) => {
    const { info, loadId, purchaseId } = data;
    try {
      const { purchases: getPurchases, products, wagons } = thunk.getState();
      const { loadsData, data: purchases } = getPurchases;
      const load = loadsData?.find((load) => load?.load === loadId);
      const chosenPurchase = purchases?.find((pur) => pur?.id === purchaseId);
      const chosenProduct = products?.data?.find(
        (item) => item?.id === chosenPurchase?.product_id
      );
      await api
        .put(`/purchaseload/${loadId}`, {
          quantity: Number(info?.quantity) || load?.quantity,
          purchase_id: Number(purchaseId) || load?.purchase_id,
          pick_up_location: info?.location || load?.pick_up_location,
          status: info?.status?.label || load?.status,
          transportation_loss: Number(info?.loss) || load?.transportation_loss,
          wagon_id: Number(info?.wagonNumber?.value) || load?.wagon_id,
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
        load: loadId,
        quantity: Number(info?.quantity) || load?.quantity,
        purchase_id: Number(purchaseId) || load?.purchase_id,
        pick_up_location: info?.location || load?.pick_up_location,
        status: info?.status?.label || load?.status,
        transportation_loss: Number(info?.loss) || load?.transportation_loss,
        wagon_id: Number(info?.wagonNumber?.value) || load?.wagon_id,
        wagon_number: info?.wagonNumber?.label || load?.wagon_number,
        shipping_date: info?.shipmentDate || load?.shipping_date,
        product: chosenPurchase?.product_name,
        manufacturer: chosenPurchase?.manufacturer_name,
        category: chosenProduct?.category_name,
        subcategory: chosenProduct?.subcategory_name,
        customer: chosenPurchase?.customer_company_name,
        manager: chosenPurchase?.staff_name,
        table: [
          loadId,
          load?.pi,
          chosenPurchase?.product_name,
          chosenPurchase?.manufacturer_name,
          info?.quantity || load?.quantity,
          chosenPurchase?.price,
          (Number(info?.quantity) * Number(chosenPurchase?.price))?.toFixed(2),
          info?.location || load?.pick_up_location,
          info?.loss || load?.transportation_loss,
        ],
        secondTable: [
          chosenProduct?.name,
          chosenProduct?.category_name,
          chosenProduct?.subcategory_name,
          Number(info?.quantity) || load?.quantity,
          Number(info?.loss) || load?.transportation_loss,
        ],
        thirdTable: [
          load?.created_at,
          load?.pi,
          chosenPurchase?.product_name,
          info?.quantity || load?.quantity,
          chosenPurchase?.price,
          (Number(info?.quantity) * Number(chosenPurchase?.price))?.toFixed(2),
          info?.loss || load?.transportation_loss,
        ],
        insiderTable: [
          loadId,
          info?.location || load?.pick_up_location,
          info?.quantity || load?.quantity,
          info?.wagonNumber?.label || load?.wagon_number,
          info?.shipmentDate || load?.shipping_date,
          info?.loss || load?.transportation_loss,
          info?.status?.label || load?.status,
        ],
      };
      if (
        wagons?.data?.length > 0 &&
        info?.wagonNumber?.value &&
        info?.wagonNumber?.label
      ) {
        const correctWagon = wagons?.data?.find(
          (wagon) => wagon?.id === Number(info?.wagonNumber?.value)
        );
        await api.put(
          `/wagon/${Number(info?.wagonNumber?.value) || load?.wagon_id}`,
          {
            shipping_date: info?.shipmentDate,
          }
        );
        const correctWagonCopy = cloneDeep(correctWagon);
        correctWagonCopy?.purchase_loads_products?.push({
          load: loadId,
          pick_up_location: info?.location,
          quantity: Number(info?.quantity),
          transportation_loss: Number(info?.loss),
          product: chosenPurchase?.product_name,
        });
        correctWagonCopy.shipping_date = info?.shipmentDate;
        correctWagonCopy.table[2] = info?.shipmentDate;
        correctWagonCopy.insiderData["Shipping Date"] = info?.shipmentDate;
        thunk.dispatch(
          fixWagon({
            data: correctWagonCopy,
            id: Number(info?.wagonNumber?.value),
          })
        );
      }
      thunk.dispatch(setSuccess("Successfuly edited load"));
      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
