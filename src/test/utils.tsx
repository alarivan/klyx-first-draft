import type { IList, IStore } from "../store/types";
import type { Component } from "solid-js";

import {
  memoryIntegration,
  Outlet,
  Route,
  Router,
  Routes,
} from "@solidjs/router";
import { render } from "@solidjs/testing-library";
import { createRoot } from "solid-js";

import { ListGuardProvider } from "../components/ListGuard";
import { ListItemGuardProvider } from "../components/ListItemGuard";
import { StoreProvider } from "../store/context";

const createMemorySource = (list: IList, itemIndex?: number) => {
  const integration = memoryIntegration();
  const [_, setHistoryItem] = integration.signal;

  let value = `/list/${list.id}`;
  if (typeof itemIndex !== "undefined") {
    if (list.items[itemIndex]) {
      value = `/list/${list.id}/${list.items[itemIndex].id}`;
    } else {
      throw `Item at ${itemIndex} does not exist in list`;
    }
  }

  setHistoryItem({
    value,
    replace: true,
  });
  return integration;
};

export const renderInRouter = (
  C: Component,
  initialStore: IStore = { lists: [] },
) => {
  const memorySource = createRoot(() => memoryIntegration());

  render(() => (
    <Router source={memorySource}>
      <StoreProvider initalStore={initialStore}>
        <Routes>
          <Route path="/" component={C} />
        </Routes>
      </StoreProvider>
    </Router>
  ));

  return memorySource.signal;
};

export const renderInListGuardProvider = (C: Component, list: IList) => {
  const memorySource = createRoot(() => createMemorySource(list));

  render(() => (
    <Router source={memorySource}>
      <StoreProvider initalStore={{ lists: [list] }}>
        <Routes>
          <Route path="/list" component={ListGuardProvider}>
            <Route path="/:listId" component={C} />
          </Route>
        </Routes>
      </StoreProvider>
    </Router>
  ));

  return memorySource.signal;
};

export const renderInListItemGuardProvider = (
  C: Component,
  list: IList,
  itemIndex: number = 0,
) => {
  const memorySource = createRoot(() => createMemorySource(list, itemIndex));

  render(() => (
    <Router source={createMemorySource(list, itemIndex)}>
      <StoreProvider initalStore={{ lists: [list] }}>
        <Routes>
          <Route path="/list" component={ListItemGuardProvider}>
            <Route path="/:listId" component={() => <Outlet />}>
              <Route path="/:itemId" component={C} />
            </Route>
          </Route>
        </Routes>
      </StoreProvider>
    </Router>
  ));

  return memorySource.signal;
};
