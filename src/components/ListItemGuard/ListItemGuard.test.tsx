import type { Mock } from "vitest";

import { Navigate, Router, useParams } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createListWithItems } from "../../store/helpers";

import { ListItemGuard } from "./ListItemGuard";

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

describe("ListItemGuard", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({
      listId: list.id,
      itemId: list.items[0].id,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders when list and itemId are available", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <ListItemGuard>
            {(value) => (
              <>
                <p>{value().list.name}</p>
                <p>{value().item.data.name}</p>
              </>
            )}
          </ListItemGuard>
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("list1")).toBeInTheDocument();
  });

  it("renders first item when there is no itemId", () => {
    mockUseParams.mockReturnValue({
      listId: list.id,
    });
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <ListItemGuard>
            {(value) => (
              <>
                <p>{value().list.name}</p>
                <p>{value().item.data.name}</p>
              </>
            )}
          </ListItemGuard>
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("list1")).toBeInTheDocument();
  });

  it("redirects when there is no items", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [{ ...list, items: [] }] }}>
          <ListItemGuard>
            {(value) => (
              <>
                <p>{value().list.name}</p>
                <p>{value().item.data.name}</p>
              </>
            )}
          </ListItemGuard>
        </StoreProvider>
      </Router>
    ));

    expect(mockNavigateComponent).toHaveBeenCalledWith({
      href: `/list/${list.id}`,
    });
  });

  it("redirects when item is not found", () => {
    mockUseParams.mockReturnValue({
      listId: list.id,
      itemId: "fake",
    });
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <ListItemGuard>
            {(value) => (
              <>
                <p>{value().list.name}</p>
                <p>{value().item.data.name}</p>
              </>
            )}
          </ListItemGuard>
        </StoreProvider>
      </Router>
    ));

    expect(mockNavigateComponent).toHaveBeenCalledWith({
      href: `/list/${list.id}`,
    });
  });
});
