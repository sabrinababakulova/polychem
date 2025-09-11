import React from "react";

export const TextWrapper = ({ children, className }) => {
  return (
    <div className={`${className} flex flex-col w-[360px] gap-5`}>
      {children}
    </div>
  );
};
