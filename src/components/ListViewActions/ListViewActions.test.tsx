import { screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { renderInRouter } from "../../test/utils";

import {
  ListViewActionNew,
  ListViewActionPlay,
  ListViewActions,
} from "./ListViewActions";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

describe("ListViewActions", () => {
  it("renders items", () => {
    renderInRouter(
      () => (
        <ListViewActions>
          <ListViewActionNew listId={list.id} />
          <ListViewActionPlay listId={list.id} />
        </ListViewActions>
      ),
      { lists: [list] },
    );

    expect(screen.getByLabelText("Add item")).toHaveAttribute(
      "href",
      `/list/${list.id}/item/new`,
    );
    expect(screen.getByLabelText("Play list")).toHaveAttribute(
      "href",
      `/list/${list.id}/play`,
    );
  });
});
