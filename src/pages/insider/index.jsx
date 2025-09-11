import React, { useEffect, useState } from "react";
import { useGetCorrectTableHeaders } from "../../hooks/use-get-correct-table-headers";
import { InsiderSideMenu } from "../../components/headers/insider-side-menu";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import noLoadsImage from "../../assets/NoLoads.png";
import Cookies from "js-cookie";
import {
  useGetInformation,
  useGetInformationLoads,
} from "../../hooks/use-get-information";
import { Button } from "../../components/button";
import { CreateLoadModal } from "../../components/modals/create-load-modal";
import { Table } from "../../components/table";
import {
  ACCOUNTING_TABLE_HEADERS,
  ACTIVE_DEALS_MANUFACTURER_TABLE_HEADERS,
  ACTIVE_DEALS_TABLE_HEADERS,
  CUSTOMERS_TABLE_HEADERS,
  DEMAND_PRODUCTS_HEADER,
  HISTORY_TABLE_HEADERS,
  INSIDER_LOADS_PURCHASE,
  PRICE_ANALYTICS_HEADER,
  WAGON_LOADS_HEADERS,
} from "../../constants";
import { EditLoadModal } from "../../components/modals/edit-load";
import { fetchWagon } from "../../store/wagons/fetch-wagons";
import { getWagons } from "../../store";
import { AddFileModal } from "../../components/modals/add-file-modal";
import FileHolder from "../../components/file-holder";
import { fetchAdditionalCost as fetchPurchaseCost } from "../../store/get-purchase/fetch-additional-cost";
import { fetchAdditionalCost as fetchSaleCost } from "../../store/sales/fetch-additional-cost";
import { isEmpty } from "lodash";
import { Input } from "../../components/input";
import { CreateCostseModal } from "../../components/modals/additional-cost-modal";
import { deletePurchaseLoad } from "../../store/get-purchase/delete-loads";
import { Spinner } from "../../components/spinner";
import { useGetRoleRestrictions } from "../../hooks/use-get-role-acess";
import { Scheduler } from "../../components/scheduler";
import { AddMeeting } from "../../components/modals/add-meeting";
import { CreateSellModal } from "../../components/modals/create-sell-modal";
import { CreatePurchaseModal } from "../../components/modals/create-purchase-modal";
import { CreateDemandModal } from "../../components/modals/add-demand-product";
import { CreateProductPrice } from "../../components/modals/update-product-price";
import { deleteProductPrice } from "../../store/products/delete-price-analytics";
import { format } from "date-fns";
import { Avatar } from "../../components/avatar";
import { AddNoteModal } from "../../components/modals/add-note";
import { deleteSaleLoad } from "../../store/sales/delete-load";
import { TransitionWrapper } from "../../components/modals/transition-wrapper";
import { fetchSalesPaid } from "../../store/sales/fetch-paid";

