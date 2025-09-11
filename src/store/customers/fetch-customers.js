import { createAsyncThunk } from "@reduxjs/toolkit";
import { CUSTOMER } from "../../constants";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { differenceInMilliseconds } from "date-fns";
import { fetchNotes } from "../counter-agents/fetch-notes";
import { isArray } from "lodash";

function findClosestDate(dates) {
  const today = new Date();
  const closestDate = dates.reduce(
    (closest, current) =>
      Math.abs(differenceInMilliseconds(today, current)) <
      Math.abs(differenceInMilliseconds(today, closest))
        ? current
        : closest,
    dates[0]
  );

  return closestDate;
}

export function findPriority(dateArray) {
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

export const fetchCustomers = createAsyncThunk(
  `fetch ${CUSTOMER}`,
  async (data, thunk) => {
    try {
      const { sales, workingTime, products } = thunk.getState();
      const response = await api.get("/customer").catch((e) => {
        thunk.dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
        throw new Error(e);
      });
      const notes = await thunk.dispatch(fetchNotes());
      const responseData = response.data?.map((item) => {
        const chosenSales = sales?.data?.filter(
          (sale) => sale?.customer_id === item?.id
        );
        const filteredNotes = notes?.payload?.data?.filter(
          (counter) => counter?.customer_id === item?.id
        );
        const allMeetings = workingTime?.meetings
          ?.filter((each) => each?.meeting_with === item?.company_name)
          ?.map((each) => each?.start_time);
        let overallDemand = 0;
        return {
          ...item,
          activeDealsQuantity: chosenSales?.reduce(
            (acc, sale) => acc + sale?.quantity,
            0
          ),
          allPaymentDates: chosenSales?.map((sale) => sale?.payment_date),
          meeting_time: findClosestDate(allMeetings),
          priority:
            findPriority(
              chosenSales?.map((sale) => new Date(sale?.payment_date))
            ) || "low",
          products: item?.products?.map((product) => {
            const chosenProduct = products?.data?.find(
              (item) => item?.id === product?.product_id
            );
            let saleQuantity = 0;
            chosenSales?.forEach((sale) => {
              if (
                sale?.pis?.find(
                  (pi) => pi?.product_name === product?.product_name
                )
              )
                saleQuantity += sale?.quantity;
            });
            overallDemand += product?.demand;
            return {
              ...product,
              category: chosenProduct?.category_name,
              subcategory: chosenProduct?.subcategory_name,
              saleQuantity,
              performance: `${(saleQuantity / product?.demand) * 100}%`,
            };
          }),
          overallDemand,
          notes: filteredNotes,
          history: [],
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
          secondTable: [
            item?.company_name,
            item?.contact_person,
            item?.phone_number,
            findPriority(
              chosenSales?.map((sale) => new Date(sale?.payment_date))
            ) || "low",
            item?.total_debts,
          ],
          table: [
            item?.company_name,
            item?.contact_person,
            findPriority(
              chosenSales?.map((sale) => new Date(sale?.payment_date))
            ) || "low",
            overallDemand,
            findClosestDate(allMeetings),
            item?.phone_number,
            item?.email,
            item?.country_name,
            item?.city,
            item?.address,
          ],
          insiderData: {
            id: item?.id,
            "Company Name": item?.company_name,
            "Contact Person": item?.contact_person,
            "Sales Manager": item?.staff_name,
            priority:
              findPriority(
                chosenSales?.map((sale) => new Date(sale?.payment_date))
              ) || "low",
            demand: overallDemand,
            "Next Call Time": findClosestDate(allMeetings),
            "Phone Number": item?.phone_number,
            "E-mail": item?.email,
            country: item?.country_name,
            city: item?.city,
            address: item?.address,
            "Total Debts": item?.total_debts,
          },
        };
      });
      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
