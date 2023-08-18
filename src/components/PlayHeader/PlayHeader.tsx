import type { IList } from "../../store/types";
import type { Component } from "solid-js";

import styles from "./PlayHeader.module.css";

export const PlayHeader: Component<{ list: IList; index: number }> = (
  props,
) => {
  const progress = () => `${props.index + 1}/${props.list.items.length}`;

  return (
    <div class={styles.container}>
      <h1>{props.list.name}</h1>
      <div class={styles.progress}>{progress()}</div>
    </div>
  );
};
