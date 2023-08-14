import type { Mock } from "vitest";

import { Navigate, Router, useNavigate, useParams } from "@solidjs/router";
import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createListWithItems } from "../../store/helpers";

import { NewItem } from "./NewItem";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

vi.mock("@solidjs/router", async () => {
  const type = await import("@solidjs/router");
  const mod: typeof type = await vi.importActual("@solidjs/router");
  return {
    ...mod,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
    Navigate: vi.fn(),
  };
});

const mockUseParams = useParams as Mock;
const mockUseNavigate = useNavigate as Mock;
const mockNavigateComponent = Navigate as Mock;

describe("NewItem", () => {
  const mockNavigate = vi.fn();
  beforeEach(() => {
    mockUseParams.mockReturnValue({ listId: list.id });
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders new list form", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <NewItem />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("Add item")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("redirects when list is not found", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [] }}>
          <NewItem />
        </StoreProvider>
      </Router>
    ));

    expect(mockNavigateComponent).toHaveBeenCalledWith({ href: "/" });
  });

  it("submits form when all inputs are valid", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <NewItem />
        </StoreProvider>
      </Router>
    ));

    const nameInput = screen.getByLabelText(/Item name/);
    const descriptionInput = screen.getByRole("textbox", {
      name: "item description",
    });

    fireEvent.change(nameInput, { target: { value: "name" } });
    fireEvent.change(descriptionInput, { target: { value: "longer than 3" } });

    expect(nameInput).toHaveValue("name");
    expect(descriptionInput).toHaveValue("longer than 3");

    const button = screen.getByText("Add item");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(`/list/${list.id}`);
  });
});
