import React, { useState } from "react";
import { CreateDesign } from "./create-design";
import { isObjectValuesNotEmpty } from "./constants";
import { postPurchase } from "../../store/get-purchase/post-purchase";
import { useDispatch } from "react-redux";
import { postCosts } from "../../store/sales/post-costs";
import { setError } from "../../store/get-notif";

export const CreateCostseModal = ({
  handleModal,
  subText,
  modalTitle,
  onCreate,
  selectedItem,
  isSkipCreate,
  onSkipCreate,
  cancelBtnText,
  mainBtnText,
  itemId,
  isPurchase,
}) => {
  const dispatch = useDispatch();
  const [additionalCostItem, setAdditionalCostItem] = useState({
    money: selectedItem?.money_transfer || "",
    cost: selectedItem?.transportation || "",
    custom: selectedItem?.custom || "",
    commission: selectedItem?.commission || "",
    bukhara: selectedItem?.bukhara_expenses || "",
    uzbCost: selectedItem?.uzb_expenses || "",
    delivery: selectedItem?.delivery || "",
    other: selectedItem?.other || "",
  });

  const itemsSecond= [
    {
      id: 1,
      label: "Money transfer costs",
      isInput: true,
      placeholder: "Enter expense value",
      value: additionalCostItem?.money,
      onChange: (e) =>
        setAdditionalCostItem((prev) => ({ ...prev, money: e.target.value })),
    },
    {
      id: 2,
      label: "Transportation costs",
      isInput: true,
      placeholder: "Enter expense value",
      value: additionalCostItem?.cost,
      onChange: (e) =>
        setAdditionalCostItem((prev) => ({ ...prev, cost: e.target.value })),
    },
    {
      id: 3,
      label: "Custom",
      isInput: true,
      placeholder: "Enter expense value",
      value: additionalCostItem?.custom,
      onChange: (e) =>
        setAdditionalCostItem((prev) => ({ ...prev, custom: e.target.value })),
    },
    {
      id: 4,
      label: "Commission costs",
      isInput: true,
      placeholder: "Enter expense value",
      value: additionalCostItem?.commission,
      onChange: (e) =>
        setAdditionalCostItem((prev) => ({
          ...prev,
          commission: e.target.value,
        })),
    },
    {
      id: 5,
      label: "Bukhara expenses",
      isInput: true,
      placeholder: "Enter expense value",
      value: additionalCostItem?.bukhara,
      onChange: (e) =>
        setAdditionalCostItem((prev) => ({ ...prev, bukhara: e.target.value })),
    },
    {
      id: 6,
      label: "Uzb transportation costs",
      isInput: true,
      placeholder: "Enter expense value",
      value: additionalCostItem?.uzbCost,
      onChange: (e) =>
        setAdditionalCostItem((prev) => ({ ...prev, uzbCost: e.target.value })),
    },
    {
      id: 7,
      label: "Delivery to customer",
      isInput: true,
      placeholder: "Enter expense value",
      value: additionalCostItem?.delivery,
      onChange: (e) =>
        setAdditionalCostItem((prev) => ({
          ...prev,
          delivery: e.target.value,
        })),
    },
    {
      id: 8,
      label: "Other costs",
      isInput: true,
      placeholder: "Enter expense value",
      value: additionalCostItem?.other,
      onChange: (e) =>
        setAdditionalCostItem((prev) => ({ ...prev, other: e.target.value })),
    },
  ];

  const handleContinue = () => {
    if (!isObjectValuesNotEmpty(additionalCostItem))
      return dispatch(setError("Fill all fields"));
    if (onCreate) {
      onCreate(additionalCostItem);
    } else {
      if (isPurchase) {
        dispatch(
          postPurchase({
            purchaseItem: null,
            additionalCostItem,
            file: null,
            itemId,
          })
        );
      } else {
        dispatch(
          postCosts({
            additionalCostItem,
            itemId,
          })
        );
      }
      handleModal();
    }
  };

  return (
    <CreateDesign
      modalTitle={modalTitle || "Edit Additional Costs"}
      items={itemsSecond}
      handleClose={handleModal}
      cancelBtnText={cancelBtnText || "Cancel"}
      handleContinue={handleContinue}
      mainBtnText={mainBtnText || "Save"}
      subText={subText}
      isSkipCreate={isSkipCreate}
      onSkipCreate={onSkipCreate}
    />
  );
};
