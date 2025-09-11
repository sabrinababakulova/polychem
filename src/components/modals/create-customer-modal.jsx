import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateDesign } from "./create-design";
import { postCustomer } from "../../store/customers/post-customers";
import { getCountries, getStaff } from "../../store";
import { useGetInformation } from "../../hooks/use-get-information";
import { isObjectValuesNotEmpty } from "./constants";
import { editCustomer } from "../../store/customers/edit-customers";
import { setError } from "../../store/get-notif";
import { fetchStaff } from "../../store/staff/fetch-staff";

export const CreateCustomerModal = ({ handleModal, isEdit, selectedItem }) => {
  const dispatch = useDispatch();
  const { data: countries, fetched } = useSelector(getCountries);
  const { data: staff, fetched: staffFetched } = useSelector(getStaff);
  useGetInformation({ fetcher: fetchStaff, selector: getStaff });
  const salesPeople = staff?.filter(
    (employee) =>
      employee?.position?.toLowerCase() === "salesperson" ||
      employee?.position?.toLowerCase() === "chief sales" ||
      employee?.position?.toLowerCase() === "director"
  );
  const [info, setInfo] = useState({
    companyName: selectedItem?.company_name || "",
    contactPerson: selectedItem?.contact_person || "",
    phoneNumber: selectedItem?.phone_number || "",
    email: selectedItem?.email || "",
    country: selectedItem?.country_name
      ? { label: selectedItem?.country_name, value: selectedItem?.country_id }
      : "",
    city: selectedItem?.city || "",
    address: selectedItem?.address || "",
    salesManager: selectedItem?.staff_name
      ? { label: selectedItem?.staff_name }
      : "",
  });
  const items = [
    {
      id: 1,
      label: "Company name",
      isInput: true,
      placeholder: "Enter company name",
      value: info?.companyName,
      onChange: (e) =>
        setInfo((prev) => ({ ...prev, companyName: e.target.value })),
    },
    {
      id: 2,
      label: "Contact person",
      isInput: true,
      placeholder: "Enter contact person name",
      value: info?.contactPerson,
      onChange: (e) =>
        setInfo((prev) => ({ ...prev, contactPerson: e.target.value })),
    },
    {
      id: 3,
      label: "Phone number",
      isInput: true,
      placeholder: "Enter phone number",
      value: info?.phoneNumber,
      onChange: (e) =>
        setInfo((prev) => ({ ...prev, phoneNumber: e.target.value })),
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
      label: "Country",
      placeholder: "Enter country",
      items: countries,
      value: info?.country,
      onChange: (e) => setInfo((prev) => ({ ...prev, country: e })),
    },
    {
      id: 6,
      label: "City",
      placeholder: "Enter city",
      isInput: true,
      value: info?.city,
      onChange: (e) => setInfo((prev) => ({ ...prev, city: e.target.value })),
    },
    {
      id: 7,
      label: "Address",
      placeholder: "Enter address",
      isInput: true,
      value: info?.address,
      onChange: (e) =>
        setInfo((prev) => ({ ...prev, address: e.target.value })),
    },
    {
      id: 9,
      label: "Sales manager",
      placeholder: "Pick a sales manager",
      value: info?.salesManager,
      items: salesPeople?.map((each) => ({
        name: each?.table?.[0],
        id: each?.id,
      })),
      onChange: (e) => setInfo((prev) => ({ ...prev, salesManager: e })),
    },
  ];

  const handleContinue = () => {
    if (isEdit) {
      dispatch(editCustomer({ info, itemId: selectedItem?.id }));
      handleModal();
    } else {
      if (!isObjectValuesNotEmpty(info)) {
        return dispatch(setError("Fill all fields"));
      } else {
        dispatch(postCustomer({ info }));
        handleModal();
      }
    }
  };

  return (
    <CreateDesign
      loading={!fetched || !staffFetched}
      modalTitle={isEdit ? "Edit a Customer" : "Add a Customer"}
      items={items}
      handleClose={handleModal}
      handleContinue={handleContinue}
      mainBtnText="Save"
      cancelBtnText="Cancel"
    />
  );
};
