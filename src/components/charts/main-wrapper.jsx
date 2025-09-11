import React from "react";
import { MAIN_WRAPPER } from "./charts-classnames";
import { DRAG_N_DROP_TYPE } from "../../constants";
import { useDrag } from "react-dnd";
import { ReactComponent as DragIcon } from "../../icons/drag.svg";

export const MainWrapper = ({ children, index, chart }) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: DRAG_N_DROP_TYPE,
    item: () => ({
      index,
      chart,
    }),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <div
      ref={preview}
      className={`${
        isDragging ? "opacity-20" : "opacity-100"
      }  flex gap-8 items-center`}
    >
      <div ref={drag}>
        <DragIcon className="cursor-move" />
      </div>
      <div className={MAIN_WRAPPER}>{children}</div>
    </div>
  );
};
