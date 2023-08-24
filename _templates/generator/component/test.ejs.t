---
to: _templates/component/<%= name %>/test.ejs.t
---
---
to: <%- h.componentPath(h.ejsOutput("name") + ".test.tsx") %>
---
import type { Mock } from "vitest";

import { Router, useParams } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { renderInListGuardProvider } from "../../test/utils";

import { <%- h.ejsOutput('name') %> } from "./<%- h.ejsOutput('name') %>";

const list = () => createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

describe("<%- h.ejsOutput('name') %>", () => {
  it("renders component", () => {
    renderInListGuardProvider(
      () => <<%- h.ejsOutput('name') %> />,
      list(),
    );

    expect(screen.getByText("<%- h.ejsOutput('name') %>")).toBeInTheDocument();
  });
});
