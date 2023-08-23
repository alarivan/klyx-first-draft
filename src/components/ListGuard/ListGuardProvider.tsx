import type { IList } from "../../store/types";
import type { Accessor, Component } from "solid-js";

import { Outlet } from "@solidjs/router";
import { createContext, useContext } from "solid-js";

import { ListGuard } from ".";

const ListGuardContext = createContext<Accessor<IList>>();

export const ListGuardProvider: Component = () => {
  return (
    <ListGuard>
      {(list) => (
        <ListGuardContext.Provider value={list}>
          <Outlet />
        </ListGuardContext.Provider>
      )}
    </ListGuard>
  );
};

export function useListGuardContext() {
  const context = useContext(ListGuardContext);
  if (!context) {
    throw new Error("useListGuardContext: cannot find a ListGuardContext");
  }
  return context;
}
