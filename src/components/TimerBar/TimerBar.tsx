import type { Component } from "solid-js";

import { formatSecondsToTime } from "../../lib/format";

import styles from "./TimerBar.module.css";

export const TimerBar: Component<{ progress: number; total: number }> = (
  props,
) => {
  const percentProgress = () => {
    return props.progress / (props.total / 100) + "%";
  };
  const percentRemaining = () => {
    return 100 - props.progress / (props.total / 100) + "%";
  };

  return (
    <div class={styles.container}>
      <div class={styles.progressText}>
        {formatSecondsToTime(props.progress)}
      </div>
      <div class={styles.bar}>
        <div class={styles.progress} style={{ width: percentProgress() }} />
        <div class={styles.total} style={{ width: percentRemaining() }} />
      </div>
      <div class={styles.totalText}>{formatSecondsToTime(props.total)}</div>
    </div>
  );
};
