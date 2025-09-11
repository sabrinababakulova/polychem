import React from "react";
import { ChartModal } from "./charts-modal";

export const DetailsWindow = ({ title, children, handleModal, onClick }) => {
  return (
    <ChartModal
      onMainBtnClick={onClick}
      mainBtnText="Delete"
      modalTitle={title}
      handleClose={handleModal}
    >
      {children}
    </ChartModal>
  );
};
