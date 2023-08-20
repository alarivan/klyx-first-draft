import type { Component } from "solid-js";

import { Show } from "solid-js";

import { ListItemGuard } from "../../components/ListItemGuard";
import { PlayContent } from "../../components/PlayContent";
import { PlayCounter } from "../../components/PlayCounter";
import { PlayHeader } from "../../components/PlayHeader";

import styles from "./Play.module.css";

export const Play: Component = () => {
  return (
    <ListItemGuard>
      {(value) => (
        <div class={styles.container}>
          <PlayHeader list={value().list} index={value().item.index} />
          <PlayContent item={value().item.data} />
          <Show when={value().item.data.counterType !== "none"}>
            <PlayCounter
              list={value().list}
              index={value().item.index}
              item={value().item.data}
            />
          </Show>
        </div>
      )}
    </ListItemGuard>
  );
};
