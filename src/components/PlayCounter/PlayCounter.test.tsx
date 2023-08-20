import type { Mock } from "vitest";

import { Router, useNavigate, useParams } from "@solidjs/router";
import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createStoreValue } from "../../store/createStoreValue";
import { createListWithItems } from "../../store/helpers";

import { PlayCounter } from "./PlayCounter";

vi.mock("@solidjs/router", async () => {
  const type = await import("@solidjs/router");
  const mod: typeof type = await vi.importActual("@solidjs/router");
  return {
    ...mod,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

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

const mockUseParams = useParams as Mock;
const mockUseNavigate = useNavigate as Mock;
const mockCreateStoreValue = createStoreValue as Mock;

describe("PlayCounter", () => {
  const navigateMock = vi.fn();
  const updateItemMock = vi.fn();
  beforeEach(() => {
    mockCreateStoreValue.mockReturnValue([
      null,
      { updateItem: updateItemMock },
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("limited", () => {
    const list = createListWithItems(
      { name: "list1", description: "list1desc" },
      [
        {
          name: "item1",
          description: "item1desc",
          counterLimit: "2",
          counterType: "limited",
        },
        {
          name: "item2",
          description: "item2desc",
        },
      ],
    );
    const limitedItem = list.items[0];

    beforeEach(() => {
      mockUseParams.mockReturnValue({ listId: list.id });
      mockUseNavigate.mockReturnValue(navigateMock);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("renders component with initial state 0", () => {
      render(() => (
        <Router>
          <StoreProvider initalStore={{ lists: [list] }}>
            <PlayCounter list={list} item={limitedItem} index={0} />
          </StoreProvider>
        </Router>
      ));

      expect(screen.getByLabelText("Decrease counter")).toBeDisabled();
      expect(screen.getByLabelText("Increase counter")).not.toBeDisabled();
      expect(screen.getByText("Reset counter")).toBeInTheDocument();
      expect(
        screen.getByText("Automatically go next when counter is completed"),
      ).toBeInTheDocument();

      expect(screen.getByText("0/2")).toBeInTheDocument();
    });

    it("renders component with initial state limit", () => {
      render(() => (
        <Router>
          <StoreProvider initalStore={{ lists: [list] }}>
            <PlayCounter
              list={list}
              item={{ ...limitedItem, counterProgress: 2 }}
              index={0}
            />
          </StoreProvider>
        </Router>
      ));

      expect(screen.getByLabelText("Decrease counter")).not.toBeDisabled();
      expect(screen.getByLabelText("Increase counter")).toBeDisabled();
      expect(screen.getByText("2/2")).toBeInTheDocument();
    });

    it("decreases counter", () => {
      render(() => (
        <Router>
          <StoreProvider initalStore={{ lists: [list] }}>
            <PlayCounter
              list={list}
              item={{ ...limitedItem, counterProgress: 2 }}
              index={0}
            />
          </StoreProvider>
        </Router>
      ));

      expect(screen.getByText("2/2")).toBeInTheDocument();

      const decrease = screen.getByLabelText("Decrease counter");
      fireEvent.click(decrease);
      expect(updateItemMock).toHaveBeenCalledWith(list.id, limitedItem.id, {
        counterProgress: 1,
      });
    });

    it("increases counter", () => {
      render(() => (
        <Router>
          <StoreProvider initalStore={{ lists: [list] }}>
            <PlayCounter
              list={list}
              item={{ ...limitedItem, counterProgress: 1 }}
              index={0}
            />
          </StoreProvider>
        </Router>
      ));

      expect(screen.getByText("1/2")).toBeInTheDocument();

      const decrease = screen.getByLabelText("Increase counter");
      fireEvent.click(decrease);
      expect(updateItemMock).toHaveBeenCalledWith(list.id, limitedItem.id, {
        counterProgress: 2,
      });
    });

    it("resets counter", () => {
      render(() => (
        <Router>
          <StoreProvider initalStore={{ lists: [list] }}>
            <PlayCounter
              list={list}
              item={{ ...limitedItem, counterProgress: 1 }}
              index={0}
            />
          </StoreProvider>
        </Router>
      ));

      expect(screen.getByText("1/2")).toBeInTheDocument();

      const reset = screen.getByText("Reset counter");
      fireEvent.click(reset);
      expect(updateItemMock).toHaveBeenCalledWith(list.id, limitedItem.id, {
        counterProgress: 0,
      });
    });

    it("updates counterAutoswitch", () => {
      render(() => (
        <Router>
          <StoreProvider initalStore={{ lists: [list] }}>
            <PlayCounter
              list={list}
              item={{ ...limitedItem, counterProgress: 1 }}
              index={0}
            />
          </StoreProvider>
        </Router>
      ));

      expect(screen.getByText("1/2")).toBeInTheDocument();

      const checkbox = screen.getByLabelText(
        "Automatically go next when counter is completed",
      );
      fireEvent.click(checkbox);

      expect(updateItemMock).toHaveBeenCalledWith(list.id, limitedItem.id, {
        counterAutoswitch: false,
      });
    });

    describe("when counterAutocomplete is true", () => {
      it("calls navigate to next item when counter is completed", () => {
        render(() => (
          <Router>
            <StoreProvider initalStore={{ lists: [list] }}>
              <PlayCounter
                list={list}
                item={{ ...limitedItem, counterProgress: 1 }}
                index={0}
              />
            </StoreProvider>
          </Router>
        ));

        expect(screen.getByText("1/2")).toBeInTheDocument();

        const increase = screen.getByLabelText("Increase counter");
        fireEvent.click(increase);

        expect(navigateMock).toHaveBeenCalledWith(
          `/list/${list.id}/play/${list.items[1].id}`,
        );
      });

      it("calls navigate to done when counter is completed and last item", () => {
        const listWithSingleItem = { ...list, items: [list.items[0]] };

        render(() => (
          <Router>
            <StoreProvider initalStore={{ lists: [listWithSingleItem] }}>
              <PlayCounter
                list={listWithSingleItem}
                item={{ ...listWithSingleItem.items[0], counterProgress: 1 }}
                index={0}
              />
            </StoreProvider>
          </Router>
        ));

        expect(screen.getByText("1/2")).toBeInTheDocument();

        const increase = screen.getByLabelText("Increase counter");
        fireEvent.click(increase);

        expect(navigateMock).toHaveBeenCalledWith(
          `/list/${listWithSingleItem.id}/play/done`,
        );
      });
    });
  });

  describe("unlimited", () => {
    const list = createListWithItems(
      { name: "list1", description: "list1desc" },
      [
        {
          name: "item1",
          description: "item1desc",
          counterType: "unlimited",
        },
        {
          name: "item2",
          description: "item2desc",
          counterLimit: "2",
          counterType: "limited",
        },
      ],
    );
    const unlimitedItem = list.items[0];

    beforeEach(() => {
      mockUseParams.mockReturnValue({ listId: list.id });
      mockUseNavigate.mockReturnValue(navigateMock);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("renders component with initial state", () => {
      render(() => (
        <Router>
          <StoreProvider initalStore={{ lists: [list] }}>
            <PlayCounter list={list} item={unlimitedItem} index={0} />
          </StoreProvider>
        </Router>
      ));

      expect(screen.getByLabelText("Decrease counter")).toBeDisabled();
      expect(screen.getByLabelText("Increase counter")).not.toBeDisabled();
      expect(screen.getByText("Reset counter")).toBeInTheDocument();
      expect(
        screen.queryByText("Automatically go next when counter is completed"),
      ).not.toBeInTheDocument();

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("increases counter", () => {
      render(() => (
        <Router>
          <StoreProvider initalStore={{ lists: [list] }}>
            <PlayCounter
              list={list}
              item={{ ...unlimitedItem, counterProgress: 1 }}
              index={0}
            />
          </StoreProvider>
        </Router>
      ));

      expect(screen.getByText("1")).toBeInTheDocument();

      const decrease = screen.getByLabelText("Increase counter");
      fireEvent.click(decrease);
      expect(updateItemMock).toHaveBeenCalledWith(list.id, unlimitedItem.id, {
        counterProgress: 2,
      });
    });
  });
});
