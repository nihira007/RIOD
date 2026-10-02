import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { ReportStoreProvider } from "./lib/store";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReportStoreProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReportStoreProvider>
  </React.StrictMode>
);