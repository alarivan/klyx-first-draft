import type { Component } from "solid-js";

import { FiMaximize2, FiMinimize2 } from "solid-icons/fi";
import { createSignal, For, Show } from "solid-js";

import { BottomActionsLayout } from "../../components/BottomActionsLayout";
import { useListGuardContext } from "../../components/ListGuard";
import { ListHeader } from "../../components/ListHeader";
import { ListItemSummaryLine } from "../../components/ListItemSummaryLine";
import { ListViewActions } from "../../components/ListViewActions";
import {
  ListViewActionNew,
  ListViewActionPlay,
} from "../../components/ListViewActions/ListViewActions";
import { SortableListItems } from "../../components/SortableListItems";

export const ListView: Component = () => {
  const list = useListGuardContext();
  const items = () => list().items;

  const [isCompactView, setIsCompactView] = createSignal(false);

  return (
    <BottomActionsLayout
      actions={
        <ListViewActions>
          <ListViewActionNew listId={list().id} />
          <ListViewActionPlay listId={list().id} />
        </ListViewActions>
      }
    >
      <ListHeader list={list()}>
        <Show
          when={isCompactView()}
          fallback={
            <button
              title="Sortable compact view"
              class="action action__secondary"
              onClick={() => setIsCompactView((s) => !s)}
            >
              <FiMinimize2 />
            </button>
          }
        >
          <button
            title="Detailed view"
            class="action action__secondary"
            onClick={() => setIsCompactView((s) => !s)}
          >
            <FiMaximize2 />
          </button>
        </Show>
      </ListHeader>
      <Show when={!isCompactView()} fallback={<SortableListItems />}>
        <ul>
          <For each={items()}>
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
      </Show>
    </BottomActionsLayout>
  );
};
