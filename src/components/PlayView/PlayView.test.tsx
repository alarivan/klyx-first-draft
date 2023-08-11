import { Router } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";

import { PlayView } from "./PlayView";

const list = createListWithItems(
  { name: "list1", description: "list1desc" },
  Array(4)
    .fill(undefined)
    .map((_, idx) => ({
      name: `item${idx + 1}name`,
      description: `item${idx + 1}desc`,
    })),
);

describe("PlayView", () => {
  it("renders play view", () => {
    render(() => (
      <Router>
        <PlayView list={list} item={{ data: list.items[1], index: 1 }} />
      </Router>
    ));

    expect(screen.getByText(list.name)).toBeInTheDocument();
    expect(screen.getByText(list.items[1].name)).toBeInTheDocument();

    expect(screen.getByText("prev")).toHaveAttribute(
      "href",
      `/list/${list.id}/play/${list.items[0].id}`,
    );
    expect(screen.getByText("next")).toHaveAttribute(
      "href",
      `/list/${list.id}/play/${list.items[2].id}`,
    );
  });

  it("renders play without prev when there is no prev item", () => {
    render(() => (
      <Router>
        <PlayView list={list} item={{ data: list.items[0], index: 0 }} />
      </Router>
    ));

    expect(screen.getByText(list.name)).toBeInTheDocument();
    expect(screen.getByText(list.items[0].name)).toBeInTheDocument();

    expect(screen.queryByText("prev")).not.toBeInTheDocument();
    expect(screen.getByText("next")).toHaveAttribute(
      "href",
      `/list/${list.id}/play/${list.items[1].id}`,
    );
  });

  it("renders play with a link to done when there is no next items", () => {
    render(() => (
      <Router>
        <PlayView list={list} item={{ data: list.items[3], index: 3 }} />
      </Router>
    ));

    expect(screen.getByText(list.name)).toBeInTheDocument();
    expect(screen.getByText(list.items[3].name)).toBeInTheDocument();

    expect(screen.getByText("next")).toHaveAttribute(
      "href",
      `/list/${list.id}/play/done`,
    );
  });
});
