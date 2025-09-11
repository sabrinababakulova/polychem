import React, { useState } from "react";
import { CreateDesign } from "./create-design";

const SortingModal = ({
  sortingCriteria,
  chosenSortingType,
  onCancel,
  onChoose,
}) => {
  const [chosenSorting, setChosenSorting] = useState(
    chosenSortingType?.asc ? { label: chosenSortingType?.asc } : ""
  );
  const [chosenSortingObject, setChosenSortingObject] = useState(
    chosenSortingType?.sortingObject
      ? { label: chosenSortingType?.sortingObject }
      : ""
  );
  const items = [
    {
      id: 1,
      label: "Sorting Type",
      placeholder: "Choose sorting type",
      value: chosenSorting,
      items: [
        {
          id: 1,
          name: "Descending",
        },
        {
          id: 2,
          name: "Ascending",
        },
      ],
      onChange: (e) => setChosenSorting(e),
    },
    {
      id: 2,
      label: "Sorting Object",
      placeholder: "Choose sorting object",
      value: chosenSortingObject,
      items: sortingCriteria
        ?.filter(
          (item) =>
            item?.toLowerCase() !== "product" &&
            item?.toLowerCase() !== "manufacturer" &&
            item?.toLowerCase() !== "origin" &&
            item?.toLowerCase() !== "customer" &&
            item?.toLowerCase() !== "payment type" &&
            item?.toLowerCase() !== "payment condition" &&
            item?.toLowerCase() !== "product name" &&
            item?.toLowerCase() !== "category" &&
            item?.toLowerCase() !== "subcategory" &&
            item?.toLowerCase() !== "wagon type" &&
            item?.toLowerCase() !== "wagon location" &&
            item?.toLowerCase() !== "status" &&
            item?.toLowerCase() !== "company name" &&
            item?.toLowerCase() !== "contact person" &&
            item?.toLowerCase() !== "priority" &&
            item?.toLowerCase() !== "phone number" &&
            item?.toLowerCase() !== "e-mail" &&
            item?.toLowerCase() !== "manufacturer name" &&
            item?.toLowerCase() !== "full name" &&
            item?.toLowerCase() !== "position" &&
            item?.toLowerCase() !== "status" &&
            item?.toLowerCase() !== "person" &&
            item?.toLowerCase() !== "action type" &&
            item?.toLowerCase() !== "changing object" &&
            item?.toLowerCase() !== "related objects" &&
            item?.toLowerCase() !== "country" &&
            item?.toLowerCase() !== "city" &&
            item?.toLowerCase() !== "address" &&
            item?.toLowerCase() !== "sales manager" &&
            item?.toLowerCase() !== "transaction type" &&
            item?.toLowerCase() !== "created by" &&
            item?.toLowerCase() !== "delivery condition"
        )
        ?.map((item) => ({ name: item, id: item })),
      onChange: (e) => setChosenSortingObject(e),
    },
  ];
  const handleContinue = () => {
    onChoose(chosenSorting?.label, chosenSortingObject?.label);
    onCancel();
  };

  return (
    <CreateDesign
      modalTitle="Sort Items"
      items={items}
      handleClose={onCancel}
      handleContinue={handleContinue}
      mainBtnText="Apply"
    />
  );
};

export default SortingModal;
