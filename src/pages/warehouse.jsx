import React, { useEffect, useState } from "react";
import { Table } from "../components/table";
import {
  WAREHOUSE_TABLE_HEADERS,
  WAREHOUSE_TABLE_HEADERS_INCOME,
  WAREHOUSE_TABLE_HEADERS_OUTCOME,
} from "../constants";
import { getPurchases, getSales } from "../store";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetInformation,
  useGetInformationLoads,
} from "../hooks/use-get-information";
import { fetchPurchase } from "../store/get-purchase/fetch-purchase";
import { fetchPurchaseLoad } from "../store/get-purchase/fetch-loads";
import { useLocation } from "react-router-dom";
import { Spinner } from "../components/spinner";
import { fetchSalesLoads } from "../store/sales/fetch-loads";
import { updateLoadsFilters, updateLoadsSearch } from "../store/get-purchase";
import { updateLoadsFilters as updateLoadsFiltersSales } from "../store/sales";
import { cloneDeep } from "lodash";

const Warehouse = () => {
  const dispatch = useDispatch();
  const filtersFirstTable = [
    {
      id: 1,
      name: "Product name",
      searchKey: "product_name",
    },
    {
      id: 2,
      name: "Category",
      searchKey: "category_name",
    },
    {
      id: 3,
      name: "Subcategory",
      searchKey: "sub_category_name",
    },
  ];
  const filtersSecondTable = [
    {
      id: 1,
      name: "Product name",
      searchKey: "product",
    },
  ];
  const filtersThirdTable = [
    {
      id: 1,
      name: "Product name",
      searchKey: "product",
    },
    {
      id: 2,
      name: "Customer",
      searchKey: "customer",
    },
    {
      id: 3,
      name: "Sales manager",
      searchKey: "manager",
    },
  ];
  const [filteredLoads, setFilteredLoads] = useState([]);
  const [filteredLoadsSales, setFilteredLoadsSales] = useState([]);
  const location = useLocation();
  const secondPath = location.search.split("=")[1];
  const {
    loadsData,
    warehouse,
    loadsFilters: savedFilters,
    loadsSearch,
    loadsFetched,
    loadsLoading,
  } = useSelector(getPurchases);
  const setSavedFilters = (filters) => {
    dispatch(updateLoadsFilters(filters));
  };
  const setSearchString = (search) => dispatch(updateLoadsSearch(search));
  const {
    loadsData: salesLoadsData,
    loadsFilters: savedFiltersSales,
    loadsFetched: salesLoadsFetched,
    loadsLoading: salesLoadsLoading,
  } = useSelector(getSales);
  const setSavedFiltersSales = (filters) => {
    dispatch(updateLoadsFiltersSales(filters));
  };
  useGetInformation({
    selector: getPurchases,
    fetcher: fetchPurchase,
  });
  useGetInformationLoads({
    selector: getPurchases,
    fetcher: fetchPurchaseLoad,
  });
  useGetInformationLoads({
    selector: getSales,
    fetcher: fetchSalesLoads,
  });

  useEffect(() => {
    const filtered = loadsData.filter(
      (item) => item.status?.toLowerCase() === "warehouse"
    );
    const combinedQuantities = cloneDeep(filtered).reduce(
      (accumulator, currentItem) => {
        const key = `${currentItem.product}-${currentItem.category}-${currentItem.subcategory}`;

        if (accumulator[key]) {
          accumulator[key].quantity += currentItem.quantity;
        } else {
          accumulator[key] = { ...currentItem };
        }

        return accumulator;
      },
      {}
    );
    const resultArray = Object.values(combinedQuantities);
    setFilteredLoads(resultArray);
  }, [loadsData]);

  useEffect(() => {
    setFilteredLoadsSales(
      salesLoadsData.filter(
        (item) => item.status?.toLowerCase() === "delivered"
      )
    );
  }, [salesLoadsData]);

  if (
    !loadsFetched ||
    loadsLoading ||
    !salesLoadsFetched ||
    salesLoadsLoading
  ) {
    return <Spinner />;
  }
  if (secondPath === "balance") {
    return (
      <Table
        setSavedFilters={setSavedFilters}
        savedFilters={savedFilters}
        isNew={secondPath}
        filters={filtersFirstTable}
        search={loadsSearch}
        setSearchString={setSearchString}
        onClick={() => {}}
        tableItems={warehouse}
        tableHeader={WAREHOUSE_TABLE_HEADERS}
        isFullHeight
      />
    );
  }

  if (secondPath === "income") {
    return (
      <Table
        setSavedFilters={setSavedFilters}
        savedFilters={savedFilters}
        isNew={secondPath}
        isThirdTable
        filters={filtersSecondTable}
        search={loadsSearch}
        setSearchString={setSearchString}
        onClick={() => {}}
        tableItems={filteredLoads}
        tableHeader={WAREHOUSE_TABLE_HEADERS_INCOME}
        isFullHeight
      />
    );
  }

  if (secondPath === "outcome") {
    return (
      <Table
        setSavedFilters={setSavedFiltersSales}
        savedFilters={savedFiltersSales}
        isNew={secondPath}
        isSecondTable
        filters={filtersThirdTable}
        search={loadsSearch}
        setSearchString={setSearchString}
        onClick={() => {}}
        tableItems={filteredLoadsSales}
        tableHeader={WAREHOUSE_TABLE_HEADERS_OUTCOME}
        isFullHeight
      />
    );
  }

  return null;
};

export default Warehouse;
