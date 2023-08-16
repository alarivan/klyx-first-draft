import type { Component } from "solid-js";

import { ListItemGuard } from "../../components/ListItemGuard";
import { PlayView } from "../../components/PlayView";

export const Play: Component = () => {
  return (
    <ListItemGuard>
      {(value) => <PlayView list={value().list} item={value().item} />}
    </ListItemGuard>
  );
};
