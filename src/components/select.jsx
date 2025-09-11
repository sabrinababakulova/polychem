import { isEmpty } from "lodash";
import React, { useState } from "react";
import SelectComp from "react-select";

export const Select = ({
  items,
  placeholder,
  selectedValue,
  onPick,
  addNewOption,
  text = "Add as a new category",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isNoOptions, setIsNoOptions] = useState(false);

  const handleNoOptions = () => {
    setIsNoOptions(false);
    if (inputValue && addNewOption) {
      setIsNoOptions(true);
      return null;
    } else {
      return "No options";
    }
  };

  const handleAddNewOption = () => {
    addNewOption(inputValue);
  };

  const styles = {
    control: () => ({
      display: "flex",
      height: "48px",
      width: "100%",
      border: "1px solid #E8E8EA",
      borderRadius: "8px",
      backgroundColor: "#F8F8FD",
      paddingLeft: "14px",
      fontWeight: "400",
      cursor: "pointer",
      transitionProperty:
        "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
      transitionTimingFunction: " cubic-bezier(0.4, 0, 0.2, 1)",
      transitionDuration: "150ms",
      ":hover": {
        background: "#F1F0FB",
      },
    }),
    menu: () => ({
      backgroundColor: "#F8F8FD",
      border: "1px solid #E8E8EA",
      borderRadius: "8px",
      marginTop: "4px",
      width: "100%",
      zIndex: "100",
    }),
    option: (styles, { isSelected }) => ({
      ...styles,
      textAlign: "left",
      backgroundColor: isSelected ? "#F1F0FB" : "#F8F8FD",
      color: isSelected ? "#4F3CFF" : "#000",
      ":hover": {
        background: "#F1F0FB",
      },

      transitionProperty:
        "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
      transitionTimingFunction: " cubic-bezier(0.4, 0, 0.2, 1)",
      transitionDuration: "300ms",
    }),
  };
  return (
    <>
      <SelectComp
        placeholder={placeholder}
        styles={styles}
        options={items?.map((each) => ({
          value: each?.id,
          label: each?.name,
        }))}
        value={!isEmpty(selectedValue) && selectedValue}
        onChange={onPick}
        onInputChange={(e) => e && setInputValue(e)}
        noOptionsMessage={handleNoOptions}
        isOptionSelected={() => setIsNoOptions(false)}
      />
      {isNoOptions && addNewOption && (
        <p
          onClick={handleAddNewOption}
          className="text-main-purple cursor-pointer"
        >
          {text}
        </p>
      )}
    </>
  );
};
