import type { IList, IListItemWithIndex } from "../../store/types";
import type { Accessor, Component } from "solid-js";

import { Outlet } from "@solidjs/router";
import { createContext, useContext } from "solid-js";

import { ListItemGuard } from ".";

const ListItemGuardContext = createContext<
  Accessor<{
    list: IList;
    item: IListItemWithIndex;
  }>
>();

export const ListItemGuardProvider: Component = () => {
  return (
    <ListItemGuard>
      {(value) => (
        <ListItemGuardContext.Provider value={value}>
          <Outlet />
        </ListItemGuardContext.Provider>
      )}
    </ListItemGuard>
  );
};

export function useListItemGuardContext() {
  const context = useContext(ListItemGuardContext);
  if (!context) {
    throw new Error(
      "useListItemGuardContext: cannot find a ListItemGuardContext",
    );
  }
  return context;
}
