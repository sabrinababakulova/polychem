import React, { Fragment, useState } from "react";
import { Modal } from "./modal";
import { Button, GreyScaleButton, RedButton } from "../button";
import { Input } from "../input";
import { Select } from "../select";
import { Avatar } from "../avatar";
import { Calendar } from "../calendar";
import { ReactComponent as CalendarIcon } from "../../icons/calendar.svg";
import { FileDrop } from "../dropzone/file-drop";
import { Spinner } from "../spinner";

export const ChartModal = ({
  handleClose,
  selectItems,
  isAddLine,
  isResetDefault,
  onResetDefault,
  modalTitle,
  underTitle,
  onMainBtnClick,
  mainBtnText = "Apply",
  cancelBtnText = "Cancel",
  children,
  isSkipCreate,
  onSkipCreate,
  isAddPI,
  onAddPi,
  onDeleteInput,
  isDeactivate,
  onDeactivate,
  isStaff,
  noMainBtn,
  piLabel,
  isTransaction,
  selectedType,
  onSelectType,
  onFileDrop,
  filePfp,
  loading,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const handleInputClick = (item) => {
    item?.isCalendar && item && showCalendar !== item?.id
      ? setShowCalendar(item?.id)
      : setShowCalendar(false);
  };
  return (
    <Modal underTitle={underTitle} title={modalTitle}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex flex-col gap-2 px-4 overflow-y-auto">
            {children ? (
              children
            ) : (
              <>
                <div className="w-full flex justify-center">
                  {isStaff && (
                    <FileDrop
                      setFile={onFileDrop}
                      fileType={["jpg", "jpeg", "png"]}
                    >
                      <Avatar photo={filePfp?.preview} />
                    </FileDrop>
                  )}
                  {isTransaction && (
                    <div className="flex h-12 w-full justify-between gap-[10px]">
                      <div className="border px-3 flex items-center gap-4 rounded-lg w-full bg-bg-slight-grey">
                        <input
                          name="income"
                          id="income"
                          checked={selectedType === "income"}
                          type="radio"
                          onChange={onSelectType}
                        />
                        <label
                          for="income"
                          className="capitalize text-storm-grey"
                        >
                          Income
                        </label>
                      </div>
                      <div className="border px-3 rounded-lg flex items-center gap-4 w-full bg-bg-slight-grey">
                        <input
                          onChange={onSelectType}
                          checked={selectedType === "outcome"}
                          id="outcome"
                          name="outcome"
                          type="radio"
                        />
                        <label
                          for="outcome"
                          className="capitalize text-storm-grey"
                        >
                          Outcome
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                {selectItems?.length !== 0 &&
                  selectItems?.map((item) => (
                    <Fragment key={item?.id}>
                      {item?.isHidden ? null : (
                        <>
                          <div className="flex justify-between">
                            <label>{item?.label}</label>
                            {onDeleteInput && item?.isDeleteEnabled && (
                              <p
                                onClick={() => onDeleteInput(item?.pi)}
                                className="text-main-red cursor-pointer"
                              >
                                Delete
                              </p>
                            )}
                          </div>
                          {item?.isInput ? (
                            <div className="relative">
                              <Input
                                readOnly={item?.readOnly}
                                onChange={(e) =>
                                  !item?.isCalendar && item?.onChange(e)
                                }
                                onClick={(e) => handleInputClick(item)}
                                value={item?.value}
                                placeholder={item?.placeholder}
                                icon={
                                  item?.isCalendar ? (
                                    <CalendarIcon />
                                  ) : item?.inputAddition ? (
                                    item?.inputAddition
                                  ) : null
                                }
                                iconPosition={
                                  item?.isCalendar ? "right" : "left"
                                }
                              />
                              {showCalendar === item?.id && (
                                <Calendar
                                  onClose={handleInputClick}
                                  onChange={
                                    !item?.readOnly ? item?.onChange : () => {}
                                  }
                                />
                              )}
                            </div>
                          ) : (
                            <Select
                              text={item?.selectText}
                              addNewOption={item?.addNewItem}
                              selectedValue={item?.value}
                              onPick={item?.onChange}
                              placeholder={item?.placeholder}
                              items={item?.items}
                            />
                          )}
                        </>
                      )}
                    </Fragment>
                  ))}
              </>
            )}
          </div>
          <div className="flex flex-col px-4 gap-3">
            {isSkipCreate && (
              <Button
                onClick={onSkipCreate}
                isSecondary
                text="Skip and Create"
              />
            )}
            {isAddPI && (
              <Button
                onClick={onAddPi}
                isSecondary
                text={piLabel || "Add a Pi"}
              />
            )}
            {isAddLine && <Button isSecondary text="Add Line" />}
            {isDeactivate && (
              <RedButton onClick={onDeactivate} text="Deactivate Employee" />
            )}
            {isResetDefault && (
              <GreyScaleButton
                onClick={onResetDefault}
                width="w-full"
                text="Reset to default"
              />
            )}
            <div className="flex gap-3">
              <GreyScaleButton
                width="w-full"
                text={cancelBtnText}
                onClick={handleClose}
              />
              {!noMainBtn && (
                <Button onClick={onMainBtnClick} text={mainBtnText} />
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};
