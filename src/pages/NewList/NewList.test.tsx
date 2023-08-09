import type { Mock } from "vitest";

import { Router, useNavigate } from "@solidjs/router";
import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";

import { NewList } from "./NewList";

vi.mock("@solidjs/router", async () => {
  const mod: any = await vi.importActual("@solidjs/router");
  return {
    ...mod,
    useNavigate: vi.fn(),
  };
});

const mockUseNavigate = useNavigate as Mock;

describe("NewList", () => {
  const mockNavigate = vi.fn();
  beforeEach(() => {
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders new list form", () => {
    render(() => (
      <Router>
        <StoreProvider>
          <NewList />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("Add list")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("submits form when all inputs are valid", () => {
    render(() => (
      <Router>
        <StoreProvider>
          <NewList />
        </StoreProvider>
      </Router>
    ));

    const nameInput = screen.getByPlaceholderText("List name");
    const descriptionInput = screen.getByRole("textbox", {
      name: "list description",
    });

    fireEvent.change(nameInput, { target: { value: "name" } });
    fireEvent.change(descriptionInput, { target: { value: "longer than 3" } });

    expect(nameInput).toHaveValue("name");
    expect(descriptionInput).toHaveValue("longer than 3");

    const button = screen.getByText("Add list");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
