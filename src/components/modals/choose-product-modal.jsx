import React, { useState } from "react";
import { CreateDesign } from "./create-design";
import { getProducts } from "../../store";
import { useSelector } from "react-redux";

export const ChooseProductModal = ({ handleModal }) => {
  const { data: products, fetched } = useSelector(getProducts);

  const [chosenProduct, setChosenProduct] = useState({
    label: products?.[0]?.product_name,
    value: products?.[0]?.id,
  });
  const items = [
    {
      id: 3,
      label: "Product",
      value: chosenProduct,
      onChange: (e) => setChosenProduct(e),
      items: products.map((item) => ({
        id: item.id,
        name: item.product_name,
      })),
      placeholder: "Enter and pick a product",
    },
  ];

  const handleContinue = () => {};
  const handleCancelBtn = () => {
    handleModal();
  };

  return (
    <CreateDesign
      loading={!fetched}
      items={items}
      modalTitle="Choose a product"
      handleClose={handleCancelBtn}
      handleContinue={handleContinue}
    />
  );
};
