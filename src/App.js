import * as React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import Home from "./pages/home/Home";
import CustomerList from "./pages/customerList/CustomerList";
import './app.css';
import Customer from "./pages/customer/Customer";
import NewCustomer from "./pages/newCustomer/NewCustomer";
import Productlist from "./pages/productlist/Productlist";
import Product from "./pages/product/Product";
import Newproduct from "./pages/newProduct/NewProduct";

const Layout = () => (
  <div>
    <Topbar />
    <div className="container">
      <Sidebar />
      <Outlet /> 
    </div>
  </div>
);


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, 
    children: [
      { path: "/", element: <Home /> },
      { path: "/customers", element: <CustomerList /> },
      { path: "/customer/:customerId", element: <Customer /> },
      { path: "/newCustomer", element: <NewCustomer /> },
      
      { path: "/products", element: <Productlist/> },
      { path: "/product/:productId", element: <Product /> },
      { path: "/newProduct", element: <Newproduct /> },
    ],
  },
]);


export default function App() {
  return <RouterProvider router={router} />;
}


const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);
