import React from "react";
import { useDrop } from "react-dnd";
import { DRAG_N_DROP_TYPE } from "../../constants";
import { useDispatch } from "react-redux";
import { updateCharts } from "../../store/correct-chart";

export const DropZone = ({ itemId, index, isLast }) => {
  const dispatch = useDispatch();
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: DRAG_N_DROP_TYPE,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    canDrop: (item) => !(item.index + 1 === index || item.index === index),
    drop: (item) => {
      dispatch(
        updateCharts({
          idToReplace: itemId,
          item,
          isLast,
        })
      );
    },
  });
  return (
    <div className={`w-full h-12 max-h-12`} ref={drop}>
      {canDrop && isOver && <div className="h-12 w-full bg-grey-border" />}
    </div>
  );
};
