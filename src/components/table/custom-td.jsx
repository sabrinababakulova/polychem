import React from "react";
import { StatusType } from "../status-type";
import { format } from "date-fns";

export const CustomTd = ({
  table,
  itemIsStatusIndex,
  handleNavigate,
  item,
}) => {
  return table?.map((insideItem, index) => (
    <td
      key={`${insideItem}` + index}
      className="first:cursor-pointer capitalize first:text-main-purple text-sm p-3 border-b text-left border-grey-light whitespace-no-wrap "
    >
      {itemIsStatusIndex === index ? (
        <StatusType text={insideItem?.toLowerCase()} />
      ) : (
        <p
          className={`${
            insideItem?.toString()?.match("high")
              ? "text-border-red"
              : insideItem?.toString()?.match("medium")
              ? "text-main-yellow"
              : insideItem?.toString()?.match("low")
              ? "text-light-blue-grey"
              : ""
          }`}
          onClick={index === 0 ? () => handleNavigate(item) : null}
        >
          {/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(insideItem)
            ? format(new Date(insideItem), "yyyy-MM-dd")
            : insideItem || "-"}
        </p>
      )}
    </td>
  ));
};
