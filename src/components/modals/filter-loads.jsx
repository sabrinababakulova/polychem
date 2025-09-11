import { useEffect, useState } from "react";
import { ChartModal } from "./charts-modal";
import { isEmpty } from "lodash";

export const FilterLoads = ({
  filters,
  items,
  onChoose,
  onCancel,
  chosenFilters,
}) => {
  const [selectedSettings, setSelectedSettings] = useState(
    !isEmpty(chosenFilters)
      ? chosenFilters
      : filters &&
          Object?.fromEntries(
            filters?.map((key) => [
              key?.name,
              { searchKey: key?.searchKey, value: "" },
            ])
          )
  );
  const handleFilter = () => {
    const filteredArray = items.filter((obj) => {
      return Object.entries(selectedSettings).every(([key, value]) => {
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
    onChoose(filteredArray, selectedSettings);
    onCancel();
  };

  const [filterItems, setFilterItems] = useState(
    filters?.map((filter) => ({
      id: filter?.id,
      label: filter?.name,
      placeholder: `Pick ${filter?.name}`,
      value: selectedSettings?.[filter?.name]?.value,
      items:
        filter?.searchKey === "products"
          ? items
              ?.map((customer) =>
                customer?.products?.map((product) => ({
                  name: product?.product_name,
                  id: product?.product_id,
                }))
              )
              ?.flat()
              ?.filter(
                (value, index, self) =>
                  index ===
                  self.findIndex((t) => t.id === value.id && value?.id !== null)
              )
          : items
              ?.map((item) => ({
                name: item?.[filter?.searchKey],
                id:
                  item?.category_id ||
                  item?.subcategory_id ||
                  item?.load ||
                  item?.id,
              }))
              ?.filter(
                (value, index, self) =>
                  index ===
                  self.findIndex(
                    (t) => t.name === value.name && value?.name !== null
                  )
              ),
      onChange: (e) =>
        setSelectedSettings((prev) => ({
          ...prev,
          [filter.name]: { ...prev?.[filter?.name], value: e },
        })),
    }))
  );

  useEffect(() => {
    setFilterItems((prev) =>
      prev?.map((item) => {
        return {
          ...item,
          value: selectedSettings?.[item?.label]?.value,
        };
      })
    );
  }, [selectedSettings]);

  return (
    <ChartModal
      isResetDefault
      onResetDefault={() => {
        onChoose(items, {});
        setSelectedSettings({});
      }}
      modalTitle="Filter items"
      selectItems={filterItems}
      handleClose={onCancel}
      onMainBtnClick={handleFilter}
      mainBtnText="Apply"
    />
  );
};
