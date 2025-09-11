import React, { useEffect, useState } from "react";
import { Table } from "../components/table";
import { PRICE_ANALYTICS_TABLE_HEADERS } from "../constants";
import { useNavigate } from "react-router-dom";
import { useGetRoleRestrictions } from "../hooks/use-get-role-acess";
import { getProducts } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { updateFilters } from "../store/products";

const PriceAnalytics = () => {
  const dispatch = useDispatch();
  const filters = [
    {
      id: 1,
      name: "Product Name",
      searchKey: "product_name",
    },
    {
      id: 2,
      name: "Manufacturer",
      searchKey: "manufacturer_name",
    },
  ];
  const { data: products, filters: savedFilters } = useSelector(getProducts);

  const setSavedFilters = (filters) => {
    dispatch(updateFilters(filters));
  };

  const navigate = useNavigate();
  const restrictions = useGetRoleRestrictions();
  const [allPrices, setAllPrices] = useState([]);
  useEffect(() => {
    const isPageRestricted = restrictions?.["price analytics"];
    if (typeof isPageRestricted === "boolean" && isPageRestricted === false)
      navigate("/purchases");
  }, [restrictions, navigate]);

  useEffect(() => {
    setAllPrices(products?.map((product) => product.prices).flat());
  }, [products]);

  return (
    <Table
      setSavedFilters={setSavedFilters}
      savedFilters={savedFilters}
      filters={filters}
      onClick={() => {}}
      tableItems={allPrices}
      tableHeader={PRICE_ANALYTICS_TABLE_HEADERS}
      isFullHeight
    />
  );
};

export default PriceAnalytics;
