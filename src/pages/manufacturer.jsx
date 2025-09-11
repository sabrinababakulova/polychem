import React, { useState } from "react";
import { Table } from "../components/table";
import { MANUFACTURER_TABLE_HEADERS } from "../constants";
import { useGetInformation } from "../hooks/use-get-information";
import { getManufacturers } from "../store";
import { fetchManufacturer } from "../store/get-manufacturer/fetch-manufacturer";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as PlusSign } from "../icons/plus-sign-box.svg";
import { CreateManufacturerModal } from "../components/modals/create-manufacturer-modal";
import { deleteMultiple } from "../store/get-manufacturer/delete-multiple";
import { Spinner } from "../components/spinner";
import { updateFilters, updateSearch } from "../store/get-manufacturer";
import { TransitionWrapper } from "../components/modals/transition-wrapper";

const Manufacturer = () => {
  const filters = [
    {
      id: 2,
      name: "Country",
      searchKey: "country_name",
    },
    {
      id: 4,
      name: "Address",
      searchKey: "address",
    },
  ];
  const dispatch = useDispatch();
  const handleMultipleDelete = (selectedIds) =>
    dispatch(deleteMultiple({ items: selectedIds }));
  const {
    data,
    filters: savedFilters,
    search,
    fetched,
    loading,
  } = useSelector(getManufacturers);
  const [openManufacturer, setOpenManufacturer] = useState(false);
  const setSavedFilters = (filters) => {
    dispatch(updateFilters(filters));
  };
  const setSearchString = (search) => dispatch(updateSearch(search));
  const handleModal = () => setOpenManufacturer(!openManufacturer);
  useGetInformation({ selector: getManufacturers, fetcher: fetchManufacturer });
  return !fetched || loading ? (
    <Spinner />
  ) : (
    <>
      <Table
        setSavedFilters={setSavedFilters}
        savedFilters={savedFilters}
        filters={filters}
        search={search}
        setSearchString={setSearchString}
        tableItems={data}
        onDeleteMultiple={handleMultipleDelete}
        extraBtnText="Add Manufacturer"
        extraBtnIcon={<PlusSign />}
        tableHeader={MANUFACTURER_TABLE_HEADERS}
        onExtraBtnClick={handleModal}
        isFullHeight
      />
      <TransitionWrapper isShow={openManufacturer}>
        <CreateManufacturerModal handleModal={handleModal} />
      </TransitionWrapper>
    </>
  );
};

export default Manufacturer;
