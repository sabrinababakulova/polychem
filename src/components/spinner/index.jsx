import React from "react";
import logo from "../../assets/loading.gif";

export const Spinner = () => {
  return (
    <div className="w-full h-[calc(100vh-300px)] flex items-center justify-center">
      <img src={logo} alt="loading..." width="60px" height="60px" />
    </div>
  );
};
