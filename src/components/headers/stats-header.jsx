import React from "react";
import { MOBILE_WIDTH } from "../../constants";
import { Tooltip as ReactTooltip } from "react-tooltip";

const StyledSpan = ({ text }) => (
  <span className="text-gray-500 text-sm">{text}</span>
);

const MainText = ({ text }) => (
  <h3
    data-tooltip-id="detail"
    data-tooltip-content={text}
    className="text-2xl whitespace-pre-line overflow-hidden text-ellipsis max-w-[170px] font-semibold"
  >
    {text}
  </h3>
);

export const StatsHeader = ({ description, mainText, descriptionItems }) => {
  if (window.innerWidth > MOBILE_WIDTH) {
    return (
      <div className="flex relative justify-between px-14 pb-10">
        <div className="w-[288px] border-r border-grey-border flex flex-col gap-2">
          <StyledSpan text={description} />
          <MainText text={mainText} />
        </div>
        <div className="flex gap-10">
          {descriptionItems?.length !== 0 &&
            descriptionItems.map((item) => (
              <div
                key={item?.id}
                className=" px-5 last:border-none last:w-auto border-r border-grey-border flex flex-col gap-3"
              >
                <StyledSpan text={item.label} />
                <MainText text={item.value} />
              </div>
            ))}
        </div>
        <div className="absolute h-0.5 w-full left-0 bg-grey-border bottom-0" />
        <ReactTooltip id="detail" place="bottom" delayShow={1000} />
      </div>
    );
  }
};
