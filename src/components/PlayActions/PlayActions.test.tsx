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

    const next = screen.getByLabelText("Next without completing");
    expect(next).toBeInTheDocument();

    fireEvent.click(next);

    expect(goNext).toHaveBeenCalledOnce();
  });

  it("calls goNext with true on next click", () => {
    render(() => <PlayActions goNext={goNext} goPrev={goPrev} />);

    const next = screen.getByLabelText("Next and complete");
    expect(next).toBeInTheDocument();

    fireEvent.click(next);

    expect(goNext).toHaveBeenCalledWith(true);
  });

  it("calls goPrev on previous click", () => {
    render(() => <PlayActions goNext={goNext} goPrev={goPrev} />);

    const prev = screen.getByLabelText("Previous");
    expect(prev).toBeInTheDocument();

    fireEvent.click(prev);

    expect(goPrev).toHaveBeenCalledOnce();
  });
});
