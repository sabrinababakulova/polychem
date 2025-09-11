import React, { useEffect, useState } from "react";
import { GreyScaleButton } from "../button";
import { MAIN_TEXT_WRAPPER } from "./charts-classnames";
import { TextWrapper } from "./text-wrapper";
import { ChartModal } from "../modals/charts-modal";
import { WorkedAmount } from "./utils/worked-amount";
import Chart from "react-apexcharts";
import { useDispatch } from "react-redux";
import { authorizationAPI } from "../../constants/api";
import { setError } from "../../store/get-notif";
import { TransitionWrapper } from "../modals/transition-wrapper";

export const SalesPercentage = () => {
  const dispatch = useDispatch();
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [openChartSettings, setOpenChartSettings] = useState(false);
  const defaultSettings = {
    sortBy: { label: "By sales", value: "sales" },
    object: { label: "Product", value: 1 },
    from: "",
    to: "",
  };
  const [chosenSettings, setChosenSettings] = useState(defaultSettings);
  const getInfo = async () => {
    const urlQuery = new URLSearchParams();
    defaultSettings?.sortBy?.value &&
      urlQuery.append("transaction_type", chosenSettings?.sortBy?.value);
    chosenSettings?.from && urlQuery.append("start_date", chosenSettings?.from);
    chosenSettings?.to && urlQuery.append("end_date", chosenSettings?.to);
    chosenSettings?.object?.label &&
      urlQuery.append(
        "object_type",
        chosenSettings?.object?.label?.toLowerCase()
      );
    await authorizationAPI
      .get(`api/get-pie-chart-data?${urlQuery?.toString()}`)
      .catch((e) => {
        dispatch(
          setError(
            e?.response?.data?.[0] || `${e.message} from ${e?.config?.url}`
          )
        );
      })
      .then((res) => {
        if (res?.data) {
          setSeries(Object.values(res?.data));
          setLabels(Object.keys(res?.data));
        }
      });
    setOpenChartSettings(false);
  };
  useEffect(() => {
    getInfo();
  }, []);
  const handleChartsettings = () => setOpenChartSettings(!openChartSettings);
  const handleResetDefault = () => {
    setChosenSettings(defaultSettings);
    handleChartsettings();
  };
  const [items, setItems] = useState([
    {
      id: 1,
      label: "",
      settingKey: "sortBy",
      value: chosenSettings.sortBy,
      items: [
        { name: "By sales", id: "sales" },
        { name: "By purchases", id: "purchases" },
      ],
      onChange: (e) => setChosenSettings((prev) => ({ ...prev, sortBy: e })),
    },
    {
      id: 2,
      label: "Object",
      settingKey: "object",
      value: chosenSettings.object,
      onChange: (e) => setChosenSettings((prev) => ({ ...prev, object: e })),
      items: [
        {
          id: 1,
          name: "Product",
        },
        {
          id: 2,
          name: "Category",
        },
        {
          id: 3,
          name: "Subcategory",
        },
      ],
    },
    {
      id: 3,
      label: "Time Period From",
      settingKey: "from",
      isInput: true,
      isCalendar: true,
      placeholder: "From what time period",
      value: chosenSettings.from,
      onChange: (e) => setChosenSettings((prev) => ({ ...prev, from: e })),
    },
    {
      id: 4,
      label: "Time Period To",
      settingKey: "to",
      isInput: true,
      isCalendar: true,
      placeholder: "To what time period",
      value: chosenSettings.to,
      onChange: (e) => setChosenSettings((prev) => ({ ...prev, to: e })),
    },
  ]);

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      type: "donut",
    },
    plotOptions: {
      pie: {
        startAngle: 10,
        borderRadius: 8,
        donut: {
          size: "40%",
        },
      },
    },
    labels: labels,
    stroke: {
      show: true,
      width: 2,
      colors: [
        "#C08346",
        "#0B829B",
        "#6F6CD9",
        "#474958",
        "#1CBB90",
        "#FF5A5A",
        "#CCC980",
        "#C08346",
        "#C08346",
        "#0B829B",
        "#6F6CD9",
        "#474958",
        "#1CBB90",
        "#FF5A5A",
        "#CCC980",
        "#C08346",
        "#C08346",
        "#0B829B",
        "#6F6CD9",
        "#474958",
        "#1CBB90",
        "#FF5A5A",
        "#CCC980",
        "#C08346",
        "#C08346",
        "#0B829B",
        "#6F6CD9",
        "#474958",
        "#1CBB90",
        "#FF5A5A",
        "#CCC980",
        "#C08346",
        "#C08346",
        "#0B829B",
        "#6F6CD9",
        "#474958",
        "#1CBB90",
        "#FF5A5A",
        "#CCC980",
        "#C08346",
        "#C08346",
        "#0B829B",
        "#6F6CD9",
        "#474958",
        "#1CBB90",
        "#FF5A5A",
        "#CCC980",
        "#C08346",
        "#C08346",
        "#0B829B",
        "#6F6CD9",
        "#474958",
        "#1CBB90",
        "#FF5A5A",
        "#CCC980",
        "#C08346",
        "#C08346",
        "#0B829B",
        "#6F6CD9",
        "#474958",
        "#1CBB90",
        "#FF5A5A",
        "#CCC980",
        "#C08346",
        "#C08346",
        "#0B829B",
        "#6F6CD9",
        "#474958",
        "#1CBB90",
        "#FF5A5A",
        "#CCC980",
        "#C08346",
        "#C08346",
        "#0B829B",
        "#6F6CD9",
        "#474958",
        "#1CBB90",
        "#FF5A5A",
        "#CCC980",
        "#C08346",
        "#C08346",
        "#0B829B",
        "#6F6CD9",
        "#474958",
        "#1CBB90",
        "#FF5A5A",
        "#CCC980",
        "#C08346",
        "#C08346",
        "#0B829B",
        "#6F6CD9",
        "#474958",
        "#1CBB90",
        "#FF5A5A",
        "#CCC980",
        "#C08346",
        "#C08346",
        "#0B829B",
        "#6F6CD9",
        "#474958",
        "#1CBB90",
        "#FF5A5A",
        "#CCC980",
        "#C08346",
        "#C08346",
        "#0B829B",
        "#6F6CD9",
        "#474958",
        "#1CBB90",
        "#FF5A5A",
        "#CCC980",
        "#C08346",
        "#C08346",
        "#0B829B",
        "#6F6CD9",
        "#474958",
        "#1CBB90",
        "#FF5A5A",
        "#CCC980",
        "#C08346",
        "#C08346",
        "#0B829B",
        "#6F6CD9",
        "#474958",
        "#1CBB90",
        "#FF5A5A",
        "#CCC980",
        "#C08346",
      ],
    },
    colors: [
      "rgba(240, 164, 88, 0.40)",
      "rgba(11, 130, 155, 0.40)",
      "rgba(111, 108, 217, 0.40)",
      "rgba(25, 27, 46, 0.40)",
      "rgba(28, 187, 144, 0.40)",
      "rgba(255, 90, 90, 0.40)",
      "rgba(204, 201, 128, 0.40)",
      "rgba(144, 98, 53, 0.40)",
      "rgba(240, 164, 88, 0.40)",
      "rgba(11, 130, 155, 0.40)",
      "rgba(111, 108, 217, 0.40)",
      "rgba(25, 27, 46, 0.40)",
      "rgba(28, 187, 144, 0.40)",
      "rgba(255, 90, 90, 0.40)",
      "rgba(204, 201, 128, 0.40)",
      "rgba(144, 98, 53, 0.40)",
      "rgba(240, 164, 88, 0.40)",
      "rgba(11, 130, 155, 0.40)",
      "rgba(111, 108, 217, 0.40)",
      "rgba(25, 27, 46, 0.40)",
      "rgba(28, 187, 144, 0.40)",
      "rgba(255, 90, 90, 0.40)",
      "rgba(204, 201, 128, 0.40)",
      "rgba(144, 98, 53, 0.40)",
      "rgba(240, 164, 88, 0.40)",
      "rgba(11, 130, 155, 0.40)",
      "rgba(111, 108, 217, 0.40)",
      "rgba(25, 27, 46, 0.40)",
      "rgba(28, 187, 144, 0.40)",
      "rgba(255, 90, 90, 0.40)",
      "rgba(204, 201, 128, 0.40)",
      "rgba(144, 98, 53, 0.40)",
      "rgba(240, 164, 88, 0.40)",
      "rgba(11, 130, 155, 0.40)",
      "rgba(111, 108, 217, 0.40)",
      "rgba(25, 27, 46, 0.40)",
      "rgba(28, 187, 144, 0.40)",
      "rgba(255, 90, 90, 0.40)",
      "rgba(204, 201, 128, 0.40)",
      "rgba(144, 98, 53, 0.40)",
      "rgba(240, 164, 88, 0.40)",
      "rgba(11, 130, 155, 0.40)",
      "rgba(111, 108, 217, 0.40)",
      "rgba(25, 27, 46, 0.40)",
      "rgba(28, 187, 144, 0.40)",
      "rgba(255, 90, 90, 0.40)",
      "rgba(204, 201, 128, 0.40)",
      "rgba(144, 98, 53, 0.40)",
      "rgba(240, 164, 88, 0.40)",
      "rgba(11, 130, 155, 0.40)",
      "rgba(111, 108, 217, 0.40)",
      "rgba(25, 27, 46, 0.40)",
      "rgba(28, 187, 144, 0.40)",
      "rgba(255, 90, 90, 0.40)",
      "rgba(204, 201, 128, 0.40)",
      "rgba(144, 98, 53, 0.40)",
      "rgba(240, 164, 88, 0.40)",
      "rgba(11, 130, 155, 0.40)",
      "rgba(111, 108, 217, 0.40)",
      "rgba(25, 27, 46, 0.40)",
      "rgba(28, 187, 144, 0.40)",
      "rgba(255, 90, 90, 0.40)",
      "rgba(204, 201, 128, 0.40)",
      "rgba(144, 98, 53, 0.40)",
      "rgba(240, 164, 88, 0.40)",
      "rgba(11, 130, 155, 0.40)",
      "rgba(111, 108, 217, 0.40)",
      "rgba(25, 27, 46, 0.40)",
      "rgba(28, 187, 144, 0.40)",
      "rgba(255, 90, 90, 0.40)",
      "rgba(204, 201, 128, 0.40)",
      "rgba(144, 98, 53, 0.40)",
      "rgba(240, 164, 88, 0.40)",
      "rgba(11, 130, 155, 0.40)",
      "rgba(111, 108, 217, 0.40)",
      "rgba(25, 27, 46, 0.40)",
      "rgba(28, 187, 144, 0.40)",
      "rgba(255, 90, 90, 0.40)",
      "rgba(204, 201, 128, 0.40)",
      "rgba(144, 98, 53, 0.40)",
      "rgba(240, 164, 88, 0.40)",
      "rgba(11, 130, 155, 0.40)",
      "rgba(111, 108, 217, 0.40)",
      "rgba(25, 27, 46, 0.40)",
      "rgba(28, 187, 144, 0.40)",
      "rgba(255, 90, 90, 0.40)",
      "rgba(204, 201, 128, 0.40)",
      "rgba(144, 98, 53, 0.40)",
      "rgba(240, 164, 88, 0.40)",
      "rgba(11, 130, 155, 0.40)",
      "rgba(111, 108, 217, 0.40)",
      "rgba(25, 27, 46, 0.40)",
      "rgba(28, 187, 144, 0.40)",
      "rgba(255, 90, 90, 0.40)",
      "rgba(204, 201, 128, 0.40)",
      "rgba(144, 98, 53, 0.40)",
      "rgba(240, 164, 88, 0.40)",
      "rgba(11, 130, 155, 0.40)",
      "rgba(111, 108, 217, 0.40)",
      "rgba(25, 27, 46, 0.40)",
      "rgba(28, 187, 144, 0.40)",
      "rgba(255, 90, 90, 0.40)",
      "rgba(204, 201, 128, 0.40)",
      "rgba(144, 98, 53, 0.40)",
      "rgba(240, 164, 88, 0.40)",
      "rgba(11, 130, 155, 0.40)",
      "rgba(111, 108, 217, 0.40)",
      "rgba(25, 27, 46, 0.40)",
      "rgba(28, 187, 144, 0.40)",
      "rgba(255, 90, 90, 0.40)",
      "rgba(204, 201, 128, 0.40)",
      "rgba(144, 98, 53, 0.40)",
      "rgba(240, 164, 88, 0.40)",
      "rgba(11, 130, 155, 0.40)",
      "rgba(111, 108, 217, 0.40)",
      "rgba(25, 27, 46, 0.40)",
      "rgba(28, 187, 144, 0.40)",
      "rgba(255, 90, 90, 0.40)",
      "rgba(204, 201, 128, 0.40)",
      "rgba(144, 98, 53, 0.40)",
      "rgba(240, 164, 88, 0.40)",
      "rgba(11, 130, 155, 0.40)",
      "rgba(111, 108, 217, 0.40)",
      "rgba(25, 27, 46, 0.40)",
      "rgba(28, 187, 144, 0.40)",
      "rgba(255, 90, 90, 0.40)",
      "rgba(204, 201, 128, 0.40)",
      "rgba(144, 98, 53, 0.40)",
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  useEffect(() => {
    setItems((prev) =>
      prev?.map((item) => ({ ...item, value: chosenSettings[item.settingKey] }))
    );
  }, [chosenSettings]);
  return (
    <>
      <TextWrapper>
        <p className={MAIN_TEXT_WRAPPER}>Sales percentage and Check in</p>
        <span className="text-grey-text">
          The most popular products sold analytics
        </span>
        <GreyScaleButton
          onClick={handleChartsettings}
          height="h-10"
          text="Settings"
        />
      </TextWrapper>
      <TransitionWrapper isShow={openChartSettings}>
        <ChartModal
          onMainBtnClick={getInfo}
          onResetDefault={handleResetDefault}
          isResetDefault
          modalTitle="Sales percentage chart settings"
          selectItems={items}
          handleClose={handleChartsettings}
        />
      </TransitionWrapper>
      <div className="flex-1 flex gap-6">
        <div className="shadow-main w-full h-full flex justify-center items-center">
          {series?.length > 0 ? (
            <Chart
              className="w-full"
              options={options}
              series={series}
              type="donut"
              height="100%"
            />
          ) : (
            <div>No data</div>
          )}
        </div>
        <WorkedAmount />
      </div>
    </>
  );
};
