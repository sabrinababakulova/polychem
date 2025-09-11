import { useLocation } from "react-router-dom";

export const useGetDashboardHeader = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[1]?.split("-")?.join(" ");
  const additionalPath =
    location.pathname.split("/")?.[2]?.split("-")?.join(" ") || "";
  const secondPath = location.search.split("=")[1]?.split("-")?.join(" ") || "";
  if (secondPath) {
    if (additionalPath?.toLowerCase() === "insider")
      return {
        main: path + " - " + secondPath,
        addition: path?.toLowerCase()?.trim(),
      };
    else
      return {
        main: path + " " + additionalPath + " - " + secondPath,
        addition: additionalPath
          ? path?.toLowerCase()?.trim() +
            " " +
            additionalPath?.toLowerCase()?.trim()
          : path?.toLowerCase()?.trim(),
      };
  }
  if (!path) {
    return { main: "Dashboard", addition: "dashboard" };
  }
  return { main: path, addition: path?.toLowerCase()?.trim() };
};
