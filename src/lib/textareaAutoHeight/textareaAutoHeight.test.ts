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

  afterAll(() => {
    Object.defineProperty(
      HTMLElement.prototype,
      "scrollHeight",
      originalScrollHeight,
    );
  });

  it("updates text area height to scroll height", () => {
    const textarea = document.createElement("textarea");
    textareaAutoHeight(textarea);
    fireEvent.input(textarea, { target: { value: "haloa" } });

    expect(textarea).toHaveStyle("min-height: 40px;");
  });
});
