import { Router } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createListWithItems } from "../../store/helpers";

import { ListViewActions } from "./ListViewActions";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

describe("ListViewActions", () => {
  it("renders component", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <ListViewActions listId={list.id} />
        </StoreProvider>
      </Router>
    ));

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
