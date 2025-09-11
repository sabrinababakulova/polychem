import React, { useState } from "react";
import { CreateDesign } from "./create-design";
import { useDispatch } from "react-redux";

export const AddFileModal = ({ handleModal, onCreate, itemId }) => {
  const [file, setFile] = useState([]);
  const dispatch = useDispatch();

  const handleContinue = () => {
    dispatch(onCreate({ file, itemId }));
    handleModal();
  };

  const handleDeleteFile = (index) => {
    setFile((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <CreateDesign
      handleClose={handleModal}
      handleContinue={handleContinue}
      isDropZone
      file={file}
      handleDeleteFile={handleDeleteFile}
      setFile={setFile}
    />
  );
};
