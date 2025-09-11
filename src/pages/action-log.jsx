import React, { useEffect } from "react";
import { Table } from "../components/table";
import { ACTION_LOG_TABLE_HEADERS } from "../constants";
import { fetchActionLog } from "../store/action-log/fetch-log";
import { getActionLog } from "../store";
import { useGetInformation } from "../hooks/use-get-information";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../components/spinner";
import { useNavigate } from "react-router-dom";
import { useGetRoleRestrictions } from "../hooks/use-get-role-acess";
import { updateFilters, updateSearch } from "../store/action-log";

const ActionLog = () => {
  const dispatch = useDispatch();
  const {
    data,
    filters: savedFilters,
    search,
    fetched,
    loading,
  } = useSelector(getActionLog);

  const setSavedFilters = (filters) => {
    dispatch(updateFilters(filters));
  };
  useGetInformation({ selector: getActionLog, fetcher: fetchActionLog });

  const navigate = useNavigate();
  const restrictions = useGetRoleRestrictions();
  const setSearchString = (search) => dispatch(updateSearch(search));
  const filters = [
    {
      id: 1,
      name: "Action Type",
      searchKey: "action_type",
    },
    {
      id: 2,
      name: "Changing object",
      searchKey: "change_object",
    },
    {
      id: 3,
      name: "Related objects",
      searchKey: "related_object",
    },
  ];

  useEffect(() => {
    const isPageRestricted = restrictions?.["action log"];
    if (typeof isPageRestricted === "boolean" && isPageRestricted === false)
      navigate("/purchases");
  }, [restrictions, navigate]);

  return !fetched || loading ? (
    <Spinner />
  ) : (
    <Table
      onClick={(id, staff) =>
        navigate(`/staff/insider?id=${staff.staff_id}`, {
          state: { selectedId: staff.staff_id },
        })
      }
      setSavedFilters={setSavedFilters}
      savedFilters={savedFilters}
      search={search}
      setSearchString={setSearchString}
      filters={filters}
      tableItems={data}
      tableHeader={ACTION_LOG_TABLE_HEADERS}
      isFullHeight
    />
  );
};

export default ActionLog;
