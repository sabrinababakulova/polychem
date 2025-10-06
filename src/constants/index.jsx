import { ReactComponent as Purchases } from "../icons/purchases.svg";
import { ReactComponent as Home } from "../icons/home.svg";
import { ReactComponent as Box } from "../icons/box.svg";
import { ReactComponent as Sales } from "../icons/sales.svg";
import { ReactComponent as BoxWTick } from "../icons/box-w-tick.svg";
import { ReactComponent as House } from "../icons/house.svg";
import { ReactComponent as Location } from "../icons/location.svg";
import { ReactComponent as Customer } from "../icons/customer.svg";
import { ReactComponent as Buildings } from "../icons/buildings.svg";
import { ReactComponent as Products } from "../icons/products.svg";
import { ReactComponent as Analytics } from "../icons/analitics.svg";
import { ReactComponent as Staff } from "../icons/staff.svg";
import { ReactComponent as Balance } from "../icons/balance.svg";
import { ReactComponent as Action } from "../icons/action.svg";
import { ReactComponent as ArrowDown } from "../icons/arrow-down.svg";

export const UNIVERSAL_TIME = "yyyy-MM-dd'T'HH:mm:ss'Z'";
export const MOBILE_WIDTH = 800;

export const USER = "user";
export const PURCHASE = "purchase";
export const MANUFACTURER = "manufacturer";
export const LOAD = "load";
export const PRODUCT = "product";
export const STAFF = "staff";
export const WAGON = "wagon";
export const CATEGORY = "category";
export const SUBCATEGORY = "subcategory";
export const CUSTOMER = "customer";
export const SALES = "sales";
export const ACTION_LOG = "action-log";
export const SALES_LOADS = "sales-loads";
export const OPTION = "option";
export const SUBOPTION = "suboption";
export const ACCOUNTING = "accounting";

export const MENU_ITEMS = [
  {
    id: 1,
    name: "Dashboard",
    icon: <Home />,
    link: "/",
  },
  {
    id: 2,
    name: "Purchases",
    icon: <Purchases />,
    link: "/purchases",
  },
  {
    id: 3,
    name: "Purchase Loads",
    icon: <Box />,
    link: "/purchases/loads",
    sideIcon: <ArrowDown />,
    children: [
      {
        id: 1,
        name: "Not Loaded",
        link: "purchases/loads?type=not-loaded",
      },
      {
        id: 2,
        name: "On The Way",
        link: "purchases/loads?type=on-the-way",
      },
      {
        id: 3,
        name: "Warehouse",
        link: "purchases/loads?type=warehouse",
      },
    ],
  },
  {
    id: 4,
    name: "Sales",
    icon: <Sales />,
    link: "/sales",
  },
  {
    id: 5,
    name: "Sales Loads",
    icon: <BoxWTick />,
    link: "/sales/loads",

    sideIcon: <ArrowDown />,
    children: [
      {
        id: 1,
        name: "Not Loaded",
        link: "sales/loads?type=not-loaded",
      },
      {
        id: 2,
        name: "On The Way",
        link: "sales/loads?type=on-the-way",
      },
      {
        id: 3,
        name: "Delivered",
        link: "sales/loads?type=delivered",
      },
    ],
  },
  {
    id: 6,
    name: "Warehouse",
    icon: <House />,
    link: "/warehouse",

    sideIcon: <ArrowDown />,
    children: [
      {
        id: 1,
        name: "Balance",
        link: "warehouse?type=balance",
      },
      {
        id: 2,
        name: "Income",
        link: "warehouse?type=income",
      },
      {
        id: 3,
        name: "Outcome",
        link: "warehouse?type=outcome",
      },
    ],
  },
  {
    id: 7,
    name: "Wagons",
    icon: <Location />,
    link: "/wagons",
  },
  {
    id: 8,
    name: "Customers",
    icon: <Customer />,
    link: "/customers",

    sideIcon: <ArrowDown />,
    children: [
      {
        id: 1,
        name: "Marketing Research",
        link: "customers?type=marketing",
      },
      {
        id: 2,
        name: "Potential Customers",
        link: "customers?type=potential",
      },
      {
        id: 3,
        name: "Active Customers",
        link: "customers?type=active",
      },
      {
        id: 4,
        name: "Debts",
        link: "customers?type=debts",
      },
    ],
  },
  {
    id: 9,
    name: "Manufacturers",
    icon: <Buildings />,
    link: "/manufacturers",
  },
  {
    id: 10,
    name: "Products",
    icon: <Products />,
    link: "/products",
  },
  {
    id: 11,
    name: "Price Analytics",
    icon: <Analytics />,
    link: "/price-analytics",
  },
  {
    id: 12,
    name: "Staff",
    icon: <Staff />,
    link: "/staff",
    sideIcon: <ArrowDown />,
    children: [
      {
        id: 1,
        name: "Staff Management",
        link: "staff?type=management",
      },
      {
        id: 2,
        name: "Sales Performance",
        link: "staff?type=performance",
      },
    ],
  },
  {
    id: 13,
    name: "Accounting and Balance",
    icon: <Balance />,
    link: "/accounting",
    sideIcon: <ArrowDown />,
    children: [
      {
        id: 1,
        name: "Accounting",
        link: "accounting?type=accounting",
      },
      {
        id: 2,
        name: "Counteragents",
        link: "accounting?type=counteragents",
      },
    ],
  },
  {
    id: 14,
    name: "Actions Log",
    icon: <Action />,
    link: "/action-log",
  },
];

