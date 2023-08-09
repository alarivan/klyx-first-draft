import type { IStoreContextValue, IStore } from "./types";
import type { ParentComponent } from "solid-js";

import { createContext, useContext } from "solid-js";

import { createStoreValue } from "./createStoreValue";

const StoreContext = createContext<IStoreContextValue>();

export const StoreProvider: ParentComponent<{ initalStore?: IStore }> = (
  props,
) => {
  const value = createStoreValue(props.initalStore);
  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

export function useStoreContext() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStoreContext: cannot find a StoreContext");
  }
  return context;
}
