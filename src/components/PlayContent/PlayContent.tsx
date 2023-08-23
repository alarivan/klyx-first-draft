import type { Component } from "solid-js";

import { Show } from "solid-js";

import { useListItemGuardContext } from "../ListItemGuard";

import styles from "./PlayContent.module.css";

export const PlayContent: Component = () => {
  const guard = useListItemGuardContext();
  const item = () => guard().item.data;

  return (
    <div class={styles.container}>
      <h2>{item().completed ? 1 : 0}</h2>
      <Show when={item().name}>
        <h2>{item().name}</h2>
      </Show>
      <Show when={item().description}>
        <p class={styles.description}>{item().description}</p>
      </Show>
    </div>
  );
};
