---
to: "src/<%= dir %>/<%= name %>/<%= name %>.tsx"
---
import type { Component } from "solid-js";

import { Navigate, useParams } from "@solidjs/router";
import { Show } from "solid-js";

import { useStoreContext } from "../../store/context";

import styles from "./<%= name %>.module.css";

export const <%= name %>: Component = () => {
  const params = useParams();
  const [_, actions] = useStoreContext();

  const maybeList = () => actions.find(params.listId);

  return (
    <Show when={maybeList()} fallback={<Navigate href="/" />}>
      {(list) => (
        <div class={styles.container}><%= name %></div>
      )}
    </Show>
  );
};
