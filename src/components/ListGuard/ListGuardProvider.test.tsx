import { screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { renderInListGuardProvider } from "../../test/utils";

import { useListGuardContext } from "./ListGuardProvider";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

describe("ListGuardProvider", () => {
  it("renders provider with children", () => {
    renderInListGuardProvider(() => "outlet", list);

    expect(screen.getByText("outlet")).toBeInTheDocument();
  });
});

describe("useListGuardContext", () => {
  it("throws an error when used outside of provider", () => {
    expect(() => useListGuardContext()).toThrow();
  });

  it("renders inside provider", () => {
    const Component = () => {
      useListGuardContext();
      return <>test</>;
    };

    renderInListGuardProvider(Component, list);

    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
