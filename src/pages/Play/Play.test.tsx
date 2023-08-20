import type { Mock } from "vitest";

import { Router, useNavigate, useParams } from "@solidjs/router";
import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createListWithItems } from "../../store/helpers";

import { Play } from "./Play";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
  {
    name: "item2",
    description: "item2desc",
    counterType: "limited",
    counterLimit: "10",
  },
  { name: "item3" },
]);

vi.mock("@solidjs/router", async () => {
  const type = await import("@solidjs/router");
  const mod: typeof type = await vi.importActual("@solidjs/router");
  return {
    ...mod,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

const mockUseParams = useParams as Mock;
const mockUseNavigate = useNavigate as Mock;

describe("Play", () => {
  const navigateMock = vi.fn();
  beforeEach(() => {
    mockUseParams.mockReturnValue({
      listId: list.id,
      itemId: list.items[0].id,
    });
    mockUseNavigate.mockReturnValue(navigateMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders play", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <Play />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText(list.name)).toBeInTheDocument();
    expect(screen.getByText("item1")).toBeInTheDocument();
  });

  it("renders play with counter", () => {
    mockUseParams.mockReturnValue({
      listId: list.id,
      itemId: list.items[1].id,
    });
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <Play />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText(list.name)).toBeInTheDocument();
    expect(screen.getByText("item2")).toBeInTheDocument();
    expect(screen.getByLabelText("Increase counter")).toBeInTheDocument();
  });

  it("increases counter", () => {
    mockUseParams.mockReturnValue({
      listId: list.id,
      itemId: list.items[1].id,
    });
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <Play />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("0/10")).toBeInTheDocument();

    const increase = screen.getByLabelText("Increase counter");
    fireEvent.click(increase);

    expect(screen.getByText("1/10")).toBeInTheDocument();
  });

  it("navigates to next item when counter is completed", () => {
    mockUseParams.mockReturnValue({
      listId: list.id,
      itemId: list.items[1].id,
    });
    render(() => (
      <Router>
        <StoreProvider
          initalStore={{
            lists: [
              {
                ...list,
                items: [
                  list.items[0],
                  { ...list.items[1], counterProgress: 9 },
                  list.items[2],
                ],
              },
            ],
          }}
        >
          <Play />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("9/10")).toBeInTheDocument();

    const increase = screen.getByLabelText("Increase counter");
    fireEvent.click(increase);

    expect(navigateMock).toHaveBeenCalledWith(
      `/list/${list.id}/play/${list.items[2].id}`,
    );
  });
});
