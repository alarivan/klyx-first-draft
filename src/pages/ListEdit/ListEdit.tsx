import type { Component } from "solid-js";

import { Navigate, useParams } from "@solidjs/router";
import { Show } from "solid-js";

import { useStoreContext } from "../../store/context";

import styles from "./ListEdit.module.css";

export const ListEdit: Component = () => {
  const params = useParams();
  const [_, actions] = useStoreContext();

  const maybeList = () => actions.find(params.listId);

  return (
    <Show when={maybeList()} fallback={<Navigate href="/" />}>
      <div class={styles.container}>ListEdit</div>
    </Show>
  );
};
