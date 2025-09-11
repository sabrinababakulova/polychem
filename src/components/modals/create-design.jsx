import React from "react";
import { ChartModal } from "./charts-modal";
import { FileDrop } from "../dropzone/file-drop";
import FileHolder from "../file-holder";

export const CreateDesign = ({
  subText,
  modalTitle,
  items,
  handleClose,
  handleContinue,
  mainBtnText,
  cancelBtnText,
  isDropZone,
  file,
  handleDeleteFile,
  setFile,
  isSkipCreate,
  onSkipCreate,
  isAddPI,
  onAddPi,
  onDeleteInput,
  isDeactivate,
  onDeactivate,
  isStaff,
  piLabel,
  loading
}) => {
  return (
    <ChartModal
      loading={loading}
      piLabel={piLabel}
      isStaff={isStaff}
      isSkipCreate={isSkipCreate}
      onSkipCreate={onSkipCreate}
      isDeactivate={isDeactivate}
      onDeactivate={onDeactivate}
      isAddPI={isAddPI}
      onAddPi={onAddPi}
      modalTitle={modalTitle}
      underTitle={subText?.text || subText}
      selectItems={items}
      handleClose={handleClose}
      onMainBtnClick={handleContinue}
      mainBtnText={mainBtnText}
      cancelBtnText={cancelBtnText}
      onDeleteInput={onDeleteInput}
    >
      {isDropZone && (
        <div className="w-[320px] flex flex-col gap-8">
          {file.map((item, index) => (
            <FileHolder
              lastModified={item?.lastModified}
              index={index}
              name={item?.name}
              onDelete={handleDeleteFile}
              key={item?.lastModified}
            />
          ))}
          <div className="h-[160px]">
            <FileDrop
              setFile={setFile}
              fileType={[
                "msword",
                "wordprocessingml.document",
                "xls",
                "spreadsheetml",
                "pdf",
                "zip",
                "jpg",
                "jpeg",
                "png",
              ]}
            />
          </div>
          <p className="text-grey-text text-center text-sm">
            Supported formats: doc, xls, pdf, zip, jpg, png. Memory limit: 10 MB
          </p>
          <hr />
        </div>
      )}
    </ChartModal>
  );
};
