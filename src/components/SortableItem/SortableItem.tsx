import type { ParentComponent } from "solid-js";

import { createSortable, useDragDropContext } from "@thisbeyond/solid-dnd";

import styles from "./SortableItem.module.css";

export const SortableItem: ParentComponent<{ id: string }> = (props) => {
  const _sortable = createSortable(props.id);
  const [state] = useDragDropContext() || [];

  return (
    <div
      data-testid="sortableid"
      use:_sortable
      class={styles.container}
      classList={{
        [styles.opacity25]: _sortable.isActiveDraggable,
        [styles.transitionTransfrom]: !!state?.active?.draggable,
      }}
    >
      {props.children}
    </div>
  );
};
