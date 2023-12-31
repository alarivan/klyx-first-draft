import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { FiEdit2 } from "solid-icons/fi";
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
          <ItemStatus status={item().completed} size={28} />
        </button>
        <Show when={item().name}>
          <h3>{item().name}</h3>
        </Show>
        <A
          aria-label="Edit item"
          class={`action action__secondary ${styles.action}`}
          href={`/list/${guard().list.id}/item/${item().id}/edit`}
        >
          <FiEdit2 />
        </A>
      </div>
      <Show when={item().description}>
        <hr />
        <p class={styles.description}>{item().description}</p>
      </Show>
    </div>
  );
};
