import type { Component } from "solid-js";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckSquare,
  FiList,
  FiSquare,
} from "solid-icons/fi";
import { Show } from "solid-js";

import styles from "./PlayActions.module.css";

export const PlayActions: Component<{
  goNext: (complete?: boolean) => void;
  goPrev: () => void;
  isPrevAvailable: boolean;
}> = (props) => {
  return (
    <div class={styles.container}>
      <button
        title={props.isPrevAvailable ? "Previous" : "Back to list"}
        onClick={() => props.goPrev()}
        type="button"
        class="action action__primary"
      >
        <FiArrowLeft size={32} />
        <Show when={!props.isPrevAvailable}>
          <FiList size={32} />
        </Show>
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
