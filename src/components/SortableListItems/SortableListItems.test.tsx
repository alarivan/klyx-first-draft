import type { IStoreActions } from "../../store/types";
import type { Draggable, Droppable } from "@thisbeyond/solid-dnd";
import type { Mock } from "vitest";

import { screen } from "@solidjs/testing-library";
import { DragOverlay, useDragDropContext } from "@thisbeyond/solid-dnd";
import { beforeEach, describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { renderInListGuardProvider, renderInRouter } from "../../test/utils";

import {
  onDragEndCreator,
  onDragStartCreator,
  SortableItemsActiveDragged,
  SortableListItems,
} from "./SortableListItems";

const list = () =>
  createListWithItems({ name: "list1", description: "list1desc" }, [
    { name: "item1" },
    { name: "item2" },
    { name: "item3" },
  ]);

vi.mock("@thisbeyond/solid-dnd", async () => {
  const type = await import("@thisbeyond/solid-dnd");
  const mod: typeof type = await vi.importActual("@thisbeyond/solid-dnd");
  return {
    ...mod,
    DragOverlay: vi.fn(),
    useDragDropContext: vi.fn(),
  };
});

const DragOverlayMock = DragOverlay as Mock;
const useDragableContextMock = useDragDropContext as Mock;

describe("SortableListItems", () => {
  beforeEach(() => {
    DragOverlayMock.mockImplementation((p) => p.children);
    useDragableContextMock.mockReturnValue([{}]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders component", () => {
    renderInListGuardProvider(() => <SortableListItems />, list());

    expect(screen.getByText("item1")).toBeInTheDocument();
  });

  it(onDragStartCreator, () => {
    const currentList = list();

    const setActiveItem = vi.fn();
    const actions = { findItem: vi.fn() } as unknown as IStoreActions;
    const onDragStart = onDragStartCreator(
      setActiveItem,
      actions,
      currentList.id,
    );

    onDragStart({
      draggable: { id: currentList.items[0].id } as Draggable,
    }),
      expect(setActiveItem).toHaveBeenCalledWith(null);
  });

  it(onDragEndCreator, () => {
    const currentList = list();

    const actions = { reorderItems: vi.fn() } as unknown as IStoreActions;
    const onDragStart = onDragEndCreator(() => currentList, actions);

    onDragStart({
      draggable: { id: currentList.items[0].id } as Draggable,
      droppable: { id: currentList.items[1].id } as Droppable,
    }),
      expect(actions.reorderItems).toHaveBeenCalledWith(currentList.id, [
        currentList.items[1],
        currentList.items[0],
        currentList.items[2],
      ]);
  });

  it("SortableItemsActiveDragged", () => {
    const currentList = list();
    renderInRouter(() => (
      <SortableItemsActiveDragged
        item={{ data: currentList.items[0], index: 0 }}
        list={currentList}
      />
    ));

    expect(screen.getByText("item1")).toBeInTheDocument();
  });

  it("SortableItemsActiveDragged", () => {
    const currentList = list();
    renderInRouter(() => (
      <SortableItemsActiveDragged item={null} list={currentList} />
    ));

    expect(screen.queryByText("item1")).not.toBeInTheDocument();
  });
});
