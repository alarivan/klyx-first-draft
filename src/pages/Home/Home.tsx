import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { FiPlus } from "solid-icons/fi";
import { Show, For } from "solid-js";

import { useStoreContext } from "../../store/context";

import styles from "./Home.module.css";

export const Home: Component = () => {
  const [state] = useStoreContext();

  return (
    <Show
      when={state.lists.length > 0}
      fallback={
        <div class={styles.addListButtonWrapper}>
          <A href="/list/new" class={styles.addListButton}>
            add new list <FiPlus style={{ display: "block" }} size={40} />
          </A>
        </div>
      }
    >
      <ul>
        <For each={state.lists}>
          {(list) => (
            <li>
              <A href={`/list/${list.id}`}>{list.name}</A>
            </li>
          )}
        </For>
      </ul>
      <div class={styles.addListButtonWrapper}>
        <A href="/list/new" class={styles.addListButton}>
          add new list <FiPlus style={{ display: "block" }} size={40} />
        </A>
      </div>
    </Show>
  );
};
