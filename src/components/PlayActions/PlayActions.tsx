import type { Component } from "solid-js";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckSquare,
  FiSquare,
} from "solid-icons/fi";

import styles from "./PlayActions.module.css";

export const PlayActions: Component<{
  goNext: (complete?: boolean) => void;
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
        aria-label="Next without completing"
        onClick={() => props.goNext()}
        type="button"
        class="action action__primary"
      >
        <FiSquare size={32} />
        <FiArrowRight size={32} />
      </button>
      <button
        aria-label="Next and complete"
        onClick={() => props.goNext(true)}
        type="button"
        class="action action__primary"
      >
        <FiCheckSquare size={32} />
        <FiArrowRight size={32} />
      </button>
    </div>
  );
};
