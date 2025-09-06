import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MyContextProvider } from './src/MyContext'; 
import routes from "./src/routes";  
import "./src/index.css";

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MyContextProvider>
    <RouterProvider router={router} />
  </MyContextProvider>
);
