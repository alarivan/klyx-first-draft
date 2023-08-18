import type { Component } from "solid-js";

import { For } from "solid-js";

import { ListGuard } from "../../components/ListGuard";
import { ListHeader } from "../../components/ListHeader";
import { ListItemSummaryLine } from "../../components/ListItemSummaryLine";
import { ListViewActions } from "../../components/ListViewActions";

import styles from "./ListView.module.css";

export const ListView: Component = () => {
  return (
    <ListGuard>
      {(list) => (
        <div class={styles.container}>
          <ListHeader list={list()} />
          <ul>
            <For each={list()?.items}>
              {(item, index) => (
                <li>
                  <ListItemSummaryLine
                    index={index()}
                    item={item}
                    listId={list().id}
                  />
                </li>
              )}
            </For>
          </ul>
          <ListViewActions listId={list().id} />
        </div>
      )}
    </ListGuard>
  );
};
