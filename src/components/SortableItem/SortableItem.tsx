import type { Component, JSX } from "solid-js";

import {
  createSortable,
  transformStyle,
  useDragDropContext,
} from "@thisbeyond/solid-dnd";

import styles from "./SortableItem.module.css";

export const SortableItem: Component<{
  id: string;
  children: (
    dragActivators: Record<
      string,
      (event: HTMLElementEventMap[keyof HTMLElementEventMap]) => void
    >,
  ) => JSX.Element;
}> = (props): JSX.Element => {
  const sortable = createSortable(props.id);
  const [state] = useDragDropContext() || [];

  return (
    <div
      ref={/* c8 ignore next */ sortable.ref}
      style={transformStyle(sortable.transform)}
      class={styles.container}
      classList={{
        [styles.opacity25]: sortable.isActiveDraggable,
        [styles.transitionTransfrom]: !!state?.active?.draggable,
      }}
    >
      {props.children(sortable.dragActivators)}
    </div>
  );
};
