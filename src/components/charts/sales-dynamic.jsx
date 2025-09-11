import React, { useEffect, useState } from "react";
import { GreyScaleButton } from "../button";
import { CHART_WRAPPER, MAIN_TEXT_WRAPPER } from "./charts-classnames";
import { TextWrapper } from "./text-wrapper";
import { ChartModal } from "../modals/charts-modal";
import Chart from "react-apexcharts";
import { getChartState } from "./utils/get-chart-state";
import {
  getCategories,
  getCountries,
  getProducts,
  getStaff,
} from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { authorizationAPI } from "../../constants/api";
import { setError } from "../../store/get-notif";
import { TransitionWrapper } from "../modals/transition-wrapper";
import { isEmpty } from "lodash";
import { Spinner } from "../spinner";

export const Dynamics = ({ isPurchase }) => {
  const dispatch = useDispatch();
  const [openChartSettings, setOpenChartSettings] = useState(false);
  const [dataSeries, setDataSeries] = useState([]);
  const { categories, subcategories } = useSelector(getCategories);
  const { data: products } = useSelector(getProducts);
  const { data: countries } = useSelector(getCountries);
  const { data: staff } = useSelector(getStaff);
  const defaultSettings = {
    unitOfMeasurement: { label: "USD", value: "price" },
    category: { label: "All categories" },
    subcategory: { label: "All subcategories" },
    product: { label: "All products" },
    year: new Date().getFullYear(),
    country: { label: "All countries" },
    salesperson: { label: "All salespersons" },
    linesAre: { label: "Products", value: 1 },
  };
  const [chosenSettings, setChosenSettings] = useState(defaultSettings);
  const handleResetDefault = () => {
    setChosenSettings(defaultSettings);
    handleChartsettings();
  };
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
    chosenSettings?.salesperson?.value &&
      urlQuery.append("sales_person_id", chosenSettings?.salesperson?.value);
    chosenSettings?.country?.value &&
      urlQuery.append("country_id", chosenSettings?.country?.value);
    await authorizationAPI
      .get(
        `api/purchase-sale?${urlQuery?.toString()}&model=${
          isPurchase ? "purchase" : "sale"
        }`
      )
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
  const [selectItems, setSelectItems] = useState([
    {
      id: 1,
      label: "Unit of measurement",
      value: chosenSettings.unitOfMeasurement,
      settingKey: "unitOfMeasurement",
      items: [
        { name: "USD", id: "price" },
        { name: "Tons", id: "quantity" },
      ],
      onChange: (e) =>
        setChosenSettings((prev) => ({ ...prev, unitOfMeasurement: e })),
    },
    {
      id: 2,
      label: "Salesperson",
      settingKey: "salesperson",
      value: chosenSettings.salesperson,
      onChange: (e) =>
        setChosenSettings((prev) => ({ ...prev, salesperson: e })),
      items:
        staff
          ?.filter(
            (item) =>
              item?.position?.toLowerCase() === "salesperson" ||
              item?.position?.toLowerCase() === "director"
          )
          ?.map((item) => ({
            name: `${item?.first_name} ${item?.last_name}`,
            id: item?.id,
          })) || [],
    },
    {
      id: 3,
      label: "Country",
      settingKey: "country",
      items: countries,
      value: chosenSettings.country,
      placeholder: "Enter and pick a country",
      onChange: (e) => setChosenSettings((prev) => ({ ...prev, country: e })),
    },
    {
      id: 4,
      label: "Year",
      settingKey: "year",
      isInput: true,
      placeholder: "Enter a year",
      value: chosenSettings.year,
      onChange: (e) =>
        setChosenSettings((prev) => ({ ...prev, year: e?.target?.value })),
    },
    {
      id: 5,
      label: "Lines are",
      settingKey: "linesAre",
      items: [
        { id: 1, name: "Products" },
        { id: 2, name: "Categories" },
        { id: 3, name: "Subcategories" },
      ],
      value: chosenSettings.linesAre,
      onChange: (e) => setChosenSettings((prev) => ({ ...prev, linesAre: e })),
    },
  ]);

  const series = [
    {
      name: isPurchase ? "Purchases" : "Sales",
      data: isPurchase ? dataSeries?.purchases : dataSeries?.sales,
    },
  ];

  useEffect(() => {
    if (chosenSettings?.linesAre?.value === 1) {
      setSelectItems((prev) => {
        prev[5] = {
          id: 6,
          label: "Products",
          settingKey: "product",
          items: products,
          value: chosenSettings.product,
          placeholder: "Enter and pick a product",
          onChange: (e) =>
            setChosenSettings((prev) => ({ ...prev, product: e })),
        };
        return [...prev];
      });
    }
    if (chosenSettings?.linesAre?.value === 2) {
      setSelectItems((prev) => {
        prev[5] = {
          id: 6,
          label: "Categories",
          settingKey: "category",
          items: categories,
          value: chosenSettings.category,
          placeholder: "Enter and pick a category",
          onChange: (e) =>
            setChosenSettings((prev) => ({ ...prev, category: e })),
        };
        return [...prev];
      });
    }
    if (chosenSettings?.linesAre?.value === 3) {
      setSelectItems((prev) => {
        prev[5] = {
          id: 6,
          label: "Subcategories",
          settingKey: "subcategory",
          items: subcategories,
          value: chosenSettings.subcategory,
          placeholder: "Enter and pick a subcategory",
          onChange: (e) =>
            setChosenSettings((prev) => ({ ...prev, subcategory: e })),
        };
        return [...prev];
      });
    }
  }, [chosenSettings.linesAre]);

  useEffect(() => {
    setSelectItems((prev) =>
      prev.map((item) => ({ ...item, value: chosenSettings[item.settingKey] }))
    );
  }, [chosenSettings]);

  useEffect(() => {
    if (isPurchase) {
      setSelectItems((prev) => {
        prev?.splice(1, 1);
        return [...prev];
      });
    }
  }, [isPurchase]);
  return (
    <>
      <TextWrapper>
        <p className={MAIN_TEXT_WRAPPER}>
          {isPurchase ? "Purchase dynamic" : "Sales dynamic"}
        </p>
        <span className="text-grey-text">
          {isPurchase
            ? "Month by month purchases line chart dynamic Adjust the settings to get better analytics"
            : " Month by month sales line chart dynamic Adjust the settings to get better analytics"}
        </span>
        <GreyScaleButton
          onClick={handleChartsettings}
          height="h-10"
          text="Chart Settings"
        />
      </TextWrapper>
      <TransitionWrapper isShow={openChartSettings}>
        <ChartModal
          modalTitle={
            isPurchase
              ? "Purchase dynamic chart settings"
              : "Sales dynamic chart settings"
          }
          // isAddLine
          onMainBtnClick={getInfo}
          onResetDefault={handleResetDefault}
          isResetDefault
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
              false,
              isPurchase ? "#0B829B" : "#F0A458",
              chosenSettings?.unitOfMeasurement?.label
            )}
            series={series}
            type="line"
            height="100%"
          />
        )}
      </div>
    </>
  );
};