export const ANALYTICS_HEADERS = [
  {
    label: "Total balance",
    value: "$0",
    id: 1,
  },
  {
    label: "International cash",
    value: "$0",
    id: 2,
  },
  {
    label: "International bank",
    value: "$0",
    id: 3,
  },
  {
    label: "Uzbekistan cash",
    value: "$0",
    id: 4,
  },
  {
    label: "Uzbekistan bank",
    value: "$0",
    id: 5,
  },
];

export const WAREHOUSE_TABLE_HEADERS = [
  "Product Name",
  "Category",
  "Subcategory",
  "Quantity (Tons)",
  "Loss",
];
export const WAREHOUSE_TABLE_HEADERS_INCOME = [
  "Date",
  "Pi#",
  "Product Name",
  "Quantity (Tons)",
  "Price per Ton",
  "Total Price",
  "Loss in Tons",
];

export const WAREHOUSE_TABLE_HEADERS_OUTCOME = [
  "Date",
  "Pi#",
  "Order Number",
  "Product Name",
  "Quantity (Tons)",
  "Price per Ton",
  "Total Price",
  "Cost Price",
  "Customer",
  "Sales Manager",
];

export const PURCHASES_TABLE_HEADERS = [
  "PI#",
  "Creation Date",
  "Product",
  "Manufacturer",
  "Quantity (Tons)",
  "Price per Ton",
  "Total Price",
];

export const PURCHASES_LOADS_TALBE_HEADERS = [
  "Load#",
  ...PURCHASES_TABLE_HEADERS,
  "Origin",
  "Transportation loss",
];

export const WAGON_LOADS_HEADERS = [
  "Load #",
  "Pick Up Location",
  "Product",
  "Quantity (Tons)",
  "Transportation Loss",
  "Delivery Loss",
];

export const INSIDER_LOADS_PURCHASE = [
  "Load #",
  "Pick Up Location",
  "Quantity (Tons)",
  "Wagon Number",
  "Shipment Date",
  "Transportation Loss",
  "Status",
];

export const SALES_TABLE_HEADERS = [
  "Order Number",
  "Customer",
  "Product",
  "Quantity (Tons)",
  "Price per Ton",
  "Sales Amount",
  "Payment Type",
  "Payment condition",
  "Delivery condition",
  "Payment date",
  "Sales Person",
];
export const SALES_LOADS_TABLE_HEADERS = [
  "Load#",
  "PI#",
  "Order Number",
  "Product Name",
  "Manufacturer",
  "Quantity (Tons)",
  "Price per Ton",
  "Sales Amount",
  "Origin",
  "Delivery loss",
];

export const WAGONS_TABLE_HEADERS = [
  "Wagon Number",
  "Wagon Type",
  "Shipping date",
  "Wagon Location",
  "Last Update",
  "Products",
];

export const CUSTOMERS_TABLE_HEADERS = [
  "Company Name",
  "Contact Person",
  "Priority",
  "Demand",
  "Next Call Time",
  "Phone Number",
  "E-mail",
  "Country",
  "City",
  "Address",
];

export const CUSTOMER_TABLE_DEBTS_HEADERS = [
  "Company Name",
  "Contact Person",
  "Phone Number",
  "Priority",
  "Total debts",
];

export const MANUFACTURER_TABLE_HEADERS = [
  "Manufacturer Name",
  "Country",
  "City",
  "Address",
  "Phone Number",
  "E-mail",
];

export const PRODUCT_TABLE_HEADERS = [
  "Product Name",
  "Category",
  "Subcategory",
  "Attached documents",
];

export const PRICE_ANALYTICS_TABLE_HEADERS = [
  "Product Name",
  "Last Update",
  "Average Stock Price",
  "Manufacturer",
  "Manufacturer Price",
];

export const STAFF_TABLE_HEADERS = [
  "Full Name",
  "Position",
  "Days Worked",
  "Hours Worked",
  "Days Off",
  "Status",
];

export const ACCOUNTING_TABLE_HEADERS = [
  "Transaction Amount",
  "Converted Amount",
  "Convertion Rate",
  "Transaction Type",
  "Balance Involved",
  "Creation Time",
  "Note",
  "Order Number",
  "Created by",
];

export const COUNTERAGENTS_TABLE_HEADERS = [
  "Name",
  "City",
  "Country",
  "E-mail",
  "Phone Number",
  "Notes",
];

