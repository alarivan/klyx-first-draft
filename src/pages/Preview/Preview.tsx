import type { Component } from "solid-js";

import { Navigate, useSearchParams } from "@solidjs/router";

import { validateList } from "../../lib/backup/validate";
import { useStoreContext } from "../../store/context";
import { stripIds } from "../../store/helpers";

export const Preview: Component = () => {
  const [searchParams] = useSearchParams();
  const [_, actions] = useStoreContext();
  const list = JSON.parse(searchParams.list);
  let isValidList = false;
  try {
    isValidList = !!list && validateList(list);
  } catch (e) {
    console.error(e);
  }

  if (isValidList) {
    actions.addWithItems(stripIds(list), list.items.map(stripIds));
  }

  return <Navigate href={`/`} />;
};
