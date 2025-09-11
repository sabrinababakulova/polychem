import React, { useState, useEffect } from "react";
import { getManufacturers, getProducts } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { CreateDesign } from "./create-design";
import { postPurchase } from "../../store/get-purchase/post-purchase";
import { editPurchase } from "../../store/get-purchase/edit-purchase";
import { isObjectValuesNotEmpty } from "./constants";
import { CreateCostseModal } from "./additional-cost-modal";
import { setError } from "../../store/get-notif";

export const CreatePurchaseModal = ({
  handleOpenPurchase,
  isEdit,
  selectedItem,
}) => {
  const dispatch = useDispatch();
  const { fetched: manufacturerFetched, data: manufacturers } =
    useSelector(getManufacturers);
  const { fetched: productsFetched, data: products } = useSelector(getProducts);
  const [file, setFile] = useState([]);
  const [subText, setSubText] = useState({
    step: 1,
    text: "Step 1/3: Adding main purchase information",
  });
  const [isDropZone, setIsDropZone] = useState(false);
  const [mainBtnText, setMainBtnText] = useState("Continue");
  const [secondaryBtnText, setSecondaryBtnText] = useState("Cancel");
  const [additionalCostItem, setAdditionalCostItem] = useState({});
  const [purchaseItem, setPurchaseItem] = useState({
    pi: selectedItem?.pi || "",
    manufacturer: selectedItem?.manufacturer_name
      ? {
          label: selectedItem?.manufacturer_name,
          value: selectedItem?.manufacturer_id,
        }
      : null,
    quantity: selectedItem?.quantity || "",
    price: selectedItem?.price || "",
    created_at: selectedItem?.created_at || "",
  });

  const [productsCount, setProductsCount] = useState(
    selectedItem?.product?.map((item, i) => ({
      label: item.name,
      value: item.id,
      id: Number(i) + 100,
    })) || []
  );

  const [createdProducts, setCreatedProducts] = useState(
    selectedItem?.product
      ? selectedItem?.product?.map((prod, i) => {
          console.log(prod.name, i);
          return {
            id: Number(i) + 100,
            label: "Product #" + (i + 1),
            items: products.map((item) => ({ id: item.id, name: item.name })),
            placeholder: "Enter and pick a product",
            value: { label: prod.name, value: prod.id },
            onChange: (e) =>
              setProductsCount((prev) => [
                ...prev,
                { ...e, id: Number(i) + 100 },
              ]),
          };
        })
      : [
          {
            id: 101,
            label: "Product #1",
            items: products.map((item) => ({ id: item.id, name: item.name })),
            placeholder: "Enter and pick a product",
            value: purchaseItem?.product,
            onChange: (e) =>
              setProductsCount((prev) => [...prev, { ...e, id: 101 }]),
          },
        ]
  );

  console.log(createdProducts);

  const items = [
    {
      id: 1,
      label: "PI#",
      isInput: true,
      placeholder: "Enter PI#",
      value: purchaseItem?.pi,
      onChange: (e) =>
        setPurchaseItem((prev) => ({ ...prev, pi: e.target.value })),
    },
    ...createdProducts,
    {
      id: 4,
      label: "Manufacturer",
      items: manufacturers.map((item) => ({ id: item.id, name: item.name })),
      placeholder: "Enter and pick a manufacturer",
      value: purchaseItem?.manufacturer,
      onChange: (e) =>
        setPurchaseItem((prev) => ({ ...prev, manufacturer: e })),
    },
    {
      id: 5,
      label: "Quantity",
      isInput: true,
      placeholder: "Enter quantity in tons",
      value: purchaseItem?.quantity,
      onChange: (e) =>
        setPurchaseItem((prev) => ({ ...prev, quantity: e.target.value })),
    },
    {
      id: 6,
      label: "Price per ton",
      isInput: true,
      placeholder: "Enter price per ton",
      value: purchaseItem?.price,
      onChange: (e) =>
        setPurchaseItem((prev) => ({ ...prev, price: e.target.value })),
    },
    {
      id: 7,
      label: "Created at",
      isInput: true,
      isCalendar: true,
      placeholder: "Enter creation date",
      value: purchaseItem?.created_at,
      onChange: (e) => setPurchaseItem((prev) => ({ ...prev, created_at: e })),
    },
  ];

  const onAddProduct = () => {
    setCreatedProducts((prev) => [
      ...prev,
      {
        id: prev.length + 101,
        label: `Product #${prev.length + 1}`,
        items: products.map((item) => ({ id: item.id, name: item.name })),
        placeholder: "Enter and pick a product",
        value: null,
        onChange: (e) =>
          setProductsCount((prev) => [
            ...prev,
            { ...e, id: prev.length + 101 },
          ]),
      },
    ]);
  };

  useEffect(() => {
    if (purchaseItem) {
      setCreatedProducts((prev) =>
        prev.map((item) => {
          if (item.label?.includes("Product")) {
            return {
              ...item,
              value: productsCount.find((each) => each.id === item.id) || null,
              onChange: (e) => {
                setProductsCount((prev) => {
                  if (prev.some((each) => each.id === item.id)) {
                    return prev.map((each) =>
                      each.id === item.id ? { ...e, id: item?.id } : each
                    );
                  } else {
                    return [...prev, { ...e, id: item?.id }];
                  }
                });
              },
            };
          }

          return item;
        })
      );
    }
  }, [purchaseItem, productsCount]);

  const skipCreate = (item) => {
    setSubText({
      step: 3,
      text: "Step 3/3: Attach documents",
    });
    setIsDropZone(true);
    setMainBtnText("Create");
    setAdditionalCostItem(item);
  };

  const handleEdit = () => {
    dispatch(
      editPurchase({
        purchaseItem,
        productsCount,
        itemId: selectedItem?.id,
      })
    );
    handleOpenPurchase();
  };

  const handleContinue = () => {
    if (subText.step === 1) {
      if (!isObjectValuesNotEmpty(purchaseItem))
        return dispatch(setError("Fill all fields"));
      setSubText({
        step: 2,
        text: "Step 2/3: Adding purchase details",
      });
      setSecondaryBtnText("Back");
    }
    if (subText.step === 3) {
      dispatch(
        postPurchase({
          purchaseItem,
          productsCount,
          additionalCostItem,
          file,
        })
      );
      handleOpenPurchase();
    }
  };

  const handleCancelBtn = () => {
    if (subText.step === 1) {
      handleOpenPurchase();
    }
    if (subText.step === 2) {
      setSubText({
        step: 1,
        text: "Step 1/3: Adding main purchase information",
      });
      setSecondaryBtnText("Cancel");
    }
    if (subText.step === 3) {
      setSubText({
        step: 2,
        text: "Step 2/3: Adding purchase details",
      });
      setIsDropZone(false);
      setMainBtnText("Continue");
      setSecondaryBtnText("Back");
    }
  };

  const handleDeleteFile = (index) => {
    setFile((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <>
      {subText.step !== 2 || isEdit ? (
        <CreateDesign
          loading={!manufacturerFetched || !productsFetched}
          isSkipCreate={subText.step === 2 && !isEdit}
          onSkipCreate={skipCreate}
          subText={!isEdit && subText}
          modalTitle={isEdit ? "Edit Purchase" : "Purchase"}
          items={items}
          handleClose={handleCancelBtn}
          cancelBtnText={isEdit ? "Cancel" : secondaryBtnText}
          handleContinue={isEdit ? handleEdit : handleContinue}
          mainBtnText={isEdit ? "Edit" : mainBtnText}
          isDropZone={isDropZone}
          file={file}
          handleDeleteFile={handleDeleteFile}
          setFile={setFile}
          isAddPI={true}
          onAddPi={onAddProduct}
          piLabel="Add New Product"
        />
      ) : (
        <CreateCostseModal
          handleModal={handleCancelBtn}
          onCreate={skipCreate}
          subText={subText}
          modalTitle="Additional costs"
          isSkipCreate={!isEdit}
          onSkipCreate={skipCreate}
          cancelBtnText={secondaryBtnText}
          mainBtnText={mainBtnText}
        />
      )}
    </>
  );
};
