import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ReactNotifications } from "react-notifications-component";
import "animate.css/animate.min.css";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReactNotifications />
    <App />
  </React.StrictMode>
);
