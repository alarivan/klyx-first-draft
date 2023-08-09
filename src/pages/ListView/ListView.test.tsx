import type { Mock } from "vitest";

import { Router, useNavigate, useParams } from "@solidjs/router";
import { cleanup, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createListWithItems } from "../../store/helpers";

import { ListView } from "./ListView";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

vi.mock("@solidjs/router", async () => {
  const mod: any = await vi.importActual("@solidjs/router");
  return {
    ...mod,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

const mockUseParams = useParams as Mock;
const mockUseNavigate = useNavigate as Mock;

describe("ListView", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ listId: list.id });
    mockUseNavigate.mockReturnValue(vi.fn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders list when list is in store", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <ListView />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("list1")).toBeInTheDocument();
    expect(screen.getByText("list1desc")).toBeInTheDocument();
    expect(screen.getByText("item1")).toBeInTheDocument();
    expect(screen.getByText("Add item")).toHaveAttribute(
      "href",
      `/list/${list.id}/item/new`,
    );
  });

  it("renders list when list without items is in store", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [{ ...list, items: [] }] }}>
          <ListView />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("list1")).toBeInTheDocument();
    expect(screen.getByText("list1desc")).toBeInTheDocument();
  });

  it("redirects when list is not found", () => {
    const mockNavigate = vi.fn();
    mockUseNavigate.mockReturnValue(mockNavigate);

    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [] }}>
          <ListView />
        </StoreProvider>
      </Router>
    ));

    expect(mockNavigate).toHaveBeenCalledOnce();
  });
});
