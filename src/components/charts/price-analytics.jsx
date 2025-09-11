import React, { useEffect, useState } from "react";
import { GreyScaleButton } from "../button";
import { CHART_WRAPPER, MAIN_TEXT_WRAPPER } from "./charts-classnames";
import { Indicator } from "../indicator";
import { TextWrapper } from "./text-wrapper";
import { ChartModal } from "../modals/charts-modal";
import Chart from "react-apexcharts";
import { getManufacturers, getProducts } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { authorizationAPI } from "../../constants/api";
import { setError } from "../../store/get-notif";
import { isArray, isEmpty } from "lodash";
import { Spinner } from "../spinner";
import { TransitionWrapper } from "../modals/transition-wrapper";

const getChartState = (
  isDouble,
  mainColor = "rgba(240, 164, 88, 0.40)",
  bar = "$",
  year = new Date().getFullYear()
) => ({
  legend: {
    show: false,
  },
  chart: {
    height: 350,
    toolbar: {
      show: false,
    },
  },
  colors: isDouble
    ? ["rgba(240, 164, 88, 0.40)", "rgba(11, 130, 155, 0.40)"]
    : [mainColor],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "16px",
      endingShape: "rounded",
      borderRadius: 8,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: isDouble ? ["#C08346", "#0B829B"] : [mainColor],
  },
  grid: {
    borderColor: "#F1F1F1",
  },
  yaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  xaxis: {
    categories: [
      `Jan ${year}`,
      `Feb ${year}`,
      `Mar ${year}`,
      `Apr ${year}`,
      `May ${year}`,
      `Jun ${year}`,
      `Jul ${year}`,
      `Aug ${year}`,
      `Sep ${year}`,
      `Oct ${year}`,
      `Nov ${year}`,
      `Dec ${year}`,
    ],
    axisTicks: {
      show: false,
    },
    crosshairs: {
      fill: {
        type: "gradient",
        gradient: {
          colorFrom: "#D8E3F0",
          colorTo: "#BED1E6",
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        },
      },
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return bar + " " + val;
      },
    },
  },
});

export const PriceAnalytics = () => {
  const dispatch = useDispatch();
  const [dataSeries, setDataSeries] = useState({});
  const { data: products } = useSelector(getProducts);
  const { data: manufacturers } = useSelector(getManufacturers);
  const [openChartSettings, setOpenChartSettings] = useState(false);
  const handleChartSettings = () => setOpenChartSettings(!openChartSettings);
  const defaultSettings = {
    product: { label: "All products" },
    manufacturer: { label: "All manufacturers" },
    year: new Date().getFullYear(),
  };
  const [chosenSettings, setChosenSettings] = useState(defaultSettings);

  const getInfo = async () => {
    const urlQuery = new URLSearchParams();
    chosenSettings?.product?.value &&
      urlQuery.append("product_id", chosenSettings?.product?.value);
    chosenSettings?.manufacturer?.value &&
      urlQuery.append("manufacturer_id", chosenSettings?.manufacturer?.value);
    chosenSettings?.year && urlQuery.append("year", chosenSettings?.year);
    await authorizationAPI
      .get(`api/price-analytics?${urlQuery?.toString()}`)
      .catch((e) => {
        dispatch(
          setError(
            isArray(e?.response?.data)
              ? e?.response?.data?.[0]
              : `${e.message} from ${e?.config?.url}`
          )
        );
      })
      .then((res) => {
        if (res?.data) {
          setDataSeries(res?.data);
        }
      });
    setOpenChartSettings(false);
  };

  useEffect(() => {
    getInfo();
  }, []);

  const handleResetDefault = () => {
    setChosenSettings(defaultSettings);
    handleChartSettings();
  };

  const selectItems = [
    {
      id: 1,
      label: "Product",
      items: products || [],
      value: chosenSettings.product,
      onChange: (e) => setChosenSettings((prev) => ({ ...prev, product: e })),
    },
    {
      id: 3,
      label: "Manufacturer",
      items: manufacturers || [],
      value: chosenSettings.manufacturer,
      onChange: (e) =>
        setChosenSettings((prev) => ({ ...prev, manufacturer: e })),
    },
    {
      id: 4,
      label: "Year",
      isInput: true,
      placeholder: "Enter a year",
      value: chosenSettings.year,
      onChange: (e) =>
        setChosenSettings((prev) => ({ ...prev, year: e?.target?.value })),
    },
  ];

  const [series, setSeries] = useState([
    {
      name: "Average stock price",
      data: [],
    },
    {
      name: "Manufacturer price",
      data: [],
    },
  ]);

  useEffect(() => {
    if (dataSeries?.manufacturers) {
      setSeries([
        {
          name: "Average stock price",
          data: dataSeries?.averageStockPrice || [],
        },
        {
          name: "Manufacturer price",
          data: Object?.values(dataSeries?.manufacturers)?.flat(),
        },
      ]);
    }
  }, [dataSeries?.manufacturers]);

  return (
    <>
      <TextWrapper>
        <p className={MAIN_TEXT_WRAPPER}>
          Price analytics <br /> {chosenSettings?.product?.label}
        </p>
        <span className="text-grey-text">
          Month by month product stock vs manufacture price comparing. Pick a
          product first
        </span>
        <div className="flex gap-3">
          <div className="flex gap-2 items-center">
            <Indicator border="border-dark-beige" background="bg-light-beige" />
            <span className="text-grey-text">Average Stock Price</span>
          </div>
          <div className="flex gap-2 items-center">
            <Indicator />
            <span className="text-grey-text">Manufacturer Price</span>
          </div>
        </div>
        <GreyScaleButton
          onClick={handleChartSettings}
          height="h-10"
          text="Pick a product"
        />
      </TextWrapper>
      <TransitionWrapper isShow={openChartSettings}>
        <ChartModal
          onMainBtnClick={getInfo}
          modalTitle="Price analytics chart settings"
          onResetDefault={handleResetDefault}
          isResetDefault
          selectItems={selectItems}
          handleClose={handleChartSettings}
        />
      </TransitionWrapper>
      <div className={CHART_WRAPPER}>
        {isEmpty(dataSeries) ? (
          <Spinner />
        ) : (
          <Chart
            className="w-full"
            options={getChartState(true, "", "$", chosenSettings?.year)}
            series={series}
            type="line"
            height="100%"
          />
        )}
      </div>
    </>
  );
};
