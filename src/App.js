import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import SignIn from "./pages/sign-in";
import Dashboard from "./pages/dashboard";
import { RootLayout } from "./components/root-layout";
import Warehouse from "./pages/warehouse";
import SalesLoads from "./pages/sales/sales-loads";
import Sales from "./pages/sales";
import Purchases from "./pages/purchase";
import PurchaseLoads from "./pages/purchase/purchase-loads";
import Wagon from "./pages/wagon";
import MarketingCustomers from "./pages/customers";
import Manufacturer from "./pages/manufacturer";
import Products from "./pages/products";
import PriceAnalytics from "./pages/price-analytics";
import Staff from "./pages/staff";
import Accounting from "./pages/accounting";
import ActionLog from "./pages/action-log";
import { store } from "./store";
import { Provider } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Insider from "./pages/insider";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "sales",
        children: [
          { index: true, element: <Sales /> },
          { path: "loads", element: <SalesLoads /> },
          {
            path: "insider",
            element: <Insider />,
          },
        ],
      },
      {
        path: "purchases",
        children: [
          {
            index: true,
            element: <Purchases />,
          },
          {
            path: "loads",
            element: <PurchaseLoads />,
          },
          {
            path: "insider",
            element: <Insider />,
          },
        ],
      },
      {
        path: "warehouse",
        element: <Warehouse />,
      },
      {
        path: "wagons",
        children: [
          {
            index: true,
            element: <Wagon />,
          },
          {
            path: "insider",
            element: <Insider />,
          },
        ],
      },
      {
        path: "manufacturers",
        children: [
          {
            index: true,
            element: <Manufacturer />,
          },
          {
            path: "insider",
            element: <Insider />,
          },
        ],
      },
      {
        path: "products",
        children: [
          {
            index: true,
            element: <Products />,
          },
          {
            path: "insider",
            element: <Insider />,
          },
        ],
      },
      {
        path: "price-analytics",
        element: <PriceAnalytics />,
      },
      {
        path: "action-log",
        element: <ActionLog />,
      },
      {
        path: "profile",
        element: <Insider />,
      },
      {
        path: "accounting",
        children: [
          {
            index: true,
            element: <Accounting />,
          },
          {
            path: "insider",
            element: <Insider />,
          },
        ],
      },
      {
        path: "staff",
        children: [
          {
            index: true,
            element: <Staff />,
          },
          {
            path: "insider",
            element: <Insider />,
          },
        ],
      },
      {
        path: "customers",
        children: [
          {
            index: true,
            element: <MarketingCustomers />,
          },
          {
            path: "insider",
            element: <Insider />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    index: true,
    element: <SignIn />,
  },
]);

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </DndProvider>
  );
}

export default App;
