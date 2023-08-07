import { Router } from "@solidjs/router";
import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from 'vitest';
import "@testing-library/jest-dom"

import { NewListForm } from "./NewListForm";


describe("NewListForm", () => {

  afterEach(cleanup);

  it("renders component", () => {
    const onSubmit = vi.fn()

    render(() => <Router><NewListForm onSubmit={onSubmit} /></Router>);


    expect(screen.getByText("Add list")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("does not call onSubmit when form is invalid", () => {
    const onSubmit = vi.fn()

    render(() => <Router><NewListForm onSubmit={onSubmit} /></Router>);


    const button = screen.getByText("Add list");
    fireEvent.click(button)
    expect(onSubmit).not.toHaveBeenCalled();
  });


  it("shows name error when name is empty", () => {
    const onSubmit = vi.fn()

    render(() => <Router><NewListForm onSubmit={onSubmit} /></Router>);


    const input = screen.getByPlaceholderText("List name");
    fireEvent.change(input, { value: '' })
    fireEvent.blur(input)

    expect(screen.getByText('Constraints not satisfied')).toBeInTheDocument();
  });

  it("shows description error when description is less than 3 characters", () => {
    const onSubmit = vi.fn()

    render(() => <Router><NewListForm onSubmit={onSubmit} /></Router>);


    const input = screen.getByRole('textbox', { name: 'list description' })
    fireEvent.change(input, { value: '' })
    fireEvent.blur(input)

    expect(screen.getByText('description should be longer than 3')).toBeInTheDocument();
  });

  it("submits form when all inputs are valid", () => {
    const onSubmit = vi.fn()

    render(() => <Router><NewListForm onSubmit={onSubmit} /></Router>);


    const nameInput = screen.getByPlaceholderText("List name");
    const descriptionInput = screen.getByRole('textbox', { name: 'list description' })

    fireEvent.change(nameInput, { target: { value: 'name' } })
    fireEvent.change(descriptionInput, { target: { value: 'longer than 3' } })

    expect(nameInput).toHaveValue('name')
    expect(descriptionInput).toHaveValue('longer than 3')

    const button = screen.getByText("Add list");
    fireEvent.click(button)

    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
