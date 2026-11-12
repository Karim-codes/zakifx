import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = document.getElementById("root")!;
if (root.hasChildNodes())
  ReactDOM.hydrateRoot(
    root,
    <React.StrictMode>
      <App initialPath={window.location.pathname} />
    </React.StrictMode>,
  );
else
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App initialPath={window.location.pathname} />
    </React.StrictMode>,
  );
