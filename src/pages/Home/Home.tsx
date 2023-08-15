import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { FiPlus } from "solid-icons/fi";
import { Show, For } from "solid-js";

import { ListSummaryLine } from "../../components/ListSummaryLine";
import { useStoreContext } from "../../store/context";

import styles from "./Home.module.css";

export const Home: Component = () => {
  const [state] = useStoreContext();

  return (
    <Show
      when={state.lists.length > 0}
      fallback={
        <div class={styles.addListButtonWrapper}>
          <A href="/list/new" class="buttonPrimary">
            add new list <FiPlus style={{ display: "block" }} size={40} />
          </A>
        </div>
      }
    >
      <div class={styles.container}>
        <ul class={styles.lists}>
          <For each={state.lists}>
            {(list) => (
              <li>
                <ListSummaryLine list={list} />
              </li>
            )}
          </For>
        </ul>
        <div class={styles.addListButtonWrapperBottom}>
          <A href="/list/new" class="buttonPrimary">
            add new list
          </A>
        </div>
      </div>
    </Show>
  );
};
