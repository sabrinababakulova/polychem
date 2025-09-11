import { createAsyncThunk } from "@reduxjs/toolkit";
import { STAFF } from "../../constants";
import api, { formDataApi } from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { isArray } from "lodash";

export const editStaff = createAsyncThunk(
  `edit ${STAFF}`,
  async (data, thunk) => {
    const {
      firstName,
      lastName,
      dateOfBirth,
      password,
      position,
      startDate,
      phoneNumber,
      email,
      itemId,
      status,
      file,
    } = data;
    try {
      const { staff: getStaff, sales, customers } = thunk.getState();
      const { data: staff } = getStaff;
      const existingEmployee = staff.find(
        (employee) => employee?.id === itemId
      );
      const chosenSales = sales?.data?.filter(
        (eachSale) => eachSale?.customer_id === itemId
      );
      const actualData = {
        first_name: firstName || existingEmployee?.first_name,
        last_name: lastName || existingEmployee?.last_name,
        email: email || existingEmployee?.email,
        date_of_birth: dateOfBirth || existingEmployee?.date_of_birth,
        position:
          position?.toLowerCase()?.replace(" ", "_") ||
          existingEmployee?.position,
        start_date: startDate || existingEmployee?.start_date,
        phone_number: phoneNumber || existingEmployee?.phone_number,
        status: status,
      };
      await api.put(`/staff/${itemId}`, actualData).catch((e) => {
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
      password && (actualData.password = password);
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        await formDataApi.post(`/logo-staff/${itemId}`, formData).catch((e) => {
          thunk.dispatch(
            setError(
              isArray(e?.response?.data)
                ? e?.response?.data?.[0]
                : `${e.message} from ${e?.config?.url}`
            )
          );
          throw new Error(e);
        });
      }
      const responseData = {
        ...actualData,
        id: itemId,
        logo: file?.preview || existingEmployee?.logo,
        totalWorkedTime: existingEmployee?.totalWorkedTime,
        totalMeetingTime: existingEmployee?.totalMeetingTime,
        table: [
          `${firstName} ${lastName}`,
          position,
          existingEmployee?.table?.[2],
          existingEmployee?.table?.[3],
          existingEmployee?.days_off,
          status ? "On" : "Off",
        ],
        customers: existingEmployee?.customers?.map((customer) => {
          const chosenCustomer = customers?.data?.find(
            (item) => item?.id === customer?.id
          );
          return {
            ...customer,
            priority: chosenCustomer?.priority,
              demand: chosenCustomer?.overallDemand,
          };
        }),
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
        activeDealsQuantity: chosenSales?.reduce(
          (acc, sale) => acc + sale?.quantity,
          0
        ).toFixed(2),
        secondTable: existingEmployee?.secondTable,
        insiderData: {
          id: itemId,
          name: firstName + " " + lastName,
          "Sales amount": existingEmployee?.sales_amount,
          "Customers Amount": existingEmployee.customer_amount,
          "Customers Demand": existingEmployee.customer_demand,
          "Actual Sales": existingEmployee.actual_sale,
          performance: existingEmployee.performance,
          "Days worker": existingEmployee.days_worked,
          "Hours worked": existingEmployee.hours_worked,
          "Days off": existingEmployee.days_off,
          status: status ? "On" : "Off",
          "Phone number": phoneNumber,
          "E-mail": email,
        },
      };
      thunk.dispatch(setSuccess("Successfuly edited user " + firstName));

      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
