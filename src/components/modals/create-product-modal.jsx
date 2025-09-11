import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postProduct } from "../../store/products/post-products";
import { CreateDesign } from "./create-design";
import { fetchSubcategory } from "../../store/categories/fetch-categories";
import { getCategories } from "../../store";
import { useGetSubcategoryInformation } from "../../hooks/use-get-information";
import {
  postCategory,
  postSubcategory,
} from "../../store/categories/post-category";
import { setSubfetchingFalse, setfetchingFalse } from "../../store/categories";
import { isEmpty } from "lodash";
import { editProduct } from "../../store/products/edit-product";
import { setError } from "../../store/get-notif";

export const CreateProductModal = ({ handleModal, isEdit, selectedItem }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState([]);
  const [isDropZone, setIsDropZone] = useState(false);
  const [mainBtnText, setMainBtnText] = useState("Continue");
  const [cancelBtnText, setCancelBtnText] = useState("Cancel");
  const [name, setName] = useState(selectedItem?.name || "");
  const [category, setCategory] = useState(
    selectedItem?.category_id
      ? {
          label: selectedItem?.category_name,
          value: selectedItem?.category_id,
        }
      : {}
  );
  const [subcategory, setSubcategory] = useState(
    selectedItem?.subcategory_id
      ? {
          label: selectedItem?.subcategory_name,
          value: selectedItem?.subcategory_id,
        }
      : {}
  );
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isNewSubcategory, setIsNewSubcategory] = useState("");
  const {
    categories,
    subcategories,
    newCategoryFetched,
    newSubcategoryFetched,
  } = useSelector(getCategories);

  useGetSubcategoryInformation({
    selector: getCategories,
    fetcher: fetchSubcategory,
  });
  const [subText, setSubText] = useState({
    step: 1,
    text: "Step 1/2: Adding main product information",
  });
  const [items, setItems] = useState([
    {
      id: 1,
      label: "Product name",
      isInput: true,
      placeholder: "Enter product name",
      value: name,
      onChange: (e) => setName(e.target.value),
    },
    {
      id: 2,
      label: "Category",
      placeholder: "Enter and pick a category",
      items: categories,
      value: category,
      selectText: "Add as a new category",
      onChange: (e) => setCategory(e),
      addNewItem: (name) => {
        dispatch(postCategory({ name }));
        setIsNewCategory(true);
      },
    },
    {
      id: 3,
      label: "Subcategory",
      placeholder: "Enter and pick a subcategory",
      selectText: "Add as a new subcategory",
      value: subcategory,
      items: subcategories,
      addNewItem: (name) => {
        setIsNewSubcategory(name);
      },
      onChange: (e) => setSubcategory(e),
    },
  ]);

  const handleEdit = () => {
    dispatch(
      editProduct({
        itemId: selectedItem.id,
        name,
        category,
        subcategory,
      })
    );
    handleModal();
  };

  const handleContinue = () => {
    if (subText.step === 1) {
      if (!name || isEmpty(category) || isEmpty(subcategory))
        return dispatch(setError("Fill all fields"));
      setSubText({
        step: 2,
        text: "Step 2/2: Attach documents",
      });
      setIsDropZone(true);
      setMainBtnText("Create");
      setCancelBtnText("Go back");
    }
    if (subText.step === 2) {
      dispatch(
        postProduct({
          name,
          category,
          subcategory,
          file,
        })
      );
      handleModal();
    }
  };

  const handleClose = () => {
    if (subText.step === 1) {
      handleModal();
    }
    if (subText.step === 2) {
      setSubText({
        step: 1,
        text: "Step 1/2: Adding main product information",
      });
      setIsDropZone(false);
      setMainBtnText("Continue");
      setCancelBtnText("Cancel");
    }
  };

  useEffect(() => {
    setItems((prev) =>
      prev?.map((item) => {
        if (item.id === 1) return { ...item, value: name };
        if (item.id === 2) return { ...item, value: category };
        if (item.id === 3) return { ...item, value: subcategory };
        return item;
      })
    );
  }, [category, subcategory, name]);

  useEffect(() => {
    if (categories && subcategories) {
      setItems((prev) =>
        prev?.map((item) => {
          if (item.id === 2) return { ...item, items: categories };
          if (item.id === 3)
            return {
              ...item,
              items: subcategories,
            };
          return item;
        })
      );
      if (isNewCategory && newCategoryFetched) {
        setCategory({
          label: categories[categories.length - 1]?.name,
          value: categories[categories.length - 1]?.id,
        });
        setIsNewCategory(false);
        dispatch(setfetchingFalse());
      }
      if (isNewSubcategory && newSubcategoryFetched) {
        setIsNewSubcategory(false);
        setSubcategory({
          label: subcategories[subcategories.length - 1]?.name,
          value: subcategories[subcategories.length - 1]?.id,
        });
        dispatch(setSubfetchingFalse());
      }
    }
  }, [
    categories,
    isNewCategory,
    dispatch,
    category,
    newCategoryFetched,
    newSubcategoryFetched,
    isNewSubcategory,
    subcategories,
  ]);

  useEffect(() => {
    if (isNewSubcategory) {
      dispatch(postSubcategory({ name: isNewSubcategory, parent: category }));
    }
  }, [isNewSubcategory, dispatch]);

  const handleDeleteFile = (index) => {
    setFile((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <CreateDesign
      subText={!isEdit && subText}
      modalTitle={isEdit ? "Edit a product" : "Create a Product"}
      items={items}
      handleClose={handleClose}
      handleContinue={isEdit ? handleEdit : handleContinue}
      mainBtnText={mainBtnText}
      cancelBtnText={cancelBtnText}
      isDropZone={isDropZone}
      file={file}
      handleDeleteFile={handleDeleteFile}
      setFile={setFile}
    />
  );
};
