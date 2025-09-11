import React from "react";

export const Button = ({
  type,
  text,
  onClick,
  isSecondary,
  isLoading,
  isSmall,
  icon,
  height,
  isFull,
  width,
  iconPosition = "left",
  isRestricted,
}) => {
  const handleClick = () => !isRestricted && onClick();
  return (
    <div
      onClick={handleClick}
      className={`
      ${isRestricted ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      ${isLoading ? "disabled:bg-slate-400 disabled:cursor-wait" : ""}
      ${isSecondary ? "bg-pale-purple" : "bg-main-purple"} rounded-lg ${
        isSecondary ? "text-text-purple" : "text-white"
      } text-center border
      transition
       border-light-purple 
       ${isSecondary ? "hover:bg-link-water" : "hover:bg-text-purple"}
       ${height || "h-12"}
       ${isFull ? "w-full" : ""}
       ${width}
        flex justify-center items-center
        gap-2 ${isSmall ? "py-3 px-3" : `min-w-[154px]`} font-semibold`}
    >
      {iconPosition === "left" && icon}
      <button
        disabled={isRestricted}
        className={`${isRestricted ? "cursor-not-allowed" : "cursor-pointer"}
        h-full`}
        type={type || "button"}
      >
        {text || "press"}
        {iconPosition === "right" && icon}
      </button>
    </div>
  );
};
export const GreyScaleButton = ({
  type,
  text,
  onClick,
  height,
  icon,
  isLoading,
  width,
  iconPosition = "left",
  isRestricted,
  isActive,
}) => {
  const handleClick = () => !isRestricted && onClick();
  return (
    <div
      className={`
        cursor-pointer
        bg-pale-grey rounded-lg
        text-dark-black text-center
        border border-grey-border
        flex justify-center items-center
        font-semibold
        transition
        hover:bg-link-water
        ${isRestricted ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${isLoading ? "disabled:bg-slate-400 disabled:cursor-wait" : ""}
        ${isActive ? "!bg-light-blue-grey" : ""}
        gap-2 ${width || "w-[154px]"} ${height || "h-12"}`}
      onClick={handleClick}
    >
      {iconPosition === "left" && icon}
      <button
        disabled={isRestricted}
        className={`${
          isRestricted ? "cursor-not-allowed" : "cursor-pointer"
        } h-full`}
        type={type || "button"}
      >
        {text || "press"}
        {iconPosition === "right" && icon}
      </button>
    </div>
  );
};

export const RedButton = ({
  type,
  text,
  onClick,
  height,
  icon,
  isLoading,
  isFull,
  iconPosition = "left",
  normalWidth,
  isRestricted,
}) => {
  const handleClick = () => !isRestricted && onClick();
  return (
    <div
      className={`
        cursor-pointer
        bg-main-red rounded-lg
        text-white text-center
        border border-border-red
        flex justify-center items-center
        transition
        hover:bg-border-red
        font-semibold
        ${isRestricted ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${isLoading ? "disabled:bg-slate-400 disabled:cursor-wait" : ""}
        gap-2 py-3 px-3 ${
          isFull ? "w-full" : normalWidth ? "w-[154px]" : "py-3 px-3"
        } ${height || "h-12"}`}
      onClick={handleClick}
    >
      {iconPosition === "left" && icon}
      <button
        disabled={isRestricted}
        className={`${
          isRestricted ? "cursor-not-allowed" : "cursor-pointer"
        }h-full`}
        type={type || "button"}
      >
        {text || "delete"}
        {iconPosition === "right" && icon}
      </button>
    </div>
  );
};
