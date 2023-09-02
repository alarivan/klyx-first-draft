import { screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { renderInListItemGuardProvider } from "../../test/utils";

import { PlayHeader } from "./PlayHeader";

const list = () =>
  createListWithItems({ name: "list1", description: "list1desc" }, [
    { name: "item1", description: "item1desc" },
    { name: "item1", description: "item1desc" },
    { name: "item1", description: "item1desc" },
  ]);

const playPath = "/list/:listId/play/:itemId";
describe("PlayHeader", () => {
  it("renders component", () => {
    renderInListItemGuardProvider(() => <PlayHeader />, playPath, list(), 1);

    expect(screen.getByText("list1")).toBeInTheDocument();
    expect(screen.getByText("2/3")).toBeInTheDocument();
  });
});
