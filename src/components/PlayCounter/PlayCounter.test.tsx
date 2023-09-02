import { fireEvent, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { COUNTER_TYPE_ENUM } from "../../store/types";
import { renderInListItemGuardProvider } from "../../test/utils";

import { PlayCounter } from "./PlayCounter";

const playPath = "/list/:listId/play/:itemId";
describe("PlayCounter", () => {
  const goNextMock = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("limited", () => {
    const list = () =>
      createListWithItems({ name: "list1", description: "list1desc" }, [
        {
          name: "item1",
          description: "item1desc",
          counterLimit: "2",
          counterType: COUNTER_TYPE_ENUM.LIMITED,
          counterAutoswitch: false,
        },
        {
          name: "item1",
          description: "item1desc",
          counterLimit: "2",
          counterType: COUNTER_TYPE_ENUM.LIMITED,
          counterProgress: 1,
        },
        {
          name: "item1",
          description: "item1desc",
          counterLimit: "2",
          counterType: COUNTER_TYPE_ENUM.LIMITED,
          counterProgress: 2,
        },
        {
          name: "item2",
          description: "item2desc",
        },
      ]);

    it("renders component with initial state 0", () => {
      renderInListItemGuardProvider(
        () => <PlayCounter goNext={goNextMock} />,
        playPath,
        list(),
      );

      expect(screen.getByLabelText("Decrease counter")).toBeDisabled();
      expect(screen.getByLabelText("Increase counter")).not.toBeDisabled();
      expect(screen.getByText("Reset counter")).toBeInTheDocument();
      expect(
        screen.getByText("Automatically go next when counter is completed"),
      ).toBeInTheDocument();

      expect(screen.getByText("0/2")).toBeInTheDocument();
    });

    it("renders component with initial state limit", () => {
      renderInListItemGuardProvider(
        () => <PlayCounter goNext={goNextMock} />,
        playPath,
        list(),
        2,
      );

      expect(screen.getByLabelText("Decrease counter")).not.toBeDisabled();
      expect(screen.getByLabelText("Increase counter")).toBeDisabled();
      expect(screen.getByText("2/2")).toBeInTheDocument();
    });

    it("decreases counter", () => {
      renderInListItemGuardProvider(
        () => <PlayCounter goNext={goNextMock} />,
        playPath,
        list(),
        2,
      );

      expect(screen.getByText("2/2")).toBeInTheDocument();

      const decrease = screen.getByLabelText("Decrease counter");
      fireEvent.click(decrease);

      expect(screen.getByText("1/2")).toBeInTheDocument();
    });

    it("increases counter", () => {
      renderInListItemGuardProvider(
        () => <PlayCounter goNext={goNextMock} />,
        playPath,
        list(),
        0,
      );

      expect(screen.getByText("0/2")).toBeInTheDocument();

      const decrease = screen.getByLabelText("Increase counter");
      fireEvent.click(decrease);

      expect(screen.getByText("1/2")).toBeInTheDocument();
    });

    it("resets counter", () => {
      renderInListItemGuardProvider(
        () => <PlayCounter goNext={goNextMock} />,
        playPath,
        list(),
        2,
      );

      expect(screen.getByText("2/2")).toBeInTheDocument();

      const reset = screen.getByText("Reset counter");
      fireEvent.click(reset);

      expect(screen.getByText("0/2")).toBeInTheDocument();
    });

    it("updates counterAutoswitch", () => {
      const autoswitchList = list();
      renderInListItemGuardProvider(
        () => <PlayCounter goNext={goNextMock} />,
        playPath,
        autoswitchList,
        0,
      );

      const checkbox = screen.getByLabelText(
        "Automatically go next when counter is completed",
      );
      fireEvent.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    it("calls navigate to next item when counter is completed", () => {
      renderInListItemGuardProvider(
        () => <PlayCounter goNext={goNextMock} />,
        playPath,
        list(),
        1,
      );

      expect(screen.getByText("1/2")).toBeInTheDocument();

      const increase = screen.getByLabelText("Increase counter");
      fireEvent.click(increase);

      expect(goNextMock).toHaveBeenCalled();
    });
  });

  describe("unlimited", () => {
    const list = () =>
      createListWithItems({ name: "list1", description: "list1desc" }, [
        {
          name: "item1",
          description: "item1desc",
          counterType: COUNTER_TYPE_ENUM.UNLIMITED,
        },
        {
          name: "item2",
          description: "item2desc",
          counterLimit: "2",
          counterType: COUNTER_TYPE_ENUM.LIMITED,
        },
      ]);

    it("renders component with initial state", () => {
      renderInListItemGuardProvider(
        () => <PlayCounter goNext={goNextMock} />,
        playPath,
        list(),
      );

      expect(screen.getByLabelText("Decrease counter")).toBeDisabled();
      expect(screen.getByLabelText("Increase counter")).not.toBeDisabled();
      expect(screen.getByText("Reset counter")).toBeInTheDocument();
      expect(
        screen.queryByText("Automatically go next when counter is completed"),
      ).not.toBeInTheDocument();

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("increases counter", () => {
      renderInListItemGuardProvider(
        () => <PlayCounter goNext={goNextMock} />,
        playPath,
        list(),
      );

      expect(screen.getByText("0")).toBeInTheDocument();

      const decrease = screen.getByLabelText("Increase counter");
      fireEvent.click(decrease);

      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });
});
