import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { BottomActionsLayout } from "./BottomActionsLayout";

describe("BottomActionsLayout", () => {
  it("renders component", () => {
    render(() => (
      <BottomActionsLayout actions={"actions"}>children</BottomActionsLayout>
    ));

    expect(screen.getByText("children")).toBeInTheDocument();
    expect(screen.getByText("actions")).toBeInTheDocument();
  });
});
