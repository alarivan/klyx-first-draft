import type { IListItemDataObject } from "./types";

import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";

import { createStoreValue } from "./createStoreValue";
import { createListWithItems } from "./helpers";

vi.mock("@solid-primitives/storage", async () => {
  const type = await import("@solid-primitives/storage");
  const mod: typeof type = await vi.importActual("@solid-primitives/storage");
  return {
    ...mod,
    makePersisted: vi.fn().mockImplementation((store) => store),
  };
});

const newMockState = () => {
  const lists = [
    Array(4)
      .fill(undefined)
      .map((_, idx) => ({
        name: `item${idx + 1}name`,
        description: `item${idx + 1}desc`,
      })),
    Array(4)
      .fill(undefined)
      .map((_, idx) => ({
        name: `item${idx + 1}name`,
        description: `item${idx + 1}desc`,
        completed: true,
        counterType: "limited",
        counterLimit: 10,
        counterProgress: 0,
        timerSeconds: "60",
        timerProgress: "20",
      })),
    [],
  ].map((items, lidx) =>
    createListWithItems(
      { name: `list${lidx + 1}`, description: `list${lidx}dec` },
      items,
    ),
  );

  return {
    lists,
  };
};

describe(createStoreValue, () => {
  describe("store", () => {
    it("returns store", () => {
      createRoot((dispose) => {
        const [state] = createStoreValue();
        expect(state.lists).toEqual([]);
        dispose();
      });
    });

    it("returns store with initial state", () => {
      createRoot((dispose) => {
        const mockState = newMockState();
        const [state] = createStoreValue(mockState);
        expect(state.lists).toEqual(mockState.lists);
        dispose();
      });
    });
  });

  describe("actions", () => {
    describe("add", () => {
      it("adds list to store", () => {
        createRoot((dispose) => {
          const [state, actions] = createStoreValue();
          actions.add({ name: "name" });
          expect(state.lists[0]).toEqual(
            expect.objectContaining({
              name: "name",
              description: undefined,
              items: [],
            }),
          );
          dispose();
        });
      });

      it("adds list to store with description", () => {
        createRoot((dispose) => {
          const [state, actions] = createStoreValue();
          actions.add({ name: "name", description: "desc" });
          expect(state.lists[0]).toEqual(
            expect.objectContaining({
              name: "name",
              description: "desc",
              items: [],
            }),
          );
          dispose();
        });
      });
    });

    describe("remove", () => {
      it("removes list from the store", () => {
        createRoot((dispose) => {
          const mockState = newMockState();
          const [state, actions] = createStoreValue({ ...mockState });
          actions.remove(mockState.lists[0].id);
          expect(state.lists).toEqual(mockState.lists.slice(1));
          dispose();
        });
      });
    });

    describe("find", () => {
      it("returns a list by id", () => {
        createRoot((dispose) => {
          const mockState = newMockState();
          const [_, actions] = createStoreValue(mockState);
          const list = actions.find(mockState.lists[1].id);
          expect(list).toEqual(mockState.lists[1]);
          dispose();
        });
      });
    });

    describe("update", () => {
      it("updates name and description", () => {
        createRoot((dispose) => {
          const mockState = newMockState();
          const [_, actions] = createStoreValue(mockState);
          const id = mockState.lists[0].id;
          const updatedValues = { name: "nameU", description: "descU" };
          actions.update(id, updatedValues);
          expect(actions.find(id)).toEqual({
            ...mockState.lists[0],
            ...updatedValues,
          });
          dispose();
        });
      });

      it("updates name and removes description when description is not prvided", () => {
        createRoot((dispose) => {
          const mockState = newMockState();
          const [_, actions] = createStoreValue(mockState);
          const id = mockState.lists[0].id;
          const updatedValues = { name: "nameU" };
          actions.update(id, updatedValues);
          expect(actions.find(id)).toEqual({
            ...mockState.lists[0],
            ...updatedValues,
            description: undefined,
          });
          dispose();
        });
      });
    });

    describe("play", () => {
      it("updates currentItems to the first item in items array when array is not empty", () => {
        createRoot((dispose) => {
          const mockState = newMockState();
          const [_, actions] = createStoreValue(mockState);
          const id = mockState.lists[0].id;
          const updatedValues = { currentItem: actions.find(id)?.items[0]?.id };
          actions.play(id);
          expect(actions.find(id)).toEqual({
            ...mockState.lists[0],
            ...updatedValues,
          });
          dispose();
        });
      });

      it("does not update current item if items array is empty", () => {
        createRoot((dispose) => {
          const mockState = newMockState();
          const [_, actions] = createStoreValue(mockState);
          const id = mockState.lists[1].id;
          actions.play(id);
          expect(actions.find(id)).toEqual({ ...mockState.lists[1] });
          dispose();
        });
      });

      it("updates completed to false for all the items in the list", () => {
        createRoot((dispose) => {
          const mockState = newMockState();
          const [_, actions] = createStoreValue(mockState);
          const id = mockState.lists[1].id;
          actions.play(id);
          expect(actions.find(id)).toEqual({ ...mockState.lists[1] });
          dispose();
        });
      });
    });

    describe("addItem", () => {
      it("adds item to a list", () => {
        createRoot((dispose) => {
          const mockState = newMockState();
          const [_, actions] = createStoreValue(mockState);
          const id = mockState.lists[0].id;
          actions.addItem(id, { name: "itemNew", description: "itemNew" });

          const items = actions.find(id)?.items;
          expect(items).toHaveLength(5);
          expect(items?.[items.length - 1]).toEqual(
            expect.objectContaining({
              name: "itemNew",
              description: "itemNew",
              completed: false,
            }),
          );
          dispose();
        });
      });
    });

    describe("findItem", () => {
      it("finds item in a list", () => {
        createRoot((dispose) => {
          const mockState = newMockState();
          const [_, actions] = createStoreValue(mockState);
          const listId = mockState.lists[0].id;
          const itemId = mockState.lists[0].items[1].id;

          expect(actions.findItem(listId, itemId)).toEqual({
            data: mockState.lists[0].items[1],
            index: 1,
          });
          dispose();
        });
      });

      it("returns undefined when list does not exist", () => {
        createRoot((dispose) => {
          const mockState = newMockState();
          const [_, actions] = createStoreValue(mockState);
          const listId = "fake";
          const itemId = mockState.lists[0].items[1].id;

          expect(actions.findItem(listId, itemId)).toBeUndefined();
          dispose();
        });
      });
    });

    describe("removeItem", () => {
      it("removes item from list", () => {
        createRoot((dispose) => {
          const mockState = newMockState();
          const [_, actions] = createStoreValue(mockState);
          const listId = mockState.lists[0].id;
          const itemId = mockState.lists[0].items[0].id;

          expect(actions.find(listId)?.items).toHaveLength(4);
          actions.removeItem(listId, itemId);

          expect(actions.find(listId)?.items).toHaveLength(3);
          expect(actions.findItem(listId, itemId)).toBeUndefined();
          dispose();
        });
      });
    });

    describe("updateItem", () => {
      it("updates item in a list", () => {
        createRoot((dispose) => {
          const mockState = newMockState();
          const [_, actions] = createStoreValue(mockState);
          const listId = mockState.lists[0].id;
          const item = mockState.lists[0].items[0];
          const updatedValues: IListItemDataObject = {
            name: "itemNameUpd",
            description: "descUpd",
            completed: true,
            counterType: "limited",
            counterLimit: "10",
            counterProgress: 0,
            timerSeconds: "60",
            timerProgress: 20,
          };

          actions.updateItem(listId, item.id, updatedValues);
          expect(actions.findItem(listId, item.id)?.data).toEqual({
            ...item,
            ...updatedValues,
          });

          dispose();
        });
      });
    });

    describe("resetItemsState", () => {
      it("resets all items state", () => {
        createRoot((dispose) => {
          const mockState = newMockState();
          const [_, actions] = createStoreValue(mockState);
          const id = mockState.lists[0].id;
          actions.resetItemsState(id);
          const items = actions.find(id)?.items;
          expect(items?.every((item) => !item.completed)).toEqual(true);
          dispose();
        });
      });

      it("resets all items state with counter and timer", () => {
        createRoot((dispose) => {
          const mockState = newMockState();
          const [_, actions] = createStoreValue(mockState);
          const id = mockState.lists[1].id;
          actions.resetItemsState(id);

          const items = actions.find(id)?.items;
          expect(
            items?.every((item) =>
              item.counterType
                ? item.counterProgress === 0
                : item.counterType === undefined,
            ),
          ).toEqual(true);
          expect(
            items?.every((item) =>
              item.timerSeconds
                ? item.timerProgress === 0
                : item.timerProgress === undefined,
            ),
          ).toEqual(true);

          dispose();
        });
      });
    });

    describe("reorderItems", () => {
      it("updates items order", () => {
        createRoot((dispose) => {
          const mockState = newMockState();
          const [_, actions] = createStoreValue(mockState);
          const list = mockState.lists[0];
          const prevItems = [...mockState.lists[0].items];

          actions.reorderItems(list.id, [list.items[1], list.items[0]]);

          const items = actions.find(list.id)?.items;
          expect(items).toEqual([prevItems[1], prevItems[0]]);

          dispose();
        });
      });
    });
  });
});
