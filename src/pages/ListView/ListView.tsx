import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { For } from "solid-js";

import { ListGuard } from "../../components/ListGuard";
import { ListHeader } from "../../components/ListHeader";
import { ListItemSummaryLine } from "../../components/ListItemSummaryLine";

export const ListView: Component = () => {
  return (
    <ListGuard>
      {(list) => (
        <>
          <ListHeader list={list()} />
          <A href={`/list/${list().id}/item/new`}>Add item</A>
          <A href={`/list/${list().id}/play`}>Start</A>
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
        </>
      )}
    </ListGuard>
  );
};
