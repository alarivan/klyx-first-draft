import type { Mock } from "vitest";

import { Router, useParams } from "@solidjs/router";
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
  };
});

const mockUseParams = useParams as Mock;

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

  it("renders play", () => {
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
});
