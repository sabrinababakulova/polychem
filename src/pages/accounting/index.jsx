import React, { useEffect, useState } from "react";
import { StatsHeader } from "../../components/headers/stats-header";
import { Table } from "../../components/table";
import {
  ACCOUNTING_TABLE_HEADERS,
  COUNTERAGENTS_TABLE_HEADERS,
  ANALYTICS_HEADERS,
} from "../../constants";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetRoleRestrictions } from "../../hooks/use-get-role-acess";
import { useDispatch, useSelector } from "react-redux";
import { getAccounting, getCounters, getStaff } from "../../store";
import { fetchAccounting } from "../../store/accounting/fetch-accounting";
import { useGetInformation } from "../../hooks/use-get-information";
import { ReactComponent as PlusSign } from "../../icons/plus-sign-box.svg";
import { CreateCounterAgentModal } from "../../components/modals/create-counter-agent";
import { deleteMultiple } from "../../store/counter-agents/delete-multiple";
import { deleteMultiple as DeleteTransactions } from "../../store/accounting/delete-multiple";
import { fetchCounters } from "../../store/counter-agents/fetch-counters";
import { Spinner } from "../../components/spinner";
import { fetchBalance } from "../../store/accounting/fetch-balance";
import { CreateTransaction } from "../../components/modals/add-transaction";
import { fetchStaff } from "../../store/staff/fetch-staff";
import { DetailsWindow } from "../../components/modals/details-window";
import { format } from "date-fns";
import { TransitionWrapper } from "../../components/modals/transition-wrapper";
import { deleteAccounting } from "../../store/accounting/delete-accounting";
import { updateFilters, updateSearch } from "../../store/accounting";

