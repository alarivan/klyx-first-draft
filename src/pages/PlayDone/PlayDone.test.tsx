import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";

import { PlayDone } from "./PlayDone";

describe("PlayDone", () => {
  it("", () => {
    render(() => <PlayDone />);

    expect(screen.getByText("done")).toBeInTheDocument();
  });
});