const Insider = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [mainInfo, setMainInfo] = useState({});
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddMeeting, setOpenAddMeeting] = useState(false);

  const handleModal = (name) => setOpenCreateModal(name);
  const handleCloseModal = () => setOpenCreateModal(false);
  const handleEditModal = () => setOpenEditModal(!openEditModal);
  const itemId = location?.search?.split("=")[1];
  const {
    headers,
    menu,
    menuBtn,
    loads,
    editModal,
    selector,
    onDelete,
    prevPage,
    fileUploader,
    type,
    noLoads,
    noDeals,
    noDocs,
    historyFetcher,
  } = useGetCorrectTableHeaders({
    onEdit: handleEditModal,
    selectedItem: mainInfo,
  });
  useGetInformationLoads({ selector, fetcher: loads });
  useGetInformationLoads({ selector, fetcher: historyFetcher, itemId });
  useGetInformation({ selector: getWagons, fetcher: fetchWagon });

  const restrictions = useGetRoleRestrictions();
  const isCreateLoadRestricted =
    restrictions[`${prevPage?.toLowerCase()} loads`]?.includes("create");
  const isEditRestricted =
    restrictions[prevPage?.toLowerCase()]?.includes("edit");
  const [chosenMenuItem, setChosenMenuItem] = useState(menu[0]?.name);
  const [openEdiTableItem, setOpenEditTableItem] = useState(false);
  const { loadsData, data, loading, fetched } = useSelector(selector);

  const handleDelete = () => {
    navigate(-1);
    dispatch(onDelete({ id: mainInfo?.id }));
  };

  const getCorrectTableData = () => {
    switch (chosenMenuItem?.toLowerCase()) {
      case "loads":
        const correctTableData = loadsData?.filter(
          (item) =>
            item?.purchase_id === Number(itemId) ||
            item?.sale_id === Number(itemId)
        );
        return { data: correctTableData, header: INSIDER_LOADS_PURCHASE };
      case "wagon loads":
        const purchaseTable = mainInfo.purchase_loads_products?.map((item) => ({
          id: item?.load + item?.quantity,
          insiderTable: [
            item?.load,
            item?.pick_up_location,
            item?.product,
            item?.quantity,
            item?.transportation_loss,
            "-",
          ],
        }));
        const saleTable = mainInfo?.sales_loads_products?.map((item) => ({
          id: item?.load + item?.quantity,
          insiderTable: [
            item?.load,
            item?.pick_up_location,
            item?.products?.map((item) => item).join(", "),
            item?.quantity,
            "-",
            item?.delivery_loss,
          ],
        }));
        if (purchaseTable) {
          return {
            header: WAGON_LOADS_HEADERS,
            data: [...purchaseTable, ...saleTable],
          };
        }
        return null;
      case "history":
        return {
          header: HISTORY_TABLE_HEADERS,
          data: mainInfo?.history?.map((item, index) => ({
            id: mainInfo?.id + index,
            insiderTable: item,
          })),
        };
      case "customers":
        const customerData = mainInfo?.customers?.map((item) => ({
          id: item?.id,
          insiderTable: [
            item?.company_name,
            item?.contact_person,
            item?.priority,
            item?.demand,
            item?.meeting_time,
            item?.phone_number,
            item?.email,
            item?.country_name,
            item?.city,
            item?.address,
          ],
        }));
        return { data: customerData, header: CUSTOMERS_TABLE_HEADERS };
      case "pi's":
        const adaptedPis = mainInfo?.pis?.map((item) => ({
          id: item?.pi + item?.product_name,
          insiderTable: [item?.pi, item?.quantity],
        }));
        return { data: adaptedPis, header: ["PI #", "Quantity (Tons)"] };
      case "transaction list":
        return {
          header: ACCOUNTING_TABLE_HEADERS,
          data: mainInfo?.accounting_balances,
        };
      case "active deals":
        return {
          header: type
            ? ACTIVE_DEALS_MANUFACTURER_TABLE_HEADERS
            : ACTIVE_DEALS_TABLE_HEADERS,
          data: mainInfo?.activeDeals,
        };
      case "demands":
        const adaptedTable = mainInfo?.products?.map((item) => ({
          id: item?.product_id,
          insiderTable: [
            item?.product_name,
            item?.category,
            item?.subcategory,
            item?.demand,
            item?.saleQuantity,
            item?.performance,
          ],
        }));
        return {
          header: DEMAND_PRODUCTS_HEADER,
          data: adaptedTable,
        };
      case "products":
        return {
          header: ["Product", "Category", "Subcategory", "Price"],
          data: mainInfo?.products,
        };
      case "price analytics":
        return {
          header: PRICE_ANALYTICS_HEADER,
          data: mainInfo?.prices,
        };
      default:
        return null;
    }
  };

  const openModal = (id, type) => setOpenEditTableItem(id);

  const handleDeleteLoad = (id) => {
    if (chosenMenuItem?.toLowerCase() === "loads") {
      switch (prevPage?.toLowerCase()) {
        case "purchases":
          dispatch(deletePurchaseLoad({ id }));
          break;
        case "sales":
          dispatch(deleteSaleLoad({ id }));
          break;
        default:
          return null;
      }
    }
  };
  const handleDeleteProductPrice = (id) => {
    dispatch(deleteProductPrice({ id, productId: mainInfo?.id }));
  };
  useEffect(() => {
    if (fetched) {
      prevPage?.toLowerCase() === "purchases" &&
        dispatch(fetchPurchaseCost({ purchaseId: itemId }));
      prevPage?.toLowerCase() === "sales" &&
        dispatch(fetchSaleCost({ saleId: itemId }));
      prevPage?.toLowerCase() === "sales" &&
        dispatch(fetchSalesPaid({ itemId }));
    }
  }, [itemId, fetched, dispatch]);

  useEffect(() => {
    if (fetched && data?.length > 0) {
      const infoId = itemId || Cookies.get("userId");
      setMainInfo(data?.find((item) => item?.id === Number(infoId)));
    }
  }, [loading, fetched, dispatch, data, itemId]);

  return !mainInfo || isEmpty(mainInfo) ? (
    <Spinner />
  ) : (
    <div className="flex gap-6 mb-10">
      {mainInfo?.insiderData && (
        <InsiderSideMenu
          userPfp={mainInfo?.logo}
          editItem={handleEditModal}
          onDelete={handleDelete}
          headersInfo={mainInfo?.insiderData}
          headers={headers}
        />
      )}
      <div className="flex flex-col w-full">
        <div className="flex items-center border-b">
          <div className="flex text-center items-center gap-6 font-semibold cursor-pointer w-full">
            {menu?.map((item) => (
              <p
                key={item?.id}
                onClick={() => setChosenMenuItem(item?.name)}
                className={` h-[86px] flex items-center ${
                  item?.name === chosenMenuItem
                    ? "border-b-4 border-main-purple text-black capitalize"
                    : " text-storm-grey"
                }`}
              >
                {item?.name}
              </p>
            ))}
          </div>
          {menuBtn && (
            <Button
              onClick={() => setOpenAddMeeting(true)}
              text={menuBtn}
              isSecondary
            />
          )}
        </div>
        <div className="w-full flex gap-4 flex-col text-center justify-center h-full items-center">
          {getCorrectTableData() !== null &&
            (getCorrectTableData()?.data?.length === 0 ||
            !getCorrectTableData()?.data ? (
              <>
                <img
                  src={noLoadsImage}
                  alt="no loads"
                  className="w-[200px] h-[200px]"
                />
                <div className="flex flex-col gap-3">
                  <p className="font-semibold">
                    Start by creating {chosenMenuItem?.toLowerCase()}
                  </p>
                  <p className="max-w-[354px] text-grey-text text-sm">
                    You can monitor your loads, customers, and other items here
                  </p>
                </div>
              </>
            ) : (
              <Table
                isInsider
                isHeader={false}
                tableItems={getCorrectTableData()?.data}
                tableHeader={getCorrectTableData()?.header}
                onClick={openModal}
                itemIsStatusIndex={
                  (chosenMenuItem === "Loads" ||
                    chosenMenuItem === "History") &&
                  getCorrectTableData()?.header?.length - 1
                }
                isThreeDots={
                  chosenMenuItem === "Loads" ||
                  chosenMenuItem === "Price Analytics"
                }
                editName={
                  chosenMenuItem === "Loads" ? "Edit the load" : "Edit the PI"
                }
                isEditRestricted={chosenMenuItem === "Price Analytics"}
                onDelete={
                  chosenMenuItem === "Loads"
                    ? handleDeleteLoad
                    : handleDeleteProductPrice
                }
              />
            ))}

          {chosenMenuItem?.toLowerCase() === "attached documents" && (
            <>
              {mainInfo?.files?.length > 0 ? (
                <>
                  <div className="w-full flex flex-wrap gap-6 my-10">
                    {mainInfo?.files?.map((file, index) => (
                      <FileHolder
                        key={file?.lastModified}
                        file={file}
                        name={file?.name || file?.[0]}
                        index={index}
                        onClick={() =>
                          file?.preview
                            ? window.open(file?.preview)
                            : window.open(
                                `${process.env.REACT_APP_SERVER}/uploads/${file?.[1]}`
                              )
                        }
                        lastModified={file?.lastModified}
                        isDelete={false}
                      />
                    ))}
                  </div>
                  <div className="h-full" />
                </>
              ) : (
                <div className="flex items-center h-full w-full justify-center">
                  <img
                    src={noLoadsImage}
                    alt="no loads"
                    className="w-[200px] h-[200px]"
                  />
                </div>
              )}
            </>
          )}
          {chosenMenuItem?.toLowerCase() === "additional costs" && (
            <>
              {!isEmpty(mainInfo?.additionalCost) ? (
                <div className="w-full flex flex-wrap gap-6 my-10">
                  {Object.entries(mainInfo?.additionalCost)?.map(
                    ([key, value]) => (
                      <div
                        key={key + value}
                        className="flex flex-col items-start"
                      >
                        <label className="capitalize">
                          {key?.replace("_", " ")}
                        </label>
                        <Input readOnly value={value} isDisabled />
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="mt-10 text-red-500">No Info Present</div>
              )}
              <div className="h-full" />
            </>
          )}
          {chosenMenuItem?.toLowerCase() === "comments" ||
            (chosenMenuItem?.toLowerCase() === "notes" && (
              <>
                {mainInfo?.notes?.length !== 0 ? (
                  <div className="w-full flex-col flex flex-wrap gap-6 item-center text-center my-10">
                    {mainInfo?.notes?.map((note) => (
                      <div className="border p-3 rounded-lg min-h-[100px]">
                        <div className="flex w-full gap-2">
                          <Avatar isSmall />
                          <p>{note?.staff_name}</p>
                          <p>•</p>
                          <span className="text-grey-text">
                            {format(note?.created_at, "HH:mm a")}
                          </span>
                        </div>
                        <p className="text-start ml-[70px]">{note?.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-10 text-red-500">No Info Present</div>
                )}
                <div className="h-full" />
              </>
            ))}
          {chosenMenuItem?.toLowerCase() === "worked hours" && (
            <>
              <Scheduler
                totalWorkedTime={mainInfo?.totalWorkedTime}
                totalMeetingTime={mainInfo?.totalMeetingTime}
              />
            </>
          )}
        </div>
        <div
          id="footer"
          className="h-[90px] border-t flex items-center justify-between"
        >
          {chosenMenuItem?.toLowerCase() === "loads" && (
            <>
              <p>Quantity Delivered: 0</p>
              {!noLoads && (
                <Button
                  isRestricted={isCreateLoadRestricted}
                  text="Create a load"
                  onClick={() => handleModal("loads")}
                />
              )}
            </>
          )}
          {chosenMenuItem?.toLowerCase() === "notes" && (
            <>
              <p />
              <Button text="Add note" onClick={() => handleModal("notes")} />
            </>
          )}
          {chosenMenuItem?.toLowerCase() === "attached documents" && (
            <>
              <p>Total attached files: {mainInfo?.files?.length || 0}</p>
              {!noDocs && (
                <Button
                  isRestricted={isEditRestricted}
                  text="Upload new document"
                  width="w-[200px]"
                  onClick={() => handleModal("attached documents")}
                />
              )}
            </>
          )}
          {chosenMenuItem?.toLowerCase() === "additional costs" && (
            <>
              <p>Total additional costs: {mainInfo?.totalCost || 0}</p>
              <Button
                isRestricted={isEditRestricted}
                isSecondary
                text="Edit costs"
                onClick={() => handleModal("additional costs")}
              />
            </>
          )}
          {chosenMenuItem?.toLowerCase() === "price analytics" && (
            <>
              <div />
              <Button
                isRestricted={isEditRestricted}
                text="Update price"
                onClick={() => handleModal("price analytics")}
              />
            </>
          )}
          {chosenMenuItem?.toLowerCase() === "demands" && (
            <>
              <p className="text-xl font-semibold">
                Overall demand quantity: {mainInfo?.overallDemand || 0}
              </p>
              <Button
                isRestricted={isEditRestricted}
                width="w-[220px]"
                text="Add on demand product"
                onClick={() => handleModal("demands")}
              />
            </>
          )}
          {chosenMenuItem?.toLowerCase() === "active deals" && (
            <>
              <p className="text-xl font-semibold">
                Active deals quantity: {mainInfo?.activeDealsQuantity || 0}
              </p>
              {!noDeals && (
                <Button
                  isRestricted={isEditRestricted}
                  text={type ? "Purchase" : "Sell"}
                  onClick={() => handleModal(type ? "purchase" : "sell")}
                />
              )}
            </>
          )}
        </div>
        <TransitionWrapper isShow={openCreateModal === "loads"}>
          <CreateLoadModal
            itemId={itemId}
            isPurchase={prevPage?.toLowerCase() === "purchases"}
            handleModal={handleCloseModal}
          />
        </TransitionWrapper>
        <TransitionWrapper isShow={openCreateModal === "additional costs"}>
          <CreateCostseModal
            selectedItem={mainInfo?.additionalCost}
            itemId={itemId}
            isPurchase={prevPage?.toLowerCase() === "purchases"}
            handleModal={handleCloseModal}
          />
        </TransitionWrapper>
        <TransitionWrapper isShow={openCreateModal === "attached documents"}>
          <AddFileModal
            onCreate={fileUploader}
            itemId={itemId}
            handleModal={handleCloseModal}
          />
        </TransitionWrapper>

        <TransitionWrapper isShow={openCreateModal === "notes"}>
          <AddNoteModal handleModal={handleCloseModal} item={mainInfo} />
        </TransitionWrapper>
        <TransitionWrapper isShow={openCreateModal === "sell"}>
          <CreateSellModal
            handleOpenSell={handleCloseModal}
            selectedItem={mainInfo}
            itemId={itemId}
          />
        </TransitionWrapper>

        <TransitionWrapper isShow={openCreateModal === "purchase"}>
          <CreatePurchaseModal
            handleOpenPurchase={handleCloseModal}
            selectedItem={{
              manufacturer_name: mainInfo?.name,
              manufacturer_id: mainInfo?.id,
            }}
            itemId={itemId}
          />
        </TransitionWrapper>

        <TransitionWrapper isShow={openCreateModal === "demands"}>
          <CreateDemandModal
            itemId={mainInfo?.id}
            handleModal={handleCloseModal}
          />
        </TransitionWrapper>
        <TransitionWrapper isShow={openCreateModal === "price analytics"}>
          <CreateProductPrice
            itemId={mainInfo?.id}
            handleModal={handleCloseModal}
          />
        </TransitionWrapper>
        <TransitionWrapper isShow={openEditModal}>
          <>{editModal}</>
        </TransitionWrapper>
        {(prevPage === "purchases" || prevPage === "sales") && (
          <TransitionWrapper isShow={!!openEdiTableItem}>
            <EditLoadModal
              handleModal={() => setOpenEditTableItem(false)}
              selectedItem={
                loadsData &&
                loadsData?.length !== 0 &&
                loadsData?.find((item) => item?.load === openEdiTableItem)
              }
              isPurchase={prevPage?.toLowerCase() === "purchases"}
            />
          </TransitionWrapper>
        )}
        <TransitionWrapper isShow={openAddMeeting}>
          <AddMeeting
            defaultInfo={
              mainInfo?.company_name && {
                meetingWith: { label: "Customer", id: 2 },
                meetingName: {
                  label: mainInfo?.company_name,
                  value: mainInfo?.id,
                },
              }
            }
            onCancel={() => setOpenAddMeeting(false)}
          />
        </TransitionWrapper>
      </div>
    </div>
  );
};

export default Insider;
