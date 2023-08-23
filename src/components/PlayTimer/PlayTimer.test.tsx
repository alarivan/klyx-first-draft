import type { Mock } from "vitest";

import { Router } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createStoreValue } from "../../store/createStoreValue";
import { createListWithItems } from "../../store/helpers";

import { PlayTimer } from "./PlayTimer";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc", timerSeconds: "60" },
  {
    name: "item1",
    description: "item1desc",
    timerSeconds: "3",
    timerAutostart: true,
  },
]);
const item = list.items[0];
const itemAutostart = list.items[1];

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

describe("PlayTimer", () => {
  const updateItemMock = vi.fn();
  const goNext = vi.fn();

  beforeEach(() => {
    mockCreateStoreValue.mockReturnValue([
      null,
      { updateItem: updateItemMock },
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders component", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <PlayTimer goNext={goNext} list={list} item={item} />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("0/60")).toBeInTheDocument();
    expect(screen.getByText("Start timer")).toBeInTheDocument();
    expect(screen.getByText("Reset timer")).toBeInTheDocument();
    expect(screen.getByText("Pause timer")).toBeInTheDocument();
    expect(
      screen.getByText("Automatically go next when timer is finished"),
    ).toBeInTheDocument();
    expect(screen.getByText("Automatically start timer")).toBeInTheDocument();
  });

  describe("with timerAutostart", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it("renders component", () => {
      render(() => (
        <Router>
          <StoreProvider initalStore={{ lists: [list] }}>
            <PlayTimer goNext={goNext} list={list} item={itemAutostart} />
          </StoreProvider>
        </Router>
      ));

      vi.advanceTimersByTime(5001);
      expect(updateItemMock).toHaveBeenCalledWith(list.id, itemAutostart.id, {
        timerProgress: 1,
      });

      expect(updateItemMock).toHaveBeenCalledTimes(4);
    });
  });
});
