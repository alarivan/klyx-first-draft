import type { Component } from "solid-js";

import { useListItemGuardContext } from "../ListItemGuard";

import styles from "./PlayHeader.module.css";

export const PlayHeader: Component = () => {
  const guard = useListItemGuardContext();
  const progress = () =>
    `${guard().item.index + 1}/${guard().list.items.length}`;

  return (
    <div class={styles.container}>
      <h1>{guard().list.name}</h1>
      <div class={styles.progress}>{progress()}</div>
    </div>
  );
};
