---
to: _templates/component/<%= name %>/index.ejs.t
---
---
to: <%- h.componentPath("index.ts") %>
---
export { <%- h.ejsOutput("name") %> } from "./<%- h.ejsOutput("name") %>";
