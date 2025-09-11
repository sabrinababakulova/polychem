import React, { useEffect } from "react";
import { DropZone } from "../components/dropzone";
import { MainWrapper } from "../components/charts/main-wrapper";
import { getCharts } from "../store";
import { useSelector } from "react-redux";
import { getCorrectChart } from "../components/charts/utils/get-correct-chart";
import { WorkedAmount } from "../components/charts/utils/worked-amount";
import { useGetRoleRestrictions } from "../hooks/use-get-role-acess";
import { useNavigate } from "react-router-dom";
import WorldMap from "../components/charts/world-map";

const Dashboard = () => {
  const { charts } = useSelector(getCharts);
  const navigate = useNavigate();
  const restrictions = useGetRoleRestrictions();

  useEffect(() => {
    const isPageRestricted = restrictions?.dashboard;
    if (typeof isPageRestricted === "boolean" && isPageRestricted === false)
      navigate("/purchases");
  }, [restrictions, navigate]);
  return (
    <>
      <div className="hidden lg:flex flex-col gap-5 pb-10">
        {charts?.map((item, index) => !restrictions?.dashboard?.includes(item?.chart) && (
          <div key={item?.id}>
            <DropZone itemId={item?.id} index={index} chartName={item?.chart} />
            <MainWrapper index={index} chart={item}>
              {getCorrectChart(item?.chart)}
            </MainWrapper>
          </div>
        ))}
        <DropZone isLast index={charts?.length} />
      </div>
      <div className="lg:hidden block">
        <WorkedAmount />
      </div>
    {!restrictions?.dashboard?.includes("map") &&
      <WorldMap />
    }
    </>
  );
};

export default Dashboard;
