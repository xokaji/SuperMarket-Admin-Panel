// src/App.js
import * as React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider,} from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import Home from "./pages/home/Home";
import CustomerList from "./pages/customerList/CustomerList";
import './app.css';

// Define your routes using createBrowserRouter
const router = createBrowserRouter([
  {
    path : "/",
    element: <Home />,
  },
  {
    path: "/customers",
    element: <CustomerList />,
  },
]);

// Main App component
export default function App() {
  return (
    <div>
      <Topbar />
      <div className="container">
        <Sidebar />
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

// Render the App component into the DOM
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);
 