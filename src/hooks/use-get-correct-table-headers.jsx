import { useLocation } from "react-router-dom";
import {
  ACCOUNTING_TABLE_HEADERS,
  COUNTERAGENTS_MENU_INSIDER,
  CUSTOMERS_TABLE_HEADERS,
  CUSTOMER_MENU_INSIDER,
  MANUFACTURER_MENU_INSIDER,
  MANUFACTURER_TABLE_HEADERS,
  PRODUCTS_MENU_INSIDER,
  PRODUCT_TABLE_HEADERS,
  PROFILE_TABLE_HEADERS,
  PURCHASES_MENU_INSIDER,
  PURCHASES_TABLE_HEADERS,
  SALES_MENU_INSIDER,
  SALES_TABLE_HEADERS,
  STAFF_MENU_INSIDER,
  STAFF_TABLE_HEADERS,
  WAGONS_TABLE_HEADERS,
  WAGON_MENU_INSIDER,
} from "../constants";
import {
  getCounters,
  getCustomers,
  getManufacturers,
  getProducts,
  getPurchases,
  getSales,
  getStaff,
  getWagons,
} from "../store";
import { fetchProduct } from "../store/products/fetch-products";
import { deleteProduct } from "../store/products/delete-product";
import { fetchManufacturer } from "../store/get-manufacturer/fetch-manufacturer";
import { deleteManufacturer } from "../store/get-manufacturer/delete-manufacturer";
import { fetchStaff } from "../store/staff/fetch-staff";
import { deleteStaff } from "../store/staff/delete-staff";
import { deleteWagon } from "../store/wagons/delete-wagons";
import { fetchWagon } from "../store/wagons/fetch-wagons";
import { fetchPurchase } from "../store/get-purchase/fetch-purchase";
import { deletePurchase } from "../store/get-purchase/delete-purchase";
import { fetchCustomers } from "../store/customers/fetch-customers";
import { deleteCustomer } from "../store/customers/delete-customers";
import { fetchSales } from "../store/sales/fetch-sales";
import { deleteSale } from "../store/sales/delete-sales";
import { CreateManufacturerModal } from "../components/modals/create-manufacturer-modal";
import { CreateProductModal } from "../components/modals/create-product-modal";
import { CreateSellModal } from "../components/modals/create-sell-modal";
import { CreatePurchaseModal } from "../components/modals/create-purchase-modal";
import { CreateWagonModal } from "../components/modals/create-wagon";
import { CreateStaffModal } from "../components/modals/create-staff-modal";
import { CreateCustomerModal } from "../components/modals/create-customer-modal";
import { fetchPurchaseLoad } from "../store/get-purchase/fetch-loads";
import { fetchSalesLoads } from "../store/sales/fetch-loads";
import { postFile as postSaleFile } from "../store/sales/post-files";
import { postFile as pustPurchaseFile } from "../store/get-purchase/post-files";
import { postFile as postProductFile } from "../store/products/post-file";
import { postFile as postCounterFile } from "../store/counter-agents/post-file";
import { postFile as postWagonFile } from "../store/wagons/post-files";
import { postStaffFile } from "../store/staff/post-files";
import { fetchCounters } from "../store/counter-agents/fetch-counters";
import { CreateCounterAgentModal } from "../components/modals/create-counter-agent";
import { deleteCounter } from "../store/counter-agents/delete-counters";
import { useSelector } from "react-redux";
import { fetchWagonHistory } from "../store/wagons/fetch-history";
import { fetchCustomerHistory } from "../store/customers/fetch-history";
import { fetchManufacturerHistory } from "../store/get-manufacturer/fetch-history";

