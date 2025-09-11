import React, { useEffect, useState } from "react";
import { StatsHeader } from "../../components/headers/stats-header";
import { PURCHASES_TABLE_HEADERS } from "../../constants";
import { Table } from "../../components/table";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, getPurchases } from "../../store";
import { fetchPurchase } from "../../store/get-purchase/fetch-purchase";
import { useGetInformation } from "../../hooks/use-get-information";
import { deleteMultiple } from "../../store/get-purchase/delete-multiple";
import { Spinner } from "../../components/spinner";
import { updateFilters, updateSearch } from "../../store/get-purchase";
import { fetchProduct } from "../../store/products/fetch-products";

const Purchases = () => {
  const filters = [
    {
      id: 3,
      name: "Product",
      searchKey: "product_name",
    },
    {
      id: 4,
      name: "Manufacturer",
      searchKey: "manufacturer_name",
    },
  ];
  const dispatch = useDispatch();
  const [statsHeader, setStatsHeader] = useState([
    {
      label: "Total orders amount",
      value: "0",
      id: 1,
    },
    {
      label: "Total tons",
      value: "0",
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
  const handleMultipleDelete = (selectedIds) =>
    dispatch(deleteMultiple({ items: selectedIds }));
  const setSavedFilters = (filters) => {
    dispatch(updateFilters(filters));
  };
  const setSearchString = (search) => dispatch(updateSearch(search));
  const {
    data: purchases,
    filters: savedFilters,
    search,
    fetched,
    loading,
  } = useSelector(getPurchases);

  const { fetched: productsFetched } = useGetInformation({
    selector: getProducts,
    fetcher: fetchProduct,
  });
  useGetInformation({
    selector: getPurchases,
    fetcher: fetchPurchase,
    secondfetch: productsFetched,
  });
  useEffect(() => {
    if (purchases) {
      setStatsHeader((prev) =>
        prev.map((item) => {
          if (item.id === 1) {
            return {
              ...item,
              value: purchases.length
                ?.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
            };
          }
          if (item.id === 2) {
            return {
              ...item,
              value: Number(
                purchases?.reduce((acc, curr) => acc + curr?.quantity, 0)
              )
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
            };
          }
          if (item.id === 3) {
            const totalPrice = purchases?.reduce(
              (acc, curr) => acc + curr?.totalPrice,
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
  }, [purchases]);
  return !fetched || loading ? (
    <Spinner />
  ) : (
    <div>
      <StatsHeader
        description="All time main numbers"
        mainText="Purchases stats overview"
        descriptionItems={statsHeader}
      />
      <Table
        filters={filters}
        setSavedFilters={setSavedFilters}
        search={search}
        setSearchString={setSearchString}
        savedFilters={savedFilters}
        onDeleteMultiple={handleMultipleDelete}
        tableHeader={PURCHASES_TABLE_HEADERS}
        tableItems={purchases}
      />
    </div>
  );
};

export default Purchases;
