import type { IList } from "../../store/types";
import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { FiEdit2, FiTrash } from "solid-icons/fi";
import { Show } from "solid-js";

import { useStoreContext } from "../../store/context";

import styles from "./ListHeader.module.css";

export const ListHeader: Component<{ list: IList }> = (props) => {
  const [_, actions] = useStoreContext();

  const deleteList = () => {
    if (confirm(`Delete ${props.list.name}?`)) {
      actions.remove(props.list.id);
    }
  };

  return (
    <div class={styles.container}>
      <div class={styles.head}>
        <h1>{props.list.name}</h1>
        <div class={styles.actions}>
          <A
            class={`action action_secondary ${styles.action}`}
            aria-label="Edit list"
            href={`/list/${props.list.id}/edit`}
          >
            <FiEdit2 />
          </A>
          <button
            aria-label="Delete list"
            type="button"
            class={`action action_secondary ${styles.action}`}
            onClick={deleteList}
          >
            <FiTrash />
          </button>
        </div>
      </div>
      <Show when={props.list.description}>
        <p class={styles.description}>{props.list.description}</p>
      </Show>
    </div>
  );
};
