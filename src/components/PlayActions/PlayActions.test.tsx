import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { PlayActions } from "./PlayActions";

describe("PlayActions", () => {
  const goNext = vi.fn();
  const goPrev = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("calls goNext on next click", () => {
    render(() => <PlayActions goNext={goNext} goPrev={goPrev} />);

    const next = screen.getByText("Next");
    expect(next).toBeInTheDocument();

    fireEvent.click(next);

    expect(goNext).toHaveBeenCalledOnce();
  });

  it("calls goPrev on previous click", () => {
    render(() => <PlayActions goNext={goNext} goPrev={goPrev} />);

    const prev = screen.getByText("Previous");
    expect(prev).toBeInTheDocument();

    fireEvent.click(prev);

    expect(goPrev).toHaveBeenCalledOnce();
  });
});
