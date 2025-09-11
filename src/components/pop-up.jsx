import React, { Fragment } from "react";

export const PopUp = ({ items, onClose }) => {
  const handlePopUpClick = (onClick) => {
    onClick();
    onClose();
  };
  return (
    <div className="rounded-lg bg-white border-light-purple z-10 absolute right-1 top-[5px] shadow-avatar-menu overflow-hidden w-48 border">
      {items.map((item) => (
        <Fragment key={item?.id}>
          {!item?.isNotVisible && (
            <div
              onClick={() =>
                !item?.isRestricted && handlePopUpClick(item?.onClick)
              }
              className={`${
                item?.isRestricted
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              } hover:bg-pale-grey flex py-[14px] px-4 gap-3 border-b ${
                item?.className
              }`}
            >
              {item?.icon}
              {item.text}
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};
