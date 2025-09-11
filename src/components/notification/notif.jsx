import React, { useState } from "react";
import { ReactComponent as Cross } from "../../icons/cross.svg";
import { Button } from "../button";
import { useSelector } from "react-redux";
import { getCustomers, getStatus } from "../../store";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { fetchUserEdit } from "../../store/get-notif/fetch-notifs";
import { useGetInformationLoads } from "../../hooks/use-get-information";
import { CreateStaffModal } from "../modals/create-staff-modal";

export const Notif = ({ item }) => {
  const navigate = useNavigate();
  const { data: customers } = useSelector(getCustomers);
  const chosenCustomer = customers?.find(
    (customer) => customer?.id === item?.customer_id
  );
  const { userEdit } = useSelector(getStatus);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const handleModal = () => setOpenReviewModal(!openReviewModal);
  useGetInformationLoads({
    fetcher: fetchUserEdit,
    selector: getStatus,
    itemId: item?.identity,
  });
  const modalText = () => {
    switch (item?._type) {
      case "1":
        return {
          title: "Payment date reminder!",
          text: `Today is a Payment date for the load, don’t forget to accept the payment and set a new Payment date if needed.`,
          btn: "Go to the deal",
          onClick: () => navigate(`/sales/insider?id=${item?.customer_id}`),
        };
      case "2":
        return {
          title: "The client running out of stock!",
          text: `It has been 25 days since your last sale to ${chosenCustomer?.company_name}, don’t forget to make the call and make the next sale.`,
          btn: "Go to the customer",
          onClick: () => navigate(`/customers/insider?id=${item?.customer_id}`),
        };
      case "3":
        return {
          title: "The sales managers underperforming!",
          text: `${
            item?.identity?.split(",")?.length
          } of your sales managers are underperforming this month. Make sure they hit the goal or adjust the clients’ demands.`,
          btn: "Go to the sales performance",
          onClick: () => navigate(`/staff?type=performance`),
        };
      case "4":
        return {
          title: "Personal information edited!",
          text: `Your request to edit your personal information was approved by ${item?.director_id}`,
          btn: "Ok",
          onClick: () => {},
        };
      case "5":
        return {
          title: "Personal information changes request",
          text: `${item?.staff_name} is requesting personal information changes`,
          btn: "Review",
          onClick: () => handleModal(),
        };
      case "6":
        return {
          title: "Personal information edit declined!",
          text: `Your request to edit your personal information was declined by ${item?.director_id}. Please contact your management for details.`,
          btn: "Ok",
          onClick: () => {},
        };
      default:
        return "Edit";
    }
  };
  return (
    <>
      <div className="w-full flex flex-col gap-4 px-5 py-4 h-[242px] rounded-lg bg-pale-grey">
        <div className="w-full flex justify-between">
          <p className="font-semibold text-xl">{modalText()?.title}</p>
          {!item?._type === "5" && (
            <div className="cursor-pointer">
              <Cross />
            </div>
          )}
        </div>
        <p className="text-storm-grey">{modalText()?.text}</p>
        <p className="text-storm-grey text-sm">
          {format(new Date(item?.created_at), "PP, HH:mm a")}
        </p>
        <Button
          isSecondary
          width="w-[150px]"
          text={modalText()?.btn}
          onClick={modalText()?.onClick}
        />
      </div>
      {openReviewModal && (
        <CreateStaffModal
          isApproval={item?.identity}
          handleModal={handleModal}
          selectedItem={userEdit?.data}
        />
      )}
    </>
  );
};
