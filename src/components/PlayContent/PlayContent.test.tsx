import type { Mock } from "vitest";

import { useParams } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";

import { PlayContent } from "./PlayContent";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
  {},
]);
const item = list.items[0];
const emptyItem = list.items[1];

vi.mock("@solidjs/router", async () => {
  const type = await import("@solidjs/router");
  const mod: typeof type = await vi.importActual("@solidjs/router");
  return {
    ...mod,
    useParams: vi.fn(),
  };
});

const mockUseParams = useParams as Mock;

describe("PlayContent", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ listId: list.id });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders component with data", () => {
    render(() => <PlayContent item={item} />);

    expect(screen.getByText("item1")).toBeInTheDocument();
    expect(screen.getByText("item1desc")).toBeInTheDocument();
  });

  it("renders component without data", () => {
    render(() => <PlayContent item={emptyItem} />);

    expect(screen.queryByText("item1")).not.toBeInTheDocument();
    expect(screen.queryByText("item1desc")).not.toBeInTheDocument();
  });
});
