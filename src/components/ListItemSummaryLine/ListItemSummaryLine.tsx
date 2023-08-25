import type { IListItem } from "../../store/types";
import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { FiChevronDown, FiChevronUp, FiEdit2, FiTrash } from "solid-icons/fi";
import { mergeProps, onMount, createSignal, Show } from "solid-js";

import { useStoreContext } from "../../store/context";
import { ItemStatus } from "../ItemStatus";

import styles from "./ListItemSummaryLine.module.css";

export const ListItemSummaryLine: Component<{
  listId: string;
  index: number;
  item: IListItem;
  isCompact?: boolean;
}> = (p) => {
  const props = mergeProps({ isCompact: false }, p);
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
        <div class={styles.nameLine}>
          <ItemStatus status={props.item.completed} size={24} />
          <p class={styles.name}>{props.item.name || props.item.description}</p>
        </div>
        <div class={styles.actions}>
          <A
            aria-label="Edit item"
            class={`action action__secondary ${styles.action}`}
            href={`/list/${props.listId}/item/${props.item.id}/edit`}
          >
            <FiEdit2 />
          </A>
          <button
            aria-label="Delete item"
            class={`action action__secondary ${styles.action}`}
            type="button"
            onClick={deleteItem}
          >
            <FiTrash />
          </button>
        </div>
      </div>
      <Show when={!props.isCompact}>
        <div class={styles.options}>
          <Show
            when={
              (props.item.counterType === "limited" &&
                props.item.counterLimit) ||
              props.item.counterType === "unlimited"
            }
          >
            <div>
              Repeat:{" "}
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
          ref={/* c8 ignore next */ descriptionElement}
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
      </Show>
    </div>
  );
};
