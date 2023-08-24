import { fireEvent, screen } from "@solidjs/testing-library";
import { createRoot, createEffect } from "solid-js";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { renderInListItemGuardProvider } from "../../test/utils";

import { PlayTimer } from "./PlayTimer";

const list = () =>
  createListWithItems({ name: "list1", description: "list1desc" }, [
    { name: "item1", timerSeconds: "60" },
    {
      name: "item2",
      timerSeconds: "3",
      timerAutostart: true,
    },
    {
      name: "item3",
      timerSeconds: "10",
      timerProgress: 6,
    },
    {
      name: "item4",
      timerSeconds: null,
    },
  ]);

describe("PlayTimer", () => {
  const goNext = vi.fn();
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders component", () => {
    renderInListItemGuardProvider(
      () => <PlayTimer goNext={goNext} />,
      list(),
      0,
    );

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
    expect(screen.getByText("Start timer")).toBeInTheDocument();
    expect(screen.getByText("Reset timer")).toBeInTheDocument();
    expect(screen.getByText("Pause timer")).toBeInTheDocument();
    expect(
      screen.getByText("Automatically go next when timer is finished"),
    ).toBeInTheDocument();
    expect(screen.getByText("Automatically start timer")).toBeInTheDocument();
  });

  it("renders with timer seconds null", () => {
    renderInListItemGuardProvider(
      () => <PlayTimer goNext={goNext} />,
      list(),
      3,
    );

    expect(screen.getAllByText("0")).toHaveLength(2);
  });

  it("starts and pauses timer", () => {
    renderInListItemGuardProvider(
      () => <PlayTimer goNext={goNext} />,
      list(),
      0,
    );

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();

    const start = screen.getByText("Start timer");
    fireEvent.click(start);
    vi.advanceTimersByTime(2000);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();

    const pause = screen.getByText("Pause timer");
    fireEvent.click(pause);
    vi.advanceTimersByTime(2000);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("resets timer", () => {
    renderInListItemGuardProvider(
      () => <PlayTimer goNext={goNext} />,
      list(),
      2,
    );

    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();

    const reset = screen.getByText("Reset timer");
    fireEvent.click(reset);

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.queryByText("6")).not.toBeInTheDocument();
  });

  describe("with timerAutoswitch", () => {
    it("goes next when timer is finished", () => {
      const autoSwitchList = list();
      const [history] = renderInListItemGuardProvider(
        () => <PlayTimer goNext={goNext} />,
        autoSwitchList,
        1,
      );

      vi.advanceTimersByTime(3000);

      createRoot((dispose) => {
        createEffect(() => {
          expect(history().value).toEqual(
            `/list/${autoSwitchList.id}/${autoSwitchList.items[2].id}`,
          );
        });
        dispose();
      });
    });
  });

  describe("with timerAutostart", () => {
    it("starts timer automatically", () => {
      renderInListItemGuardProvider(
        () => <PlayTimer goNext={goNext} />,
        list(),
        1,
      );

      vi.advanceTimersByTime(2000);
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  it("toggle autoswitch", () => {
    renderInListItemGuardProvider(
      () => <PlayTimer goNext={goNext} />,
      list(),
      0,
    );

    const autoswitch = screen.getByLabelText(
      "Automatically go next when timer is finished",
    );
    fireEvent.click(autoswitch);

    expect(autoswitch).not.toBeChecked();
  });

  it("toggle autostart", () => {
    renderInListItemGuardProvider(
      () => <PlayTimer goNext={goNext} />,
      list(),
      0,
    );

    const autostart = screen.getByLabelText("Automatically start timer");
    fireEvent.click(autostart);

    expect(autostart).toBeChecked();
  });
});