export const useGetCorrectTableHeaders = ({ onEdit, selectedItem }) => {
  const location = useLocation();
  const locationArray = location?.pathname?.split("/");
  const correctLocation =
    locationArray[locationArray.length - 2] ||
    locationArray[locationArray.length - 1];
  const { fetched } = useSelector(getSales);
  switch (correctLocation) {
    case "manufacturers":
      return {
        headers: MANUFACTURER_TABLE_HEADERS,
        type: "manufacturers",
        menu: MANUFACTURER_MENU_INSIDER,
        selector: getManufacturers,
        fetcher: fetchManufacturer,
        onDelete: deleteManufacturer,
        prevPage: correctLocation,
        historyFetcher: fetchManufacturerHistory,
        isBtn: true,
        editModal: (
          <CreateManufacturerModal
            isEdit
            handleModal={onEdit}
            selectedItem={selectedItem}
          />
        ),
      };
    case "products":
      return {
        headers: PRODUCT_TABLE_HEADERS,
        menu: PRODUCTS_MENU_INSIDER,
        selector: getProducts,
        fetcher: fetchProduct,
        onDelete: deleteProduct,
        prevPage: correctLocation,
        fileUploader: postProductFile,
        isBtn: true,
        editModal: (
          <CreateProductModal
            selectedItem={selectedItem}
            isEdit
            handleModal={onEdit}
          />
        ),
      };
    case "sales":
      return {
        headers: SALES_TABLE_HEADERS,
        menu: SALES_MENU_INSIDER,
        selector: getSales,
        fetcher: fetchSales,
        onDelete: deleteSale,
        prevPage: correctLocation,
        loads: fetchSalesLoads,
        fileUploader: postSaleFile,
        isBtn: true,
        editModal: (
          <CreateSellModal
            isEdit
            selectedItem={selectedItem}
            handleOpenSell={onEdit}
          />
        ),
      };
    case "purchases":
      return {
        headers: PURCHASES_TABLE_HEADERS,
        menu: PURCHASES_MENU_INSIDER,
        selector: getPurchases,
        fetcher: fetchPurchase,
        onDelete: deletePurchase,
        prevPage: correctLocation,
        loads: fetchPurchaseLoad,
        fileUploader: pustPurchaseFile,
        isBtn: true,
        editModal: (
          <CreatePurchaseModal
            isEdit
            selectedItem={selectedItem}
            handleOpenPurchase={onEdit}
          />
        ),
      };
    case "wagons":
      return {
        headers: WAGONS_TABLE_HEADERS,
        menu: WAGON_MENU_INSIDER,
        selector: getWagons,
        fetcher: fetchWagon,
        onDelete: deleteWagon,
        prevPage: correctLocation,
        fileUploader: postWagonFile,
        historyFetcher: fetchWagonHistory,
        noLoads: true,
        editModal: (
          <CreateWagonModal
            isEdit
            selectedItem={selectedItem}
            handleModal={onEdit}
          />
        ),
      };
    case "accounting":
      return {
        menu: COUNTERAGENTS_MENU_INSIDER,
        headers: ACCOUNTING_TABLE_HEADERS,
        selector: getCounters,
        fetcher: fetchCounters,
        onDelete: deleteCounter,
        prevPage: correctLocation,
        fileUploader: postCounterFile,
        isBtn: true,
        editModal: (
          <CreateCounterAgentModal
            isEdit
            selectedItem={selectedItem}
            handleModal={onEdit}
          />
        ),
      };
    case "staff":
      return {
        menu: STAFF_MENU_INSIDER,
        headers: STAFF_TABLE_HEADERS,
        selector: getStaff,
        fetcher: fetchStaff,
        onDelete: deleteStaff,
        prevPage: correctLocation,
        fileUploader: postStaffFile,
        noDocs: true,
        noDeals: true,
        editModal: (
          <CreateStaffModal
            isEdit
            selectedItem={selectedItem}
            handleModal={onEdit}
          />
        ),
      };
    case "profile":
      return {
        menu: STAFF_MENU_INSIDER,
        headers: PROFILE_TABLE_HEADERS,
        selector: getStaff,
        fetcher: fetchStaff,
        onDelete: deleteStaff,
        prevPage: correctLocation,
        fileUploader: postStaffFile,
        menuBtn: "Add meeting",
        noDeals: true,
        editModal: (
          <CreateStaffModal
            isEdit
            isUser
            selectedItem={selectedItem}
            handleModal={onEdit}
          />
        ),
      };
    case "customers":
      return {
        menu: CUSTOMER_MENU_INSIDER,
        menuBtn: "Add meeting time",
        headers: CUSTOMERS_TABLE_HEADERS,
        selector: getCustomers,
        fetcher: fetchCustomers,
        onDelete: deleteCustomer,
        prevPage: correctLocation,
        secondfetch: fetched,
        historyFetcher: fetchCustomerHistory,
        isBtn: true,
        editModal: (
          <CreateCustomerModal
            isEdit
            selectedItem={selectedItem}
            handleModal={onEdit}
          />
        ),
      };
    default:
      return [];
  }
};
