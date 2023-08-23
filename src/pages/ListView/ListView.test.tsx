import { screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { renderInListGuardProvider } from "../../test/utils";

import { ListView } from "./ListView";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

describe("ListView", () => {
  it("renders list when list is in store", () => {
    renderInListGuardProvider(() => <ListView />, list);

    expect(screen.getByText("list1")).toBeInTheDocument();
    expect(screen.getByText("list1desc")).toBeInTheDocument();
    expect(screen.getByText("item1")).toBeInTheDocument();
    expect(screen.getByLabelText("Add item")).toHaveAttribute(
      "href",
      `/list/${list.id}/item/new`,
    );
  });
});
