import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ErrorProvider } from "./context/ErrorContext.jsx";
import Maintenance from "./Maintenance.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
/* <Maintenance/>  */
  <AuthProvider>
    <ErrorProvider>
    <App />
    </ErrorProvider>
  </AuthProvider>
);
