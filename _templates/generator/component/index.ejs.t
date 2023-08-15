---
to: _templates/component/<%= name %>/index.ejs.t
---
---
to: <%- h.componentPath("index.ts") %>
from: shared/component/index.ejs.t
---
export { <%- h.ejsOutput("name") %> } from "./<%- h.ejsOutput("name") %>";
