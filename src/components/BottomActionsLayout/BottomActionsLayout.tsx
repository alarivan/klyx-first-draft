import type { ParentComponent, JSX } from "solid-js";

import styles from "./BottomActionsLayout.module.css";

export const BottomActionsLayout: ParentComponent<{
  actions?: JSX.Element;
}> = (props) => {
  return (
    <div class={styles.container}>
      {props.children}
      <div class={styles.actionsWrapper}>
        <div class={styles.actionsContainer}>
          <div class={styles.actionsContent}>{props.actions}</div>
        </div>
      </div>
    </div>
  );
};
