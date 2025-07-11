// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import Chat from "./pages/Chat"; // ✅ Import chat
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Chat />
  </React.StrictMode>
);
