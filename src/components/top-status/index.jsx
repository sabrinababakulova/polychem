import React, { useEffect, useState } from "react";
import { getStatus } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { removeStatus } from "../../store/get-notif";
import { ReactComponent as SuccessIcon } from "../../icons/success.svg";
import { ReactComponent as Cross } from "../../icons/cross.svg";

export const TopStatus = () => {
  const dispatch = useDispatch();
  const [isShow, setIsShow] = useState(false);
  const { message, isError, isSuccess } = useSelector(getStatus);

  useEffect(() => {
    if (message) {
      setIsShow(true);
      setTimeout(() => {
        setIsShow(false);
        dispatch(removeStatus());
      }, 3000);
    }
  }, [message, isError, dispatch, isSuccess]);

  return (
    isShow && (
      <>
        {isError ? (
          <div
            className="fixed z-20 top-0
            text-white
              h-12 w-full border
            border-border-red
            bg-main-red flex
              items-center justify-between px-6"
          >
            <p>{message}</p>
            <div className="cursor-pointer" onClick={() => setIsShow(false)}>
              <Cross className="[&>path]:stroke-white" />
            </div>
          </div>
        ) : (
          <div
            className="fixed z-20 top-0
            text-white
              h-12 w-full border
            border-blue-green-darker
            bg-blue-green flex items-center justify-between px-6"
          >
            <div className="flex gap-4 items-center">
              <SuccessIcon /> <p>{message}</p>
            </div>
            <div onClick={() => setIsShow(false)}>
              <Cross className="[&>path]:stroke-white" />
            </div>
          </div>
        )}
      </>
    )
  );
};
