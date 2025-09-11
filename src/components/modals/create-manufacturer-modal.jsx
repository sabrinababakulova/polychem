import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postManufacturer } from "../../store/get-manufacturer/post-manufacturer";
import { CreateDesign } from "./create-design";
import { editManufacturer } from "../../store/get-manufacturer/edit-manufacturer";
import { getCountries } from "../../store";
import { setError } from "../../store/get-notif";

export const CreateManufacturerModal = ({
  handleModal,
  isEdit,
  selectedItem,
}) => {
  const { data: countries, fetched } = useSelector(getCountries);
  const dispatch = useDispatch();
  const [file, setFile] = useState([]);
  const [isDropZone, setIsDropZone] = useState(false);
  const [mainBtnText, setMainBtnText] = useState("Continue");
  const [cancelBtnText, setCancelBtnText] = useState("Cancel");
  const [name, setName] = useState(selectedItem?.name || "");
  const [city, setCity] = useState(selectedItem?.city || "");
  const [country, setCountry] = useState(
    selectedItem?.country_name
      ? { label: selectedItem?.country_name, value: selectedItem?.country_id }
      : ""
  );
  const [address, setAddress] = useState(selectedItem?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(
    selectedItem?.phone_number || ""
  );
  const [email, setEmail] = useState(selectedItem?.email || "");
  const [subText, setSubText] = useState({
    step: 1,
    text: "Step 1/2: Adding main manufacturer information",
  });
  const items = [
    {
      id: 1,
      label: "Manufacturer name",
      isInput: true,
      placeholder: "Enter Manufacturer name",
      value: name,
      onChange: (e) => setName(e.target.value),
    },
    {
      id: 2,
      label: "Country",
      items: countries,
      placeholder: "Enter and pick a country",
      value: country,
      onChange: (e) => setCountry(e),
    },
    {
      id: 3,
      label: "City",
      isInput: true,
      placeholder: "Enter and pick a city",
      value: city,
      onChange: (e) => setCity(e.target.value),
    },
    {
      id: 4,
      label: "Address",
      placeholder: "Enter and pick an address",
      isInput: true,
      value: address,
      onChange: (e) => setAddress(e.target.value),
    },
    {
      id: 5,
      label: "Phone Number",
      placeholder: "Enter phone number",
      isInput: true,
      value: phoneNumber,
      onChange: (e) => setPhoneNumber(e.target.value),
    },
    {
      id: 6,
      label: "E-mail",
      placeholder: "Enter e-mail",
      isInput: true,
      value: email,
      onChange: (e) => setEmail(e.target.value),
    },
  ];

  const handleEdit = () => {
    dispatch(
      editManufacturer({
        name,
        city,
        address,
        country,
        phoneNumber,
        email,
        file,
        itemId: selectedItem.id,
      })
    );
    handleModal();
  };

  const handleContinue = () => {
    if (subText.step === 1) {
      if (!name || !city || !address || !phoneNumber || !email)
        return dispatch(setError("Fill all fields"));
      setSubText({
        step: 2,
        text: "Step 2/2: Attach documents",
      });
      setIsDropZone(true);
      setMainBtnText("Create");
      setCancelBtnText("Go back");
    }
    if (subText.step === 2) {
      dispatch(
        postManufacturer({
          name,
          city,
          address,
          country,
          phoneNumber,
          email,
          file,
        })
      );
      handleModal();
    }
  };

  const handleClose = () => {
    if (subText.step === 1) {
      handleModal();
    }
    if (subText.step === 2) {
      setSubText({
        step: 1,
        text: "Step 1/2: Adding main manufacturer information",
      });
      setIsDropZone(false);
      setMainBtnText("Continue");
      setCancelBtnText("Cancel");
    }
  };

  const handleDeleteFile = (index) => {
    setFile((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <CreateDesign
      loading={!fetched}
      subText={!isEdit && subText}
      modalTitle={isEdit ? "Edit Manufacturer" : "Create Manufacturer"}
      items={items}
      handleClose={handleClose}
      handleContinue={isEdit ? handleEdit : handleContinue}
      mainBtnText={isEdit ? "Edit" : mainBtnText}
      cancelBtnText={isEdit ? "Cancel" : cancelBtnText}
      isDropZone={isDropZone}
      file={file}
      handleDeleteFile={handleDeleteFile}
      setFile={setFile}
    />
  );
};
