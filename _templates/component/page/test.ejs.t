---
to: "src/<%= dir %>/<%= name %>/<%= name %>.test.tsx"
---
import type { Mock } from "vitest";

import { Navigate, Router, useParams } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createListWithItems } from "../../store/helpers";

import { <%= name %> } from "./<%= name %>";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

vi.mock("@solidjs/router", async () => {
  const type = await import("@solidjs/router");
  const mod: typeof type = await vi.importActual("@solidjs/router");
  return {
    ...mod,
    useParams: vi.fn(),
    Navigate: vi.fn(),
  };
});

const mockUseParams = useParams as Mock;
const mockNavigateComponent = Navigate as Mock;

describe("<%= name %>", () => {
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
          <<%= name %> />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("<%= name %>")).toBeInTheDocument();
    expect(screen.getByText(list.name)).toBeInTheDocument();
  });

  it("redirects when list is not found", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [] }}>
          <<%= name %> />
        </StoreProvider>
      </Router>
    ));

    expect(mockNavigateComponent).toHaveBeenCalledWith({ href: "/" });
  });
});
