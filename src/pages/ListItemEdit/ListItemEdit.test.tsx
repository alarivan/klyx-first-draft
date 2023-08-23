import { Router } from "@solidjs/router";
import { fireEvent, render, screen } from "@solidjs/testing-library";
import { createRoot, createEffect } from "solid-js";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createListWithItems } from "../../store/helpers";
import { renderInListGuardProvider } from "../../test/utils";

import { ListItemEdit } from "./ListItemEdit";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

describe("ListItemEdit", () => {
  it("submits form when all inputs are valid", () => {
    const [history] = renderInListGuardProvider(() => <ListItemEdit />, list);
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <ListItemEdit />
        </StoreProvider>
      </Router>
    ));

    const nameInput = screen.getByLabelText(/Item name/);

    fireEvent.change(nameInput, { target: { value: "name" } });

    expect(nameInput).toHaveValue("name");

    const button = screen.getByText("Save item");
    fireEvent.click(button);

    createRoot((dispose) => {
      createEffect(() => {
        expect(history().value).toEqual(`/list/${list.id}`);
        dispose();
      });
    });
  });
});
