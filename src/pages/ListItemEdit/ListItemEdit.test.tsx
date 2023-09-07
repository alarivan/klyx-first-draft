import { fireEvent, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { renderInListItemGuardProvider } from "../../test/utils";

import { ListItemEdit } from "./ListItemEdit";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

describe("ListItemEdit", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("submits form when all inputs are valid", () => {
    vi.spyOn(history, "back");

    renderInListItemGuardProvider(
      () => <ListItemEdit />,
      `/list/:listId/item/:itemId/edit`,
      list,
    );

    const nameInput = screen.getByLabelText("Name");

    fireEvent.change(nameInput, { target: { value: "name" } });

    expect(nameInput).toHaveValue("name");

    const button = screen.getByText("Save item");
    fireEvent.click(button);

    expect(history.back).toHaveBeenCalledOnce();
  });
});
