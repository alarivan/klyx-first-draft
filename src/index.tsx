/* @refresh reload */
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { StoreProvider } from "./store/context";
import { createListWithItems } from "./store/helpers";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

const lists = Array(4)
  .fill(undefined)
  .map((_, lidx) =>
    createListWithItems(
      { name: `list${lidx + 1}`, description: `list${lidx}dec` },
      Array(4)
        .fill(undefined)
        .map((_, idx) => ({
          name: `item${idx + 1}name`,
          description: `item${idx + 1}desc`,
        })),
    ),
  );

render(
  () => (
    <Router>
      <StoreProvider initalStore={{ lists }}>
        <App />
      </StoreProvider>
    </Router>
  ),
  root!,
);
