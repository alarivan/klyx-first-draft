import type { IList } from "./types";

import { describe, expect, it } from "vitest";

import {
  createList,
  createListItem,
  createListWithItems,
  isCompleted,
  stripIds,
} from "./helpers";

describe("helpers", () => {
  describe(createList, () => {
    it("returns a new list", () => {
      const list = createList({ name: "name", description: "desc" });
      expect(list).toEqual(
        expect.objectContaining({
          name: "name",
          description: "desc",
          items: [],
          currentItem: null,
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
        counterLimit: "10",
        timerSeconds: "60",
      });
      expect(listItem).toEqual(
        expect.objectContaining({
          name: "name",
          description: "desc",
          counterType: "limited",
          counterLimit: "10",
          counterAutoswitch: true,
          counterProgress: 0,
          timerSeconds: "60",
          timerProgress: 0,
          timerAutoswitch: true,
          timerAutostart: false,
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
          counterType: "none",
          counterLimit: null,
          counterProgress: null,
          timerSeconds: null,
          timerProgress: null,
        }),
      );
    });

    it("returns a new list item with timer and counter", () => {
      const listItem = createListItem({
        name: "name",
        description: "desc",
        counterType: "limited",
        counterLimit: "10",
        timerSeconds: "60",
      });
      expect(listItem).toEqual(
        expect.objectContaining({
          name: "name",
          description: "desc",
          completed: false,
          counterType: "limited",
          counterLimit: "10",
          counterProgress: 0,
          timerSeconds: "60",
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
          currentItem: null,
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
              counterType: "none",
              counterLimit: null,
              counterProgress: null,
              timerSeconds: null,
              timerProgress: null,
            }),
          ],
        }),
      );
    });
  });

  describe(isCompleted, () => {
    describe("default", () => {
      const item = createListItem({
        name: "name",
        description: "desc",
      });

      it("returns items' completed whithout timer and limited counter", () => {
        const completed = isCompleted({
          ...item,
          completed: true,
        });
        expect(completed).toEqual(true);
      });
    });

    describe("with limited counter and timer", () => {
      const item = createListItem({
        name: "name",
        description: "desc",
        counterType: "limited",
        counterLimit: "10",
        timerSeconds: "60",
      });

      it("retruns true when counter limit and timer seconds are reached", () => {
        const completed = isCompleted({
          ...item,
          timerProgress: 60,
          counterProgress: 10,
        });
        expect(completed).toEqual(true);
      });

      it("retruns false when counter limit and timer seconds are not reached", () => {
        const completed = isCompleted({
          ...item,
          timerProgress: 59,
          counterProgress: 9,
        });
        expect(completed).toEqual(false);
      });

      it("retruns false when counter limit or timer seconds are not reached", () => {
        const completed = isCompleted({
          ...item,
          timerProgress: 60,
          counterProgress: 9,
        });
        expect(completed).toEqual(false);
      });
    });
  });

  describe("with timer", () => {
    const item = createListItem({
      name: "name",
      description: "desc",
      counterType: "none",
      timerSeconds: "60",
    });

    it("retruns true when timer seconds are reached", () => {
      const completed = isCompleted({
        ...item,
        timerProgress: 60,
      });
      expect(completed).toEqual(true);
    });

    it("retruns false when timer seconds are not reached", () => {
      const completed = isCompleted({
        ...item,
        timerProgress: 59,
      });
      expect(completed).toEqual(false);
    });
  });

  describe("with counter 'limited'", () => {
    const item = createListItem({
      name: "name",
      description: "desc",
      counterType: "limited",
      counterLimit: "10",
    });

    it("retruns true when timer seconds are reached", () => {
      const completed = isCompleted({
        ...item,
        counterProgress: 10,
      });
      expect(completed).toEqual(true);
    });

    it("retruns false when timer seconds are not reached", () => {
      const completed = isCompleted({
        ...item,
        counterProgress: 9,
      });
      expect(completed).toEqual(false);
    });
  });

  describe("stripIds", () => {
    it("strips ids from value", () => {
      expect(stripIds({ id: "123", name: "haloa" } as IList)).toEqual({
        name: "haloa",
      });
    });
  });
});
