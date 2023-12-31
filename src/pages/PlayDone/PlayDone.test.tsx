import { screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";

import { createListWithItems } from "../../store/helpers";
import { renderInListGuardProvider } from "../../test/utils";

import { PlayDone } from "./PlayDone";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
  { name: "item1", description: "item1desc" },
]);
const listNoDescription = createListWithItems({ name: "list1" }, [
  { name: "item1", description: "item1desc" },
]);

describe("PlayDone", () => {
  it("renders component", () => {
    renderInListGuardProvider(() => <PlayDone />, list);

    expect(screen.getByText("list1")).toBeInTheDocument();
    expect(screen.getByText("2/2")).toBeInTheDocument();
    expect(screen.getByText("list1desc")).toBeInTheDocument();
    expect(screen.getByText("Restart")).toHaveAttribute(
      "href",
      `/list/${list.id}/play`,
    );
    expect(screen.getByText("Go to list")).toHaveAttribute(
      "href",
      `/list/${list.id}`,
    );
  });

  it("renders component without description", () => {
    renderInListGuardProvider(() => <PlayDone />, listNoDescription);

    expect(screen.getByText(list.name)).toBeInTheDocument();
  });
});
