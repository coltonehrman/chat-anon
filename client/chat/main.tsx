import "../index.css";

import { ChatInterface } from "./ChatInterface.tsx";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChatInterface />
  </React.StrictMode>
);
