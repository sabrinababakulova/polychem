import React, { useEffect, useState } from "react";
import { CreateDesign } from "./create-design";
import { useDispatch } from "react-redux";
import { postPurchaseLoad } from "../../store/get-purchase/post-purchase-load";
import { postSalesLoad } from "../../store/sales/post-load";
import { setError } from "../../store/get-notif";

export const CreateLoadModal = ({ handleModal, itemId, isPurchase }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [loss, setLoss] = useState("");
  const items = [
    {
      id: 1,
      label: "Quantity",
      isInput: true,
      placeholder: "Enter quantity in tons",
      value: quantity,
      onChange: (e) => setQuantity(e.target.value),
    },
    {
      id: 2,
      label: "Pick up location",
      placeholder: "Enter enter pick up location",
      isInput: true,
      value: location,
      selectText: "Add as a new category",
      onChange: (e) => setLocation(e?.target?.value),
    },
    {
      id: 3,
      label: isPurchase ? "Transportation Loss" : "Delivery Loss",
      placeholder: "Enter amount of loss",
      isInput: true,
      value: loss,
      onChange: (e) => setLoss(e?.target?.value),
    },
  ];

  const handleContinue = () => {
    if (!quantity || !location || loss === null || loss === undefined)
      return dispatch(setError("Fill all fields"));
    if (isPurchase) {
      dispatch(
        postPurchaseLoad({
          location,
          quantity,
          purchaseId: itemId,
          loss,
        })
      );
    } else {
      dispatch(
        postSalesLoad({
          location,
          quantity,
          salesId: itemId,
          loss,
        })
      );
    }
    handleModal();
  };

  const handleClose = () => handleModal();

  return (
    <CreateDesign
      subText="Allocate your item into a load"
      modalTitle="Create a load"
      items={items}
      handleClose={handleClose}
      handleContinue={handleContinue}
    />
  );
};
