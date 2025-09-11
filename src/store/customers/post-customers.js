import { createAsyncThunk } from "@reduxjs/toolkit";
import { CUSTOMER } from "../../constants";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import { isArray } from "lodash";

export const postCustomer = createAsyncThunk(
  `post ${CUSTOMER}`,
  async (data, thunk) => {
    try {
      const { info } = data;
      const customer = {
        address: info?.address,
        city: info?.city,
        company_name: info?.companyName,
        contact_person: info?.contactPerson,
        country_id: info?.country?.value,
        customer_type: info?.customerStatus?.label,
        email: info?.email,
        phone_number: info?.phoneNumber,
        staff_id: Number(info?.salesManager?.value),
      };
      const response = await api.post("/customer", customer).catch((e) => {
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
        id: response?.data?.data?.id,
        country_name: info?.country?.label,
        sales_manager: info?.salesManager?.label,
        activeDeals: [],
        notes: [],
        overallDemand: 0,
        priority: "Low",
        products: [],
        activeDealsQuantity: [],
        allPaymentDates: [],
        meeting_time: undefined,
        table: [
          info?.companyName,
          info?.contactPerson,
          "Low",
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
          "low",
          0,
        ],
        insiderData: {
          id: response?.data?.data?.id,
          "Company Name": info?.companyName,
          "Contact Person": info?.contactPerson,
          "Sales Manager": info?.salesManager?.label,
          priority: "Low",
          demand: 0,
          "Next Call Time": 0,
          "Phone Number": info?.phoneNumber,
          "E-mail": info?.email,
          country: info?.country?.label,
          city: info?.city,
          address: info?.address,
          "Total Debts": 0,
        },
      };
      thunk.dispatch(setSuccess("Successfuly added customer"));
      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
