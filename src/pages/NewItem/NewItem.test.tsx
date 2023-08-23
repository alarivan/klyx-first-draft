import { fireEvent, screen } from "@solidjs/testing-library";
import { createRoot, createEffect } from "solid-js";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { renderInListGuardProvider } from "../../test/utils";

import { NewItem } from "./NewItem";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

describe("NewItem", () => {
  it("renders new list form", () => {
    renderInListGuardProvider(() => <NewItem />, list);

    expect(screen.getByText("Add item")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("submits form when all inputs are valid", () => {
    const [history] = renderInListGuardProvider(() => <NewItem />, list);

    const nameInput = screen.getByLabelText(/Item name/);
    const descriptionInput = screen.getByRole("textbox", {
      name: "item description",
    });

    fireEvent.change(nameInput, { target: { value: "name" } });
    fireEvent.change(descriptionInput, { target: { value: "longer than 3" } });

    expect(nameInput).toHaveValue("name");
    expect(descriptionInput).toHaveValue("longer than 3");

    const button = screen.getByText("Add item");
    fireEvent.click(button);

    createRoot((dispose) => {
      createEffect(() => {
        expect(history().value).toEqual(`/list/${list.id}`);
        dispose();
      });
    });
  });
});
