import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export const useGetRoleRestrictions = () => {
  const [restrictions, setRestrictions] = useState({});
  const role = Cookies.get("position");
  useEffect(() => {
    switch (role?.toLowerCase()) {
      case "director":
        setRestrictions({
          dashboard: [],
          sales: [],
          purchases: [],
          warehouse: [],
          wagons: [],
          manufacturers: [],
          products: [],
          "price analytics": [],
          "purchases loads": [],
          "sales loads": [],
          customers: [],
          staff: [],
          accounting: [],
          "action log": [],
        });
        break;
      case "shareholder":
        setRestrictions({
          dashboard: ["edit", "create", "delete"],
          purchases: ["edit", "create", "delete"],
          sales: ["edit", "create", "delete"],
          warehouse: ["edit", "create", "delete"],
          wagons: ["edit", "create", "delete"],
          manufacturers: ["edit", "create", "delete"],
          products: ["edit", "create", "delete"],
          "price analytics": ["edit", "create", "delete"],
          "purchases loads": ["edit", "create", "delete"],
          "sales loads": ["edit", "create", "delete"],
          customers: ["edit", "create", "delete"],
          staff: ["edit", "create", "delete"],
          accounting: ["edit", "create", "delete"],
          "action log": ["edit", "create", "delete"],
        });
        break;
      case "chief sales":
        setRestrictions({
          dashboard: ["edit", "create", "delete"],
          purchases: ["edit", "create", "delete"],
          "purchases loads": [],
          sales: [],
          "sales loads": [],
          warehouse: ["edit", "create", "delete"],
          wagons: [],
          customers: [],
          manufacturers: [],
          products: [],
          "price analytics": [],
          staff: ["edit", "create", "delete"],
          accounting: [],
          "action log": ["edit", "create", "delete"],
        });
        break;
      case "salesperson":
        setRestrictions({
          dashboard: [
            "PurchaseSale",
            "SalesDynamics",
            "PurchaseAnalytics",
            "PriceAnalytics",
            "map",
          ],
          purchases: ["edit", "create", "delete"],
          "purchases loads": ["edit", "create", "delete"],
          sales: ["edit", "delete"],
          "sales loads": ["edit", "delete"],
          warehouse: ["edit", "create", "delete"],
          wagons: ["edit", "delete"],
          customers: [],
          manufacturers: ["delete"],
          products: ["edit", "create", "delete"],
          "price analytics": ["edit", "create", "delete"],
          staff: ["edit", "create", "delete"],
          accounting: ["edit", "create", "delete"],
          "action log": ["edit", "create", "delete"],
        });
        break;
      case "accountant":
        setRestrictions({
          dashboard: ["edit", "create", "delete"],
          purchases: ["edit", "create", "delete"],
          sales: ["edit", "create", "delete"],
          warehouse: ["edit", "create", "delete"],
          wagons: ["edit", "create", "delete"],
          manufacturers: ["edit", "create", "delete"],
          products: ["edit", "create", "delete"],
          "price analytics": ["edit", "create", "delete"],
          "purchases loads": ["edit", "create", "delete"],
          "sales loads": ["edit", "create", "delete"],
          customers: ["edit", "create", "delete"],
          staff: ["edit", "create", "delete"],
          accounting: [],
          "action log": ["edit", "create", "delete"],
        });
        break;
      case "price analyst":
        setRestrictions({
          dashboard: ["edit", "create", "delete"],
          purchases: ["edit", "create", "delete"],
          sales: ["edit", "create", "delete"],
          warehouse: ["edit", "create", "delete"],
          wagons: ["edit", "create", "delete"],
          manufacturers: ["edit", "create", "delete"],
          products: [],
          "price analytics": ["edit", "create", "delete"],
          "purchases loads": ["edit", "create", "delete"],
          "sales loads": ["edit", "create", "delete"],
          customers: ["edit", "create", "delete"],
          staff: ["edit", "create", "delete"],
          accounting: false,
          "action log": ["edit", "create", "delete"],
        });
        break;
      case "logistics manager":
        setRestrictions({
          dashboard: false,
          purchases: ["edit", "create", "delete"],
          "purchases loads": [],
          sales: ["edit", "create", "delete"],
          "sales loads": [],
          warehouse: ["edit", "create", "delete"],
          wagons: [],
          customers: ["edit", "create", "delete", "insider"],
          manufacturers: ["edit", "create", "delete", "insider"],
          products: ["edit", "create", "delete"],
          "price analytics": false,
          staff: ["edit", "create", "delete"],
          accounting: false,
          "action log": false,
        });
        break;
      default:
        setRestrictions({});
        break;
    }
  }, [role]);
  return restrictions;
};
