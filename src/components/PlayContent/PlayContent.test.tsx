import { fireEvent, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { renderInListItemGuardProvider } from "../../test/utils";

import { PlayContent } from "./PlayContent";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc", completed: true },
  {},
]);

const playPath = "/list/:listId/play/:itemId";

describe("PlayContent", () => {
  it("renders component with data", () => {
    renderInListItemGuardProvider(() => <PlayContent />, playPath, list);

    expect(screen.getByText("item1")).toBeInTheDocument();
    expect(screen.getByText("item1desc")).toBeInTheDocument();
  });

  it("renders component without data", () => {
    renderInListItemGuardProvider(() => <PlayContent />, playPath, list, 1);

    expect(screen.queryByText("item1")).not.toBeInTheDocument();
    expect(screen.queryByText("item1desc")).not.toBeInTheDocument();
  });

  it("toggles completed on click", () => {
    renderInListItemGuardProvider(() => <PlayContent />, playPath, list, 0);

    expect(screen.getByLabelText("completed")).toBeInTheDocument();

    const toggle = screen.getByLabelText("Toggle completed");
    fireEvent.click(toggle);

    expect(screen.getByLabelText("incomplete")).toBeInTheDocument();
  });
});
