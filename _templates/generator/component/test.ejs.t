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

import { StoreProvider } from "../../store/context";
import { createListWithItems } from "../../store/helpers";

import { <%- h.ejsOutput('name') %> } from "./<%- h.ejsOutput('name') %>";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

vi.mock("@solidjs/router", async () => {
  const mod: any = await vi.importActual("@solidjs/router");
  return {
    ...mod,
    useParams: vi.fn(),
  };
});

const mockUseParams = useParams as Mock;

describe("<%- h.ejsOutput('name') %>", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ listId: list.id });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders component", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <<%- h.ejsOutput('name') %> />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("<%- h.ejsOutput('name') %>")).toBeInTheDocument();
  });
});
