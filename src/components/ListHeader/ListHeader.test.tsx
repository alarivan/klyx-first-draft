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
  const removeMock = vi.fn();
  const resetItemsStateMock = vi.fn();
  beforeEach(() => {
    mockCreateStoreValue.mockReturnValue([
      null,
      { remove: removeMock, resetItemsState: resetItemsStateMock },
    ]);
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
    beforeEach(() => {
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

  describe("reset button", () => {
    beforeEach(() => {
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

      it("handles click on reset button", () => {
        fireEvent.click(screen.getByLabelText("Reset all items"));

        expect(resetItemsStateMock).not.toHaveBeenCalled();
      });
    });

    describe("when confirm is true", () => {
      beforeEach(() => {
        vi.spyOn(global, "confirm").mockReturnValue(true);
      });

      it("handles click on reset button", () => {
        fireEvent.click(screen.getByLabelText("Reset all items"));

        expect(resetItemsStateMock).toHaveBeenCalledWith(list.id);
      });
    });
  });

  describe("share button", () => {
    const writeTextMock = vi.fn();

    beforeAll(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: writeTextMock },
      });
    });

    beforeEach(() => {
      renderInRouter(() => <ListHeader list={list} />);

      const toggle = screen.getByLabelText("List actions");
      fireEvent.click(toggle);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("handles click on share button", async () => {
      const currentList = JSON.stringify(list);
      const url = new URL(window.location.origin + "/preview");
      url.searchParams.append("list", currentList);

      fireEvent.click(screen.getByLabelText("Share list"));

      expect(writeTextMock).toHaveBeenCalledWith(url.toString());
    });
  });
});
