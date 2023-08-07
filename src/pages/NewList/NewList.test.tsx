import { Router } from "@solidjs/router";
import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from 'vitest';

import "@testing-library/jest-dom"

import { StoreProvider } from "../../store/context";

import { NewList } from "./NewList";


describe("NewList", () => {

  afterEach(cleanup);

  it("renders new list form", () => {
    render(() =>
      <Router>
        <StoreProvider>
          <NewList />
        </StoreProvider>
      </Router>
    );

    expect(screen.getByText("Add list")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });


  it("submits form when all inputs are valid", () => {
    render(() =>
      <Router>
        <StoreProvider>
          <NewList />
        </StoreProvider>
      </Router>
    );

    const nameInput = screen.getByPlaceholderText("List name");
    const descriptionInput = screen.getByRole('textbox', { name: 'list description' })

    fireEvent.change(nameInput, { target: { value: 'name' } })
    fireEvent.change(descriptionInput, { target: { value: 'longer than 3' } })

    expect(nameInput).toHaveValue('name')
    expect(descriptionInput).toHaveValue('longer than 3')

    const button = screen.getByText("Add list");
    fireEvent.click(button)
  });
});
