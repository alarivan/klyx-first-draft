import { fireEvent, screen } from "@solidjs/testing-library";
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

  it("switches between compact and detailed views", () => {
    renderInListGuardProvider(() => <ListView />, list);

    const listActions = screen.getByLabelText("List actions");
    fireEvent.click(listActions);

    const compact = screen.getByTitle("Sortable compact view");
    fireEvent.click(compact);

    const detailed = screen.getByTitle("Detailed view");
    fireEvent.click(detailed);

    expect(screen.getByTitle("Sortable compact view")).toBeInTheDocument();
    expect(screen.queryByTitle("Detailed view")).not.toBeInTheDocument();
  });
});
