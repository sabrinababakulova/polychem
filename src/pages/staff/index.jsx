import React, { useState } from "react";
import { Table } from "../../components/table";
import {
  SALES_PERFORMANCE_HEADERS,
  STAFF_TABLE_HEADERS,
} from "../../constants";
import { getStaff } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as PlusSign } from "../../icons/plus-sign-box.svg";
import { CreateStaffModal } from "../../components/modals/create-staff-modal";
import { deleteMultiple } from "../../store/staff/delete-multiple";
import { Spinner } from "../../components/spinner";
import { useLocation } from "react-router-dom";
import { updateFilters, updateSearch } from "../../store/staff";
import { TransitionWrapper } from "../../components/modals/transition-wrapper";

const Staff = () => {
  const filters = [
    {
      id: 6,
      name: "Position",
      searchKey: "position",
    },
    {
      id: 9,
      name: "Status",
      searchKey: "status",
    },
  ];
  const dispatch = useDispatch();
  const location = useLocation();
  const secondPath = location.search.split("=")[1];

  const handleMultipleDelete = (selectedIds) =>
    dispatch(deleteMultiple({ items: selectedIds }));
  const [openCreateStaff, setOpenCreateStaff] = useState(false);
  const handleCreateStaff = () => setOpenCreateStaff(!openCreateStaff);
  const {
    data,
    filters: savedFilters,
    search,
    fetched,
    loading,
  } = useSelector(getStaff);
  const setSearchString = (search) => dispatch(updateSearch(search));
  const setSavedFilters = (filters) => {
    dispatch(updateFilters(filters));
  };
  if (!fetched || loading) {
    return <Spinner />;
  }
  return (
    <>
      {secondPath === "management" ? (
        <Table
          setSavedFilters={setSavedFilters}
          savedFilters={savedFilters}
          isNew={secondPath}
          filters={filters}
          search={search}
          setSearchString={setSearchString}
          onDeleteMultiple={handleMultipleDelete}
          tableItems={data}
          extraBtnText="Add an Employee"
          extraBtnIcon={<PlusSign />}
          onExtraBtnClick={handleCreateStaff}
          tableHeader={STAFF_TABLE_HEADERS}
          isFullHeight
        />
      ) : (
        <Table
          setSavedFilters={setSavedFilters}
          savedFilters={savedFilters}
          isNew={secondPath}
          filters={filters}
          isSecondTable
          search={search}
          setSearchString={setSearchString}
          onDeleteMultiple={handleMultipleDelete}
          tableItems={data}
          extraBtnText="Add an Employee"
          extraBtnIcon={<PlusSign />}
          onExtraBtnClick={handleCreateStaff}
          tableHeader={SALES_PERFORMANCE_HEADERS}
          isFullHeight
        />
      )}
      <TransitionWrapper isShow={openCreateStaff}>
        <CreateStaffModal handleModal={handleCreateStaff} />
      </TransitionWrapper>
    </>
  );
};

export default Staff;
