import type { Mock } from "vitest";

import { fireEvent, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createStoreValue } from "../../store/createStoreValue";
import { createListWithItems } from "../../store/helpers";
import { renderInRouter } from "../../test/utils";

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

const mockCreateStoreValue = createStoreValue as Mock;

describe("ListHeader", () => {
  beforeEach(() => {
    mockCreateStoreValue.mockReturnValue([null, { remove: vi.fn() }]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders component", () => {
    renderInRouter(() => <ListHeader list={list} />);

    expect(screen.getByText("list1")).toBeInTheDocument();
    expect(screen.getByText("list1desc")).toBeInTheDocument();
  });

  describe("actions panel", () => {
    it("renders component and open panel", async () => {
      renderInRouter(() => <ListHeader list={list}>children</ListHeader>);

      const toggle = screen.getByLabelText("List actions");
      fireEvent.click(toggle);

      await new Promise((done) => setTimeout(done, 0));

      expect(screen.getByText("children")).toBeInTheDocument();
      expect(screen.getByLabelText("Reset all items")).toBeInTheDocument();
      expect(screen.getByLabelText("Delete list")).toBeInTheDocument();
      expect(screen.getByLabelText("Edit list")).toHaveAttribute(
        "href",
        `/list/${list.id}/edit`,
      );
    });
  });

  describe("delete button", () => {
    const removeMock = vi.fn();
    beforeEach(() => {
      mockCreateStoreValue.mockReturnValue([null, { remove: removeMock }]);

      renderInRouter(() => <ListHeader list={list} />);

      const toggle = screen.getByLabelText("List actions");
      fireEvent.click(toggle);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    describe("when confirm is false", () => {
      beforeEach(() => {
        vi.spyOn(global, "confirm").mockReturnValue(false);
      });

      it("handles click on delete button", () => {
        fireEvent.click(screen.getByLabelText("Delete list"));

        expect(removeMock).not.toHaveBeenCalled();
      });
    });

    describe("when confirm is true", () => {
      beforeEach(() => {
        vi.spyOn(global, "confirm").mockReturnValue(true);
      });

      it("handles click on delete button", () => {
        fireEvent.click(screen.getByLabelText("Delete list"));

        expect(removeMock).toHaveBeenCalledWith(list.id);
      });
    });
  });
});
