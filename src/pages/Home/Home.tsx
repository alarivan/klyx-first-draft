import { A } from "@solidjs/router";
import { FiPlus } from "solid-icons/fi";
import { Component, Show, For } from "solid-js";

import { useStoreContext } from "../../store/context";

import styles from "./Home.module.css";

export const Home: Component = () => {
  const [state] = useStoreContext();

  return (
    <Show
      when={state.lists.length > 0}
      fallback={
        <div class={styles.addListButtonWrapper}>
          <A href='/list/new' class={styles.addListButton}>
            add new list <FiPlus style={{ display: "block" }} size={40} />
          </A>
        </div>
      }
    >
      <ul>
        <For each={state.lists}>
          {(list) => (
            <li>{list.name}</li>
          )}
        </For>
      </ul>
    </Show>
  );
};
