import { screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { renderInListItemGuardProvider } from "../../test/utils";

import { useListItemGuardContext } from "./ListItemGuardProvider";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

describe("ListItemGuardProvider", () => {
  it("renders provider with children", () => {
    renderInListItemGuardProvider(() => "children", list);

    expect(screen.getByText("children")).toBeInTheDocument();
  });
});

describe("useListItemGuardContext", () => {
  it("throws an error when used outside of provider", () => {
    expect(() => useListItemGuardContext()).toThrow();
  });

  it("renders inside provider", () => {
    const Component = () => {
      useListItemGuardContext();
      return <>test</>;
    };
    renderInListItemGuardProvider(Component, list);

    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
