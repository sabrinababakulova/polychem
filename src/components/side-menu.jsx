import React, { Fragment, useState } from "react";
import Polychem from "../assets/polychem.png";
import { Link, useNavigate } from "react-router-dom";
import { MENU_ITEMS } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../store/chosen-page";
import { getPageInfo } from "../store";

export const SideMenu = ({ handleMenu, restrictions }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuItemChosen, setIsMenuItemChosen] = useState(false);
  const { chosenPage } = useSelector(getPageInfo);

  const isDashboardRestricted = restrictions?.dashboard;
  const navigateToMainPage = () => navigate("/");
  const isPriceAnalyticsRestricted = restrictions?.["price analytics"];
  const isAccountingRestricted = restrictions?.accounting;
  const isActionLogRestricted = restrictions?.["action log"];

  const getDisabledClass = (name) => {
    if (
      (name === "Dashboard" && isDashboardRestricted === false) ||
      (name === "Price Analytics" && isPriceAnalyticsRestricted === false) ||
      (name === "Accounting and Balance" && isAccountingRestricted === false) ||
      (name === "Actions Log" && isActionLogRestricted === false)
    )
      return "cursor-not-allowed opacity-50 pointer-events-none";
    return "cursor-pointer";
  };

  const setChosenPage = (link) => {
    handleMenu();
    dispatch(setPage({ page: link }));
  };

  const toggleMenu = (id) => {
    id !== isMenuItemChosen
      ? setIsMenuItemChosen(id)
      : setIsMenuItemChosen(false);
  };

  return (
    <div
      className="min-h-screen w-full
    lg:w-auto z-10 border-grey-border
    border bg-white absolute lg:fixed
    "
    >
      <div
        className={`${
          isDashboardRestricted === false ? "pointer-events-none" : ""
        } flex items-center pt-6 pb-8 px-6
        cursor-pointer`}
        onClick={navigateToMainPage}
      >
        <img src={Polychem} alt="logo" />
      </div>
      <div className="flex flex-col w-full lg:w-72">
        {MENU_ITEMS.map((item) => (
          <Fragment key={item?.id}>
            {item?.sideIcon ? (
              <div
                onClick={() => toggleMenu(item?.id)}
                className={`flex px-6
                 ${getDisabledClass(item?.name)}
                  justify-between h-10 items-center ${
                    item?.name === chosenPage?.split(" - ")[0]
                      ? "bg-pale-grey shadow-open-state"
                      : ""
                  }`}
              >
                <p className="flex gap-3">
                  {item.icon}
                  {item.name}
                </p>
                <div
                  className={`flex justify-center items-center ${
                    isMenuItemChosen === item?.id ? "rotate-180" : ""
                  }`}
                >
                  {item?.sideIcon}
                </div>
              </div>
            ) : (
              <Link
                onClick={() => setChosenPage(item?.name)}
                to={item.link}
                className={`px-6 flex items-center gap-3 h-10 
                ${getDisabledClass(item?.name)} 
                ${
                  item?.name === chosenPage
                    ? "bg-pale-grey shadow-open-state"
                    : ""
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            )}
            {isMenuItemChosen === item?.id && item?.children && (
              <div className="flex bg-pale-purple flex-col">
                {item?.children?.map((subItem) => (
                  <Link
                    onClick={() =>
                      setChosenPage(item?.name + " - " + subItem?.name)
                    }
                    to={subItem?.link}
                    key={subItem?.id}
                    className={`flex h-10
                    justify-center flex-col
                    gap-3 pl-[60px] pr-6
                    hover:bg-dawn-pink
                    hover:shadow-open-state-border
                    `}
                  >
                    {subItem?.name}
                  </Link>
                ))}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
