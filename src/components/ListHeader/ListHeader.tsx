import type { IList } from "../../store/types";
import type { ParentComponent } from "solid-js";

import { A } from "@solidjs/router";
import {
  FiEdit2,
  FiMoreVertical,
  FiRefreshCcw,
  FiTrash,
  FiShare,
} from "solid-icons/fi";
import { Show, createSignal } from "solid-js";
import { Transition } from "solid-transition-group";

import { useStoreContext } from "../../store/context";

import styles from "./ListHeader.module.css";

export const ListHeader: ParentComponent<{ list: IList }> = (props) => {
  const [_, actions] = useStoreContext();

  const [showActions, setShowActions] = createSignal(false);

  const toggleActions = () => {
    setShowActions((s) => !s);
  };

  const deleteList = () => {
    if (confirm(`Delete ${props.list.name}?`)) {
      actions.remove(props.list.id);
    }
  };

  const resetItemsState = () => {
    if (confirm("Reset state of all of the items?")) {
      actions.resetItemsState(props.list.id);
    }
  };

  const shareList = () => {
    const { name, ...originalList } = props.list;
    const list = {
      name: `${name} (shared)`,
      ...originalList,
    };
    const base64List = btoa(JSON.stringify(list));
    const url = new URL(window.location.origin + "/preview");
    url.searchParams.append("list", base64List);
    navigator.clipboard.writeText(url.toString());
  };

  return (
    <div class={styles.container}>
      <div class={styles.head}>
        <div class={styles.nameLine}>
          <h1>{props.list.name}</h1>
          <button
            aria-label="List actions"
            title="List actions"
            class="action"
            onClick={toggleActions}
          >
            <FiMoreVertical size={20} />
          </button>
        </div>
        <Transition name="slide-y">
          <Show when={showActions()}>
            <div class="slide-y">
              <div class={`${styles.actions}`}>
                {props.children}
                <button
                  aria-label="Share list"
                  title="Share"
                  type="button"
                  class={`action action__secondary`}
                  onClick={shareList}
                >
                  <FiShare />
                </button>
                <button
                  aria-label="Reset all items"
                  title="Reset all items"
                  type="button"
                  class={`action action__secondary`}
                  onClick={resetItemsState}
                >
                  <FiRefreshCcw />
                </button>
                <A
                  class={`action action__secondary`}
                  aria-label="Edit list"
                  href={`/list/${props.list.id}/edit`}
                >
                  <FiEdit2 />
                </A>
                <button
                  aria-label="Delete list"
                  type="button"
                  class={`action action__secondary`}
                  onClick={deleteList}
                >
                  <FiTrash />
                </button>
              </div>
            </div>
          </Show>
        </Transition>
      </div>
      <Show when={props.list.description}>
        <p class={styles.description}>{props.list.description}</p>
      </Show>
    </div>
  );
};
