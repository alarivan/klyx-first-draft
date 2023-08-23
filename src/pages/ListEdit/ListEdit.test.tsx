import { fireEvent, screen } from "@solidjs/testing-library";
import { createRoot, createEffect } from "solid-js";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { renderInListGuardProvider } from "../../test/utils";

import { ListEdit } from "./ListEdit";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

describe("ListEdit", () => {
  it("submits form when all inputs are valid", () => {
    const [history] = renderInListGuardProvider(() => <ListEdit />, list);

    const nameInput = screen.getByLabelText(/List name/);

    fireEvent.change(nameInput, { target: { value: "name" } });

    expect(nameInput).toHaveValue("name");

    const button = screen.getByText("Save list");
    fireEvent.click(button);

    createRoot((dispose) => {
      createEffect(() => {
        expect(history().value).toEqual(`/list/${list.id}`);
        dispose();
      });
    });
  });
});
