import type {
  IList,
  IListItemWithIndex,
  IStoreActions,
} from "../../store/types";
import type { DragEvent } from "@thisbeyond/solid-dnd";
import type { Component, Accessor, Setter } from "solid-js";

import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  closestCenter,
} from "@thisbeyond/solid-dnd";
import { createSignal, For, Show } from "solid-js";

import { useListGuardContext } from "../../components/ListGuard";
import { ListItemSummaryLine } from "../../components/ListItemSummaryLine";
import { SortableItem } from "../../components/SortableItem";
import { useStoreContext } from "../../store/context";

import styles from "./SortableListItems.module.css";

export const onDragStartCreator = (
  setActiveItem: Setter<IListItemWithIndex | null>,
  actions: IStoreActions,
  listId: string,
) => {
  return ({ draggable }: DragEvent) => {
    const item = actions.findItem(listId, draggable.id as string) || null;
    setActiveItem(item);
  };
};

export const onDragEndCreator = (
  list: Accessor<IList>,
  actions: IStoreActions,
) => {
  return ({ draggable, droppable }: DragEvent) => {
    if (
      draggable &&
      droppable &&
      typeof draggable.id === "string" &&
      typeof droppable.id === "string"
    ) {
      const currentItems = list().items;
      const fromIndex = currentItems.findIndex((i) => i.id === draggable.id);
      const toIndex = currentItems.findIndex((i) => i.id === droppable.id);
      if (fromIndex !== toIndex) {
        const updatedItems = currentItems.slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        actions.reorderItems(list().id, updatedItems);
      }
    }
  };
};

export const SortableItemsActiveDragged: Component<{
  item: IListItemWithIndex | null;
  list: IList;
}> = (props) => {
  return (
    <Show when={props.item}>
      {(item: Accessor<IListItemWithIndex>) => {
        return (
          <li class={styles.activeItem}>
            <ListItemSummaryLine
              isCompact
              index={item().index}
              item={item().data}
              listId={props.list.id}
              dragActivators={{}}
            />
          </li>
        );
      }}
    </Show>
  );
};

export const SortableListItems: Component = () => {
  const list = useListGuardContext();
  const [_, actions] = useStoreContext();
  const items = () => list().items;
  const [activeItem, setActiveItem] = createSignal<IListItemWithIndex | null>(
    null,
  );
  const ids = () => list().items.map((i) => i.id);

  const onDragStart = onDragStartCreator(setActiveItem, actions, list().id);

  const onDragEnd = onDragEndCreator(list, actions);

  return (
    <DragDropProvider
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      collisionDetector={closestCenter}
    >
      <DragDropSensors />
      <SortableProvider ids={ids()}>
        <ul>
          <For each={items()}>
            {(item, index) => (
              <li>
                <SortableItem id={item.id}>
                  {(dragActivators) => (
                    <ListItemSummaryLine
                      isCompact
                      index={index()}
                      item={item}
                      listId={list().id}
                      dragActivators={dragActivators}
                    />
                  )}
                </SortableItem>
              </li>
            )}
          </For>
        </ul>
      </SortableProvider>
      <DragOverlay>
        <SortableItemsActiveDragged list={list()} item={activeItem()} />
      </DragOverlay>
    </DragDropProvider>
  );
};
