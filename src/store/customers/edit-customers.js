import { createAsyncThunk } from "@reduxjs/toolkit";
import { CUSTOMER } from "../../constants";
import api from "../../constants/api";
import Cookies from "js-cookie";
import { setError, setSuccess } from "../get-notif";
import { cloneDeep, isArray } from "lodash";

function findPriority(dateArray) {
  const today = new Date();
  let closestDate = null;
  let closestDiff = Infinity;

  for (const date of dateArray) {
    const diff = Math.abs(today.getTime() - date.getTime());
    if (diff < closestDiff) {
      closestDiff = diff;
      closestDate = date;
    }
  }

  if (!closestDate) {
    return null; // Handle the case where there are no dates in the array
  }

  const diffInDays = Math.ceil(closestDiff / (1000 * 60 * 60 * 24));
  const category = diffInDays < 7 ? "high" : diffInDays < 30 ? "medium" : "low";

  return category;
}
export const editCustomer = createAsyncThunk(
  `edit ${CUSTOMER}`,
  async (data, thunk) => {
    try {
      const { info, itemId, chosenDemand } = data;
      const { customers: getCustomers, sales, products } = thunk.getState();
      const { data: customers } = getCustomers;
      const chosenCustomer = customers.find(
        (costumer) => costumer.id === itemId
      );
      const chosenSales = sales?.data?.filter(
        (sale) => sale?.customer_id === itemId
      );

      const userId = Cookies.get("userId");
      const customer = {
        address: info?.address || chosenCustomer?.address,
        city: info?.city || chosenCustomer?.city,
        company_name: info?.companyName || chosenCustomer?.company_name,
        contact_person: info?.contactPerson || chosenCustomer?.contact_person,
        country_id: info?.country?.value || chosenCustomer?.country_id,
        customer_type:
          info?.customerStatus?.label || chosenCustomer?.customer_type,
        email: info?.email || chosenCustomer?.email,
        phone_number: info?.phoneNumber || chosenCustomer?.phone_number,
        staff_id: Number(userId),
      };
      if (info) {
        thunk.dispatch(setSuccess("Loading editing customer"));
        await api.put(`/customer/${itemId}`, customer).catch((e) => {
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
          ...customer,
          activeDealsQuantity: chosenSales?.reduce(
            (acc, sale) => acc + sale?.quantity,
            0
          ).toFixed(2),
          staff_name: info?.salesManager?.label || chosenCustomer?.staff_name,
          staff_id: info?.salesManager?.value || chosenCustomer?.staff_id,
          allPaymentDates: chosenSales?.map((sale) => sale?.payment_date),
          demand: chosenCustomer?.demand,
          files: chosenCustomer?.files,
          id: itemId,
          meeting_time: info?.meetingTime || chosenCustomer?.meeting_time,
          priority:
            findPriority(
              chosenSales?.map((sale) => new Date(sale?.payment_date))
            ) || "low",
          total_debts: chosenCustomer?.total_debts,
          country_name: info?.country?.label || chosenCustomer?.country,
          country_id: info?.country?.value || chosenCustomer?.country_id,
          notes: chosenCustomer?.notes,
          history: chosenCustomer?.history,
          insiderData: {
            id: itemId,
            "Company Name": info?.companyName || chosenCustomer?.company_name,
            "Contact Person":
              info?.contactPerson || chosenCustomer?.contact_person,
            "Sales Manager":
              info?.salesManager?.label || chosenCustomer?.staff_name,
            priority:
              findPriority(
                chosenSales?.map((sale) => new Date(sale?.payment_date))
              ) || "low",
            demand: info?.demand || chosenCustomer?.demand,
            "Next Call Time": info?.meetingTime || chosenCustomer?.meeting_time,
            "Phone Number": info?.phoneNumber || chosenCustomer?.phone_number,
            "E-mail": info?.email || chosenCustomer?.email,
            country: info?.country?.label || chosenCustomer?.country_name,
            city: info?.city || chosenCustomer?.city,
            address: info?.address || chosenCustomer?.address,
            "Total Debts": chosenCustomer?.total_debts,
          },
          activeDeals: chosenSales?.map((sale) => ({
            id: sale?.id,
            insiderTable: [
              sale?.order_number,
              sale?.pis?.[0]?.product_name,
              sale?.pis?.reduce((acc, pi) => acc + pi?.quantity, 0),
              sale?.price,
              sale?.pis?.length,
              sale?.payment_type,
              sale?.payment_condition,
              sale?.delivery_condition,
              sale?.payment_date,
            ],
          })),
          table: [
            info?.companyName,
            info?.contactPerson,
            findPriority(
              chosenSales?.map((sale) => new Date(sale?.payment_date))
            ) || "low",
            info?.demand,
            info?.meetingTime,
            info?.phoneNumber,
            info?.email,
            info?.country?.label,
            info?.city,
            info?.address,
          ],
          secondTable: [
            info?.companyName,
            info?.contactPerson,
            info?.phoneNumber,
            findPriority(
              chosenSales?.map((sale) => new Date(sale?.payment_date))
            ) || "low",
            chosenCustomer?.total_debts,
          ],
        };
        thunk.dispatch(setSuccess("Successfuly edited customer"));
        return { data: responseData };
      }
      if (chosenDemand) {
        const demands = {};
        chosenDemand?.forEach((demand) => {
          demands[demand?.product?.value] = Number(demand?.demand);
        });
        await api
          .put(`/customer/${itemId}`, {
            products_with_demand: demands,
          })
          .catch((e) => {
            thunk.dispatch(
              setError(
                isArray(e?.response?.data)
                  ? e?.response?.data?.[0]
                  : `${e.message} from ${e?.config?.url}`
              )
            );
            throw new Error("error");
          });
        const chosenCostumerCopy = cloneDeep(chosenCustomer);
        chosenDemand?.forEach((demand) => {
          const chosenProduct = products?.data?.find(
            (item) => item?.id === demand?.product?.value
          );
          let saleQuantity = 0;
          chosenSales?.forEach((sale) => {
            if (
              sale?.pis?.find(
                (pi) => pi?.product_name === demand?.product?.label
              )
            )
              saleQuantity += sale?.quantity;
          });
          chosenCostumerCopy.overallDemand += demand?.demand;
          chosenCostumerCopy?.products?.push({
            demand: demand?.demand,
            product_id: demand?.product?.value,
            product_name: demand?.product?.label,
            category: chosenProduct?.category_name,
            subcategory: chosenProduct?.subcategory_name,
            saleQuantity,
            performance: `${(saleQuantity / demand?.demand) * 100}%`,
          });
        });
        return { data: chosenCostumerCopy };
      }
    } catch (e) {
      return e;
    }
  }
);
