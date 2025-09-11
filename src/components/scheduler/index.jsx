import { addDays, format } from "date-fns";
import { DayPilotScheduler } from "daypilot-pro-react";
import { isEqual } from "lodash";
import React, { useState } from "react";
import { TotalWorkedHours } from "../modals/total-worked-hours";
import Cookies from "js-cookie";

export const Scheduler = ({ totalWorkedTime, totalMeetingTime }) => {
  const [openModal, setOpenModal] = useState(false);
  const startTime = Cookies?.get("start_time");
  const userId = Cookies?.get("userId");
  const combineTimeEntries = (data) => {
    const combinedData = [];
    let currentEntry = null;

    for (const entry of data) {
      const startDate = new Date(entry?.start_time);
      const startMonth = startDate.getMonth();
      const startHour = startDate.getHours();
      if (
        !currentEntry ||
        startMonth !== new Date(currentEntry?.start_time)?.getMonth() ||
        startHour !== new Date(currentEntry?.start_time)?.getHours()
      ) {
        currentEntry = {
          start_time: new Date(entry.start_time),
          staff_id: entry.staff_id,
          staff_name: entry.staff_name,
          end_time: new Date(entry.end_time),
          id: entry.id,
        };
        combinedData.push(currentEntry);
      } else {
        currentEntry.end_time = new Date(
          Math.max(new Date(currentEntry?.end_time), new Date(entry?.end_time))
        );
      }
    }
    if (startTime) {
      combinedData?.push({
        start_time: format(new Date(startTime), "yyyy-MM-dd'T'HH:mm:ss"),
        staff_id: Number(userId),
        end_time: new Date(),
        staff_name: "You",
        id: Math.random(),
      });
    }

    return combinedData;
  };

  const events = [
    ...combineTimeEntries(totalWorkedTime)?.map((item) => ({
      id: item?.id,
      start: format(item?.start_time, "yyyy-MM-dd'T'HH:mm:ss"),
      end: format(item?.end_time, "yyyy-MM-dd'T'HH:mm:ss"),
      backColor: "#FCEDDE",
      borderColor: "#F3B679",
      type: "work",
      name: "Worked Time",
    })),
    ...totalMeetingTime?.map((item) => ({
      id: item?.id,
      start: format(new Date(item?.start_time), "yyyy-MM-dd'T'HH:mm:ss"),
      end: format(new Date(item?.end_time), "yyyy-MM-dd'T'HH:mm:ss"),
      backColor: "#CEE6EB",
      borderColor: "#3C9BAF",
      type: "meeting",
      name: item?.meeting_with,
    })),
  ];

  const handleWorkedTimeModal = (args) => {
    const {
      e: { data },
    } = args;
    isEqual(openModal, data) ? setOpenModal(false) : setOpenModal(data);
  };

  return (
    <div className="w-full h-full">
      <DayPilotScheduler
        viewType="Days"
        days={12}
        timeFormat="Clock12Hours"
        startDate={addDays(new Date(), -6)}
        cellWidth={80}
        onEventMove={(e) => e.preventDefault()}
        onEventResize={(e) => e.preventDefault()}
        dragOutAllowed={false}
        events={events}
        onEventClick={(args) => handleWorkedTimeModal(args)}
      />
      {openModal && (
        <TotalWorkedHours
          args={openModal}
          onCancel={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};
