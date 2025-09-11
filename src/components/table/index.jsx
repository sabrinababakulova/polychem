import React, { Fragment, useEffect, useRef, useState } from "react";
import { SubHeader } from "../headers/sub-header";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as ThreeDots } from "../../icons/three-dots.svg";
import { ReactComponent as Edit } from "../../icons/edit-v2.svg";
import { ReactComponent as Trash } from "../../icons/trash.svg";
import { PopUp } from "../pop-up";
import { DeleteModal } from "../modals/delete-modal";
import { CustomTd } from "./custom-td";
import { useGetRoleRestrictions } from "../../hooks/use-get-role-acess";
import { useGetDashboardHeader } from "../../hooks/use-get-dashboard-header";
import { isEmpty } from "lodash";
import {
  TransitionWrapper,
  TransitionWrapperPopup,
} from "../modals/transition-wrapper";

export const Table = ({
  tableHeader,
  tableItems,
  extraBtnIcon,
  extraBtnText,
  onExtraBtnClick,
  isHeader = true,
  isInsider = false,
  onClick,
  isEditRestricted,
  isDeleteRestricted,
  itemIsStatusIndex,
  editName,
  isThreeDots = false,
  onDelete,
  onDeleteMultiple,
  isSecondTable,
  isThirdTable,
  isFourthTable,
  filters,
  setSavedFilters,
  savedFilters,
  isNew,
  search,
  setSearchString,
  isFullHeight = false,
}) => {
  const tableRef = useRef();
  const selectedTableRef = useRef();
  const refs = useRef({});

  const [isSelectEnabled, setIsSelectEnabled] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [filteredItems, setFilteredItems] = useState(tableItems);
  const [chosenSorting, setChosenSorting] = useState({
    asc: "",
    sortingObject: "",
  });
  const restrictions = useGetRoleRestrictions();
  const { addition } = useGetDashboardHeader();
  const isDeleteLoadRestricted =
    restrictions[`${addition} loads`]?.includes("delete");
  const isEditLoadRestricted =
    restrictions[`${addition} loads`]?.includes("edit");
  const isInsiderRestricted =
    restrictions[addition] !== false &&
    restrictions[addition]?.includes("insider");

  const navigate = useNavigate();
  const location = useLocation();
  const handlePopup = (id) =>
    !id || id === openEditPopup
      ? setOpenEditPopup(false)
      : setOpenEditPopup(id);
  const enableSelect = () => setIsSelectEnabled(!isSelectEnabled);

  const handleSorting = (asc, sortingObject) => {
    setChosenSorting({ asc, sortingObject });
    const sortingIndex = tableHeader.findIndex(
      (item) => item === sortingObject
    );
    const temp = [...tableItems];

    const sortByAsc = (a, b) => {
      if (isSecondTable) {
        if (
          !isNaN(a?.secondTable?.[sortingIndex]) &&
          !isNaN(b?.secondTable?.[sortingIndex])
        ) {
          return (
            a?.secondTable?.[sortingIndex] - b?.secondTable?.[sortingIndex]
          );
        } else {
          return a?.secondTable?.[sortingIndex]?.localeCompare(
            b?.secondTable?.[sortingIndex]
          );
        }
      } else if (isThirdTable) {
        if (
          !isNaN(a?.thirdTable?.[sortingIndex]) &&
          !isNaN(b?.thirdTable?.[sortingIndex])
        ) {
          return a?.thirdTable?.[sortingIndex] - b?.thirdTable?.[sortingIndex];
        } else {
          return a?.thirdTable?.[sortingIndex]?.localeCompare(
            b?.thirdTable?.[sortingIndex]
          );
        }
      } else {
        if (
          !isNaN(a?.table?.[sortingIndex]) &&
          !isNaN(b?.table?.[sortingIndex])
        ) {
          return a?.table?.[sortingIndex] - b?.table?.[sortingIndex];
        } else {
          return a?.table?.[sortingIndex]?.localeCompare(
            b?.table?.[sortingIndex]
          );
        }
      }
    };

    asc?.toLowerCase() === "ascending"
      ? temp.sort(sortByAsc)
      : temp.sort(sortByAsc)?.reverse();

    setFilteredItems(temp);
  };

  const handleSearch = (e) => {
    setSearchString(e?.target?.value);
  };

  const handleSelect = (item) => {
    selectedItems
      ?.map((existing) => existing?.id || existing?.load)
      ?.includes(item?.id || item?.load)
      ? setSelectedItems((prev) =>
          prev.filter(
            (existing) =>
              existing?.id !== item?.id || existing?.load !== item?.load
          )
        )
      : setSelectedItems((prev) => [...prev, item]);
  };
  const onFilter = (newFilteredData, selectedSettings) => {
    setFilteredItems(newFilteredData);
    setSavedFilters(selectedSettings);
  };

  const handleDelete = () => {
    onDelete(openConfirmationModal);
    setOpenConfirmationModal(false);
  };
  const handleNavigate = (item) => {
    localStorage.setItem("selectedId", item?.id || item?.load);
    !onClick &&
      !isInsiderRestricted &&
      navigate(location.pathname + "/insider?id=" + item?.id, {
        state: { selectedId: item.id || item?.load },
      });

    !isInsider && onClick && onClick(item?.id, item);
  };

  useEffect(() => {
    if (search) {
      const temp = [...tableItems];
      const filtered = temp.filter((item) =>
        item?.table?.some((each) =>
          each?.toString().toLowerCase().includes(search?.toLowerCase())
        )
      );
      setFilteredItems(filtered);
    }
  }, [search, tableItems, isNew]);

  useEffect(() => {
    const selectedId = localStorage.getItem("selectedId");
    if (selectedId && refs.current[selectedId]) {
      refs.current[selectedId]?.scrollIntoView({ block: "center" });
    }
  }, [location.state]);

  useEffect(() => {
    if (!search) {
      if (!isEmpty(savedFilters) && !isInsider) {
        const filteredArray = tableItems.filter((obj) => {
          return Object.entries(savedFilters).every(([key, value]) => {
            if (value?.value !== "") {
              if (value?.searchKey === "products") {
                return obj?.products?.some(
                  (product) => product?.product_name === value?.value?.label
                );
              } else {
                return obj?.[value.searchKey] === value?.value?.label;
              }
            } else {
              return true;
            }
          });
        });
        setFilteredItems(filteredArray);
      } else {
        setFilteredItems(tableItems);
      }
    }
  }, [isNew, isInsider, tableItems, savedFilters]);

  return (
    <>
      {isHeader && (
        <SubHeader
          filters={filters}
          chosenFilters={savedFilters}
          filteringArray={tableItems}
          onFilter={onFilter}
          chosenSorting={chosenSorting}
          tableRef={isSelectEnabled ? selectedTableRef : tableRef}
          onSearch={handleSearch}
          search={search}
          onsorting={handleSorting}
          onDelete={() =>
            onDeleteMultiple(
              selectedItems?.map((item) => item?.id || item?.load)
            )
          }
          onExtraBtnClick={onExtraBtnClick}
          extraBtnIcon={extraBtnIcon}
          extraBtnText={extraBtnText}
          onSelect={enableSelect}
          isSelectEnabled={isSelectEnabled}
          sortingCriteria={tableHeader}
        />
      )}
      <div
        className={`${isInsider ? "w-[calc(100vw-500px)]" : "w-full"} ${
          isFullHeight ? "h-[calc(100vh-230px)]" : "h-[calc(100vh-350px)]"
        } overflow-auto`}
      >
        <table ref={tableRef} className="table-collapse w-full">
          <thead>
            <tr className="text-left">
              {isSelectEnabled && <th />}
              {tableHeader?.map((item) => (
                <th
                  key={item}
                  className="text-sm min-w-[190px] text-left font-semibold text-grey-text p-3"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="align-baseline">
            {filteredItems?.length > 0 &&
              filteredItems?.map((item) => (
                <Fragment key={item?.id || item?.load}>
                  <tr
                    ref={(el) => (refs.current[item.id || item?.load] = el)}
                    className=" relative group transitio duration-300 hover:bg-gray-100"
                  >
                    {isSelectEnabled && (
                      <td>
                        <input
                          onChange={() => handleSelect(item)}
                          className="ml-[1.5rem]
                          mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem]
                          appearance-none rounded-[0.25rem] border-[0.125rem]
                          border-solid border-neutral-300 outline-none
                          before:pointer-events-none before:absolute before:h-[0.875rem] 
                          before:w-[0.875rem] before:scale-0 before:rounded-full
                          before:bg-transparent before:opacity-0
                          before:shadow-[0px_0px_0px_13px_transparent]
                          before:content-[''] checked:border-main-purple checked:bg-main-purple 
                          checked:before:opacity-[0.16] checked:after:-mt-px
                          checked:after:ml-[0.25rem] checked:after:block
                          checked:after:h-[0.8125rem] checked:after:w-[0.375rem]
                          checked:after:rotate-45 checked:after:border-[0.125rem]
                          checked:after:border-l-0 checked:after:border-t-0
                          checked:after:border-solid checked:after:border-white
                          checked:after:bg-transparent checked:after:content-['']
                          hover:cursor-pointer hover:before:opacity-[0.04]
                          hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)]
                          focus:shadow-none focus:transition-[border-color_0.2s]
                          focus:before:scale-100 focus:before:opacity-[0.12]
                          focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)]
                          focus:before:transition-[box-shadow_0.2s,transform_0.2s]
                          focus:after:absolute focus:after:z-[1]
                          focus:after:block focus:after:h-[0.875rem]
                          focus:after:w-[0.875rem] focus:after:rounded-[0.125rem]
                          focus:after:content-[''] checked:focus:before:scale-100
                          checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]
                          checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]
                          checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem]
                          checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem]
                          checked:focus:after:rotate-45 checked:focus:after:rounded-none
                          checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0
                          checked:focus:after:border-t-0 checked:focus:after:border-solid
                          checked:focus:after:border-white checked:focus:after:bg-transparent
                          dark:checked:border-main-purple dark:checked:bg-main-purple"
                          type="checkbox"
                          value=""
                          id="checkboxDefault"
                        />
                      </td>
                    )}
                    <CustomTd
                      table={
                        isInsider
                          ? item?.insiderTable
                          : isSecondTable
                          ? item?.secondTable
                          : isThirdTable
                          ? item?.thirdTable
                          : isFourthTable
                          ? item?.fourthTable
                          : item?.table
                      }
                      itemIsStatusIndex={itemIsStatusIndex}
                      handleNavigate={handleNavigate}
                      item={item}
                    />
                    <td>
                      {isThreeDots && (
                        <ThreeDots
                          onClick={() => handlePopup(item?.id || item?.load)}
                          className="cursor-pointer hover:bg-grey-border transition rounded-full"
                        />
                      )}
                      <TransitionWrapperPopup
                        isShow={
                          openEditPopup === item?.id ||
                          openEditPopup === item?.load
                        }
                      >
                        <PopUp
                          onClose={handlePopup}
                          items={[
                            {
                              isRestricted: isEditLoadRestricted,
                              id: 1,
                              isNotVisible: isEditRestricted,
                              text: editName,
                              icon: <Edit />,
                              onClick: () => onClick(item?.id || item?.load),
                            },
                            {
                              isRestricted: isDeleteLoadRestricted,
                              isNotVisible: isDeleteRestricted,
                              id: 2,
                              text: "Delete item",
                              className: "text-main-red",
                              icon: (
                                <Trash className="[&>path]:stroke-main-red" />
                              ),
                              onClick: () =>
                                setOpenConfirmationModal(
                                  item?.id || item?.load
                                ),
                            },
                          ]}
                        />
                      </TransitionWrapperPopup>
                    </td>
                  </tr>
                </Fragment>
              ))}
          </tbody>
        </table>
        <table
          ref={selectedTableRef}
          id="hidden selected values"
          className="hidden table-collapse w-full"
        >
          <thead>
            <tr>
              {tableHeader?.map((item) => (
                <th key={item}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedItems &&
              selectedItems?.map((item) => (
                <tr key={item?.id || item?.load}>
                  <CustomTd
                    table={
                      isInsider
                        ? item?.insiderTable
                        : isSecondTable
                        ? item?.secondTable
                        : item?.table
                    }
                    itemIsStatusIndex={itemIsStatusIndex}
                    handleNavigate={handleNavigate}
                    item={item}
                  />
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <TransitionWrapper isShow={!!openConfirmationModal}>
        <DeleteModal
          onDelete={handleDelete}
          onCancel={() => setOpenConfirmationModal(false)}
          mainTitle="Are you sure you want to delete load?"
          subTitle=" "
          secondaryBtnText="Yes, delete"
        />
      </TransitionWrapper>
    </>
  );
};
