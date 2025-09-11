import React from "react";
import { Button } from "../button";

export const Modal = ({ children, title, underTitle, closeBtn }) => {
  return (
    <>
      <div className="fixed z-20 flex top-0 bottom-0 right-0 left-0 items-center justify-center">
        <div className="rounded-lg bg-white py-10 px-8 flex flex-col gap-6 w-[416px] max-h-[90%]">
          <div className="px-6">
            <h1 className="text-2xl font-semibold  text-center">{title}</h1>
            <p className="text-sm text-grey-text  text-center">{underTitle}</p>
          </div>
          {children}
        {closeBtn && (
          <Button onClick={closeBtn} text="Close" />
        )}
        </div>
      </div>
      <div className="absolute animate-fadeIn w-full h-[1500px] top-0 bottom-0 right-0 left-0 bg-dark-black opacity-50 z-10" />
    </>
  );
};
