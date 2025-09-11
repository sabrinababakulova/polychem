import React from "react";

export const Indicator = ({ border, background }) => {
  return (
    <div
      className={`rounded-md ${background || "bg-light-green"} w-4 h-4 border-2 ${
        border || "border-dark-green"
      }`}
    />
  );
};