export const ACTION_LOG_TABLE_HEADERS = [
  "Person",
  "Creation Time",
  "Action Type",
  "Changing Object",
  "Related Objects",
  "ID",
  "Related Objects ID",
];

export const PROFILE_TABLE_HEADERS = [
  "Order Number",
  "Product",
  "Quantity (Tons)",
  "Price per Ton",
  "Sales Amount",
  "Payment Type",
];

export const ACTIVE_DEALS_TABLE_HEADERS = [
  "Order Number",
  "Product",
  "Quantity (Tons)",
  "Price per ton",
  "Sales amount",
  "Payment type",
  "Payment condition",
  "Delivery condition",
  "Payment date",
];

export const DEMAND_PRODUCTS_HEADER = [
  "Product Name",
  "Category",
  "Subcategory",
  "Demand",
  "Actual Sales",
  "Performance",
];

export const ACTIVE_DEALS_MANUFACTURER_TABLE_HEADERS = [
  "Pi#",
  "Product",
  "Quantity (Tons)",
  "Price per ton",
  "Total price",
];

export const HISTORY_TABLE_HEADERS = [
  "Created At",
  "Load #",
  "Pick Up Location",
  "Quantity (Tons)",
  "Wagon Number",
  "Shipment Date",
  "Transportation Loss",
  "Delivery Loss",
  "Status",
];

export const PURCHASES_MENU_INSIDER = [
  {
    id: 1,
    name: "Loads",
  },
  {
    id: 2,
    name: "Additional Costs",
  },
  {
    id: 3,
    name: "Attached Documents",
  },
];
export const SALES_MENU_INSIDER = [
  {
    id: 1,
    name: "Loads",
  },
  {
    id: 2,
    name: "Additional Costs",
  },
  {
    id: 3,
    name: "Attached Documents",
  },
  {
    id: 4,
    name: "PI's",
  },
];
export const WAGON_MENU_INSIDER = [
  {
    id: 1,
    name: "Wagon Loads",
  },
  {
    id: 2,
    name: "Attached Documents",
  },
  {
    id: 3,
    name: "History",
  },
];
export const MANUFACTURER_MENU_INSIDER = [
  {
    id: 1,
    name: "Active Deals",
  },
  {
    id: 2,
    name: "Products",
  },
  {
    id: 3,
    name: "Attached Documents",
  },
  {
    id: 4,
    name: "History",
  },
  {
    id: 5,
    name: "Notes",
  },
];
export const CUSTOMER_MENU_INSIDER = [
  {
    id: 1,
    name: "Active Deals",
  },
  {
    id: 2,
    name: "Demands",
  },
  {
    id: 3,
    name: "Attached Documents",
  },
  {
    id: 4,
    name: "History",
  },
  {
    id: 5,
    name: "Notes",
  },
];
export const PRODUCTS_MENU_INSIDER = [
  {
    id: 1,
    name: "Attached Documents",
  },
  {
    id: 2,
    name: "Price Analytics",
  },
];
export const STAFF_MENU_INSIDER = [
  {
    id: 1,
    name: "Active Deals",
  },
  {
    id: 2,
    name: "Worked Hours",
  },
  {
    id: 3,
    name: "Customers",
  },
  {
    id: 5,
    name: "Attached Documents",
  },
];
export const COUNTERAGENTS_MENU_INSIDER = [
  {
    id: 1,
    name: "Transaction List",
  },
  {
    id: 2,
    name: "Attached Documents",
  },
  {
    id: 3,
    name: "Comments",
  },
];

export const LOADS_HEADERS = [
  {
    id: 1,
    name: "Load #",
  },
  {
    id: 2,
    name: "Pick Up Location",
  },
  {
    id: 3,
    name: "Quantity (Tons)",
  },
  {
    id: 4,
    name: "Wagon Number",
  },
  {
    id: 5,
    name: "Shipment Date",
  },
  {
    id: 6,
    name: "Delivery Loss",
  },
  {
    id: 7,
    name: "Status",
  },
];

export const ROLES = [
  { id: 1, name: "Director" },
  { id: 2, name: "Shareholder" },
  { id: 3, name: "Chief Sales" },
  { id: 4, name: "Salesperson" },
  { id: 5, name: "Accountant" },
  { id: 6, name: "Price Analyst" },
  { id: 7, name: "Logistics manager" },
];

export const SALES_PERFORMANCE_HEADERS = [
  "Full Name",
  "Sales Amount",
  "Customers Amount",
  "Customers Demand",
  "Actual Sales",
  "Performance",
  "Days Worked",
  "Hours Worked",
  "Days Off",
  "Status",
];

export const PRICE_ANALYTICS_HEADER = [
  "Update Date",
  "Maximum Stock Price",
  "Minimum Stock Price",
  "Average Stock Price",
  "USD to UZS rate",
  "Manufacturer",
  "Manufacturer Price",
];

export const DRAG_N_DROP_TYPE = "charts";
