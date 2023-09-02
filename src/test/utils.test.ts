import { screen } from "@solidjs/testing-library";
import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../store/helpers";
import { COUNTER_TYPE_ENUM } from "../store/types";

import {
  renderInListGuardProvider,
  renderInListItemGuardProvider,
  renderInRouter,
} from "./utils";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  {
    name: "item1",
  },
  {
    name: "item2",
    counterType: COUNTER_TYPE_ENUM.UNLIMITED,
  },
  {
    name: "item2",
    timerSeconds: "10",
  },
]);

describe("renderInListItemGuardProvider", () => {
  it("throws an error when list item index is out of bounds", () => {
    expect(() =>
      renderInListItemGuardProvider(() => "no", "/:listId/:itemId", list, 10),
    ).toThrow();
  });

  it("renders list item guard component", () => {
    expect(() =>
      renderInListItemGuardProvider(() => "no", "/:listId/:itemId", list, 1),
    ).not.toThrow();
  });

  it("renders list item navigates to catchall", async () => {
    const [_, navigate] = renderInListItemGuardProvider(
      () => "no",
      "/random",
      list,
      1,
    );

    createRoot((dispose) => {
      if (navigate) {
        navigate("/list/random");
      }
      dispose();
    });

    await Promise.resolve();

    expect(screen.getByText("catchall")).toBeInTheDocument();
  });
});

describe("renderInListGuardProvider", () => {
  it("renders list guard component", () => {
    expect(() => renderInListGuardProvider(() => "no", list)).not.toThrow();
  });
});

describe("renderInRouter", () => {
  it("renders component in router", () => {
    expect(() => renderInRouter(() => "no")).not.toThrow();
  });
});
