import type { Component } from "solid-js";

import styles from "./PlayActions.module.css";

export const PlayActions: Component<{
  goNext: () => void;
  goPrev: () => void;
}> = (props) => {
  return (
    <div class={styles.container}>
      <button
        onClick={() => props.goPrev()}
        type="button"
        class="action action__primary"
      >
        Previous
      </button>
      <button
        onClick={() => props.goNext()}
        type="button"
        class="action action__primary"
      >
        Next
      </button>
    </div>
  );
};
