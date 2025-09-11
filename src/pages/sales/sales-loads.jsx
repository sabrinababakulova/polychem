import React from "react";
import { Table } from "../../components/table";
import { SALES_LOADS_TABLE_HEADERS } from "../../constants";
import { getSales } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetInformation,
  useGetInformationLoads,
} from "../../hooks/use-get-information";
import { fetchSales } from "../../store/sales/fetch-sales";
import { fetchSalesLoads } from "../../store/sales/fetch-loads";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "../../components/spinner";
import { updateLoadsFilters, updateLoadsSearch } from "../../store/sales";

const SalesLoads = () => {
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
  } = useSelector(getSales);
  const location = useLocation();
  const navigate = useNavigate();
  const setSavedFilters = (filters) => {
    dispatch(updateLoadsFilters(filters));
  };
  const handleNavigate = (id, item) => {
    navigate(`/sales/insider?id=${item?.sale_id}`, {
      state: { selectedId: item?.sale_id },
    });
  };
  const setSearchString = (search) => dispatch(updateLoadsSearch(search));

  const secondPath = location.search.split("=")[1];
  useGetInformation({
    selector: getSales,
    fetcher: fetchSales,
  });
  useGetInformationLoads({
    selector: getSales,
    fetcher: fetchSalesLoads,
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
        filters={filters}
        onClick={handleNavigate}
        tableItems={filteredData}
        tableHeader={SALES_LOADS_TABLE_HEADERS}
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
        search={loadsSearch}
        setSearchString={setSearchString}
        isNew={secondPath}
        filters={filters}
        onClick={handleNavigate}
        tableItems={filteredData}
        tableHeader={SALES_LOADS_TABLE_HEADERS}
        isFullHeight
      />
    );
  }
  if (secondPath === "delivered") {
    const filteredData = loadsData.filter(
      (item) => item.status?.toLowerCase() === "delivered"
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
        tableHeader={SALES_LOADS_TABLE_HEADERS}
        isFullHeight
      />
    );
  }
  return (
    <Table
      setSavedFilters={setSavedFilters}
      savedFilters={savedFilters}
      isNew={secondPath}
      search={loadsSearch}
      setSearchString={setSearchString}
      filters={filters}
      onClick={handleNavigate}
      tableItems={loadsData}
      tableHeader={SALES_LOADS_TABLE_HEADERS}
      isFullHeight
    />
  );
};

export default SalesLoads;
