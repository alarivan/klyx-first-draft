import type { Mock } from "vitest";

import { render, screen } from "@solidjs/testing-library";
import { createSortable, useDragDropContext } from "@thisbeyond/solid-dnd";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";

import { SortableItem } from "./SortableItem";
import styles from "./SortableItem.module.css";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

vi.mock("@thisbeyond/solid-dnd", async () => {
  const type = await import("@thisbeyond/solid-dnd");
  const mod: typeof type = await vi.importActual("@thisbeyond/solid-dnd");
  return {
    ...mod,
    transformStyle: vi.fn(),
    createSortable: vi.fn(),
    useDragDropContext: vi.fn(),
  };
});

const createSortableMock = createSortable as Mock;
const useDragableContextMock = useDragDropContext as Mock;

describe("SortableItem", () => {
  beforeEach(() => {
    createSortableMock.mockReturnValue(
      Object.defineProperties(() => {}, {
        ref: {
          writable: true,
        },
        transform: {},
        dragActivators: {},
      }),
    );
    useDragableContextMock.mockReturnValue([{}]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders children", () => {
    render(() => (
      <SortableItem id={list.items[0].id}>
        {() => <div>children</div>}
      </SortableItem>
    ));

    expect(screen.getByText("children")).toBeInTheDocument();
  });

  it("renders component with class when dragable", () => {
    createSortableMock.mockReturnValue(
      Object.defineProperties(() => {}, {
        ref: {
          writable: true,
        },
        transform: {},
        dragActivators: {},
        isActiveDraggable: {
          enumerable: true,
          get: () => true,
        },
      }),
    );
    render(() => (
      <SortableItem id={list.items[0].id}>{() => "children"}</SortableItem>
    ));

    expect(screen.getByText("children")).toHaveClass(styles.opacity25);
  });

  it("renders component with class when state is draggable", () => {
    useDragableContextMock.mockReturnValue([{ active: { draggable: true } }]);
    render(() => (
      <SortableItem id={list.items[0].id}>{() => "children"}</SortableItem>
    ));

    expect(screen.getByText("children")).toHaveClass(
      styles.transitionTransfrom,
    );
  });

  it("renders when draggable context is null", () => {
    useDragableContextMock.mockReturnValue(null);
    render(() => (
      <SortableItem id={list.items[0].id}>{() => "children"}</SortableItem>
    ));

    expect(screen.getByText("children")).toBeInTheDocument();
  });
});
