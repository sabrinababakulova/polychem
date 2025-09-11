import React from "react";
import { ReactComponent as RedCross } from "../../icons/red-cross.svg";
const FileHolder = ({
  lastModified,
  onClick,
  index,
  name,
  onDelete,
  isDelete,
}) => {
  return (
    <div
      onClick={onClick}
      key={lastModified}
      className={`max-h-[72px] w-[320px] flex justify-between items-center py-3 px-3 rounded-lg border border-grey-border bg-pale-grey`}
    >
      <div className="flex gap-3 items-center">
        <div className="w-12 h-12 bg-purple-200 rounded-lg flex justify-center items-center text-white text-3xl">
          {index + 1}
        </div>
        <div className="flex flex-col items-start">
          <p className="whitespace-nowrap text-ellipsis overflow-hidden max-w-[200px]">
            {name}
          </p>
          <span className="text-grey-text text-sm">
            {lastModified && new Date(lastModified).toLocaleDateString()}
          </span>
        </div>
      </div>
      {isDelete && (
        <RedCross onClick={() => onDelete(index)} className="cursor-pointer" />
      )}
    </div>
  );
};

export default FileHolder;
