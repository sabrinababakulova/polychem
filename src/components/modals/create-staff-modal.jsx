import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { postStaff } from "../../store/staff/post-staff";
import { editStaff } from "../../store/staff/edit-staff";
import { ROLES } from "../../constants";
import { setError } from "../../store/get-notif";
import Cookies from "js-cookie";
import { requestEdit } from "../../store/get-notif/request-edit";
import { ChartModal } from "./charts-modal";
import { answerRequest } from "../../store/get-notif/answer-request";

export const CreateStaffModal = ({
  handleModal,
  isEdit,
  isUser,
  selectedItem,
  isApproval,
}) => {
  const dispatch = useDispatch();
  const userPosition = Cookies?.get("position");
  const [firstName, setFirstName] = useState(selectedItem?.first_name || "");
  const [lastName, setLastName] = useState(selectedItem?.last_name || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    selectedItem?.date_of_birth || ""
  );
  const [email, setEmail] = useState(selectedItem?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(
    selectedItem?.phone_number || ""
  );
  const [position, setPosition] = useState(
    selectedItem?.position ? { label: selectedItem?.position } : ""
  );
  const [startDate, setStartDate] = useState(selectedItem?.start_date || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pfp, setPfp] = useState(selectedItem?.logo || "");

  const items = [
    {
      id: 1,
      label: "First name",
      readOnly: !!isApproval,
      isInput: true,
      placeholder: "Enter First name",
      value: firstName,
      onChange: (e) => setFirstName(e.target.value),
    },
    {
      id: 2,
      readOnly: !!isApproval,
      label: "Last name",
      isInput: true,
      placeholder: "Enter Last name",
      value: lastName,
      onChange: (e) => setLastName(e.target.value),
    },
    {
      id: 3,
      readOnly: !!isApproval,
      label: "Date of Birth",
      isInput: true,
      placeholder: "Enter Date of Birth",
      value: dateOfBirth,
      isCalendar: true,
      onChange: (e) => setDateOfBirth(e),
    },
    {
      id: 4,
      readOnly: !!isApproval,
      label: "E-mail",
      placeholder: "Enter e-mail",
      isInput: true,
      value: email,
      onChange: (e) => setEmail(e.target.value),
    },
    {
      id: 5,
      readOnly: !!isApproval,
      label: "Phone Number",
      placeholder: "Enter phone number",
      isInput: true,
      value: phoneNumber,
      onChange: (e) => setPhoneNumber(e.target.value),
    },
    {
      id: 6,
      readOnly: !!isApproval,
      label: "Position",
      placeholder: "Enter and pick a position",
      items: ROLES,
      value: position,
      onChange: (e) => setPosition(e),
    },
    {
      id: 7,
      readOnly: !!isApproval,
      label: "Start Date",
      placeholder: "Enter and pick a start date",
      isInput: true,
      value: startDate,
      isCalendar: true,
      onChange: (e) => setStartDate(e),
    },
    {
      id: 8,
      readOnly: !!isApproval,
      label: "Polychem Password",
      placeholder: "Enter polychem password",
      isInput: true,
      value: password,
      onChange: (e) => setPassword(e.target.value),
    },
    {
      id: 9,
      readOnly: !!isApproval,
      label: "Confirm Polychem Password",
      placeholder: "Confirm polychem password",
      isInput: true,
      value: confirm,
      onChange: (e) => setConfirm(e.target.value),
    },
  ];

  const handleContinue = () => {
    if (isApproval) {
      dispatch(
        answerRequest({
          approveId: isApproval,
          isApprove: true,
        })
      );
    }
    if (isEdit) {
      if (userPosition?.toLowerCase() !== "director") {
        dispatch(
          requestEdit({
            firstName,
            lastName,
            dateOfBirth,
            password,
            position: position?.label,
            startDate,
            phoneNumber,
            email,
            status: true,
            file: pfp,
          })
        );
      } else {
        dispatch(
          editStaff({
            firstName,
            lastName,
            dateOfBirth,
            password,
            position: position?.label,
            startDate,
            phoneNumber,
            email,
            itemId: selectedItem?.id,
            status: true,
            file: pfp,
          })
        );
      }
      handleModal();
    } else {
      if (
        !firstName ||
        !lastName ||
        !dateOfBirth ||
        !email ||
        !phoneNumber ||
        !position ||
        !password ||
        !confirm
      ) {
        return dispatch(setError("Fill all fields"));
      } else if (password !== confirm) {
        return dispatch(setError("Passwords do not match"));
      } else {
        dispatch(
          postStaff({
            firstName,
            lastName,
            dateOfBirth,
            password,
            position: position?.label,
            startDate,
            phoneNumber,
            email,
            status: true,
            file: pfp,
          })
        );
        handleModal();
      }
    }
  };
  const handleCancelBtn = () => {
    if (isApproval) {
      dispatch(
        answerRequest({
          approveId: isApproval,
          isApprove: false,
        })
      );
    }
    handleModal();
  };
  const handleDeactivate = () => {
    dispatch(editStaff({ status: false, itemId: selectedItem?.id }));
    handleModal();
  };
  const onPfp = (e) => setPfp(e[0]);
  return (
    <ChartModal
      filePfp={pfp}
      isStaff
      onFileDrop={onPfp}
      modalTitle={
        isEdit
          ? "Edit employee info"
          : isApproval
          ? "Review Changes"
          : "Add an employee"
      }
      selectItems={items}
      handleClose={handleCancelBtn}
      onMainBtnClick={handleContinue}
      mainBtnText={
        isUser && userPosition?.toLowerCase() !== "director"
          ? "Request"
          : isApproval
          ? "Approve"
          : "Apply"
      }
      cancelBtnText={isApproval ? "Reject" : "Cancel"}
      isDeactivate={
        !isUser && userPosition?.toLowerCase() === "director" && isEdit
      }
      onDeactivate={handleDeactivate}
    />
  );
};
