import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";

import { RouterProvider } from "react-router-dom";
import AppRouter from "./router/AppRouter.jsx";

createRoot(document.getElementById("root")).render(
  <RouterProvider router={AppRouter} />
);
