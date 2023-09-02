import { fireEvent, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { COUNTER_TYPE_ENUM } from "../../store/types";
import { renderInListItemGuardProvider } from "../../test/utils";

import { Play } from "./Play";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  {
    name: "item1",
  },
  {
    name: "item2",
    counterType: COUNTER_TYPE_ENUM.UNLIMITED,
  },
  {
    name: "item3",
    timerSeconds: "10",
  },
  {
    name: "item4",
    timerSeconds: "0",
  },
]);

const playPath = "/list/:listId/play/:itemId";

describe("Play", () => {
  it("renders play view", () => {
    renderInListItemGuardProvider(() => <Play />, playPath, list, 0);

    expect(screen.getByText(list.name)).toBeInTheDocument();
    expect(screen.getByText(list.items[0].name!)).toBeInTheDocument();
  });

  it("renders play view with counter", () => {
    renderInListItemGuardProvider(() => <Play />, playPath, list, 1);

    expect(screen.getByLabelText("Increase counter")).toBeInTheDocument();
  });

  it("renders play view with timer", () => {
    renderInListItemGuardProvider(() => <Play />, playPath, list, 2);

    expect(screen.getByText("Start timer")).toBeInTheDocument();
  });

  it("renders play viewout timer when timer is '0'", () => {
    renderInListItemGuardProvider(() => <Play />, playPath, list, 3);

    expect(screen.queryByText("Timer")).not.toBeInTheDocument();
  });

  it("goes next without completing", async () => {
    const [location] = renderInListItemGuardProvider(
      () => <Play />,
      playPath,
      list,
    );

    const next = screen.getByLabelText("Next without completing");
    fireEvent.click(next);

    await Promise.resolve();
    if (location) {
      expect(location.pathname).toEqual(
        `/list/${list.id}/play/${list.items[1].id}`,
      );
    }
  });

  it("goes next and completes", async () => {
    const [location] = renderInListItemGuardProvider(
      () => <Play />,
      playPath,
      list,
      3,
    );

    const next = screen.getByLabelText("Next and complete");
    fireEvent.click(next);

    await Promise.resolve();
    if (location) {
      expect(location.pathname).toEqual(`/list/${list.id}/play/done`);
    }
  });

  it("goes back", async () => {
    const [location] = renderInListItemGuardProvider(
      () => <Play />,
      playPath,
      list,
      1,
    );

    const prev = screen.getByTitle("Previous");
    fireEvent.click(prev);

    await Promise.resolve();
    if (location) {
      expect(location.pathname).toEqual(
        `/list/${list.id}/play/${list.items[0].id}`,
      );
    }
  });

  it("goes back to list", async () => {
    const [location] = renderInListItemGuardProvider(
      () => <Play />,
      playPath,
      list,
      0,
    );

    const prev = screen.getByTitle("Back to list");
    fireEvent.click(prev);

    await Promise.resolve();
    if (location) {
      expect(location.pathname).toEqual(`/list/${list.id}`);
    }
  });
});
