import type { Mock } from "vitest";

import { Router, useParams } from "@solidjs/router";
import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createStoreValue } from "../../store/createStoreValue";
import { createListWithItems } from "../../store/helpers";

import { ListHeader } from "./ListHeader";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

vi.mock("../../store/createStoreValue", async () => {
  const type = await import("../../store/createStoreValue");
  const mod: typeof type = await vi.importActual(
    "../../store/createStoreValue",
  );
  return {
    ...mod,
    createStoreValue: vi.fn(),
  };
});

vi.mock("@solidjs/router", async () => {
  const type = await import("@solidjs/router");
  const mod: typeof type = await vi.importActual("@solidjs/router");
  return {
    ...mod,
    useParams: vi.fn(),
  };
});

const mockUseParams = useParams as Mock;
const mockCreateStoreValue = createStoreValue as Mock;

describe("ListHeader", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ listId: list.id });
    mockCreateStoreValue.mockReturnValue([null, { remove: vi.fn() }]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders component", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <ListHeader list={list} />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("list1")).toBeInTheDocument();
    expect(screen.getByText("list1desc")).toBeInTheDocument();
    expect(screen.getByLabelText("Edit list")).toHaveAttribute(
      "href",
      `/list/${list.id}/edit`,
    );
  });
  describe("delete button", () => {
    const removeMock = vi.fn();
    beforeEach(() => {
      mockCreateStoreValue.mockReturnValue([null, { remove: removeMock }]);
    });
    afterEach(() => {
      vi.clearAllMocks();
    });

    describe("when confirm is false", () => {
      beforeEach(() => {
        vi.spyOn(global, "confirm").mockReturnValue(false);
      });

      it("handles click on delete button", () => {
        render(() => (
          <Router>
            <StoreProvider initalStore={{ lists: [list] }}>
              <ListHeader list={list} />
            </StoreProvider>
          </Router>
        ));

        fireEvent.click(screen.getByLabelText("Delete list"));

        expect(removeMock).not.toHaveBeenCalled();
      });
    });

    describe("when confirm is true", () => {
      beforeEach(() => {
        vi.spyOn(global, "confirm").mockReturnValue(true);
      });

      it("handles click on delete button", () => {
        render(() => (
          <Router>
            <StoreProvider initalStore={{ lists: [list] }}>
              <ListHeader list={list} />
            </StoreProvider>
          </Router>
        ));

        fireEvent.click(screen.getByLabelText("Delete list"));

        expect(removeMock).toHaveBeenCalledWith(list.id);
      });
    });
  });
});
