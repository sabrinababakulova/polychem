import React, { useEffect, useState } from "react";
import { Indicator } from "../indicator";
import { GreyScaleButton } from "../button";
import { CHART_WRAPPER, MAIN_TEXT_WRAPPER } from "./charts-classnames";
import { TextWrapper } from "./text-wrapper";
import { ChartModal } from "../modals/charts-modal";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, getProducts } from "../../store";
import Chart from "react-apexcharts";
import { getChartState } from "./utils/get-chart-state";
import { authorizationAPI } from "../../constants/api";
import { setError } from "../../store/get-notif";
import { TransitionWrapper } from "../modals/transition-wrapper";
import { isEmpty } from "lodash";
import { Spinner } from "../spinner";

export const PurchaseSale = () => {
  const dispatch = useDispatch();
  const [dataSeries, setDataSeries] = useState({});
  const [openChartSettings, setOpenChartSettings] = useState(false);
  const defaultSettings = {
    unitOfMeasurement: { label: "USD", value: "price" },
    category: { label: "All categories" },
    subcategory: { label: "All subcategories" },
    product: { label: "All products" },
    year: new Date().getFullYear(),
  };
  const [chosenSettings, setChosenSettings] = useState(defaultSettings);
  const { categories, subcategories } = useSelector(getCategories);
  const { data: products } = useSelector(getProducts);
  const getInfo = async () => {
    const urlQuery = new URLSearchParams();
    defaultSettings?.unitOfMeasurement?.value &&
      urlQuery.append("measurement", chosenSettings?.unitOfMeasurement?.value);
    chosenSettings?.category?.value &&
      urlQuery.append("category_id", chosenSettings?.category?.value);
    chosenSettings?.subcategory?.value &&
      urlQuery.append("subcategory_id", chosenSettings?.subcategory?.value);
    chosenSettings?.product?.value &&
      urlQuery.append("product_id", chosenSettings?.product?.value);
    chosenSettings?.year && urlQuery.append("year", chosenSettings?.year);
    await authorizationAPI
      .get(`api/purchase-sale?${urlQuery?.toString()}`)
      .catch((e) => {
        dispatch(
          setError(
            e?.response?.data?.[0] || `${e.message} from ${e?.config?.url}`
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
  const handleChartsettings = () => setOpenChartSettings(!openChartSettings);
  const handleResetDefault = () => {
    setChosenSettings(defaultSettings);
    handleChartsettings();
  };
  const series = [
    {
      name: "Sales",
      data: dataSeries?.sales || [],
    },
    {
      data: Array.from({ length: 12 }, () => 0),
    },
    {
      name: "Purchases",
      data: dataSeries?.purchases || [],
    },
  ];

  const [selectItems, setSelectItems] = useState([
    {
      id: 1,
      label: "Unit of measurement",
      value: chosenSettings.unitOfMeasurement,
      items: [
        { name: "USD", id: "price" },
        { name: "Tons", id: "quantity" },
      ],
      onChange: (e) =>
        setChosenSettings((prev) => ({ ...prev, unitOfMeasurement: e })),
    },
    {
      id: 2,
      label: "Category",
      items: categories,
      value: chosenSettings.category,
      onChange: (e) => setChosenSettings((prev) => ({ ...prev, category: e })),
    },
    {
      id: 3,
      label: "Subcategory",
      items: subcategories,
      value: chosenSettings.subcategory,
      onChange: (e) =>
        setChosenSettings((prev) => ({ ...prev, subcategory: e })),
    },
    {
      id: 4,
      label: "Product",
      items: products,
      value: chosenSettings.product,
      onChange: (e) => setChosenSettings((prev) => ({ ...prev, product: e })),
    },
    {
      id: 5,
      label: "Year",
      value: chosenSettings.year,
      isInput: true,
      onChange: (e) =>
        setChosenSettings((prev) => ({ ...prev, year: e.target.value })),
    },
  ]);

  useEffect(() => {
    setSelectItems((prev) =>
      prev?.map((item) => {
        if (item?.id === 1)
          return { ...item, value: chosenSettings?.unitOfMeasurement };
        if (item?.id === 2) return { ...item, value: chosenSettings?.category };
        if (item?.id === 3)
          return { ...item, value: chosenSettings?.subcategory };
        if (item?.id === 4) return { ...item, value: chosenSettings?.product };
        if (item?.id === 5) return { ...item, value: chosenSettings?.year };
        return item;
      })
    );
  }, [chosenSettings]);
  return (
    <>
      <TextWrapper>
        <p className={MAIN_TEXT_WRAPPER}>Purchases and sales over last year</p>
        <span className="text-grey-text">
          Month by month comparing purchases and sales Adjust the settings to
          get better analytics
        </span>
        <div className="flex gap-3">
          <div className="flex gap-2 items-center">
            <Indicator border="border-dark-beige" background="bg-light-beige" />
            <span className="text-grey-text">Sales</span>
          </div>
          <div className="flex gap-2 items-center">
            <Indicator />
            <span className="text-grey-text">Purchases</span>
          </div>
        </div>
        <GreyScaleButton
          onClick={handleChartsettings}
          height="h-10"
          text="Chart settings"
        />
      </TextWrapper>
      <TransitionWrapper isShow={openChartSettings}>
        <ChartModal
          onMainBtnClick={getInfo}
          modalTitle="Purchase and sales chart settings"
          isResetDefault
          onResetDefault={handleResetDefault}
          selectItems={selectItems}
          handleClose={handleChartsettings}
        />
      </TransitionWrapper>
      <div className={CHART_WRAPPER}>
        {isEmpty(dataSeries) ? (
          <Spinner />
        ) : (
          <Chart
            className="w-full"
            options={getChartState(
              true,
              "rgba(240, 164, 88, 0.40)",
              chosenSettings?.unitOfMeasurement?.label,
              chosenSettings?.year
            )}
            series={series}
            type="bar"
            height="100%"
          />
        )}
      </div>
    </>
  );
};
