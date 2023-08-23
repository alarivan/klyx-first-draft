import { describe, expect, it } from "vitest";

import { createListWithItems } from "../store/helpers";

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
    counterType: "unlimited",
  },
  {
    name: "item2",
    timerSeconds: "10",
  },
]);

describe("renderInListItemGuardProvider", () => {
  it("throws an error when list item index is out of bounds", () => {
    expect(() => renderInListItemGuardProvider(() => "no", list, 10)).toThrow();
  });

  it("renders list item guard component", () => {
    expect(() =>
      renderInListItemGuardProvider(() => "no", list, 1),
    ).not.toThrow();
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
