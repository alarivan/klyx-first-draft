import type { Mock } from "vitest";

import { Router, useNavigate, useParams } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createListWithItems } from "../../store/helpers";

import { Play } from "./Play";

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

describe("NewItem", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ listId: list.id });
    mockUseNavigate.mockReturnValue(vi.fn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders play view", () => {
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
    const mockNavigate = vi.fn();
    mockUseNavigate.mockReturnValue(mockNavigate);

    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [] }}>
          <Play />
        </StoreProvider>
      </Router>
    ));

    expect(mockNavigate).toHaveBeenCalledOnce();
  });

  it("redirects when item is not found", () => {
    mockUseParams.mockReturnValue({ listId: list.id, itemId: "fake" });
    const mockNavigate = vi.fn();
    mockUseNavigate.mockReturnValue(mockNavigate);

    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <Play />
        </StoreProvider>
      </Router>
    ));

    expect(mockNavigate).toHaveBeenCalledOnce();
  });
});
