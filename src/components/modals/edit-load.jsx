import React, { useState } from "react";
import { CreateDesign } from "./create-design";
import { useDispatch, useSelector } from "react-redux";
import { getWagons } from "../../store";
import { editPurchaseLoad } from "../../store/get-purchase/edit-load";
import { editSaleLoad } from "../../store/sales/edit-load";
import { isObjectValuesNotEmpty } from "./constants";
import { setError } from "../../store/get-notif";

export const EditLoadModal = ({ handleModal, selectedItem, isPurchase }) => {
  const dispatch = useDispatch();
  const { data: wagons, fetched } = useSelector(getWagons);
  const [info, setInfo] = useState({
    status: selectedItem?.status ? { label: selectedItem?.status } : "",
    quantity: selectedItem?.quantity || "",
    location: selectedItem?.pick_up_location || "",
    wagonNumber: selectedItem?.wagon_number
      ? { label: selectedItem?.wagon_number, value: selectedItem?.wagon_id }
      : "",
    shipmentDate: selectedItem?.shipping_date || "",
    loss: isPurchase
      ? selectedItem?.transportation_loss
      : selectedItem?.delivery_loss || "",
  });
  const items = [
    {
      id: 1,
      label: "Status",
      placeholder: "Choose a status",
      value: info.status,
      items: isPurchase
        ? [
            {
              name: "Not Loaded",
              id: 1,
            },
            {
              name: "On The Way",
              id: 2,
            },
            {
              name: "Warehouse",
              id: 3,
            },
          ]
        : [
            {
              name: "Not Loaded",
              id: 1,
            },
            {
              name: "On The Way",
              id: 2,
            },
            {
              name: "Delivered",
              id: 3,
            },
          ],
      onChange: (e) => setInfo((prev) => ({ ...prev, status: e })),
    },
    {
      id: 2,
      label: "Quantity",
      isInput: true,
      placeholder: "Enter quantity in tons",
      value: info.quantity,
      onChange: (e) =>
        setInfo((prev) => ({ ...prev, quantity: e.target.value })),
    },
    {
      id: 3,
      label: "Pick up location",
      placeholder: "Enter enter pick up location",
      isInput: true,
      value: info.location,
      onChange: (e) =>
        setInfo((prev) => ({ ...prev, location: e?.target?.value })),
    },
    {
      id: 4,
      label: "Wagon number",
      placeholder: "Pick a Wagon",
      value: info.wagonNumber,
      onChange: (e) => setInfo((prev) => ({ ...prev, wagonNumber: e })),
      items: wagons?.map((item) => ({
        name: item?.number,
        id: item?.id,
      })),
    },
    {
      id: 5,
      label: "Shipment date",
      placeholder: "pick a date",
      isInput: true,
      isCalendar: true,
      value: info.shipmentDate,
      onChange: (e) => setInfo((prev) => ({ ...prev, shipmentDate: e })),
    },
    {
      id: 6,
      label: isPurchase ? "Transportation Loss" : "Delivery Loss",
      placeholder: "Enter amount of loss",
      isInput: true,
      value: info.loss,
      onChange: (e) => setInfo((prev) => ({ ...prev, loss: e?.target?.value })),
    },
  ];

  const handleContinue = () => {
    if (!isObjectValuesNotEmpty(info))
      return dispatch(setError("Fill all fields"));

    if (isPurchase) {
      dispatch(
        editPurchaseLoad({
          info,
          loadId: selectedItem?.load,
          purchaseId: selectedItem?.purchase_id,
        })
      );
    } else {
      dispatch(
        editSaleLoad({
          info,
          loadId: selectedItem?.load,
          saleId: selectedItem?.sale_id,
        })
      );
    }
    handleModal();
  };

  const handleClose = () => handleModal();

  return (
    <CreateDesign
      loading={!fetched}
      modalTitle="Edit a load"
      items={items}
      handleClose={handleClose}
      handleContinue={handleContinue}
    />
  );
};
