import type { Mock } from "vitest";

import { Router } from "@solidjs/router";
import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createStoreValue } from "../../store/createStoreValue";
import { createListWithItems } from "../../store/helpers";
import { renderInRouter } from "../../test/utils";

import { ListItemSummaryLine } from "./ListItemSummaryLine";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1" },
  {
    name: "item2",
    description: "item2desc",
    counterType: "limited",
    counterLimit: "10",
    timerSeconds: "60",
  },
  {
    name: "item3",
    description: "item3desc",
    counterType: "unlimited",
  },
  {
    description: "item4desc",
  },
]);
const itemMinimal = list.items[0];
const itemFull = list.items[1];
const itemUnlimited = list.items[2];
const itemNoName = list.items[3];

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

describe("ListItemSummaryLine", () => {
  beforeEach(() => {
    mockCreateStoreValue.mockReturnValue([
      null,
      { removeItem: vi.fn(), updateItem: vi.fn() },
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders component with all data", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <ListItemSummaryLine listId={list.id} item={itemFull} index={1} />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("item2")).toBeInTheDocument();
    expect(screen.getByText("Repeat:")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Timer:")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
    expect(screen.getByText("item2desc")).toBeInTheDocument();
  });

  it("renders component without name and with description", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <ListItemSummaryLine listId={list.id} item={itemNoName} index={3} />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getAllByText("item4desc")).toHaveLength(2);
  });

  it("renders component with unlimited counter", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <ListItemSummaryLine
            listId={list.id}
            item={itemUnlimited}
            index={2}
          />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("Repeat:")).toBeInTheDocument();
    expect(screen.getByText("unlimited")).toBeInTheDocument();
  });

  it("renders with minimal data", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [] }}>
          <ListItemSummaryLine listId={list.id} item={itemMinimal} index={0} />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("item1")).toBeInTheDocument();
    expect(screen.queryByText("Repeat:")).not.toBeInTheDocument();
    expect(screen.queryByText("Timer:")).not.toBeInTheDocument();
    expect(screen.queryByText("item1desc")).not.toBeInTheDocument();
  });

  it("renders with minimal data", () => {
    const updateItemMock = vi.fn();
    mockCreateStoreValue.mockReturnValue([
      null,
      { removeItem: vi.fn(), updateItem: updateItemMock },
    ]);
    renderInRouter(() => (
      <ListItemSummaryLine listId={list.id} item={itemMinimal} index={0} />
    ));

    const toggle = screen.getByTitle("Toggle completed for item 1");
    fireEvent.click(toggle);

    expect(updateItemMock).toHaveBeenCalledWith(list.id, itemMinimal.id, {
      completed: true,
    });
  });

  describe("delete item", () => {
    const removeItemMock = vi.fn();
    beforeEach(() => {
      mockCreateStoreValue.mockReturnValue([
        null,
        { removeItem: removeItemMock },
      ]);
    });
    afterEach(() => {
      vi.clearAllMocks();
    });

    describe("when confirm is false", () => {
      beforeEach(() => {
        vi.spyOn(global, "confirm").mockReturnValue(false);
      });

      it("does not call remove item when delete button is clicked", () => {
        render(() => (
          <Router>
            <StoreProvider initalStore={{ lists: [] }}>
              <ListItemSummaryLine
                listId={list.id}
                item={itemMinimal}
                index={0}
              />
            </StoreProvider>
          </Router>
        ));

        const deleteItem = screen.getByLabelText("Delete item");
        fireEvent.click(deleteItem);

        expect(removeItemMock).not.toHaveBeenCalled();
      });
    });

    describe("when confirm is true", () => {
      beforeEach(() => {
        vi.spyOn(global, "confirm").mockReturnValue(true);
      });

      it("calls remove item when delete button is clicked", () => {
        render(() => (
          <Router>
            <StoreProvider initalStore={{ lists: [] }}>
              <ListItemSummaryLine
                listId={list.id}
                item={itemMinimal}
                index={0}
              />
            </StoreProvider>
          </Router>
        ));

        const deleteItem = screen.getByLabelText("Delete item");
        fireEvent.click(deleteItem);

        expect(removeItemMock).toHaveBeenCalled();
      });
    });
  });

  describe("description height", () => {
    describe("when description is expandable", () => {
      const originalOffsetHeight = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        "offsetHeight",
      ) as PropertyDescriptor;

      beforeAll(() => {
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
          configurable: true,
          value: 40,
        });
      });

      afterAll(() => {
        Object.defineProperty(
          HTMLElement.prototype,
          "offsetHeight",
          originalOffsetHeight,
        );
      });

      it("renders expand button for long description", () => {
        render(() => (
          <Router>
            <StoreProvider initalStore={{ lists: [] }}>
              <ListItemSummaryLine
                listId={list.id}
                item={{
                  ...itemMinimal,
                  description:
                    "Dolor mollit anim est excepteur aliqua exercitation tempor commodo occaecat dolore proident quis duis mollit proident nulla proident aute aliqua aliqua cillum esse exercitation consequat labore exercitation adipisicing amet mollit quis nostrud excepteur excepteur eu aute fugiat proident sint aliqua ipsum esse id exercitation enim elit eiusmod elit amet aliqua occaecat et commodo excepteur in adipisicing minim mollit Lorem ad do deserunt aute exercitation.",
                }}
                index={0}
              />
            </StoreProvider>
          </Router>
        ));

        expect(screen.getByText(/Dolor mollit/)).toBeInTheDocument();

        const expand = screen.getByLabelText("Expand description");
        fireEvent.click(expand);

        const collapse = screen.getByLabelText("Collapse description");
        fireEvent.click(collapse);
      });
    });

    describe("when description is expandable", () => {
      const originalOffsetHeight = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        "offsetHeight",
      ) as PropertyDescriptor;

      beforeAll(() => {
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
          configurable: true,
          value: 35,
        });
      });

      afterAll(() => {
        Object.defineProperty(
          HTMLElement.prototype,
          "offsetHeight",
          originalOffsetHeight,
        );
      });

      it("renders expand button for long description", () => {
        render(() => (
          <Router>
            <StoreProvider initalStore={{ lists: [] }}>
              <ListItemSummaryLine
                listId={list.id}
                item={{
                  ...itemMinimal,
                  description: "short",
                }}
                index={0}
              />
            </StoreProvider>
          </Router>
        ));

        expect(screen.getByText("short")).toBeInTheDocument();
        expect(
          screen.queryByLabelText("Expand description"),
        ).not.toBeInTheDocument();
      });
    });
  });
});
