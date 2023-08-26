import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { TimerForm } from "./TimerForm";

describe("TimerForm", () => {
  const onSubmitMock = vi.fn();
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders with timer seconds null", () => {
    render(() => <TimerForm onSubmit={onSubmitMock} timerSeconds={null} />);

    expect(screen.getByLabelText("Timer (seconds)")).toHaveValue(0);
  });

  it("renders with timer seconds value", () => {
    render(() => <TimerForm onSubmit={onSubmitMock} timerSeconds={"10"} />);

    expect(screen.getByLabelText("Timer (seconds)")).toHaveValue(10);
  });

  it("show error on fail", () => {
    render(() => <TimerForm onSubmit={onSubmitMock} timerSeconds={null} />);

    const timer = screen.getByLabelText("Timer (seconds)");
    fireEvent.input(timer, { target: { value: -1 } });

    const update = screen.getByText("Update timer");
    fireEvent.click(update);

    expect(screen.getByText("Constraints not satisfied")).toBeInTheDocument();

    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it("submits form", () => {
    render(() => <TimerForm onSubmit={onSubmitMock} timerSeconds={"10"} />);

    const timer = screen.getByLabelText("Timer (seconds)");
    fireEvent.input(timer, { target: { value: 11 } });

    const update = screen.getByText("Update timer");
    fireEvent.click(update);

    expect(onSubmitMock).toHaveBeenCalledWith({ timerSeconds: "11" });
  });
});
