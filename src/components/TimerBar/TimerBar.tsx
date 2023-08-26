import type { Component } from "solid-js";

import styles from "./TimerBar.module.css";

const padZero = (n: number) => {
  if (n < 10) {
    return `0${n}`;
  }
  return n;
};

export const TimerBar: Component<{ progress: number; total: number }> = (
  props,
) => {
  const percentProgress = () => {
    return props.progress / (props.total / 100) + "%";
  };
  const percentRemaining = () => {
    return 100 - props.progress / (props.total / 100) + "%";
  };
  const formatText = (value: number) => {
    const minutes = padZero(Math.floor(value / 60));
    const seconds = padZero(value % 60);
    return `${minutes}:${seconds}`;
  };

  return (
    <div class={styles.container}>
      <div class={styles.progressText}>{formatText(props.progress)}</div>
      <div class={styles.bar}>
        <div class={styles.progress} style={{ width: percentProgress() }} />
        <div class={styles.total} style={{ width: percentRemaining() }} />
      </div>
      <div class={styles.totalText}>{formatText(props.total)}</div>
    </div>
  );
};
