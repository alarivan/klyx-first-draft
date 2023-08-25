import { fireEvent, screen } from "@solidjs/testing-library";
import { createEffect, createRoot } from "solid-js";
import { describe, expect, it } from "vitest";

import { renderInRouter } from "../../test/utils";

import { NewList } from "./NewList";

describe("NewList", () => {
  it("submits form when all inputs are valid", () => {
    const [history] = renderInRouter(() => <NewList />);

    const nameInput = screen.getByLabelText(/List name/);

    fireEvent.change(nameInput, { target: { value: "name" } });

    expect(nameInput).toHaveValue("name");

    const button = screen.getByText("Add list");
    fireEvent.click(button);

    createRoot((dispose) => {
      createEffect(() => {
        expect(history()).toEqual({ value: "/" });
        dispose();
      });
    });
  });

  it("navigates to home on cancel", () => {
    const [history] = renderInRouter(() => <NewList />);

    const button = screen.getByText("Cancel");
    fireEvent.click(button);

    createRoot((dispose) => {
      createEffect(() => {
        expect(history().value).toEqual(`/`);
        dispose();
      });
    });
  });
});
