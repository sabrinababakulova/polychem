import React from "react";
import { Button } from "../../button";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { postWorkingTime } from "../../../store/working-time/post-time";
import { useStopwatch } from "react-timer-hook";

export const WorkedAmount = () => {
  const { totalSeconds, seconds, minutes, hours, isRunning, start, pause } =
    useStopwatch({
      autoStart: Cookies.get("start_time") ? true : false,
      offsetTimestamp: Cookies.get("start_time")
        ? new Date().setSeconds(
            new Date().getSeconds() +
              Math.floor(
                (new Date().getTime() -
                  new Date(Cookies.get("start_time")).getTime()) /
                  1000
              )
          )
        : new Date().setSeconds(
            new Date().getSeconds() +
              Number(Cookies.get("worked_time_difference"))
          ),
    });
  const dispatch = useDispatch();

  const startWorking = () => {
    start();
    Cookies.set("start_time", new Date());
  };
  const endWorking = () => {
    pause();
    dispatch(postWorkingTime({ workedDifference: totalSeconds }));
  };
  const formatTime = (time) => String(time).padStart(2, "0");

  return (
    <div className="shadow-main w-full h-full flex justify-center items-center">
      <div className="max-w-[285px] flex justify-center flex-col items-center gap-6">
        <p className="text-5xl text-grey-text font-semibold">
          <span>{formatTime(hours)}:</span>
          <span>{formatTime(minutes)}:</span>
          <span>{formatTime(seconds)}</span>
        </p>
        <div className="flex flex-col items-center text-center gap-3">
          <p className="text-2xl font-semibold">Worked today</p>
          {!isRunning && Number(totalSeconds) === 0 && (
            <span className="text-sm text-grey-text">
              You haven’t worked today yet Check In to start tracking your
              working time
            </span>
          )}
        </div>
        <Button
          onClick={isRunning ? endWorking : startWorking}
          width='w-[250px]'
          text={isRunning ? "Check out" : "Check In"}
        />
      </div>
    </div>
  );
};
