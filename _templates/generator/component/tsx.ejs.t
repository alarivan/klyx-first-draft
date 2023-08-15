---
to: _templates/component/<%= name %>/tsx.ejs.t
---
---
to: <%- h.componentPath(h.ejsOutput("name") + ".tsx") %>
---
import type { Component } from "solid-js";

import styles from "./<%- h.ejsOutput('name') %>.module.css";

export const <%- h.ejsOutput('name') %>: Component = () => {
  return (
    <div class={styles.container}>
      <div><%- h.ejsOutput('name') %></div>
    </div>
  );
};
