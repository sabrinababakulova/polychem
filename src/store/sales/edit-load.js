import { createAsyncThunk } from "@reduxjs/toolkit";
import { LOAD } from "../../constants";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { cloneDeep, isArray } from "lodash";
import { fixWagon } from "../wagons";

export const editSaleLoad = createAsyncThunk(
  `put ${LOAD}`,
  async (data, thunk) => {
    const { info, loadId, saleId } = data;
    try {
      const { sales: getSales, wagons } = thunk.getState();
      const { loadsData, data: sales } = getSales;
      const chosenSale = sales?.find((sale) => sale?.id === saleId);
      const load = loadsData?.find((load) => load?.load === loadId);

      await api
        .put(`/saleload/${loadId}`, {
          quantity: Number(info?.quantity) || load?.quantity,
          sale_id: Number(saleId) || load?.sale_id,
          pick_up_location: info?.location || load?.pick_up_location,
          status: info?.status?.label || load?.status,
          delivery_loss: Number(info?.loss) || load?.delivery_loss,
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
        sale_id: Number(saleId) || load?.sale_id,
        pick_up_location: info?.location || load?.pick_up_location,
        status: info?.status?.label || load?.status,
        delivery_loss: Number(info?.loss) || load?.delivery_loss,
        wagon_id: Number(info?.wagonNumber?.value) || load?.wagon_id,
        wagon_number: info?.wagonNumber?.label || load?.wagon_number,
        shipping_date: info?.shipmentDate || load?.shipping_date,
        product: chosenSale?.pis?.[0]?.product_name,
        manufacturer: chosenSale?.customer_company_name,
        table: [
          loadId,
          load?.pis?.map((pi) => pi).join(", "),
          chosenSale?.order_number,
          chosenSale?.pis?.[0]?.product_name,
          chosenSale?.customer_company_name,
          info?.quantity || load?.quantity,
          chosenSale?.price,
          (Number(info?.quantity) * Number(chosenSale?.price))?.toFixed(2),
          info?.location || load?.pick_up_location,
          info?.loss || load?.transportation_loss,
        ],
        secondTable: [
          load?.created_at,
          load?.pis?.map((pi) => pi).join(", "),
          chosenSale?.order_number,
          chosenSale?.pis?.[0]?.product_name,
          load?.quantity,
          chosenSale?.price,
          (load?.quantity * chosenSale?.price).toFixed(2),
          0,
          chosenSale?.customer_company_name,
          chosenSale?.staff_name,
        ],
        insiderTable: [
          loadId,
          info?.location || load?.pick_up_location,
          info?.quantity || load?.quantity,
          info?.wagonNumber?.label || load?.wagon_number,
          info?.shipmentDate || load?.shipping_date,
          info?.loss || load?.delivery_loss,
          info?.status?.label || load?.status,
        ],
      };

      if (wagons?.data?.length > 0 && info?.wagonNumber?.value && info?.wagonNumber?.label) {
        const correctWagon = wagons?.data?.find(
          (wagon) => wagon?.id === Number(info?.wagonNumber?.value)
        );
        await api.put(`/wagon/${info?.wagonNumber?.value}`, {
          shipping_date: info?.shipmentDate,
        });
        const correctWagonCopy = cloneDeep(correctWagon);
        correctWagonCopy?.sales_loads_products?.push({
          load: loadId,
          pick_up_location: info?.location,
          quantity: Number(info?.quantity),
          delivery_loss: Number(info?.loss),
          products: [chosenSale?.pis?.[0]?.product_name],
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
      return { data: responseData, id: loadId };
    } catch (e) {
      return e;
    }
  }
);
