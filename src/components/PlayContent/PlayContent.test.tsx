import { screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { renderInListItemGuardProvider } from "../../test/utils";

import { PlayContent } from "./PlayContent";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc", completed: true },
  {},
]);

describe("PlayContent", () => {
  it("renders component with data", () => {
    renderInListItemGuardProvider(() => <PlayContent />, list);

    expect(screen.getByText("item1")).toBeInTheDocument();
    expect(screen.getByText("item1desc")).toBeInTheDocument();
  });

  it("renders component without data", () => {
    renderInListItemGuardProvider(() => <PlayContent />, list, 1);

    expect(screen.queryByText("item1")).not.toBeInTheDocument();
    expect(screen.queryByText("item1desc")).not.toBeInTheDocument();
  });
});
