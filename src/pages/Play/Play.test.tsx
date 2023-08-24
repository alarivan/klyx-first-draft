import { fireEvent, screen } from "@solidjs/testing-library";
import { createEffect, createRoot } from "solid-js";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { renderInListItemGuardProvider } from "../../test/utils";

import { Play } from "./Play";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  {
    name: "item1",
  },
  {
    name: "item2",
    counterType: "unlimited",
  },
  {
    name: "item2",
    timerSeconds: "10",
  },
]);

describe("Play", () => {
  it("renders play view", () => {
    renderInListItemGuardProvider(() => <Play />, list, 0);

    expect(screen.getByText(list.name)).toBeInTheDocument();
    expect(screen.getByText(list.items[0].name!)).toBeInTheDocument();
  });

  it("renders play view with counter", () => {
    renderInListItemGuardProvider(() => <Play />, list, 1);

    expect(screen.getByLabelText("Increase counter")).toBeInTheDocument();
  });

  it("renders play view with timer", () => {
    renderInListItemGuardProvider(() => <Play />, list, 2);

    expect(screen.getByText("Start timer")).toBeInTheDocument();
  });

  it("goes next", () => {
    const [history] = renderInListItemGuardProvider(() => <Play />, list, 0);

    const next = screen.getByLabelText("Next");
    fireEvent.click(next);

    createRoot((dispose) => {
      createEffect(() => {
        expect(history().value).toEqual(`/list/${list.id}/${list.items[1].id}`);
      });
      dispose();
    });
  });

  it("goes back", () => {
    const [history] = renderInListItemGuardProvider(() => <Play />, list, 1);

    const prev = screen.getByLabelText("Previous");
    fireEvent.click(prev);

    createRoot((dispose) => {
      createEffect(() => {
        expect(history().value).toEqual(`/list/${list.id}/${list.items[0].id}`);
      });
      dispose();
    });
  });
});
