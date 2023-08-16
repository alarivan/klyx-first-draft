import type { Mock } from "vitest";

import { Navigate, Router, useParams } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createListWithItems } from "../../store/helpers";

import { ListGuard } from "./ListGuard";

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

describe("ListGuard", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ listId: list.id });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders when list is available", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <ListGuard>{(list) => <p>{list().name}</p>}</ListGuard>
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("list1")).toBeInTheDocument();
  });

  it("redirects when there is no items in a list and no itemId", () => {
    mockUseParams.mockReturnValue({
      listId: list.id,
    });
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [] }}>
          <ListGuard>{(list) => <p>{list().name}</p>}</ListGuard>
        </StoreProvider>
      </Router>
    ));

    expect(mockNavigateComponent).toHaveBeenCalledWith({
      href: `/`,
    });
  });
});
