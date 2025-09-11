import React, { useEffect, useState } from "react";
import { ReactComponent as Menu } from "../../icons/menu.svg";
import { ReactComponent as Bell } from "../../icons/bell.svg";
import { ReactComponent as FullArrow } from "../../icons/full-arrow.svg";
import { Button } from "../button";
import { Avatar } from "../avatar";
import { HeaderWrapper } from "./header-wrapper";
import { CreatePurchaseModal } from "../modals/create-purchase-modal";
import { CreateSellModal } from "../modals/create-sell-modal";
import { useGetDashboardHeader } from "../../hooks/use-get-dashboard-header";
import { MOBILE_WIDTH } from "../../constants";
import { useGetRoleRestrictions } from "../../hooks/use-get-role-acess";
import { TransitionWrapper } from "../modals/transition-wrapper";
import { useSelector } from "react-redux";
import { getWorkingTime } from "../../store";
import { format } from "date-fns";
import { Modal } from "../modals/modal";

export const Header = ({
  handleMenu,
  isMenuOpen,
  onNotification,
  isFetched,
}) => {
  const [openPurchase, setOpenPurchase] = useState(false);
  const [openSell, setOpenSell] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState({});
  const handleOpenPurchase = () => isFetched && setOpenPurchase(!openPurchase);
  const handleOpenSell = () => isFetched && setOpenSell(!openSell);
  const { main: dashboardHeader } = useGetDashboardHeader();
  const { meetings } = useSelector(getWorkingTime);
  const restrictions = useGetRoleRestrictions();
  const isCreatePurchaseRestricted =
    restrictions.purchases !== false &&
    restrictions.purchases?.includes("create");
  const isCreateSellRestricted =
    restrictions.sales !== false && restrictions.sales?.includes("create");

  useEffect(() => {
    const currentMeetings = meetings?.filter(
      (meeting) =>
        meeting.start_time === format(new Date(), "yyyy-MM-dd HH:mm:00"),
    );
    if (currentMeetings?.length !== 0) {
      setMeetingDetails(currentMeetings[0]);
    }
  }, [new Date().getMinutes(), meetings]);
  return (
    <>
      {meetingDetails?.meeting_with && (
        <Modal
          title={`Don’t forget to call ${meetingDetails?.meeting_with}!`}
          closeBtn={() => setMeetingDetails({})}
        />
      )}
      <div
        className={`bg-white transition-[width] ${
          isMenuOpen ? "lg:w-[calc(100vw-18rem)]" : "w-screen"
        } fixed top-0 right-0 px-10 z-10`}
      >
        <HeaderWrapper>
          <div className="flex gap-6 text-2xl	items-center">
            {isMenuOpen ? (
              <FullArrow className="cursor-pointer" onClick={handleMenu} />
            ) : (
              <Menu className="cursor-pointer" onClick={handleMenu} />
            )}
            <p className="hidden lg:block capitalize">{dashboardHeader}</p>
          </div>
          <div className="flex gap-3">
            {window.innerWidth > MOBILE_WIDTH && (
              <>
                <Button
                  isRestricted={isCreatePurchaseRestricted}
                  isSecondary
                  text="Purchase"
                  onClick={handleOpenPurchase}
                />
                <Button
                  isRestricted={isCreateSellRestricted}
                  isSecondary
                  text="Sell"
                  onClick={handleOpenSell}
                />
              </>
            )}
            <Button
              onClick={onNotification}
              isSecondary
              isSmall
              text={<Bell />}
            />
            <Avatar isOwnUser isAction isSmall />
          </div>
        </HeaderWrapper>
        <hr />
        {window.innerWidth <= MOBILE_WIDTH && (
          <>
            <div className="capitalize font-bold h-12 flex items-center">
              {dashboardHeader}
            </div>
            <hr />
          </>
        )}
        <TransitionWrapper isShow={openPurchase}>
          <CreatePurchaseModal handleOpenPurchase={handleOpenPurchase} />
        </TransitionWrapper>
        <TransitionWrapper isShow={openSell}>
          <CreateSellModal handleOpenSell={handleOpenSell} />
        </TransitionWrapper>
      </div>
    </>
  );
};
