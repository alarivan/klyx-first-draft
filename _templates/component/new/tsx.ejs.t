---
to: "src/<%= dir %>/<%= name %>/<%= name %>.tsx"
---
import type { Component } from "solid-js";

import styles from "./<%= name %>.module.css";

export const <%= name %>: Component = () => {
  return (
    <div class={styles.container}>
      <div><%= name %></div>
    </div>
  );
};
