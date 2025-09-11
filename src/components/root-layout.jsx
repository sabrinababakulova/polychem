import React, { useEffect, useState } from "react";
import { Header } from "./headers/header";
import { Outlet, useNavigate } from "react-router-dom";
import { SideMenu } from "./side-menu";
import Cookies from "js-cookie";
import {
  useGetCategoryInformation,
  useGetInformation,
  useGetSubcategoryInformation,
} from "../hooks/use-get-information";
import {
  getCategories,
  getCountries,
  getCustomers,
  getManufacturers,
  getProducts,
  getPurchases,
  getSales,
  getStaff,
  getStatus,
  getWorkingTime,
} from "../store";
import { fetchManufacturer } from "../store/get-manufacturer/fetch-manufacturer";
import { fetchProduct } from "../store/products/fetch-products";
import {
  fetchCategory,
  fetchSubcategory,
} from "../store/categories/fetch-categories";
import { fetchCustomers } from "../store/customers/fetch-customers";
import { Notification } from "./notification";
import { Spinner } from "./spinner";
import { useGetRoleRestrictions } from "../hooks/use-get-role-acess";
import { TopStatus } from "./top-status";
import { fetchCountry } from "../store/get-countries/fetch-countries";
import { fetchSales } from "../store/sales/fetch-sales";
import { fetchPurchase } from "../store/get-purchase/fetch-purchase";
import { fetchMeetings } from "../store/working-time/fetch-meetings";
import { fetchNotifs } from "../store/get-notif/fetch-notifs";
import { fetchStaff } from "../store/staff/fetch-staff";
import { TransitionWrapperMenu } from "./modals/transition-wrapper";

export const RootLayout = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const handleNotificationClick = () =>
    setIsNotificationOpen(!isNotificationOpen);

  const token = Cookies.get("token");
  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { fetched: notifsFetched } = useGetInformation({
    selector: getStatus,
    fetcher: fetchNotifs,
  });
  const { fetched: meetingsFetched } = useGetInformation({
    selector: getWorkingTime,
    fetcher: fetchMeetings,
  });
  const { fetched: productsFetched } = useGetInformation({
    selector: getProducts,
    fetcher: fetchProduct,
  });
  const { fetched: purchaseFetched } = useGetInformation({
    selector: getPurchases,
    fetcher: fetchPurchase,
    secondfetch: productsFetched,
  });
  const { fetched: salesFetched } = useGetInformation({
    selector: getSales,
    fetcher: fetchSales,
    secondfetch: meetingsFetched,
    thirdFetch: purchaseFetched,
  });
  const {fetched: customersFetched} = useGetInformation({
    selector: getCustomers,
    fetcher: fetchCustomers,
    secondfetch: salesFetched,
  });
  useGetInformation({
    selector: getCountries,
    fetcher: fetchCountry,
  });
  useGetInformation({
    selector: getStaff,
    fetcher: fetchStaff,
    secondfetch: customersFetched,
  });
  useGetCategoryInformation({
    selector: getCategories,
    fetcher: fetchCategory,
  });
  useGetSubcategoryInformation({
    selector: getCategories,
    fetcher: fetchSubcategory,
  });
  useGetInformation({
    selector: getManufacturers,
    fetcher: fetchManufacturer,
    secondfetch: purchaseFetched,
  });

  useEffect(() => {
    if (!token) navigate("/login");
  }, [navigate, token]);

  const restrictions = useGetRoleRestrictions();

  return (
    <div className="flex relative w-full">
      <TopStatus />
      <Header
        isFetched={notifsFetched}
        onNotification={handleNotificationClick}
        handleMenu={handleMenuClick}
        isMenuOpen={isMenuOpen}
      />
      {!notifsFetched ? (
        <Spinner />
      ) : (
        <>
          <TransitionWrapperMenu isShow={isMenuOpen}>
            <SideMenu
              restrictions={restrictions}
              handleMenu={handleMenuClick}
            />
          </TransitionWrapperMenu>
          <div
            className={` ${
              isMenuOpen ? "lg:ml-72" : ""
            } my-0 w-full py-0 px-10 relative`}
          >
            <div className="lg:pt-28 pt-40">
              <Outlet />
            </div>
          </div>
          <TransitionWrapperMenu isShow={isNotificationOpen} isRightToLeft>
            <Notification onCancel={handleNotificationClick} />
          </TransitionWrapperMenu>
        </>
      )}
    </div>
  );
};
