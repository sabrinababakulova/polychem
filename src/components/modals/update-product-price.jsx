import React, { useEffect, useState } from "react";
import { CreateDesign } from "./create-design";
import { getManufacturers } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../store/get-notif";
import { postProductPrice } from "../../store/products/post-price-analytics";
import { isObjectValuesNotEmpty } from "./constants";

export const CreateProductPrice = ({ handleModal, itemId }) => {
  const dispatch = useDispatch();
  const { fetched, data: manufacturers } = useSelector(getManufacturers);
  const [chosenPrices, setChosenPrices] = useState({
    date: "",
    maxStock: "",
    minStock: "",
    conversionRate: "",
  });
  const [manufacturersPrices, setManufacturersPrices] = useState([
    {
      pi: 1,
      manufacturer: "",
      price: "",
    },
  ]);
  const [items, setItems] = useState([
    {
      id: 1,
      label: "Date",
      isInput: true,
      isCalendar: true,
      priceKey: "date",
      value: chosenPrices?.date,
      onChange: (e) => setChosenPrices((prev) => ({ ...prev, date: e })),
      placeholder: "Enter Date",
    },
    {
      id: 2,
      label: "Max stock price",
      isInput: true,
      priceKey: "maxStock",
      inputAddition: "$",
      value: chosenPrices?.maxStock,
      onChange: (e) =>
        setChosenPrices((prev) => ({ ...prev, maxStock: e?.target?.value })),
      placeholder: "Enter max stock price",
    },
    {
      id: 3,
      label: "Min stock price",
      priceKey: "minStock",
      inputAddition: "$",
      placeholder: "Enter min stock price",
      value: chosenPrices?.minStock,
      onChange: (e) =>
        setChosenPrices((prev) => ({ ...prev, minStock: e?.target?.value })),
      isInput: true,
    },
    {
      id: 4,
      label: "USD to UZS rate",
      priceKey: "conversionRate",
      inputAddition: "UZS",
      value: chosenPrices?.conversionRate,
      onChange: (e) =>
        setChosenPrices((prev) => ({
          ...prev,
          conversionRate: e?.target?.value,
        })),
      isInput: true,
      placeholder: "Enter USD to UZS rate",
    },
    {
      id: 5,
      piId: 1,
      manufacturerKey: "manufacturer",
      label: "Manufacturer #1",
      items: manufacturers,
      placeholder: "Pick Manufacturer",
      isDeleteEnabled: true,
      pi: 1,
      onChange: (e) =>
        setManufacturersPrices((prev) =>
          prev.map((item) =>
            item.pi === 1 ? { ...item, manufacturer: e } : item
          )
        ),
      value: manufacturersPrices[0]?.manufacturer,
    },
    {
      id: 6,
      piId: 2,
      label: "Manufacturer #1 price",
      isInput: true,
      placeholder: "Enter price",
      pi: 1,
      onChange: (e) =>
        setManufacturersPrices((prev) =>
          prev.map((item) =>
            item.pi === 1 ? { ...item, price: e.target.value } : item
          )
        ),
      value: manufacturersPrices[0]?.quantity,
    },
  ]);

  const addPi = () => {
    setManufacturersPrices((prev) => [
      ...prev,
      { pi: prev.length + 1, manufacturer: "", price: "" },
    ]);
    const newInput = {
      id: items.length + 1,
      label: `Manufacturer #${manufacturersPrices.length + 1}`,
      piId: 1,
      items: manufacturers,
      isDeleteEnabled: true,
      placeholder: "Pick a Manufacturer",
      pi: manufacturersPrices.length + 1,
      onChange: (e) =>
        setManufacturersPrices((prev) =>
          prev.map((item) =>
            item.pi === manufacturersPrices.length + 1
              ? { ...item, manufacturer: e }
              : item
          )
        ),
      value: manufacturersPrices[manufacturersPrices?.length]?.manufacturer,
    };
    const newInputQuantity = {
      id: items.length + 2,
      label: `Manufacturer #${manufacturersPrices.length + 1} price`,
      isInput: true,
      piId: 2,
      placeholder: "Enter Price",
      pi: manufacturersPrices.length + 1,
      onChange: (e) =>
        setManufacturersPrices((prev) =>
          prev.map((item) =>
            item.pi === manufacturersPrices.length + 1
              ? { ...item, price: e.target.value }
              : item
          )
        ),
      value: manufacturersPrices[manufacturersPrices?.length]?.price,
    };
    setItems((prev) => [...prev, newInput, newInputQuantity]);
  };

  const deletePi = (pi) => {
    setManufacturersPrices((prev) => prev.filter((item) => item.pi !== pi));
    setItems((prev) => prev.filter((item) => item.pi !== pi));
  };

  const handleContinue = () => {
    if (!isObjectValuesNotEmpty(chosenPrices))
      return dispatch(setError("Please fill all the fields"));
    dispatch(
      postProductPrice({
        chosenPrices,
        manufacturersPrices,
        itemId,
      })
    );
    handleModal();
  };
  useEffect(() => {
    setItems((prev) =>
      prev?.map((item) => {
        return {
          ...item,
          value: chosenPrices?.[item?.priceKey],
        };
      })
    );
  }, [chosenPrices]);

  useEffect(() => {
    setItems((prev) => {
      return prev?.map((item) => {
        if (item?.pi) {
          const temp = manufacturersPrices?.find(
            (each) => each?.pi === item?.pi
          );
          if (item.piId === 1) return { ...item, value: temp?.manufacturer };
          if (item.piId === 2) return { ...item, value: temp?.price };
        }
        return item;
      });
    });
  }, [manufacturersPrices]);

  return (
    <CreateDesign
      loading={!fetched}
      modalTitle="Update product price"
      items={items}
      isAddPI={true}
      piLabel="Add Manufacturer Price"
      onAddPi={addPi}
      handleClose={handleModal}
      onDeleteInput={manufacturersPrices?.length > 1 && deletePi}
      handleContinue={handleContinue}
      mainBtnText="Save changes"
    />
  );
};
