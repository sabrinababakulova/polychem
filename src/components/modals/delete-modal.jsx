import React from "react";
import { Modal } from "./modal";
import { GreyScaleButton, RedButton } from "../button";

export const DeleteModal = ({
  onDelete,
  onCancel,
  mainTitle = "Are you sure?",
  subTitle = "The item will be deleted permanently",
  mainBtnText = "Cancel",
  secondaryBtnText = "Delete",
}) => {
  return (
    <Modal title={mainTitle} underTitle={subTitle}>
      <div className="flex w-full gap-3">
        <GreyScaleButton text={mainBtnText} width="w-full" onClick={onCancel} />
        <RedButton text={secondaryBtnText} isFull onClick={onDelete} />
      </div>
    </Modal>
  );
};
