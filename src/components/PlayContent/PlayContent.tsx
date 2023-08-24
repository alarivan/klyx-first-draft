import type { Component } from "solid-js";

import { Show } from "solid-js";

import { ItemStatus } from "../ItemStatus";
import { useListItemGuardContext } from "../ListItemGuard";

import styles from "./PlayContent.module.css";

export const PlayContent: Component = () => {
  const guard = useListItemGuardContext();
  const item = () => guard().item.data;

  return (
    <div class={styles.container}>
      <div class={styles.main}>
        <div class={styles.status}>
          <ItemStatus status={item().completed} />
        </div>
        <Show when={item().name}>
          <h2>{item().name}</h2>
        </Show>
      </div>
      <hr />
      <Show when={item().description}>
        <p class={styles.description}>{item().description}</p>
      </Show>
    </div>
  );
};
