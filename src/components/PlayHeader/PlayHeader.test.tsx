import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";

import { PlayHeader } from "./PlayHeader";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
  { name: "item1", description: "item1desc" },
  { name: "item1", description: "item1desc" },
]);

describe("PlayHeader", () => {
  it("renders component", () => {
    render(() => <PlayHeader list={list} index={1} />);

    expect(screen.getByText("list1")).toBeInTheDocument();
    expect(screen.getByText("2/3")).toBeInTheDocument();
  });
});
