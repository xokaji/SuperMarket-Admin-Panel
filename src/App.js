import * as React from "react";
import Transactions from "./pages/transactions/Transactions";
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
import NewProduct from "./pages/newProduct/NewProduct";
import Login from "./pages/login/Login";
import Stock from "./pages/stocks/Stocks";



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
    element: <Login />,
  },
  
  {
    path: "/home",
    element: <Layout/>,
    children: [
      { path: "", element: <Home /> }, 
    
    ],
  },
  {
    path: "/customers",
    element: <Layout />,
    children: [
      { path: "", element: <CustomerList /> }, 
      { path: "new", element: <NewCustomer /> },
      { path: ":id", element: <Customer /> }, 
    ],
  },
  {
    path: "/products",
    element: <Layout />,
    children: [
      { path: "", element: <Productlist /> },
      { path: "new", element: <NewProduct /> },
      { path: ":id", element: <Product /> },
    ],
  },

  {
    path: "/transactions",
    element: <Layout />,
    children: [
      { path: "", element: <Transactions /> }, 
     
    ],
  },

  {
    path: "/stockreports",
    element: <Layout />,
    children: [
      { path: "", element: <Stock /> }, 
     
    ],
  },

]);


export default function App() {
  return <RouterProvider router={router} />;
}
