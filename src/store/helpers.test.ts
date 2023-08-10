import { describe, expect, it } from "vitest";

import { createList, createListItem, createListWithItems } from "./helpers";

describe("helpers", () => {
  describe(createList, () => {
    it("returns a new list", () => {
      const list = createList({ name: "name", description: "desc" });
      expect(list).toEqual(
        expect.objectContaining({
          name: "name",
          description: "desc",
          items: [],
        }),
      );
    });
  });

  describe(createListItem, () => {
    it("returns a new list item", () => {
      const listItem = createListItem({
        name: "name",
        description: "desc",
        counterType: "limited",
        counterLimit: 10,
        timerSeconds: 60,
      });
      expect(listItem).toEqual(
        expect.objectContaining({
          name: "name",
          description: "desc",
          completed: false,
        }),
      );
    });

    it("returns a new list item with completed", () => {
      const listItem = createListItem({
        name: "name",
        description: "desc",
        completed: true,
      });
      expect(listItem).toEqual(
        expect.objectContaining({
          name: "name",
          description: "desc",
          completed: true,
        }),
      );
    });

    it("returns a new list item with timer and counter", () => {
      const listItem = createListItem({
        name: "name",
        description: "desc",
        counterType: "limited",
        counterLimit: 10,
        timerSeconds: 60,
      });
      expect(listItem).toEqual(
        expect.objectContaining({
          name: "name",
          description: "desc",
          completed: false,
          counterType: "limited",
          counterLimit: 10,
          counterProgress: 0,
          timerSeconds: 60,
          timerProgress: 0,
        }),
      );
    });
  });

  describe(createListWithItems, () => {
    it("returns a new list without itmes", () => {
      const list = createListWithItems({
        name: "name",
        description: "desc",
      });
      expect(list).toEqual(
        expect.objectContaining({
          name: "name",
          description: "desc",
          items: [],
        }),
      );
    });

    it("returns a new list with items", () => {
      const list = createListWithItems(
        {
          name: "name",
          description: "desc",
        },
        [{ name: "itemName", description: "itemDesc", completed: true }],
      );
      expect(list).toEqual(
        expect.objectContaining({
          name: "name",
          description: "desc",
          items: [
            expect.objectContaining({
              name: "itemName",
              description: "itemDesc",
              completed: true,
            }),
          ],
        }),
      );
    });
  });
});
