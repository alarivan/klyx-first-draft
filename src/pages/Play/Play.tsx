import type { Component } from "solid-js";

import { ListItemGuard } from "../../components/ListItemGuard";
import { PlayHeader } from "../../components/PlayHeader";

export const Play: Component = () => {
  return (
    <ListItemGuard>
      {(value) => <PlayHeader list={value().list} index={value().item.index} />}
    </ListItemGuard>
  );
};
