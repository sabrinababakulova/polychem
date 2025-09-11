import { configureStore } from "@reduxjs/toolkit";
import isAuthReducer from "./isAuth";
import chosenPageReducer from "./chosen-page";
import chartsReducer from "./correct-chart";
import purchaseReducer from "./get-purchase";
import manufacturerReducer from "./get-manufacturer";
import productReducer from "./products";
import staffReducer from "./staff";
import wagonReducer from "./wagons";
import categoryReducer from "./categories";
import customersReducer from "./customers";
import salesReducer from "./sales";
import actionLogReducer from "./action-log";
import statusReducer from "./get-notif";
import countryReducer from "./get-countries";
import accountingReducer from "./accounting";
import countersReducer from "./counter-agents";
import workTimeReducer from './working-time';

export const store = configureStore({
  reducer: {
    isAuth: isAuthReducer,
    chosenPage: chosenPageReducer,
    charts: chartsReducer,
    purchases: purchaseReducer,
    manufacturers: manufacturerReducer,
    products: productReducer,
    staff: staffReducer,
    wagons: wagonReducer,
    categories: categoryReducer,
    customers: customersReducer,
    sales: salesReducer,
    actionLog: actionLogReducer,
    status: statusReducer,
    countries: countryReducer,
    accounting: accountingReducer,
    counteragents: countersReducer,
    workingTime: workTimeReducer,
  },
});

export const getUserInfo = (state) => state.isAuth;
export const getPageInfo = (state) => state.chosenPage;
export const getCharts = (state) => state.charts;
export const getPurchases = (state) => state.purchases;
export const getManufacturers = (state) => state.manufacturers;
export const getProducts = (state) => state.products;
export const getStaff = (state) => state.staff;
export const getWagons = (state) => state.wagons;
export const getCategories = (state) => state.categories;
export const getCustomers = (state) => state.customers;
export const getSales = (state) => state.sales;
export const getActionLog = (state) => state.actionLog;
export const getStatus = (state) => state.status;
export const getCountries = (state) => state.countries;
export const getAccounting = (state) => state.accounting;
export const getCounters = (state) => state.counteragents;
export const getWorkingTime = (state) => state.workingTime;
