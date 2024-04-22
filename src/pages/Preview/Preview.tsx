import type { Component } from "solid-js";

import { Navigate, useSearchParams } from "@solidjs/router";

import { useStoreContext } from "../../store/context";
import { stripIds } from "../../store/helpers";

export const Preview: Component = () => {
  const [searchParams] = useSearchParams();
  const [_, actions] = useStoreContext();
  const list = JSON.parse(searchParams.list);

  if (list) {
    actions.addWithItems(stripIds(list), list.items.map(stripIds));
  }

  return <Navigate href={`/`} />;
};
