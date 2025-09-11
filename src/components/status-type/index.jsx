import React from "react";

export const StatusType = ({ text }) => {
  switch (text) {
    case "not loaded":
      return (
        <div className="capitalize flex items-center justify-center w-[160px] h-[40px] rounded border-cold-purple border bg-link-water">
          {text}
        </div>
      );
    case "on the way":
      return (
        <div className="capitalize flex items-center justify-center w-[160px] h-[40px] rounded border-pale-yellow border bg-light-yellow">
          {text}
        </div>
      );
    case "warehouse":
      return (
        <div className="capitalize flex items-center justify-center w-[160px] h-[40px] rounded border-bright-green border bg-brighter-green">
          {text}
        </div>
      );
    case "delivered":
      return (
        <div className="capitalize flex items-center justify-center w-[160px] h-[40px] rounded border-bright-green border bg-brighter-green">
          {text}
        </div>
      );
    default:
      return (
        <div className="capitalize flex items-center justify-center w-[160px] h-[40px] rounded border-cold-purple border bg-link-water">
          {text}
        </div>
      );
  }
};
