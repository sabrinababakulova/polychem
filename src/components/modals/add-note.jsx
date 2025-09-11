import React, { useState } from "react";
import { ChartModal } from "./charts-modal";
import { addNote } from "../../store/counter-agents/add-note";
import { useDispatch } from "react-redux";

export const AddNoteModal = ({ handleModal, item }) => {
  const dispatch = useDispatch();
  const [note, setNote] = useState("");
  const items = [
    {
      id: 1,
      label: "Note",
      isInput: true,
      placeholder: "Enter note",
      value: note,
      onChange: (e) => setNote(e.target.value),
    },
  ];
  const handlePost = () => {
    dispatch(
      addNote({
        note,
        manufacturerId: item?.company_name ? null : item?.id,
        customerId: item?.company_name ? item?.id : null,
      })
    );
    handleModal();
  };
  return (
    <ChartModal
      onMainBtnClick={handlePost}
      modalTitle="Add Note"
      handleClose={handleModal}
      selectItems={items}
      mainBtnText="Add"
    />
  );
};
