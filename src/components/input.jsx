import React from "react";

export const Input = ({
  onChange,
  placeholder,
  icon,
  type,
  iconPosition = "right",
  error,
  value,
  isDisabled,
  readOnly,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`${error ? "border-red-400" : ""} ${
        isDisabled ? "disabled:bg-red-300" : ""
      } flex justify-between bg-bg-slight-grey transition hover:bg-pale-purple rounded-lg border-grey-border border py-3 px-4`}
    >
      {iconPosition === "left" && icon}
      <input
        readOnly={readOnly}
        value={value}
        type={type || "text"}
        onChange={onChange}
        className="w-full px-2 bg-inherit outline-none bg-bg-slight-grey"
        placeholder={placeholder || "введите текст"}
      />
      {iconPosition === "right" && icon}
    </div>
  );
};
