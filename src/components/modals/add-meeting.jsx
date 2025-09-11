import { useEffect, useState } from "react";
import { ChartModal } from "./charts-modal";
import { useDispatch, useSelector } from "react-redux";
import { postMeetingTime } from "../../store/working-time/add-meeting";
import { getCustomers, getManufacturers, getStaff } from "../../store";
import { setError } from "../../store/get-notif";
import { parse } from "date-fns";

export const AddMeeting = ({ onCancel, defaultInfo }) => {
  const dispatch = useDispatch();
  const { fetched: customersFetched, data: customers } =
    useSelector(getCustomers);
  const { fetched: manufacturersFetched, data: manufacturers } =
    useSelector(getManufacturers);
  const { fetched: staffFetched, data: staff } = useSelector(getStaff);

  const timeLabel = "dd.mm hh:mm";
  const timeFormat = "dd.MM HH:mm";
  const timeMask = /^([0-3][0-9])\.([0-1][0-9]) ([0-2][0-9]):([0-5][0-9])$/;
  const [meetingSettings, setMeetingSettings] = useState({
    meetingWith: defaultInfo?.meetingWith || {},
    meetingName: defaultInfo?.meetingName || {},
    startTime: "",
    endTime: "",
  });
  const [items, setItems] = useState([
    {
      id: 1,
      label: "Meeting with",
      settingLabel: "meetingWith",
      placeholder: "Pick meeting with",
      items: [
        { name: "Manufacturer", id: 1 },
        { name: "Customer", id: 2 },
        { name: "Employee", id: 3 },
      ],
      onChange: (e) =>
        setMeetingSettings((prev) => ({ ...prev, meetingWith: e })),
    },
    {
      id: 2,
      label: "Start time",
      settingLabel: "startTime",
      placeholder: timeLabel,
      isInput: true,
      onChange: (e) =>
        setMeetingSettings((prev) => ({
          ...prev,
          startTime: e?.target?.value,
        })),
    },
    {
      id: 3,
      label: "End time",
      settingLabel: "endTime",
      placeholder: timeLabel,
      isInput: true,
      onChange: (e) =>
        setMeetingSettings((prev) => ({ ...prev, endTime: e?.target?.value })),
    },
  ]);

  const handlePostMeeting = () => {
    if (
      timeMask.test(meetingSettings?.startTime) &&
      timeMask.test(meetingSettings?.endTime)
    ) {
      dispatch(
        postMeetingTime({
          endTime: parse(meetingSettings.endTime, timeFormat, new Date()),
          startTime: parse(meetingSettings.startTime, timeFormat, new Date()),
          meetingWith: meetingSettings.meetingName,
        })
      );
      onCancel();
    } else dispatch(setError("Please, enter time as shown in placeholder"));
  };

  useEffect(() => {
    if (meetingSettings?.meetingWith?.label) {
      const additionalInfo = {
        id: 4,
        label: meetingSettings?.meetingWith?.label,
        settingLabel: "meetingName",
        placeholder: `Enter ${meetingSettings?.meetingWith?.label} name`,
        onChange: (e) =>
          setMeetingSettings((prev) => ({
            ...prev,
            meetingName: e,
          })),
      };
      if (meetingSettings?.meetingWith?.value === 1)
        additionalInfo.items = manufacturers;
      if (meetingSettings?.meetingWith?.value === 2)
        additionalInfo.items = customers?.map((customer) => ({
          name: customer?.company_name,
          id: customer?.id,
        }));
      if (meetingSettings?.meetingWith?.value === 3)
        additionalInfo.items = staff?.map((employee) => ({
          name: employee?.table?.[0],
          id: employee?.id,
        }));

      const newItems = [...items];

      if (items?.find((item) => item?.id === 4))
        newItems.splice(1, 1, additionalInfo);
      else newItems.splice(1, 0, additionalInfo);
      setItems(newItems);
    }
  }, [meetingSettings]);

  useEffect(() => {
    setItems((prev) =>
      prev?.map((item) => {
        return {
          ...item,
          value: meetingSettings?.[item?.settingLabel],
        };
      })
    );
  }, [meetingSettings]);

  return (
    <ChartModal
      loading={!customersFetched || !manufacturersFetched || !staffFetched}
      modalTitle="Add meeting time"
      selectItems={items}
      handleClose={onCancel}
      onMainBtnClick={handlePostMeeting}
      mainBtnText="Add meeting"
    />
  );
};
