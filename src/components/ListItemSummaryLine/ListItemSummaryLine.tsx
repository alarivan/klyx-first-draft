import type { IListItem } from "../../store/types";
import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { FiChevronDown, FiChevronUp, FiEdit2, FiTrash } from "solid-icons/fi";
import { onMount, createSignal, Show } from "solid-js";

import { useStoreContext } from "../../store/context";

import styles from "./ListItemSummaryLine.module.css";

export const ListItemSummaryLine: Component<{
  listId: string;
  index: number;
  item: IListItem;
}> = (props) => {
  const [_, actions] = useStoreContext();
  const deleteItem = () => {
    if (confirm(`Delete ${props.item.name}?`)) {
      actions.removeItem(props.listId, props.item.id);
    }
  };

  const [isLongDescription, setIsLongDescription] = createSignal(false);
  let descriptionElement: HTMLParagraphElement | undefined;
  onMount(() => {
    if (descriptionElement) {
      const height = descriptionElement.offsetHeight;
      if (height > 37) {
        setIsLongDescription(true);
        setShowDescription(false);
      }
    }
  });

  const [showDescription, setShowDescription] = createSignal(true);
  const toggleShowDescription = () => setShowDescription((s) => !s);

  return (
    <div class={styles.container}>
      <div class={styles.header}>
        <div class={styles.number}>{props.index + 1}</div>
        <p class={styles.name}>{props.item.completed ? 1 : 0}</p>
        <p class={styles.name}>{props.item.name}</p>
        <div class={styles.actions}>
          <A
            class={`action action_secondary ${styles.action}`}
            href={`/list/${props.listId}/item/${props.item.id}/edit`}
          >
            <FiEdit2 />
          </A>
          <button
            class={`action action_secondary ${styles.action}`}
            type="button"
            onClick={deleteItem}
          >
            <FiTrash />
          </button>
        </div>
      </div>
      <div class={styles.options}>
        <Show
          when={props.item.counterType !== "none" && props.item.counterLimit}
        >
          <div>
            Counter:{" "}
            <b>
              {props.item.counterType === "limited"
                ? props.item.counterLimit
                : "unlimited"}
            </b>
          </div>
        </Show>
        <Show
          when={
            props.item.timerSeconds && parseInt(props.item.timerSeconds) > 0
          }
        >
          <div>
            Timer: <b>{props.item.timerSeconds}</b>
          </div>
        </Show>
      </div>
      <p
        ref={descriptionElement}
        classList={{
          [styles.description]: true,
          [styles.descriptionFull]: showDescription(),
        }}
      >
        {props.item.description}
      </p>
      <Show when={isLongDescription()}>
        <Show
          when={showDescription()}
          fallback={
            <button
              aria-label="Expand description"
              class={styles.expandDescription}
              type="button"
              onClick={toggleShowDescription}
            >
              <FiChevronDown size={20} />
            </button>
          }
        >
          <button
            aria-label="Collapse description"
            class={styles.expandDescription}
            type="button"
            onClick={toggleShowDescription}
          >
            <FiChevronUp size={20} />
          </button>
        </Show>
      </Show>
    </div>
  );
};
