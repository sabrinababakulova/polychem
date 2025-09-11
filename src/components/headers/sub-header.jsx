import React, { useState } from "react";
import { HeaderWrapper } from "./header-wrapper";
import { Input } from "../input";
import { ReactComponent as Search } from "../../icons/search.svg";
import { ReactComponent as Export } from "../../icons/export.svg";
import { ReactComponent as Filters } from "../../icons/filters.svg";
import { ReactComponent as Sorting } from "../../icons/sorting.svg";
import { ReactComponent as TickInBox } from "../../icons/tick-in-box.svg";
import { ReactComponent as Trash } from "../../icons/trash.svg";
import { Button, GreyScaleButton, RedButton } from "../button";
import { MOBILE_WIDTH } from "../../constants";
import { DeleteModal } from "../modals/delete-modal";
import SortingModal from "../modals/sorting-modal";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useGetDashboardHeader } from "../../hooks/use-get-dashboard-header";
import { useGetRoleRestrictions } from "../../hooks/use-get-role-acess";
import { FilterLoads } from "../modals/filter-loads";
import { isEmpty } from "lodash";
import { TransitionWrapper } from "../modals/transition-wrapper";

export const SubHeader = ({
  extraBtnText,
  extraBtnIcon,
  onSelect,
  onExtraBtnClick,
  isSelectEnabled,
  onDelete,
  sortingCriteria = [],
  onsorting,
  onSearch,
  tableRef,
  chosenSorting,
  onFilter,
  filters,
  filteringArray,
  chosenFilters,
  search,
}) => {
  const { main: path, addition } = useGetDashboardHeader();
  const restrictions = useGetRoleRestrictions();
  const isDeleteRestricted =
    restrictions?.[addition] !== false &&
    restrictions?.[addition]?.includes("delete");
  const isCreateRestricted =
    restrictions?.[addition] !== false &&
    restrictions?.[addition]?.includes("create");
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: path,
    sheet: path,
  });
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openSorting, setOpenSorting] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const handleFilters = () => setOpenFilter(!openFilter);
  const handleSorting = () => setOpenSorting(!openSorting);
  const handleDelete = () => {
    onDelete();
    setOpenConfirmationModal(false);
  };
  if (window.innerWidth > MOBILE_WIDTH) {
    return (
      <>
        <HeaderWrapper>
          <Input
            onChange={onSearch}
            value={search}
            placeholder="Search"
            icon={<Search />}
            iconPosition="left"
          />
          <div className="flex gap-3">
            {isSelectEnabled ? (
              <>
                <GreyScaleButton onClick={onSelect} text="Cancel" />
                <RedButton
                  isRestricted={isDeleteRestricted}
                  onClick={() => setOpenConfirmationModal(true)}
                  normalWidth
                  icon={<Trash />}
                  text="Delete"
                />
                <Button
                  onClick={onDownload}
                  text="Export"
                  icon={<Export className="[&>path]:stroke-white" />}
                />
              </>
            ) : (
              <>
                <GreyScaleButton
                  onClick={onSelect}
                  text="Select"
                  icon={<TickInBox />}
                />
                <GreyScaleButton
                  text="Filter by"
                  isActive={!isEmpty(chosenFilters)}
                  onClick={handleFilters}
                  icon={<Filters />}
                />
                <GreyScaleButton
                  onClick={handleSorting}
                  text="Sort by"
                  icon={<Sorting />}
                />
                <GreyScaleButton
                  onClick={onDownload}
                  text="Export"
                  icon={<Export />}
                />
                {extraBtnText && (
                  <Button
                    isRestricted={isCreateRestricted}
                    width="w-60"
                    text={extraBtnText}
                    icon={extraBtnIcon}
                    onClick={onExtraBtnClick}
                  />
                )}
              </>
            )}
          </div>
        </HeaderWrapper>
        <TransitionWrapper isShow={openConfirmationModal}>
          <DeleteModal
            onDelete={handleDelete}
            onCancel={() => setOpenConfirmationModal(false)}
            mainTitle="Are you sure you want to delete all of them?"
            subTitle=" "
            secondaryBtnText="Yes, delete"
          />
        </TransitionWrapper>
        <TransitionWrapper isShow={openSorting}>
          <SortingModal
            chosenSortingType={chosenSorting}
            onCancel={handleSorting}
            sortingCriteria={sortingCriteria}
            onChoose={onsorting}
          />
        </TransitionWrapper>
        <TransitionWrapper isShow={openFilter}>
          <FilterLoads
            chosenFilters={chosenFilters}
            filters={filters}
            onCancel={handleFilters}
            items={filteringArray}
            onChoose={onFilter}
          />
        </TransitionWrapper>
      </>
    );
  }
};
