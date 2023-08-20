import type { IListItem } from "../../store/types";
import type { Component } from "solid-js";

import { Show } from "solid-js";

import styles from "./PlayContent.module.css";

export const PlayContent: Component<{ item: IListItem }> = (props) => {
  return (
    <div class={styles.container}>
      <h2>{props.item.completed ? 1 : 0}</h2>
      <Show when={props.item.name}>
        <h2>{props.item.name}</h2>
      </Show>
      <Show when={props.item.description}>
        <p class={styles.description}>{props.item.description}</p>
      </Show>
    </div>
  );
};
