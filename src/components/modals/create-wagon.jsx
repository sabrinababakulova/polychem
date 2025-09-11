import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { CreateDesign } from "./create-design";
import { postWagon } from "../../store/wagons/post-wagons";
import { editWagon } from "../../store/wagons/edit-wagon";
import { setError } from "../../store/get-notif";

export const CreateWagonModal = ({ handleModal, isEdit, selectedItem }) => {
  const dispatch = useDispatch();
  const [wagonNumber, setWagonNumber] = useState(selectedItem?.number || "");
  const [wagonType, setWagonType] = useState(
    selectedItem?.type ? { label: selectedItem?.type } : ""
  );
  const [location, setLocation] = useState(selectedItem?.location || "");
  const items = [
    {
      id: 1,
      label: "Wagon Number",
      isInput: true,
      placeholder: "Enter the Wagon Number",
      value: wagonNumber,
      onChange: (e) => setWagonNumber(e?.target?.value),
    },
    {
      id: 2,
      label: "Wagon Type",
      items: [
        { id: 1, name: "Train" },
        { id: 2, name: "Truck" },
        { id: 3, name: "Ship" },
      ],
      placeholder: "Pick a wagon type",
      value: wagonType,
      onChange: (e) => setWagonType(e),
    },
    {
      id: 3,
      label: "Location",
      isInput: true,
      placeholder: "Enter Location",
      value: location,
      onChange: (e) => setLocation(e?.target?.value),
    },
  ];

  const handleContinue = () => {
    if (isEdit) {
      dispatch(
        editWagon({
          wagonNumber,
          wagonType: wagonType?.label,
          location,
          itemId: selectedItem.id,
        })
      );
    } else {
      if (!wagonNumber || !wagonType || !location)
        return dispatch(setError("Fill all fields"));
      dispatch(
        postWagon({
          wagonNumber,
          wagonType: wagonType?.label,
          location,
        })
      );
    }
    handleModal();
  };
  const handleClose = () => handleModal();

  return (
    <CreateDesign
      modalTitle={isEdit ? "Edit a wagon" : "Create a Wagon"}
      items={items}
      handleClose={handleClose}
      handleContinue={handleContinue}
      mainBtnText={isEdit ? "Save" : "Create"}
      cancelBtnText="Cancel"
    />
  );
};
