import { Router } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";

import { ListSummaryLine } from "./ListSummaryLine";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
  { name: "item2", description: "item1desc" },
]);

const listNoDesc = createListWithItems({ name: "list1" }, []);

describe("ListSummaryLine", () => {
  it("renders component", () => {
    render(() => (
      <Router>
        <ListSummaryLine list={list} />
      </Router>
    ));

    expect(screen.getByText("list1")).toBeInTheDocument();
    expect(screen.getByText("list1desc")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByLabelText("list1")).toHaveAttribute(
      "href",
      `/list/${list.id}`,
    );
  });
  it("renders component", () => {
    render(() => (
      <Router>
        <ListSummaryLine list={listNoDesc} />
      </Router>
    ));

    expect(screen.getByText("list1")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByLabelText("list1")).toHaveAttribute(
      "href",
      `/list/${listNoDesc.id}`,
    );
  });
});
