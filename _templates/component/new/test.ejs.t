---
to: "src/<%= dir %>/<%= name %>/<%= name %>.test.tsx"
---
import type { Mock } from "vitest";

import { Router, useParams } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createListWithItems } from "../../store/helpers";
import { renderInListGuardProvider } from "../../test/utils";

import { <%= name %> } from "./<%= name %>";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1", description: "item1desc" },
]);

describe("<%= name %>", () => {
  it("renders component", () => {
    renderInListGuardProvider(
      () => <%= name %>,
      list(),
    );

    expect(screen.getByText("<%= name %>")).toBeInTheDocument();
  });
});
