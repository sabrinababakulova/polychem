import React, { useState } from "react";
import avatar from "../assets/user-solid.png";
import { PopUp } from "./pop-up";
import { ReactComponent as AvatarIcon } from "../icons/avatar.svg";
import { ReactComponent as Logout } from "../icons/logout.svg";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../store/isAuth";
import { DeleteModal } from "./modals/delete-modal";
import { getStaff } from "../store";
import {
  TransitionWrapper,
  TransitionWrapperPopup,
} from "./modals/transition-wrapper";

export const Avatar = ({ isSmall, isAction, photo, isOwnUser }) => {
  const { data: staff } = useSelector(getStaff);
  const userId = Cookies.get("userId");
  const chosenEmployee = staff?.find((item) => item?.id === Number(userId));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const handleOpenMenu = () => isAction && setIsMenuOpen(!isMenuOpen);
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    Cookies.remove("position");
    Cookies.remove("start_time");
    Cookies.remove("worked_time_difference");
    navigate("/login");
    dispatch(removeUser());
  };
  const popupItems = [
    {
      id: 1,
      text: "My Profile",
      icon: <AvatarIcon />,
      onClick: () => navigate("/profile"),
    },
    {
      id: 3,
      className: "text-red-500",
      text: "Log out",
      icon: <Logout />,
      onClick: () => setOpenConfirmationModal(true),
    },
  ];
  return (
    <div
      className={`relative ${
        isSmall ? "max-w-[48px] max-h-[48px]" : "max-w-[96px] max-h-[96px]"
      }`}
    >
      <div
        onClick={handleOpenMenu}
        className="cursor-pointer rounded-full overflow-hidden"
      >
        <img
          src={isOwnUser ? chosenEmployee?.logo : photo || avatar}
          alt="avatar"
          className={isSmall ? "w-[48px] h-[48px]" : "w-[96px] h-[85px]"}
        />
      </div>
      <TransitionWrapperPopup isShow={isMenuOpen}>
        <PopUp onClose={handleOpenMenu} items={popupItems} />
      </TransitionWrapperPopup>
      <TransitionWrapper isShow={openConfirmationModal}>
        <DeleteModal
          onDelete={handleLogout}
          onCancel={() => setOpenConfirmationModal(false)}
          mainTitle="Are you sure you want to log out?"
          subTitle=" "
          secondaryBtnText="Yes, log out"
        />
      </TransitionWrapper>
    </div>
  );
};
