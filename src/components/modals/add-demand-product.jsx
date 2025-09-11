import React, { useEffect, useState } from "react";
import { CreateDesign } from "./create-design";
import { isObjectValuesNotEmpty } from "./constants";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../store/get-notif";
import { getProducts } from "../../store";
import { editCustomer } from "../../store/customers/edit-customers";

export const CreateDemandModal = ({ handleModal, itemId, selectedItem }) => {
  const dispatch = useDispatch();
  const { fetched, data: products } = useSelector(getProducts);

  const [chosenDemand, setChosenDemand] = useState([
    {
      pi: 1,
      product: selectedItem?.product || "",
      demand: selectedItem?.demand || "",
    },
  ]);

  const [items, setItems] = useState([
    {
      id: 1,
      pi: 1,
      label: "Product #1",
      piId: 1,
      items: products,
      placeholder: "Pick a product",
      isDeleteEnabled: true,
      value: chosenDemand[0]?.product,
      onChange: (e) =>
        setChosenDemand((prev) =>
          prev.map((item) => (item.pi === 1 ? { ...item, product: e } : item))
        ),
    },
    {
      id: 2,
      pi: 1,
      piId: 2,
      label: "Demand #1",
      isInput: true,
      placeholder: "Enter demanded quantity",
      value: chosenDemand[0]?.demand,
      onChange: (e) =>
        setChosenDemand((prev) =>
          prev.map((item) =>
            item.pi === 1 ? { ...item, demand: e.target.value } : item
          )
        ),
    },
  ]);

  const handleContinue = () => {
    if (!isObjectValuesNotEmpty(chosenDemand))
      return dispatch(setError("Fill all fields"));

    dispatch(
      editCustomer({
        itemId,
        chosenDemand,
      })
    );
    handleModal();
  };
  const addPi = () => {
    setChosenDemand((prev) => [
      ...prev,
      { pi: prev.length + 1, product: "", demand: "" },
    ]);
    const newInput = {
      id: items.length + 1,
      label: `Product #${chosenDemand.length + 1}`,
      piId: 1,
      items: products,
      isDeleteEnabled: true,
      placeholder: "Pick a Product",
      pi: chosenDemand.length + 1,
      onChange: (e) =>
        setChosenDemand((prev) =>
          prev.map((item) =>
            item.pi === chosenDemand.length + 1 ? { ...item, product: e } : item
          )
        ),
      value: chosenDemand[chosenDemand?.length]?.product,
    };
    const newInputQuantity = {
      id: items.length + 2,
      label: `Demand #${chosenDemand.length + 1}`,
      isInput: true,
      piId: 2,
      placeholder: "Enter demanded quantity",
      pi: chosenDemand.length + 1,
      onChange: (e) =>
        setChosenDemand((prev) =>
          prev.map((item) =>
            item.pi === chosenDemand.length + 1
              ? { ...item, demand: e.target.value }
              : item
          )
        ),
      value: chosenDemand[chosenDemand?.length]?.demand,
    };
    setItems((prev) => [...prev, newInput, newInputQuantity]);
  };

  const deletePi = (pi) => {
    setChosenDemand((prev) => prev.filter((item) => item.pi !== pi));
    setItems((prev) => prev.filter((item) => item.pi !== pi));
  };

  useEffect(() => {
    setItems((prev) => {
      return prev?.map((item) => {
        if (item?.pi) {
          const temp = chosenDemand?.find((each) => each?.pi === item?.pi);
          if (item.piId === 1) return { ...item, value: temp?.product };
          if (item.piId === 2) return { ...item, value: temp?.demand };
        }
        return item;
      });
    });
  }, [chosenDemand]);

  return (
    <CreateDesign
      loading={!fetched}
      isAddPI={true}
      piLabel="Add New Demand"
      modalTitle="Add Demand"
      onAddPi={addPi}
      items={items}
      handleClose={handleModal}
      cancelBtnText="Cancel"
      handleContinue={handleContinue}
      onDeleteInput={chosenDemand?.length > 1 && deletePi}
      mainBtnText="Add"
    />
  );
};
