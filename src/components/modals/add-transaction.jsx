import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../store/get-notif";
import { ChartModal } from "./charts-modal";
import { postAccounting } from "../../store/accounting/post-accounting";
import { getCounters, getPurchases, getSales } from "../../store";

export const CreateTransaction = ({ handleModal, selectedItem }) => {
  const dispatch = useDispatch();
  const { data: counterAgents, fetched: countersFetched } =
    useSelector(getCounters);
  const { data: sales, fetched: salesFetched } = useSelector(getSales);
  const { data: purchases, fetched: purchasesFetched } =
    useSelector(getPurchases);
  const [transaction, setTransaction] = useState({
    type: selectedItem?._type || "income",
    amount: selectedItem?.amount || "",
    currency: selectedItem?.currency || {
      value: 1,
      label: "UZS",
    },
    transactionType: selectedItem?.transaction_type || {
      value: 1,
      label: "Sale",
    },
    orderNumber: selectedItem?.order_number || "",
    balanceInvolved: selectedItem?.balance_involved || {
      label: "Uzbekistan Cash",
      value: 1,
    },
    balanceTo: selectedItem?.balance_to || "",
    createdAt: selectedItem?.created_at || "",
    note: selectedItem?.note || "",
    convertionRate: selectedItem?.convertion_rate || "",
    piNumber: selectedItem?.pi_number || "",
    counterAgent: selectedItem?.counter_agent || "",
  });

  const [items, setItems] = useState([
    {
      id: 1,
      label: "Amount",
      isInput: true,
      placeholder: "Enter amount",
      value: transaction?.product,
      transactionKey: "amount",
      onChange: (e) =>
        setTransaction((prev) => ({ ...prev, amount: e.target.value })),
    },
    {
      id: 12,
      label: "Currency",
      transactionKey: "currency",
      items: [
        {
          id: 1,
          name: "UZS",
        },
        {
          id: 2,
          name: "USD",
        },
      ],
      placeholder: "Pick currency",
      value: transaction?.currency,
      onChange: (e) =>
        setTransaction((prev) => ({ ...prev, currency: e })),
    },
    {
      id: 2,
      label: "Transaction type",
      transactionKey: "transactionType",
      items: [
        {
          id: 1,
          name: "Sale",
        },
        {
          id: 2,
          name: "Transfer",
        },
        {
          id: 3,
          name: "Purchase",
        },
        {
          id: 4,
          name: "Counteragent",
        },
      ],
      placeholder: "Enter transaction type",
      value: transaction?.transactionType,
      onChange: (e) =>
        setTransaction((prev) => ({ ...prev, transactionType: e })),
    },
    {
      id: 3,
      label: "Order Number",
      transactionKey: "orderNumber",
      items: sales?.map((sale) => ({ name: sale?.order_number, id: sale?.id })),
      placeholder: "Enter order number",
      value: transaction?.orderNumber,
      onChange: (e) => setTransaction((prev) => ({ ...prev, orderNumber: e })),
    },
    {
      id: 4,
      label: "Balance Involved",
      transactionKey: "balanceInvolved",
      items: [
        { name: "Uzbekistan Cash", id: 1 },
        { name: "Uzbekistan Bank", id: 2 },
        { name: "International Cash", id: 3 },
        { name: "International Bank", id: 4 },
      ],
      placeholder: "Pick balance involved",
      value: transaction?.balanceInvolved,
      onChange: (e) =>
        setTransaction((prev) => ({ ...prev, balanceInvolved: e })),
    },
    {
      id: 5,
      label: "Creation Time",
      transactionKey: "createdAt",
      isInput: true,
      placeholder: "Choose creation time",
      isCalendar: true,
      value: transaction?.createdAt,
      onChange: (e) =>
        setTransaction((prev) => ({ ...prev, createdAt: e })),
    },
    {
      id: 6,
      label: "Note",
      transactionKey: "note",
      isInput: true,
      placeholder: "Enter note",
      value: transaction?.note,
      onChange: (e) =>
        setTransaction((prev) => ({ ...prev, note: e?.target?.value })),
    },
    {
      id: 7,
      label: "USD Rate",
      transactionKey: "convertionRate",
      isInput: true,
      placeholder: "Enter USD Rate",
      value: transaction?.convertionRate,
      onChange: (e) =>
        setTransaction((prev) => ({
          ...prev,
          convertionRate: e?.target?.value,
        })),
    },
  ]);

  useEffect(() => {
    if (transaction.transactionType.value === 1) {
      setItems((prev) => {
        const newPrev = [...prev];
        newPrev[3] = {
          id: 3,
          label: "Order Number",
          transactionKey: "orderNumber",
          items: sales?.map((sale) => ({
            name: sale?.order_number,
            id: sale?.id,
          })),
          placeholder: "Enter order number",
          value: transaction?.orderNumber,
          onChange: (e) =>
            setTransaction((prev) => ({
              ...prev,
              orderNumber: e,
            })),
        };
        newPrev[4] = {
          id: 4,
          label: "Balance Involved",
          transactionKey: "balanceInvolved",
          items: [
            { name: "Uzbekistan Cash", id: 1 },
            { name: "Uzbekistan Bank", id: 2 },
            { name: "International Cash", id: 3 },
            { name: "International Bank", id: 4 },
          ],
          placeholder: "Pick balance involved",
          value: transaction?.balanceInvolved,
          onChange: (e) =>
            setTransaction((prev) => ({ ...prev, balanceInvolved: e })),
        };
        return newPrev;
      });
    }
    if (transaction.transactionType.value === 2) {
      setItems((prev) => {
        const newPrev = [...prev];
        newPrev[3] = {
          id: 3,
          label: "Balance Involved From",
          transactionKey: "balanceInvolved",
          items: [
            { name: "Uzbekistan Cash", id: 1 },
            { name: "Uzbekistan Bank", id: 2 },
            { name: "International Cash", id: 3 },
            { name: "International Bank", id: 4 },
          ],
          placeholder: "From",
          value: transaction?.balanceInvolved,
          onChange: (e) =>
            setTransaction((prev) => ({
              ...prev,
              balanceInvolved: e,
            })),
        };
        newPrev[4] = {
          id: 4,
          label: "Balance Involved To",
          transactionKey: "balanceTo",
          items: [
            { name: "Uzbekistan Cash", id: 1 },
            { name: "Uzbekistan Bank", id: 2 },
            { name: "International Cash", id: 3 },
            { name: "International Bank", id: 4 },
          ],
          placeholder: "To",
          value: transaction?.balanceTo,
          onChange: (e) =>
            setTransaction((prev) => ({
              ...prev,
              balanceTo: e,
            })),
        };
        return newPrev;
      });
    }
    if (transaction.transactionType.value === 3) {
      setItems((prev) => {
        const newPrev = [...prev];
        newPrev[3] = {
          id: 3,
          label: "PI Number",
          transactionKey: "piNumber",
          items: purchases?.map((purchase) => ({
            name: purchase?.pi,
            id: purchase?.id,
          })),
          placeholder: "Enter PI number",
          value: transaction?.piNumber,
          onChange: (e) => setTransaction((prev) => ({ ...prev, piNumber: e })),
        };
        newPrev[4] = {
          id: 4,
          label: "Balance Involved",
          transactionKey: "balanceInvolved",
          items: [
            { name: "Uzbekistan Cash", id: 1 },
            { name: "Uzbekistan Bank", id: 2 },
            { name: "International Cash", id: 3 },
            { name: "International Bank", id: 4 },
          ],
          placeholder: "Pick balance involved",
          value: transaction?.balanceInvolved,
          onChange: (e) =>
            setTransaction((prev) => ({ ...prev, balanceInvolved: e })),
        };
        return newPrev;
      });
    }
    if (transaction.transactionType.value === 4) {
      setItems((prev) => {
        const newPrev = [...prev];
        newPrev[3] = {
          id: 3,
          label: "Counteragent",
          transactionKey: "counterAgent",
          items: counterAgents,
          placeholder: "Enter counter agent",
          value: transaction?.counterAgent,
          onChange: (e) =>
            setTransaction((prev) => ({
              ...prev,
              counterAgent: e,
            })),
        };
        newPrev[4] = {
          id: 4,
          label: "Balance Involved",
          transactionKey: "balanceInvolved",
          items: [
            { name: "Uzbekistan Cash", id: 1 },
            { name: "Uzbekistan Bank", id: 2 },
            { name: "International Cash", id: 3 },
            { name: "International Bank", id: 4 },
          ],
          placeholder: "Pick balance involved",
          value: transaction?.balanceInvolved,
          onChange: (e) =>
            setTransaction((prev) => ({ ...prev, balanceInvolved: e })),
        };
        return newPrev;
      });
    }
  }, [transaction.transactionType]);

  const handleContinue = () => {
    if (transaction?.transactionType?.value === 1) {
      if (
        !transaction?.amount ||
        !transaction?.orderNumber ||
        !transaction?.balanceInvolved ||
        !transaction?.convertionRate
      )
        return dispatch(setError("Fill all fields"));
    }
    if (transaction?.transactionType?.value === 2) {
      if (
        !transaction?.amount ||
        !transaction?.balanceInvolved ||
        !transaction?.balanceTo ||
        !transaction?.convertionRate
      )
        return dispatch(setError("Fill all fields"));
    }
    if (transaction?.transactionType?.value === 3) {
      if (
        !transaction?.amount ||
        !transaction?.balanceInvolved ||
        !transaction?.piNumber ||
        !transaction?.convertionRate
      )
        return dispatch(setError("Fill all fields"));
    }
    if (transaction?.transactionType?.value === 4) {
      if (
        !transaction?.amount ||
        !transaction?.balanceInvolved ||
        !transaction?.counterAgent ||
        !transaction?.convertionRate
      )
        return dispatch(setError("Fill all fields"));
    }
    dispatch(
      postAccounting({
        info: transaction,
      })
    );
    handleModal();
  };

  useEffect(() => {
    setItems((prev) =>
      prev?.map((item) => {
        return {
          ...item,
          value: transaction?.[item?.transactionKey],
        };
      })
    );
  }, [transaction]);

  return (
    <ChartModal
      loading={!countersFetched || !salesFetched || !purchasesFetched}
      isTransaction
      modalTitle="Add Transaction"
      selectItems={items}
      handleClose={handleModal}
      cancelBtnText="Cancel"
      onMainBtnClick={handleContinue}
      selectedType={transaction?.type}
      onSelectType={(e) =>
        setTransaction((prev) => ({ ...prev, type: e?.target?.name }))
      }
      mainBtnText="Add"
    />
  );
};
