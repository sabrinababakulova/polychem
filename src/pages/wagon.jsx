import React, { useState } from "react";
import { Table } from "../components/table";
import { WAGONS_TABLE_HEADERS } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { getWagons } from "../store";
import { useGetInformation } from "../hooks/use-get-information";
import { fetchWagon } from "../store/wagons/fetch-wagons";
import { ReactComponent as PlusSign } from "../icons/plus-sign-box.svg";
import { CreateWagonModal } from "../components/modals/create-wagon";
import { deleteMultiple } from "../store/wagons/delete-multiple";
import { Spinner } from "../components/spinner";
import { updateFilters, updateSearch } from "../store/wagons";
import { TransitionWrapper } from "../components/modals/transition-wrapper";

const Wagon = () => {
  const filters = [
    {
      id: 2,
      name: "Wagon Type",
      searchKey: "type",
    },
    {
      id: 3,
      name: "Location",
      searchKey: "location",
    },
  ];
  const dispatch = useDispatch();
  const handleMultipleDelete = (items) => dispatch(deleteMultiple({ items }));
  const [openCreateWagon, setOpenCreateWagon] = useState(false);
  const handleCreateWagon = () => setOpenCreateWagon(!openCreateWagon);
  const {
    data,
    filters: savedFilters,
    search,
    fetched,
    loading,
  } = useSelector(getWagons);
  const setSavedFilters = (filters) => {
    dispatch(updateFilters(filters));
  };
  const setSearchString = (search) => dispatch(updateSearch(search));
  useGetInformation({ selector: getWagons, fetcher: fetchWagon });
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
        onDeleteMultiple={handleMultipleDelete}
        tableItems={data}
        extraBtnText="Add Wagon"
        extraBtnIcon={<PlusSign />}
        onExtraBtnClick={handleCreateWagon}
        tableHeader={WAGONS_TABLE_HEADERS}
        isFullHeight
      />
      <TransitionWrapper isShow={openCreateWagon}>
        <CreateWagonModal handleModal={handleCreateWagon} />
      </TransitionWrapper>
    </>
  );
};

export default Wagon;
