---
to: src/pages/<%= name %>/<%= name %>.tsx
---
import type { Component } from "solid-js";

import styles from "./<%= name %>.module.css";

export const <%= name %>: Component = () => {
  return (
    <div>
      <div class={styles.listReview}>ListReview</div>
    </div>
  );
};
