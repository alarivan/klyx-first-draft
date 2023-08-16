import type { Mock } from "vitest";

import { Router, useParams } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";

import { StoreProvider } from "../../store/context";
import { createListWithItems } from "../../store/helpers";

import { PlayDone } from "./PlayDone";

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

describe("PlayDone", () => {
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
          <PlayDone />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText(list.name)).toBeInTheDocument();
    expect(screen.getByText("Restart")).toHaveAttribute(
      "href",
      `/list/${list.id}/play`,
    );
    expect(screen.getByText("Go to list")).toHaveAttribute(
      "href",
      `/list/${list.id}`,
    );
  });
});
