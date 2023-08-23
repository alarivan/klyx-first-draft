import { screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";

import { createListWithItems } from "../../store/helpers";
import { renderInListGuardProvider } from "../../test/utils";

import { PlayDone } from "./PlayDone";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

describe("PlayDone", () => {
  it("renders component", () => {
    renderInListGuardProvider(() => <PlayDone />, list);

    expect(screen.getByText(list.name)).toBeInTheDocument();
    expect(screen.getByText("Restart")).toHaveAttribute(
      "href",
      `/list/${list.id}/play`,
    );
    expect(screen.getByText("Go to list")).toHaveAttribute(
      "href",
      `/list/${list.id}`,
    );
  });
});
