import type { Mock } from "vitest";

import { Navigate, Router, useParams } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createListWithItems } from "../../store/helpers";

import { Play } from "./Play";

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

describe("Play", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({
      listId: list.id,
      itemId: list.items[0].id,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders play with itemId is provided", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <Play />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText(list.name)).toBeInTheDocument();
    expect(screen.getByText(list.items[0].name)).toBeInTheDocument();
  });

  it("renders play view without itemId", () => {
    mockUseParams.mockReturnValue({
      listId: list.id,
    });
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <Play />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText(list.name)).toBeInTheDocument();
    expect(screen.getByText(list.items[0].name)).toBeInTheDocument();
  });

  it("redirects when list is not found", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [] }}>
          <Play />
        </StoreProvider>
      </Router>
    ));

    expect(mockNavigateComponent).toHaveBeenCalledWith({ href: "/" });
  });

  it("redirects when item is not found", () => {
    mockUseParams.mockReturnValue({ listId: list.id, itemId: "fake" });
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <Play />
        </StoreProvider>
      </Router>
    ));

    expect(mockNavigateComponent).toHaveBeenCalledWith({
      href: `/list/${list.id}`,
    });
  });

  it("redirects when there is no items in a list and no itemId", () => {
    mockUseParams.mockReturnValue({
      listId: list.id,
    });
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [{ ...list, items: [] }] }}>
          <Play />
        </StoreProvider>
      </Router>
    ));

    expect(mockNavigateComponent).toHaveBeenCalledWith({
      href: `/list/${list.id}`,
    });
  });
});
