import React from "react";
import { ChartModal } from "./charts-modal";
import { differenceInSeconds, format } from "date-fns";

export const TotalWorkedHours = ({ onCancel, args }) => {
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    let result = "";
    if (hours > 0) result += `${hours}h `;
    else result += "0h ";
    if (minutes > 0) result += `${minutes}m`;
    else result += "0m";

    return result.trim();
  };
  return (
    <ChartModal
      noMainBtn
      handleClose={onCancel}
      modalTitle={
        args?.type === "meeting" ? "Meeting Information" : "Worked Time details"
      }
    >
      <div className="flex justify-between">
        <p className="font-semibold text-storm-grey">
          {args?.type === "meeting"
            ? "Meeting duration:"
            : "Total tracked time:"}
        </p>
        <p>
          {formatDuration(
            differenceInSeconds(new Date(args?.end), new Date(args?.start))
          )}
        </p>
      </div>
      {args?.type === "meeting" && (
        <div className="flex justify-between">
          <p className="font-semibol text-storm-grey">Meeting with</p>
          <p className="text-main-purple">{args?.name}</p>
        </div>
      )}
      <div className="flex justify-between">
        <p className="font-semibold text-storm-grey">Start Time:</p>
        <p>{format(new Date(args?.start), "MMM dd, hh:mm a")}</p>
      </div>
      <div className="flex justify-between">
        <p className="font-semibold text-storm-grey">End Time:</p>
        <p>{format(new Date(args?.end), "MMM dd, hh:mm a")}</p>
      </div>
    </ChartModal>
  );
};
