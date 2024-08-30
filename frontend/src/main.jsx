import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./myApp.jsx";
import ConnectWalletProvider from "../providers/ConnectWallet.jsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConnectWalletProvider>
      <App />
      <Toaster position="bottom-right" />
    </ConnectWalletProvider>
  </React.StrictMode>
);
