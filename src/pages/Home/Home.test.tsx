import { Router } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createListWithItems } from "../../store/helpers";

import { Home } from "./Home";

const lists = Array(3)
  .fill(undefined)
  .map((_, idx) =>
    createListWithItems(
      { name: `list${idx + 1}`, description: `list${idx + 1}desc` },
      [{ name: "item1", description: "item1desc" }],
    ),
  );

describe("Home", () => {
  it("renders lists", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists }}>
          <Home />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("list1")).toBeInTheDocument();
    expect(screen.getByText("list2")).toBeInTheDocument();
    expect(screen.getByText("list3")).toBeInTheDocument();
    expect(screen.getByText("add new list")).toBeInTheDocument();
  });

  it("renders button when there is no lists", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [] }}>
          <Home />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("add new list")).toBeInTheDocument();
  });
});
