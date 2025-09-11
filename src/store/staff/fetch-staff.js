import { createAsyncThunk } from "@reduxjs/toolkit";
import { STAFF } from "../../constants";
import api from "../../constants/api";
import { setError } from "../get-notif";
import { fetchMeetings } from "../working-time/fetch-meetings";
import { fetchWorkingTime } from "../working-time/fetch-working-time";
import { isArray, sumBy } from "lodash";
import { format } from "date-fns";

export const fetchStaff = createAsyncThunk(
  `fetch ${STAFF}`,
  async (info, thunk) => {
    try {
      const { sales, customers } = thunk.getState();
      const response = await api.get("/staff").catch((e) => {
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
      const workTime = await thunk.dispatch(fetchWorkingTime());
      const meetingTime = await thunk.dispatch(fetchMeetings());

      const responseData = response?.data?.map((employee) => {
        const totalWorkedTime = workTime?.payload?.filter(
          (item) => item?.staff_id === employee?.id
        );
        const totalMeetingTime = meetingTime?.payload?.filter(
          (item) => item?.staff_id === employee?.id
        );
        const chosenSales = sales?.data?.filter(
          (item) => item?.staff_id === employee?.id
        );

        return {
          ...employee,
          date_of_birth: format(
            new Date(employee?.date_of_birth),
            "yyyy-MM-dd"
          ),
          start_date: format(new Date(employee?.start_date), "yyyy-MM-dd"),
          logo: employee?.logo
            ? `${process.env.REACT_APP_SERVER}/uploads/${employee?.logo}`
            : null,
          totalWorkedTime,
          totalMeetingTime,
          table: [
            `${employee?.first_name} ${employee?.last_name}`,
            employee?.position,
            sumBy(totalWorkedTime, (event) => {
              const timeDiff =
                new Date(event.end_time).getTime() -
                new Date(event.start_time).getTime();
              const hours = timeDiff / (1000 * 60 * 60 * 24);
              return Number(hours);
            })?.toFixed(2),
            sumBy(totalWorkedTime, (event) => {
              const timeDiff =
                new Date(event.end_time).getTime() -
                new Date(event.start_time).getTime();
              const hours = timeDiff / (1000 * 60 * 60);
              return Number(hours);
            })?.toFixed(2),
            employee?.days_off,
            `${employee?.status ? "On" : "Off"}`,
          ],
          customers: employee?.customers?.map((customer) => {
            const chosenCustomer = customers?.data?.find(
              (item) => item?.id === customer?.id
            );
            return {
              ...customer,
              priority: chosenCustomer?.priority,
              demand: chosenCustomer?.overallDemand,
            };
          }),
          activeDealsQuantity: chosenSales?.reduce(
            (acc, sale) => acc + sale?.quantity,
            0
          ).toFixed(2),
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
            `${employee?.first_name} ${employee?.last_name}`,
            chosenSales?.length,
            employee?.customers?.length,
            employee?.customers?.reduce(
              (acc, item) =>
                acc + item?.products?.reduce((acc, pr) => acc + pr?.demand, 0),
              0
            ),
            chosenSales?.filter((item) => item?.paid_left === 0)?.length,
            employee?.performance,
            sumBy(totalWorkedTime, (event) => {
              const timeDiff =
                new Date(event.end_time).getTime() -
                new Date(event.start_time).getTime();
              const hours = timeDiff / (1000 * 60 * 60 * 24);
              return hours;
            })?.toFixed(2),
            sumBy(totalWorkedTime, (event) => {
              const timeDiff =
                new Date(event.end_time).getTime() -
                new Date(event.start_time).getTime();
              const hours = timeDiff / (1000 * 60 * 60);
              return hours;
            })?.toFixed(2),
            employee?.days_off,
            `${employee?.status ? "On" : "Off"}`,
          ],
          insiderData: {
            id: employee?.id,
            name: employee?.first_name + " " + employee?.last_name,
            position: employee?.position,
            "Sales amount": chosenSales?.length,
            "Customers Amount": employee?.customers?.length,
            "Customers Demand": employee?.customers?.reduce(
              (acc, item) =>
                acc + item?.products?.reduce((acc, pr) => acc + pr?.demand, 0),
              0
            ),
            performance: employee?.performance,
            "Days worked": sumBy(totalWorkedTime, (event) => {
              const timeDiff =
                new Date(event.end_time).getTime() -
                new Date(event.start_time).getTime();
              const hours = timeDiff / (1000 * 60 * 60 * 24);
              return hours;
            }).toFixed(2),
            "actual sales": chosenSales?.filter((item) => item?.paid_left === 0)
              ?.length,
            "Hours worked": sumBy(totalWorkedTime, (event) => {
              const timeDiff =
                new Date(event.end_time).getTime() -
                new Date(event.start_time).getTime();
              const hours = timeDiff / (1000 * 60 * 60);
              return hours;
            }).toFixed(2),
            "Days off": employee?.days_off,
            Status: employee?.status ? "On" : "Off",
            "Phone number": employee?.phone_number,
            "E-mail": employee?.email,
          },
        };
      });
      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
