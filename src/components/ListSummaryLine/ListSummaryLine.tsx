import type { IList } from "../../store/types";
import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { Show } from "solid-js";

import styles from "./ListSummaryLine.module.css";

export const ListSummaryLine: Component<{ list: IList }> = (props) => {
  return (
    <A
      class={styles.container}
      aria-label={props.list.name}
      href={`/list/${props.list.id}`}
    >
      <div class={styles.main}>
        <p class={styles.name}>{props.list.name}</p>
        <Show when={props.list.description}>
          <p class={styles.description}>{props.list.description}</p>
        </Show>
      </div>
      <div class={styles.secondary}>{props.list.items.length}</div>
    </A>
  );
};
