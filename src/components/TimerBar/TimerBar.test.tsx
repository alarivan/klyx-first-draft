import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { TimerBar } from "./TimerBar";

describe("TimerBar", () => {
  it("renders component", () => {
    render(() => <TimerBar progress={10} total={60} />);

    expect(screen.getByText("00:10")).toBeInTheDocument();
    expect(screen.getByText("01:00")).toBeInTheDocument();
  });
});
