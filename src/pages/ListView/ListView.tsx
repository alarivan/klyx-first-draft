import type { Component } from "solid-js";

import { For } from "solid-js";

import { BottomActionsLayout } from "../../components/BottomActionsLayout";
import { ListGuard } from "../../components/ListGuard";
import { ListHeader } from "../../components/ListHeader";
import { ListItemSummaryLine } from "../../components/ListItemSummaryLine";
import { ListViewActions } from "../../components/ListViewActions";

export const ListView: Component = () => {
  return (
    <ListGuard>
      {(list) => (
        <BottomActionsLayout actions={<ListViewActions listId={list().id} />}>
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
        </BottomActionsLayout>
      )}
    </ListGuard>
  );
};
