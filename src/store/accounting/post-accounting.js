import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../constants/api";
import { setError, setSuccess } from "../get-notif";
import Cookies from "js-cookie";
import { cloneDeep, isArray } from "lodash";
import { fixCounter } from "../counter-agents";

export const postAccounting = createAsyncThunk(
  `post accounting balance`,
  async (data, thunk) => {
    try {
      const { info } = data;
      const { staff, counteragents } = thunk.getState();
      const userId = Cookies.get("userId");
      const employee = staff?.data?.find((item) => item?.id === Number(userId));
      const chosenCounter = counteragents?.data?.find(
        (item) => item?.id === Number(info?.counterAgent?.value)
      );
      const transaction = {
        _type: info?.type,
        order_number: info?.orderNumber?.label,
        balance_type: info?.balanceInvolved?.label
          ?.toLowerCase()
          ?.replace(" ", "_")
          ?.replace("ekistan", ""),
        counter_agent_id: Number(info?.counterAgent?.value),
        purchase_id: Number(info?.piNumber?.value),
        sale_id: Number(info?.orderNumber?.value),
        staff_id: Number(userId),
        currency: info?.currency?.label,
        transaction_amount: Number(info?.amount?.replaceAll(" ", "")),
        transaction_type: info?.transactionType?.label,
        transfer_balance: info?.balanceFrom,
        usd_to_uzs_rate: Number(info?.convertionRate?.replaceAll(" ", "")),
        created_at: info.createdAt,
      };
      const response = await api
        .post("/accountingbalance", transaction)
        .catch((e) => {
          thunk.dispatch(
            setError(
              isArray(e?.response?.data)
                ? e?.response?.data?.[0]
                : `${e.message} from ${e?.config?.url}`
            )
          );
          throw new Error("bruh");
        });
      if (info?.note) {
        await api
          .post("/note", {
            accounting_balance_id: response?.data?.data?.id,
            staff_id: Number(userId),
            message: info?.note,
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
      }
      const responseData = {
        ...transaction,
        id: response?.data?.data?.id,
        table: [
          info?.currency?.label,
          info?.transaction_type?.toLowerCase() === "income"
            ? `+ ${
                info?.currency?.label === "UZS"
                  ? (
                      Number(info?.amount?.replaceAll(" ", "")) /
                      Number(info?.convertionRate?.replaceAll(" ", ""))
                    ).toFixed(2)
                  : info?.amount
              }`
            : `- ${
                info?.currency?.label === "UZS"
                  ? (
                      Number(info?.amount?.replaceAll(" ", "")) /
                      Number(info?.convertionRate?.replaceAll(" ", ""))
                    ).toFixed(2)
                  : info?.amount
              }`,
          info?.convertionRate,
          info?.transactionType?.label,
          info?.balanceInvolved?.label,
          info?.createdAt,
          info?.note,
          info?.orderNumber?.label,
          `${employee?.first_name} ${employee?.last_name}`,
        ],
      };
      if (chosenCounter) {
        const chosenCounterCopy = cloneDeep(chosenCounter);
        chosenCounterCopy?.accounting_balances?.push({
          id: responseData?.id,
          insiderTable: [
            info?.type?.toLowerCase() === "income"
              ? `+ $ ${responseData?.transaction_amount}`
              : `- $ ${responseData?.transaction_amount}`,
            responseData?.transaction_type,
            info?.balanceInvolved?.label,
            info.createdAt,
          ],
        });
        thunk.dispatch(
          fixCounter({ id: chosenCounter?.id, data: chosenCounterCopy })
        );
      }
      thunk.dispatch(setSuccess("Successfuly added transaction"));
      return { data: responseData };
    } catch (e) {
      return e;
    }
  }
);
