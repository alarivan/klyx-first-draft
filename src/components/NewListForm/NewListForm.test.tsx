import { Router } from "@solidjs/router";
import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";

import { createListWithItems } from "../../store/helpers";

import { NewListForm } from "./NewListForm";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

describe("NewListForm", () => {
  afterEach(cleanup);

  it("renders component", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewListForm onSubmit={onSubmit} onCancel={() => {}} />
      </Router>
    ));

    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("renders component with initial values", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewListForm onSubmit={onSubmit} list={list} onCancel={() => {}} />
      </Router>
    ));

    expect(screen.getByLabelText(/List name/)).toHaveValue("list1");
    expect(screen.getByLabelText("Description")).toHaveValue("list1desc");
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("does not call onSubmit when form is invalid", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewListForm onSubmit={onSubmit} onCancel={() => {}} />
      </Router>
    ));

    const button = screen.getByText("Submit");
    fireEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows name error when name is empty", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewListForm onSubmit={onSubmit} onCancel={() => {}} />
      </Router>
    ));

    const input = screen.getByLabelText(/List name/);
    fireEvent.change(input, { value: "" });
    fireEvent.blur(input);

    expect(screen.getByText("Constraints not satisfied")).toBeInTheDocument();
  });

  it("submits form when all inputs are valid", () => {
    const onSubmit = vi.fn();

    render(() => (
      <Router>
        <NewListForm onSubmit={onSubmit} onCancel={() => {}} />
      </Router>
    ));

    const nameInput = screen.getByLabelText(/List name/);
    const descriptionInput = screen.getByLabelText("Description");

    fireEvent.change(nameInput, { target: { value: "name" } });
    fireEvent.change(descriptionInput, { target: { value: "desc" } });

    expect(nameInput).toHaveValue("name");
    expect(descriptionInput).toHaveValue("desc");

    const button = screen.getByText("Submit");
    fireEvent.click(button);

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("submits form when all inputs are valid", () => {
    const onCancel = vi.fn();

    render(() => (
      <Router>
        <NewListForm onCancel={onCancel} onSubmit={vi.fn()} />
      </Router>
    ));

    const button = screen.getByText("Cancel");
    fireEvent.click(button);

    expect(onCancel).toHaveBeenCalledOnce();
  });
});
