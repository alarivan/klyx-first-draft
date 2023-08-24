import type { Component } from "solid-js";

import { FiArrowLeft, FiArrowRight } from "solid-icons/fi";

import styles from "./PlayActions.module.css";

export const PlayActions: Component<{
  goNext: () => void;
  goPrev: () => void;
}> = (props) => {
  return (
    <div class={styles.container}>
      <button
        aria-label="Previous"
        onClick={() => props.goPrev()}
        type="button"
        class="action action__primary"
      >
        <FiArrowLeft size={32} />
      </button>
      <button
        aria-label="Next"
        onClick={() => props.goNext()}
        type="button"
        class="action action__primary"
      >
        <FiArrowRight size={32} />
      </button>
    </div>
  );
};