const Accounting = () => {
  const filters = [
    {
      id: 1,
      name: "Transaction Type",
      searchKey: "transaction_type",
    },
    {
      id: 2,
      name: "Created By",
      searchKey: "staff_name",
    },
  ];
  const [openDetails, setOpenDetails] = useState(false);
  const [chosenDetails, setChosenDetails] = useState(null);
  const getDetails = (id) => {
    const item = accounting.find((item) => item.id === id);
    setChosenDetails(item);
    setOpenDetails(true);
  };
  const handleDetailsModal = () => setOpenDetails(false);
  const [descriptionItems, setDescriptionItems] = useState(ANALYTICS_HEADERS);
  const navigate = useNavigate();
  const [openTransaction, setOpenTransaction] = useState(false);
  const handleTransactionModal = () => setOpenTransaction(!openTransaction);
  const restrictions = useGetRoleRestrictions();
  const location = useLocation();
  const secondPath = location.search.split("=")[1];
  const {
    data: balance,
    accounting,
    filters: savedFilters,
    search,
  } = useSelector(getAccounting);
  const { data: counters } = useSelector(getCounters);
  const setSearchString = (search) => dispatch(updateSearch(search));
  const setSavedFilters = (filters) => dispatch(updateFilters(filters));
  const { fetched, loading } = useGetInformation({
    fetcher: fetchBalance,
    selector: getAccounting,
  });
  const { fetched: staffFetched, loading: staffLoading } = useGetInformation({
    fetcher: fetchStaff,
    selector: getStaff,
  });
  useEffect(() => {
    if (fetched && !loading && balance) {
      const newDescriptionItems = [
        {
          label: "Total balance",
          value: `$${Number(balance?.total_balance)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`,
          id: 1,
        },
        {
          label: "International cash",
          value: `$${Number(balance?.international_cash)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`,
          id: 2,
        },
        {
          label: "International bank",
          value: `$${Number(balance?.international_bank)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`,
          id: 3,
        },
        {
          label: "Uzbekistan cash",
          value: `$${Number(balance?.uzb_cash)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`,
          id: 4,
        },
        {
          label: "Uzbekistan bank",
          value: `$${Number(balance?.uzb_bank)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`,
          id: 5,
        },
      ];
      setDescriptionItems(newDescriptionItems);
    }
  }, [fetched, loading, balance]);

  const dispatch = useDispatch();
  const handleMultipleDelete = (selectedIds) =>
    dispatch(deleteMultiple({ items: selectedIds }));
  const handleMultipleDeleteTransactions = (selectedIds) =>
    dispatch(DeleteTransactions({ items: selectedIds }));
  const [openManufacturer, setOpenManufacturer] = useState(false);
  const handleModal = () => setOpenManufacturer(!openManufacturer);
  const { fetched: accountingFetched, loading: accountingLoading } =
    useGetInformation({
      selector: getAccounting,
      fetcher: fetchAccounting,
    });
  const { fetched: countersFetched, loading: countersLoading } =
    useGetInformation({
      selector: getCounters,
      fetcher: fetchCounters,
      secondfetch: accountingFetched,
    });
  const handleDelete = () => {
    dispatch(deleteAccounting({ id: chosenDetails?.id }));
    handleDetailsModal();
  };
  useEffect(() => {
    const isPageRestricted = restrictions?.accounting;
    if (typeof isPageRestricted === "boolean" && isPageRestricted === false)
      navigate("/purchases");
  }, [restrictions, navigate]);
  if (
    !accountingFetched ||
    accountingLoading ||
    !countersFetched ||
    countersLoading ||
    !staffFetched ||
    staffLoading
  ) {
    return <Spinner />;
  }

  if (secondPath === "counteragents") {
    return (
      <>
        <Table
          setSavedFilters={() => {}}
          savedFilters={{}}
          tableItems={counters}
          onDeleteMultiple={handleMultipleDelete}
          extraBtnText="Add Counteragent"
          extraBtnIcon={<PlusSign />}
          tableHeader={COUNTERAGENTS_TABLE_HEADERS}
          onExtraBtnClick={handleModal}
          isFullHeight
        />
        <TransitionWrapper isShow={openManufacturer}>
          <CreateCounterAgentModal handleModal={handleModal} />
        </TransitionWrapper>
      </>
    );
  }
  return (
    <>
      <StatsHeader
        mainText="Accounting and Balance"
        description="All time main numbers"
        descriptionItems={descriptionItems}
      />
      <Table
        setSavedFilters={setSavedFilters}
        savedFilters={savedFilters}
        filters={filters}
        search={search}
        setSearchString={setSearchString}
        onDeleteMultiple={handleMultipleDeleteTransactions}
        onClick={getDetails}
        onExtraBtnClick={handleTransactionModal}
        tableItems={accounting}
        extraBtnText="Add Transaction"
        extraBtnIcon={<PlusSign />}
        tableHeader={ACCOUNTING_TABLE_HEADERS}
      />
      <TransitionWrapper isShow={openTransaction}>
        <CreateTransaction handleModal={handleTransactionModal} />
      </TransitionWrapper>
      <TransitionWrapper isShow={openDetails}>
        <DetailsWindow
          onClick={handleDelete}
          handleModal={handleDetailsModal}
          title="Transaction Details"
        >
          <div className="flex justify-between">
            <p className="font-semibold text-storm-grey">Transaction Amount</p>
            <p
              className={`${
                chosenDetails?._type?.toLowerCase() === "income"
                  ? "text-blue-green"
                  : "text-main-red"
              }`}
            >
              {chosenDetails?.table?.[0]}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-storm-grey">Transaction Type</p>
            <p>{chosenDetails?.transaction_type}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-storm-grey">From Balance:</p>
            <p>{chosenDetails?.balance_type}</p>
          </div>
          {chosenDetails?.pi && (
            <div className="flex justify-between">
              <p className="font-semibold text-storm-grey">Pi#:</p>
              <p>{chosenDetails?.pi}</p>
            </div>
          )}
          {chosenDetails?.order_number && (
            <div className="flex justify-between">
              <p className="font-semibold text-storm-grey">Order Number</p>
              <p>{chosenDetails?.order_number}</p>
            </div>
          )}
          {chosenDetails?.counter_agent_id && (
            <div className="flex justify-between">
              <p className="font-semibold text-storm-grey">Counter Agent:</p>
              <p>
                {
                  counters?.find(
                    (item) => item?.id === chosenDetails?.counter_agent_id,
                  )?.name
                }
              </p>
            </div>
          )}
          {chosenDetails?.transfer_balance && (
            <div className="flex justify-between">
              <p className="font-semibold text-storm-grey">To Balance: </p>
              <p>{chosenDetails?.transfer_balance}</p>
            </div>
          )}
          <div className="flex justify-between">
            <p className="font-semibold text-storm-grey">Creation Time:</p>
            <p>
              {chosenDetails?.created_at &&
                format(new Date(chosenDetails?.created_at), "HH:mma, PP")}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-storm-grey">Created By:</p>
            <p>{chosenDetails?.staff_name}</p>
          </div>
        </DetailsWindow>
      </TransitionWrapper>
    </>
  );
};

export default Accounting;
