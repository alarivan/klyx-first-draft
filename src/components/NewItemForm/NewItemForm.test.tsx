import type { IListItemDataObject } from "../../store/types";

import { Router } from "@solidjs/router";
import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";

import { createListWithItems } from "../../store/helpers";

import { NewItemForm } from "./NewItemForm";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  {
    name: "item1",
    description: "item1desc",
    counterType: "limited",
    counterLimit: "4",
    timerSeconds: "60",
  },
]);
const item = list.items[0];

describe("NewItemForm", () => {
  afterEach(cleanup);

  it("renders component", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewItemForm listId="listid" onSubmit={onSubmit} />
      </Router>
    ));

    expect(screen.getByLabelText(/Item name/)).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Counter")).toBeInTheDocument();
    expect(screen.queryByLabelText("Counter limit")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Timer")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("renders component with initial values", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewItemForm item={item} listId="listid" onSubmit={onSubmit} />
      </Router>
    ));

    expect(screen.getByLabelText(/Item name/)).toHaveValue("item1");
    expect(screen.getByLabelText("Description")).toHaveValue("item1desc");
    expect(screen.getByLabelText("Counter")).toHaveValue("limited");
    // lol wtf? why?
    const counterInput = screen.getByLabelText("Counter");
    fireEvent.input(counterInput, { target: { value: "limited" } });
    //
    expect(screen.getByLabelText("Counter limit")).toHaveValue(4);

    expect(screen.getByLabelText("Timer")).toHaveValue(60);
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("does not call onSubmit when form is invalid", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewItemForm listId="listid" onSubmit={onSubmit} />
      </Router>
    ));

    const counterInput = screen.getByLabelText("Counter");
    fireEvent.input(counterInput, { target: { value: "limited" } });
    expect(screen.getByLabelText("Counter limit")).toHaveValue(0);

    const button = screen.getByText("Submit");
    fireEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows counterLimit input when counterType is 'limited'", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewItemForm listId="listid" onSubmit={onSubmit} />
      </Router>
    ));

    const counterInput = screen.getByLabelText("Counter");
    fireEvent.input(counterInput, { target: { value: "limited" } });
    const counterLimitInput = screen.getByLabelText("Counter limit");
    fireEvent.blur(counterLimitInput);

    expect(screen.getByText("Constraints not satisfied")).toBeInTheDocument();
  });

  it("submits form when all inputs are valid", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewItemForm listId="listid" onSubmit={onSubmit} />
      </Router>
    ));

    const nameInput = screen.getByLabelText(/Item name/);
    const descriptionInput = screen.getByLabelText("Description");
    const counterInput = screen.getByLabelText("Counter");
    const timerInput = screen.getByLabelText("Timer");

    fireEvent.change(nameInput, { target: { value: "name" } });
    fireEvent.change(descriptionInput, { target: { value: "desc" } });
    fireEvent.input(counterInput, { target: { value: "limited" } });
    fireEvent.input(timerInput, { target: { value: "60" } });

    const counterLimitInput = screen.getByLabelText("Counter limit");
    fireEvent.input(counterLimitInput, { target: { value: "10" } });

    const button = screen.getByText("Submit");
    fireEvent.click(button);

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("submits form with default values when form inputs are empty", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewItemForm listId="listid" onSubmit={onSubmit} />
      </Router>
    ));

    const counterInput = screen.getByLabelText("Counter");
    fireEvent.input(counterInput, { target: { value: null } });

    const button = screen.getByText("Submit");
    fireEvent.click(button);

    const expected: IListItemDataObject = {
      name: null,
      description: null,
      counterType: "none",
      counterLimit: null,
      timerSeconds: "0",
    };
    expect(onSubmit).toHaveBeenCalledWith(expected);
  });
});
