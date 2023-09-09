/* @refresh reload */
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";

import "modern-normalize";
import "./index.css";
import App from "./App";
import { restoreToInitalState } from "./lib/backup";
import { LOCAL_STORAGE_STORE_KEY } from "./store";
import { StoreProvider } from "./store/context";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

if (!localStorage.getItem(LOCAL_STORAGE_STORE_KEY)) {
  restoreToInitalState();
}

render(
  () => (
    <Router>
      <StoreProvider>
        <App />
      </StoreProvider>
    </Router>
  ),
  root!,
);
