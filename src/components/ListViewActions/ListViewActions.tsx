import type { Component, ParentComponent } from "solid-js";

import { A } from "@solidjs/router";
import { FiPlay, FiPlus } from "solid-icons/fi";

import styles from "./ListViewActions.module.css";

export const ListViewActionNew: Component<{ listId: string }> = (props) => {
  return (
    <A
      class={`a-reset action action__primary`}
      aria-label="Add item"
      href={`/list/${props.listId}/item/new`}
    >
      <FiPlus size={32} />
    </A>
  );
};

export const ListViewActionPlay: Component<{
  listId: string;
  href?: string;
}> = (props) => {
  return (
    <A
      class={`a-reset action action__primary`}
      aria-label="Play list"
      href={props.href ?? `/list/${props.listId}/play`}
    >
      <FiPlay size={28} />
    </A>
  );
};

export const ListViewActions: ParentComponent = (props) => {
  return <div class={styles.container}>{props.children}</div>;
};
