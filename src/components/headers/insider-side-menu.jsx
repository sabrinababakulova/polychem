import React, { useEffect, useState } from "react";
import { Button, RedButton } from "../button";
import { ReactComponent as Trash } from "../../icons/trash.svg";
import { ReactComponent as Edit } from "../../icons/edit.svg";
import { DeleteModal } from "../modals/delete-modal";
import { Avatar } from "../avatar";
import { useLocation } from "react-router-dom";
import { useGetDashboardHeader } from "../../hooks/use-get-dashboard-header";
import { useGetRoleRestrictions } from "../../hooks/use-get-role-acess";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { TransitionWrapper } from "../modals/transition-wrapper";

export const InsiderSideMenu = ({
  headersInfo,
  onDelete,
  editItem,
  userPfp,
}) => {
  const location = useLocation();
  const isEmployee =
    location.pathname?.match("staff") || location.pathname?.match("profile");
  const userPosition = Cookies?.get("position");
  const { addition } = useGetDashboardHeader();
  const restrictions = useGetRoleRestrictions();
  const isDeleteRestricted = restrictions[addition]?.includes("delete");
  const isEditRestricted = restrictions[addition]?.includes("edit");
  const [openModal, setOpenModal] = useState(false);
  const [adaptedHeaders, setAdaptedHeaders] = useState([]);

  const handleOpenModal = () => setOpenModal(!openModal);

  const handleDelete = () => {
    setOpenModal(false);
    onDelete();
  };

  useEffect(() => {
    setAdaptedHeaders(
      Object?.entries(headersInfo)
        ?.map(([key, value]) => ({
          key,
          value,
        }))
        ?.filter((item) => item?.key !== "id" && item?.key !== "pis")
    );
  }, [headersInfo]);

  return (
    <>
      <div className="max-w-[400px] w-full pr-12 flex flex-col justify-between min-h-[720px] border-r h-full">
        <div className="flex flex-col gap-10">
          <div
            className={`${
              isEmployee && "flex gap-6 items-center"
            } h-[100px] flex items-center border-b`}
          >
            {isEmployee && <Avatar photo={userPfp} />}
            <div>
              <h2 className={`font-semibold text-2xl uppercase `}>
                {adaptedHeaders?.[0]?.value || " - "}
              </h2>
              {isEmployee && (
                <span className="text-grey-text">
                  {adaptedHeaders?.find((item) => item?.key === "position")
                    ?.value || ""}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {adaptedHeaders?.map((item, index) => (
              <div
                className={`flex ${
                  item?.key?.includes("mail") ? "" : "capitalize"
                } gap-6`}
                key={index}
              >
                <p className="min-w-[150px] break-words font-semibold text-storm-grey">
                  {item?.key || " - "}
                </p>
                <p className="min-w-[150px] max-w-[150px] break-words text-left">
                  {/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(item?.value)
                    ? format(new Date(item?.value), "dd.MM, HH:mm a")
                    : item?.value || " - "}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 mt-10">
          <Button
            isRestricted={isEditRestricted}
            isSecondary
            isFull
            onClick={editItem}
            icon={<Edit />}
            text={
              location.pathname?.match("profile") &&
              userPosition?.toLowerCase() !== "director"
                ? "Request to edit info"
                : "Edit info"
            }
          />
          {!location?.pathname?.match("profile") && (
            <RedButton
              isRestricted={isDeleteRestricted}
              onClick={handleOpenModal}
              text={<Trash />}
            />
          )}
        </div>
        <TransitionWrapper isShow={openModal}>
          <DeleteModal onCancel={handleOpenModal} onDelete={handleDelete} />
        </TransitionWrapper>
      </div>
    </>
  );
};
