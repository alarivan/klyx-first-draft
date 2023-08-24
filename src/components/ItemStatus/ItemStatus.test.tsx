import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { ItemStatus } from "./ItemStatus";

describe("ItemStatus", () => {
  it("renders with status true", () => {
    render(() => <ItemStatus status={true} size={24} />);

    expect(screen.getByLabelText("completed")).toBeInTheDocument();
  });

  it("renders with status false", () => {
    render(() => <ItemStatus status={false} size={24} />);

    expect(screen.getByLabelText("incomplete")).toBeInTheDocument();
  });

  it("renders without custom size", () => {
    render(() => <ItemStatus status={false} />);

    expect(screen.getByLabelText("incomplete")).toBeInTheDocument();
  });
});
