import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { Settings } from "./Settings";

describe("Settings", () => {
  it("renders component", () => {
    render(() => <Settings />);

    const color = screen.getByLabelText("Choose theme color");
    fireEvent.change(color, { target: { value: "#000" } });

    expect(color).toHaveValue("#000000");
  });
});
