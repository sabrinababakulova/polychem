import React from "react";
import { ReactComponent as Cross } from "../../icons/cross.svg";
import { GreyScaleButton } from "../button";
import noNotifications from "../../assets/NoNotifications.png";
import { Notif } from "./notif";
import { getStatus } from "../../store";
import { useSelector } from "react-redux";

export const Notification = ({ onCancel }) => {
  const { data: notifications } = useSelector(getStatus);
  return (
    <>
      <div className="fixed z-40 px-12 pt-10 right-0 border bg-white w-[500px] h-screen">
        <div className="w-full pb-6 border-b flex items-center justify-between">
          <p className="font-semibold text-2xl">Notifications</p>
          <GreyScaleButton
            onClick={onCancel}
            text={<Cross />}
            isSecondary
            width="w-[50px]"
          />
        </div>
        {notifications?.length > 0 ? (
          <div className="pt-6">
            {notifications?.map((item) => (
              <Notif key={item?.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="pt-6 flex text-center gap-4 flex-col items-center justify-center w-full h-full">
            <img src={noNotifications} alt="no notifications" />
            <div>
              <p className="font-semibold text-xl">
                New notifications will appear here
              </p>
              <p className="text-storm-grey">
                You will get Payment date alerts, call reminders and other
                notifications here
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="fixed animate-fadeIn w-full h-full top-0 bottom-0 right-0 left-0 bg-dark-black opacity-50 z-10" />
    </>
  );
};
