import { memo, useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { TextWrapper } from "./text-wrapper";
import { MAIN_TEXT_WRAPPER } from "./charts-classnames";
import { authorizationAPI } from "../../constants/api";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../store/get-notif";
import { getCountries } from "../../store";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Spinner } from "../spinner";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = () => {
  const { fetched: countriesFetched, data: countries } =
    useSelector(getCountries);
  const dispatch = useDispatch();
  const [dataSeries, setDataSeries] = useState([]);
  const getInfo = async () => {
    await authorizationAPI
      .get(`api/country-count`)
      .catch((e) => {
        dispatch(
          setError(
            e?.response?.data?.[0] || `${e.message} from ${e?.config?.url}`
          )
        );
      })
      .then((res) => {
        if (res?.data) {
          Object.entries(res?.data)?.forEach(([key, value]) => {
            const existingCountry = countries?.find(
              (each) => each?.name === key
            );
            if (existingCountry) {
              setDataSeries((prev) => [
                ...prev,
                {
                  name: existingCountry?.name,
                  coordinates: [
                    existingCountry?.longitude,
                    existingCountry?.latitude,
                  ],
                  ...value,
                },
              ]);
            }
          });
        }
      });
  };

  useEffect(() => {
    if (countriesFetched) {
      getInfo();
    }
  }, [countriesFetched]);

  return (
    <>
      <div className="hidden lg:flex gap-24 mb-32">
        <TextWrapper className="ml-[60px]">
          <p className={MAIN_TEXT_WRAPPER}>
            Worldwide data by countries <br />
          </p>
          <span className="text-grey-text">
            Top deals, top manufacturers, top customers and other country by
            data on the map
          </span>
          {/* <GreyScaleButton
            // onClick={handleChartSettings}
            height="h-10"
            text="Map settings"
          /> */}
        </TextWrapper>
        <div className="w-full">
          {!countriesFetched || dataSeries?.length === 0 ? (
            <Spinner />
          ) : (
            <>
              <ComposableMap
                className="max-h-[700px] w-full"
                projection="geoMercator"
              >
                <ZoomableGroup
                  center={dataSeries?.[0]?.coordinates}
                  zoom={1}
                  minZoom={1}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          className="pointer-events-none"
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#F8F8FD"
                          stroke="#A9A7E8"
                        />
                      ))
                    }
                  </Geographies>
                  {dataSeries?.map(
                    ({
                      name,
                      coordinates,
                      customer_count,
                      manufacturer_count,
                      total_purchases,
                      total_sales,
                    }) => (
                      <Marker
                        data-tooltip-id="marker"
                        data-tooltip-content={`${name}
                  \nTotal purchases: ${Number(total_purchases).toFixed(2)}
                  \nCustomers: ${Number(customer_count).toFixed(2)}
                  \nManufacturers: ${Number(manufacturer_count).toFixed(2)}
                  \nTotal sales: ${Number(total_sales).toFixed(2)}`}
                        key={name}
                        coordinates={coordinates}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <g filter="url(#filter0_d_1067_21590)">
                            <circle cx="9" cy="8" r="4" fill="white" />
                            <circle
                              cx="9"
                              cy="8"
                              r="4"
                              stroke="#F0A458"
                              strokeWidth="2"
                            />
                          </g>
                          <defs>
                            <filter
                              id="filter0_d_1067_21590"
                              x="0"
                              y="0"
                              width="18"
                              height="18"
                              filterUnits="userSpaceOnUse"
                              colorInterpolationFilters="sRGB"
                            >
                              <feFlood
                                floodOpacity="0"
                                result="BackgroundImageFix"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                              />
                              <feOffset dy="1" />
                              <feGaussianBlur stdDeviation="2" />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0.941176 0 0 0 0 0.643137 0 0 0 0 0.345098 0 0 0 0.2 0"
                              />
                              <feBlend
                                mode="normal"
                                in2="BackgroundImageFix"
                                result="effect1_dropShadow_1067_21590"
                              />
                              <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="effect1_dropShadow_1067_21590"
                                result="shape"
                              />
                            </filter>
                          </defs>
                        </svg>
                      </Marker>
                    )
                  )}
                </ZoomableGroup>
              </ComposableMap>
            </>
          )}
        </div>
      </div>
      <ReactTooltip
        style={{
          backgroundColor: "#F0A458",
          color: "#6F6CD9",
          whiteSpace: "pre-wrap",
        }}
        id="marker"
      />
    </>
  );
};

export default memo(WorldMap);
