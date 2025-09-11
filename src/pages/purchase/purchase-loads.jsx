import React from "react";
import { Table } from "../../components/table";
import { PURCHASES_LOADS_TALBE_HEADERS } from "../../constants";
import { fetchPurchaseLoad } from "../../store/get-purchase/fetch-loads";
import { getPurchases } from "../../store";
import { useGetInformationLoads } from "../../hooks/use-get-information";
import { useDispatch, useSelector } from "react-redux";
import { useGetInformation } from "../../hooks/use-get-information";
import { fetchPurchase } from "../../store/get-purchase/fetch-purchase";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "../../components/spinner";
import {
  updateLoadsFilters,
  updateLoadsSearch,
} from "../../store/get-purchase";

const PurchaseLoads = () => {
  const dispatch = useDispatch();
  const filters = [
    {
      id: 1,
      name: "Product",
      searchKey: "product",
    },
    {
      id: 2,
      name: "Manufacturer",
      searchKey: "manufacturer",
    },
    {
      id: 3,
      name: "Origin",
      searchKey: "pick_up_location",
    },
  ];
  const {
    loadsData,
    loadsFilters: savedFilters,
    loadsSearch,
    loadsFetched,
    loadsLoading,
  } = useSelector(getPurchases);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (id, item) => {
    navigate(`/purchases/insider?id=${item?.purchase_id}`);
  };
  const setSearchString = (search) => dispatch(updateLoadsSearch(search));

  const setSavedFilters = (filters) => {
    dispatch(updateLoadsFilters(filters));
  };
  const secondPath = location.search.split("=")[1];
  useGetInformation({
    selector: getPurchases,
    fetcher: fetchPurchase,
  });
  useGetInformationLoads({
    selector: getPurchases,
    fetcher: fetchPurchaseLoad,
  });
  if (!loadsFetched || loadsLoading) {
    return <Spinner />;
  }
  if (secondPath === "not-loaded") {
    const filteredData = loadsData.filter(
      (item) => item.status?.toLowerCase() === "not loaded"
    );
    return (
      <Table
        setSavedFilters={setSavedFilters}
        savedFilters={savedFilters}
        isNew={secondPath}
        search={loadsSearch}
        setSearchString={setSearchString}
        onClick={handleNavigate}
        tableItems={filteredData}
        tableHeader={PURCHASES_LOADS_TALBE_HEADERS}
        isFullHeight
      />
    );
  }
  if (secondPath === "on-the-way") {
    const filteredData = loadsData.filter(
      (item) => item.status?.toLowerCase() === "on the way"
    );
    return (
      <Table
        setSavedFilters={setSavedFilters}
        savedFilters={savedFilters}
        isNew={secondPath}
        filters={filters}
        onClick={handleNavigate}
        tableItems={filteredData}
        search={loadsSearch}
        setSearchString={setSearchString}
        tableHeader={PURCHASES_LOADS_TALBE_HEADERS}
        isFullHeight
      />
    );
  }
  if (secondPath === "warehouse") {
    const filteredData = loadsData.filter(
      (item) => item.status?.toLowerCase() === "warehouse"
    );
    return (
      <Table
        setSavedFilters={setSavedFilters}
        savedFilters={savedFilters}
        isNew={secondPath}
        filters={filters}
        search={loadsSearch}
        setSearchString={setSearchString}
        onClick={handleNavigate}
        tableItems={filteredData}
        tableHeader={PURCHASES_LOADS_TALBE_HEADERS}
        isFullHeight
      />
    );
  }
  return (
    <Table
      setSavedFilters={setSavedFilters}
      savedFilters={savedFilters}
      isNew={secondPath}
      filters={filters}
      onClick={handleNavigate}
      search={loadsSearch}
      setSearchString={setSearchString}
      tableItems={loadsData}
      tableHeader={PURCHASES_LOADS_TALBE_HEADERS}
      isFullHeight
    />
  );
};

export default PurchaseLoads;
