import { Router } from "@solidjs/router";
import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from 'vitest';

import { StoreProvider } from "../../store/context";

import { NewItem } from "./NewItem";


describe("NewItem", () => {

  afterEach(cleanup);

  it("renders new list form", () => {
    render(() =>
      <Router>
        <StoreProvider>
          <NewItem />
        </StoreProvider>
      </Router>
    );

    expect(screen.getByText("Add item")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });


  it("submits form when all inputs are valid", () => {
    render(() =>
      <Router>
        <StoreProvider>
          <NewItem />
        </StoreProvider>
      </Router>
    );

    const nameInput = screen.getByPlaceholderText("Item name");
    const descriptionInput = screen.getByRole('textbox', { name: 'item description' })

    fireEvent.change(nameInput, { target: { value: 'name' } })
    fireEvent.change(descriptionInput, { target: { value: 'longer than 3' } })

    expect(nameInput).toHaveValue('name')
    expect(descriptionInput).toHaveValue('longer than 3')

    const button = screen.getByText("Add item");
    fireEvent.click(button)
  });
});
