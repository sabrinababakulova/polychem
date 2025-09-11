import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateDesign } from "./create-design";
import { getCountries } from "../../store";
import { isObjectValuesNotEmpty } from "./constants";
import { postCounter } from "../../store/counter-agents/post-counter";
import { editCounter } from "../../store/counter-agents/edit-counters";
import { setError } from "../../store/get-notif";

export const CreateCounterAgentModal = ({
  handleModal,
  isEdit,
  selectedItem,
}) => {
  const dispatch = useDispatch();
  const { data: countries, fetched } = useSelector(getCountries);
  const [info, setInfo] = useState({
    name: selectedItem?.name || "",
    city: selectedItem?.city || "",
    country: selectedItem?.country_name
      ? { label: selectedItem?.country_name, value: selectedItem?.country_id }
      : "",
    email: selectedItem?.email || "",
    phoneNumber: selectedItem?.phone_number || "",
    notes: "",
  });

  const items = [
    {
      id: 1,
      label: "Name",
      isInput: true,
      placeholder: "Enter name",
      value: info?.name,
      onChange: (e) => setInfo((prev) => ({ ...prev, name: e.target.value })),
    },
    {
      id: 2,
      label: "City",
      isInput: true,
      placeholder: "Enter city",
      value: info?.city,
      onChange: (e) => setInfo((prev) => ({ ...prev, city: e.target.value })),
    },

    {
      id: 3,
      label: "Country",
      placeholder: "Enter country",
      items: countries,
      value: info?.country,
      onChange: (e) => setInfo((prev) => ({ ...prev, country: e })),
    },

    {
      id: 4,
      label: "E-mail",
      placeholder: "Enter e-mail",
      isInput: true,
      value: info?.email,
      onChange: (e) => setInfo((prev) => ({ ...prev, email: e.target.value })),
    },
    {
      id: 5,
      label: "Phone number",
      isInput: true,
      placeholder: "Enter phone number",
      value: info?.phoneNumber,
      onChange: (e) =>
        setInfo((prev) => ({ ...prev, phoneNumber: e.target.value })),
    },
    {
      id: 6,
      label: "Notes",
      isInput: true,
      placeholder: "Enter notes",
      value: info?.notes,
      onChange: (e) => setInfo((prev) => ({ ...prev, notes: e.target.value })),
    },
  ];

  const handleContinue = () => {
    if (isEdit) {
      dispatch(editCounter({ info, itemId: selectedItem?.id }));
      handleModal();
    } else {
      if (!isObjectValuesNotEmpty(info)) {
        return dispatch(setError("Fill all fields"));
      } else {
        dispatch(postCounter({ info }));
        handleModal();
      }
    }
  };

  return (
    <CreateDesign
      loading={!fetched}
      modalTitle={isEdit ? "Edit a Counter agent" : "Add a Counter agent"}
      items={items}
      handleClose={handleModal}
      handleContinue={handleContinue}
      mainBtnText="Save"
      cancelBtnText="Cancel"
    />
  );
};
