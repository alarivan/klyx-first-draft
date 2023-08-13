import { Router } from "@solidjs/router";
import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";

import { NewItemForm } from "./NewItemForm";

describe("NewItemForm", () => {
  afterEach(cleanup);

  it("renders component", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewItemForm listId="listid" onSubmit={onSubmit} />
      </Router>
    ));

    expect(screen.getByLabelText("Item name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Counter")).toBeInTheDocument();
    expect(screen.queryByLabelText("Counter limit")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Timer")).toBeInTheDocument();
    expect(screen.getByText("Add item")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("does not call onSubmit when form is invalid", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewItemForm listId="listid" onSubmit={onSubmit} />
      </Router>
    ));

    const button = screen.getByText("Add item");
    fireEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows name error when name is empty", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewItemForm listId="listid" onSubmit={onSubmit} />
      </Router>
    ));

    const input = screen.getByLabelText("Item name");
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);

    expect(screen.getByText("Constraints not satisfied")).toBeInTheDocument();
  });

  it("shows min length error when name is less than 3", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewItemForm listId="listid" onSubmit={onSubmit} />
      </Router>
    ));

    const input = screen.getByLabelText("Item name");
    fireEvent.change(input, { target: { value: "12" } });
    fireEvent.blur(input);

    expect(
      screen.getByText("name should be longer than 3"),
    ).toBeInTheDocument();
  });

  it("shows counterLimit input when counterType is 'limited'", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewItemForm listId="listid" onSubmit={onSubmit} />
      </Router>
    ));

    const input = screen.getByLabelText("Counter");
    fireEvent.input(input, { target: { value: "limited" } });

    expect(screen.getByLabelText("Counter limit")).toBeInTheDocument();
  });

  it("submits form when all inputs are valid", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewItemForm listId="listid" onSubmit={onSubmit} />
      </Router>
    ));

    const nameInput = screen.getByLabelText("Item name");
    const descriptionInput = screen.getByLabelText("Description");
    const counterInput = screen.getByLabelText("Counter");
    const timerInput = screen.getByLabelText("Timer");

    fireEvent.change(nameInput, { target: { value: "name" } });
    fireEvent.change(descriptionInput, { target: { value: "longer than 3" } });
    fireEvent.input(counterInput, { target: { value: "limited" } });
    fireEvent.input(timerInput, { target: { value: "60" } });

    const counterLimitInput = screen.getByLabelText("Counter limit");
    fireEvent.input(counterLimitInput, { target: { value: "10" } });

    const button = screen.getByText("Add item");
    fireEvent.click(button);

    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
