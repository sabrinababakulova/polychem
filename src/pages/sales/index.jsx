import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Table } from "../../components/table";
import { StatsHeader } from "../../components/headers/stats-header";
import { SALES_TABLE_HEADERS } from "../../constants";
import { fetchSales } from "../../store/sales/fetch-sales";
import { getPurchases, getSales } from "../../store";
import { useGetInformation } from "../../hooks/use-get-information";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchase } from "../../store/get-purchase/fetch-purchase";
import { deleteMultiple } from "../../store/sales/delete-multiple";
import { Spinner } from "../../components/spinner";
import { updateFilters, updateSearch } from "../../store/sales";

const Sales = () => {
  const filters = [
    {
      id: 12,
      name: "Country",
      searchKey: "country_name",
    },

    {
      id: 2,
      name: "Customer",
      searchKey: "customer_company_name",
    },
    {
      id: 2,
      name: "Sales manager",
      searchKey: "staff_name",
    },
    {
      id: 3,
      name: "Product",
      searchKey: "product",
    },
    {
      id: 5,
      name: "Sale type",
      searchKey: "sale_type",
    },
    {
      id: 7,
      name: "Payment type",
      searchKey: "payment_type",
    },
    {
      id: 8,
      name: "Payment conditions",
      searchKey: "payment_condition",
    },
    {
      id: 9,
      name: "Delivery condition",
      searchKey: "delivery_condition",
    },
  ];
  const dispatch = useDispatch();
  const {
    data: sales,
    filters: savedFilters,
    search,
    fetched,
    loading,
  } = useSelector(getSales);
  const setSavedFilters = (filters) => {
    dispatch(updateFilters(filters));
  };
  const setSearchString = (search) => dispatch(updateSearch(search));
  const handleMultipleDelete = (items) => dispatch(deleteMultiple({ items }));
  const [statsHeader, setStatsHeader] = useState([
    {
      label: "Total orders amount",
      value: "$0",
      id: 1,
    },
    {
      label: "Total tons",
      value: "$0",
      id: 2,
    },
    {
      label: "Total costs",
      value: "$0",
      id: 3,
    },
    {
      label: "Total sales revenue",
      value: "$0",
      id: 4,
    },
  ]);
  useGetInformation({ selector: getPurchases, fetcher: fetchPurchase });
  useGetInformation({ selector: getSales, fetcher: fetchSales });

  useEffect(() => {
    if (sales) {
      setStatsHeader((prev) =>
        prev.map((item) => {
          if (item.id === 1) {
            return {
              ...item,
              value: Number(sales.length)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
            };
          }
          if (item.id === 2) {
            return {
              ...item,
              value: Number(
                sales?.reduce(
                  (acc, curr) =>
                    acc +
                    curr?.pis?.reduce(
                      (accsecond, currsecond) =>
                        accsecond + currsecond?.quantity,
                      0
                    ),
                  0
                )
              )
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
            };
          }
          if (item.id === 3) {
            const totalPrice = sales?.reduce(
              (acc, curr) => acc + curr?.price,
              0
            );
            return {
              ...item,
              value: `$${Number(totalPrice)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`,
            };
          }
          if (item.id === 4) {
            const totalPrice = sales?.reduce(
              (acc, curr) => acc + curr?.paid,
              0
            );
            return {
              ...item,
              value: `$${Number(totalPrice)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`,
            };
          }
          return item;
        })
      );
    }
  }, [sales]);
  return !fetched || loading ? (
    <Spinner />
  ) : (
    <>
      <StatsHeader
        mainText={`Sales \n stats overview`}
        description="All time main numbers"
        descriptionItems={statsHeader}
      />
      <Table
        setSavedFilters={setSavedFilters}
        savedFilters={savedFilters}
        filters={filters}
        search={search}
        setSearchString={setSearchString}
        onDeleteMultiple={handleMultipleDelete}
        tableHeader={SALES_TABLE_HEADERS}
        tableItems={sales}
      />
      <Outlet />
    </>
  );
};

export default Sales;
