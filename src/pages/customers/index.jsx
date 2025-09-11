import React, { useState } from "react";
import { Table } from "../../components/table";
import {
  CUSTOMERS_TABLE_HEADERS,
  CUSTOMER_TABLE_DEBTS_HEADERS,
} from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { getCustomers } from "../../store";
import { ReactComponent as PlusSign } from "../../icons/plus-sign-box.svg";
import { CreateCustomerModal } from "../../components/modals/create-customer-modal";
import { deleteMultiple } from "../../store/customers/delete-multiple";
import { Spinner } from "../../components/spinner";
import { useLocation } from "react-router-dom";
import { updateFilters, updateSearch } from "../../store/customers";
import { TransitionWrapper } from "../../components/modals/transition-wrapper";

const MarketingCustomers = () => {
  const location = useLocation();
  const secondPath = location.search.split("=")[1];
  const filters = [
    {
      id: 1,
      name: "Contact person",
      searchKey: "contact_person",
    },
    {
      id: 2,
      name: "Country",
      searchKey: "country_name",
    },
    {
      id: 4,
      name: "Priority",
      searchKey: "priority",
    },
    {
      id: 5,
      name: "Sales Manager",
      searchKey: "staff_name",
    },
    {
      id: 6,
      name: "Product",
      searchKey: "products",
    },
  ];
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const handleModal = () => setModal(!modal);
  const handleMultipleDelete = (items) => dispatch(deleteMultiple({ items }));
  const {
    data,
    filters: savedFilters,
    search,
    fetched,
    loading,
  } = useSelector(getCustomers);
  const setSearchString = (search) => dispatch(updateSearch(search));

  const setSavedFilters = (filters) => {
    dispatch(updateFilters(filters));
  };

  if (!fetched || loading) {
    return <Spinner />;
  }

  return (
    <>
      {secondPath === "marketing" && (
        <Table
          setSavedFilters={setSavedFilters}
          savedFilters={savedFilters}
          filters={filters}
          tableItems={data?.filter(
            (item) =>
              item?.activeDeals?.length === 0 && item?.products?.length === 0
          )}
          search={search}
          setSearchString={setSearchString}
          isNew={secondPath}
          onDeleteMultiple={handleMultipleDelete}
          extraBtnText="Add Customer"
          extraBtnIcon={<PlusSign />}
          onExtraBtnClick={handleModal}
          tableHeader={CUSTOMERS_TABLE_HEADERS}
          isFullHeight
        />
      )}
      {secondPath === "potential" && (
        <Table
          isNew={secondPath}
          setSavedFilters={setSavedFilters}
          savedFilters={savedFilters}
          filters={filters}
          search={search}
          setSearchString={setSearchString}
          tableItems={data?.filter(
            (item) =>
              item?.products?.length !== 0 && item?.activeDeals?.length === 0
          )}
          onDeleteMultiple={handleMultipleDelete}
          extraBtnText="Add Customer"
          extraBtnIcon={<PlusSign />}
          onExtraBtnClick={handleModal}
          tableHeader={CUSTOMERS_TABLE_HEADERS}
          isFullHeight
        />
      )}
      {secondPath === "active" && (
        <Table
          isNew={secondPath}
          setSavedFilters={setSavedFilters}
          search={search}
          setSearchString={setSearchString}
          savedFilters={savedFilters}
          filters={filters}
          tableItems={data?.filter((item) => item?.activeDeals?.length !== 0)}
          onDeleteMultiple={handleMultipleDelete}
          extraBtnText="Add Customer"
          extraBtnIcon={<PlusSign />}
          onExtraBtnClick={handleModal}
          tableHeader={CUSTOMERS_TABLE_HEADERS}
          isFullHeight
        />
      )}
      {secondPath === "debts" && (
        <Table
          isNew={secondPath}
          setSavedFilters={setSavedFilters}
          search={search}
          setSearchString={setSearchString}
          savedFilters={savedFilters}
          filters={filters}
          tableItems={data?.filter(
            (item) =>
              item?.allPaymentDates?.filter(
                (date) => new Date(date).getTime() < new Date().getTime()
              ).length !== 0
          )}
          onDeleteMultiple={handleMultipleDelete}
          extraBtnText="Add Customer"
          extraBtnIcon={<PlusSign />}
          onExtraBtnClick={handleModal}
          isSecondTable
          tableHeader={CUSTOMER_TABLE_DEBTS_HEADERS}
          isFullHeight
        />
      )}
      <TransitionWrapper isShow={modal}>
        <CreateCustomerModal handleModal={handleModal} />
      </TransitionWrapper>
    </>
  );
};

export default MarketingCustomers;
