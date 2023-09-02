import type { IList, IStore } from "../store/types";
import type { Location, Navigator } from "@solidjs/router";
import type { Component } from "solid-js";

import {
  memoryIntegration,
  Route,
  Router,
  Routes,
  useLocation,
  useNavigate,
} from "@solidjs/router";
import { render } from "@solidjs/testing-library";
import { createRoot } from "solid-js";

import { ListGuardProvider } from "../components/ListGuard";
import { ListItemGuardProvider } from "../components/ListItemGuard";
import { StoreProvider } from "../store/context";

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
  const memorySource = createRoot(() => {
    const integration = memoryIntegration();
    const [_, setHistoryItem] = integration.signal;

    setHistoryItem({
      value: `/list/${list.id}`,
      replace: true,
    });
    return integration;
  });

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
  path: string,
  list: IList,
  itemIndex: number = 0,
): [location?: Location<unknown>, navigate?: Navigator] => {
  const memorySource = createRoot(() => {
    const integration = memoryIntegration();
    const [_, setHistoryItem] = integration.signal;

    if (list.items[itemIndex]) {
      const value = path
        .replace(":listId", list.id)
        .replace(":itemId", list.items[itemIndex].id);

      setHistoryItem({
        value,
        replace: true,
      });

      return integration;
    } else {
      throw `Item at ${itemIndex} does not exist in list`;
    }
  });

  let navigate: Navigator | undefined;
  let location: Location<unknown> | undefined;

  render(() => (
    <Router source={memorySource}>
      <>
        {() => {
          location = useLocation();
          navigate = useNavigate();
          return (
            <StoreProvider initalStore={{ lists: [list] }}>
              <Routes>
                <Route path="/list/:listId" component={() => "catchall"} />
                <Route path={path} component={ListItemGuardProvider}>
                  <Route path="/" component={C} />
                </Route>
              </Routes>
            </StoreProvider>
          );
        }}
      </>
    </Router>
  ));

  return [location, navigate];
};
