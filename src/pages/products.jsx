import React, { useState } from "react";
import { Table } from "../components/table";
import { PRODUCT_TABLE_HEADERS } from "../constants";
import { ReactComponent as PlusSign } from "../icons/plus-sign-box.svg";
import { CreateProductModal } from "../components/modals/create-product-modal";
import { getProducts } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../store/products/fetch-products";
import { useGetInformation } from "../hooks/use-get-information";
import { deleteMultiple } from "../store/products/delete-multiple";
import { Spinner } from "../components/spinner";
import { updateFilters, updateSearch } from "../store/products";
import { TransitionWrapper } from "../components/modals/transition-wrapper";

const Products = () => {
  const filters = [
    {
      id: 1,
      name: "Product name",
      searchKey: "name",
    },
    {
      id: 2,
      name: "Category",
      searchKey: "category_name",
    },
    {
      id: 3,
      name: "Subcategory",
      searchKey: "subcategory_name",
    },
  ];
  const dispatch = useDispatch();
  const handleMultipleDelete = (selectedIds) =>
    dispatch(deleteMultiple({ items: selectedIds }));
  const [openProduct, setOpenProduct] = useState(false);
  const handleOpenProduct = () => setOpenProduct(!openProduct);
  const {
    data,
    filters: savedFilters,
    search,
    fetched,
    loading,
  } = useSelector(getProducts);
  useGetInformation({ selector: getProducts, fetcher: fetchProduct });
  const setSearchString = (search) => dispatch(updateSearch(search));
  const setSavedFilters = (filters) => {
    dispatch(updateFilters(filters));
  };
  return !fetched || loading ? (
    <Spinner />
  ) : (
    <>
      <Table
        setSavedFilters={setSavedFilters}
        savedFilters={savedFilters}
        filters={filters}
        onDeleteMultiple={handleMultipleDelete}
        tableItems={data}
        search={search}
        setSearchString={setSearchString}
        extraBtnText="Add Product"
        extraBtnIcon={<PlusSign />}
        onExtraBtnClick={handleOpenProduct}
        tableHeader={PRODUCT_TABLE_HEADERS}
        isFullHeight
      />
      <TransitionWrapper isShow={openProduct}>
        <CreateProductModal handleModal={handleOpenProduct} />
      </TransitionWrapper>
    </>
  );
};

export default Products;
