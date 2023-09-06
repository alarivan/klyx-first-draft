import { fireEvent } from "@solidjs/testing-library";

import { textareaAutoHeight } from "./textareaAutoHeight";

describe("textareaAutoHeight", () => {
  const originalScrollHeight =
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollHeight") ||
    {};

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 40,
    });
  });
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    Object.defineProperty(
      HTMLElement.prototype,
      "scrollHeight",
      originalScrollHeight,
    );
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("adds min-height on directive init", () => {
    const textarea = document.createElement("textarea");
    textareaAutoHeight(textarea);

    vi.runAllTimers();

    expect(textarea).toHaveStyle("min-height: 40px;");
  });

  it("updates text area height to scroll height", () => {
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 42,
    });
    const textarea = document.createElement("textarea");
    textareaAutoHeight(textarea);
    fireEvent.input(textarea, { target: { value: "haloa" } });

    expect(textarea).toHaveStyle("min-height: 42px;");
  });
});
