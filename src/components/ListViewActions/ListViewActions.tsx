import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { FiPlay, FiPlus } from "solid-icons/fi";

import styles from "./ListViewActions.module.css";

export const ListViewActions: Component<{ listId: string }> = (props) => {
  return (
    <div class={styles.container}>
      <A
        class={`a-reset action action__primary`}
        aria-label="Add item"
        href={`/list/${props.listId}/item/new`}
      >
        <FiPlus size={32} />
      </A>
      <A
        class={`a-reset action action__primary`}
        aria-label="Play list"
        href={`/list/${props.listId}/play`}
      >
        <FiPlay size={28} />
      </A>
    </div>
  );
};
