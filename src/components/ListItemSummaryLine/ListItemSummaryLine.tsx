import type { IListItem } from "../../store/types";
import type { Accessor, Component } from "solid-js";

import { A } from "@solidjs/router";
import {
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiMove,
  FiTrash,
} from "solid-icons/fi";
import { mergeProps, onMount, createSignal, Show } from "solid-js";

import { formatSecondsToTime } from "../../lib/format";
import { useStoreContext } from "../../store/context";
import { ItemStatus } from "../ItemStatus";

import styles from "./ListItemSummaryLine.module.css";

export const ListItemSummaryLine: Component<{
  listId: string;
  index: number;
  item: IListItem;
  isCompact?: boolean;
  dragActivators?: any;
}> = (p) => {
  const props = mergeProps({ isCompact: false }, p);
  const [_, actions] = useStoreContext();
  const deleteItem = () => {
    const name = props.item.name || `item ${props.index + 1}`;
    if (confirm(`Delete ${name}?`)) {
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

  const toggleCompleted = () => {
    actions.updateItem(props.listId, props.item.id, {
      completed: !props.item.completed,
    });
  };

  const [showDescription, setShowDescription] = createSignal(true);
  const toggleShowDescription = () => setShowDescription((s) => !s);

  return (
    <div class={styles.container}>
      <div class={styles.header}>
        <div class={styles.number}>{props.index + 1}</div>
        <div class={styles.nameLine}>
          <button
            title={`Toggle completed for item ${props.index + 1}`}
            onClick={toggleCompleted}
          >
            <ItemStatus status={props.item.completed} size={24} />
          </button>
          <p class={styles.name}>{props.item.name || props.item.description}</p>
        </div>
        <div class={styles.actions}>
          <Show
            when={!props.dragActivators}
            fallback={
              <button
                aria-label="Drag handle"
                title="Drag handle"
                style={{ "touch-action": "none" }}
                class={`action action__secondary ${styles.action} ${styles.draggable}`}
                {...props.dragActivators}
              >
                <FiMove />
              </button>
            }
          >
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
          </Show>
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
              props.item.timerSeconds &&
              parseInt(props.item.timerSeconds) > 0 &&
              parseInt(props.item.timerSeconds)
            }
          >
            {(ts: Accessor<number>) => (
              <div>
                Timer: <b>{formatSecondsToTime(ts())}</b>
              </div>
            )}
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
