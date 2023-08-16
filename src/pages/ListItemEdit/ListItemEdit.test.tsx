import type { Mock } from "vitest";

import { Router, useNavigate, useParams } from "@solidjs/router";
import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createListWithItems } from "../../store/helpers";

import { ListItemEdit } from "./ListItemEdit";

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
  };
});

const mockUseParams = useParams as Mock;
const mockUseNavigate = useNavigate as Mock;

describe("ListItemEdit", () => {
  const mockNavigate = vi.fn();
  beforeEach(() => {
    mockUseParams.mockReturnValue({ listId: list.id });
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders component", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <ListItemEdit />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("Save item")).toBeInTheDocument();
  });

  it("submits form when all inputs are valid", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <ListItemEdit />
        </StoreProvider>
      </Router>
    ));

    const nameInput = screen.getByLabelText(/Item name/);

    fireEvent.change(nameInput, { target: { value: "name" } });

    expect(nameInput).toHaveValue("name");

    const button = screen.getByText("Save item");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(`/list/${list.id}`);
  });
});
