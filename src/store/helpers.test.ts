import { describe, expect, it } from "vitest";

import { createList, createListItem } from "./helpers";

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
      });
      expect(listItem).toEqual(
        expect.objectContaining({
          name: "name",
          description: "desc",
          completed: false,
        }),
      );
    });
  });
});
