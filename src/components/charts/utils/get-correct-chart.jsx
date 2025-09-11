import { Dynamics } from "../sales-dynamic";
import { PriceAnalytics } from "../price-analytics";
import { SalesPercentage } from "../sales-percentage";
import { PurchaseSale } from "../purchase-sale";

export const getCorrectChart = (chartName) => {
  switch (chartName) {
    case "PurchaseSale":
      return <PurchaseSale />;
    case "SalesDynamics":
      return <Dynamics />;
    case "PurchaseAnalytics":
      return <Dynamics isPurchase />;
    case "PriceAnalytics":
      return <PriceAnalytics />;
    case "SalesPercentage":
      return <SalesPercentage />;
    default:
      return 0;
  }
};
