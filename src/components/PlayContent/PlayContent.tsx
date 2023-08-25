import type { Component } from "solid-js";

import { Show } from "solid-js";

import { useStoreContext } from "../../store/context";
import { ItemStatus } from "../ItemStatus";
import { useListItemGuardContext } from "../ListItemGuard";

import styles from "./PlayContent.module.css";

export const PlayContent: Component = () => {
  const guard = useListItemGuardContext();
  const [_, actions] = useStoreContext();
  const item = () => guard().item.data;

  const toggleCompleted = () => {
    actions.updateItem(guard().list.id, guard().item.data.id, {
      completed: !item().completed,
    });
  };

  return (
    <div class={styles.container}>
      <div class={styles.main}>
        <button
          aria-label="Toggle completed"
          onClick={toggleCompleted}
          class={styles.status}
        >
          <ItemStatus status={item().completed} />
        </button>
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
