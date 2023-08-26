import Color from "color";

import { applyColorsToAction, applyTheme, getTextColor } from "./utils";

describe("getTextColor", () => {
  it("returns #000 for light color", () => {
    expect(getTextColor(Color("#FFFFFF"))).toEqual("#000000");
  });

  it("returns #FFFFFF for light color", () => {
    expect(getTextColor(Color("#000000"))).toEqual("#FFFFFF");
  });
});

describe("applyColorsToAction", () => {
  it("applies colors to html element", () => {
    const root = document.createElement(":root");
    const baseColor = Color("#FF0000");
    applyColorsToAction(root, "--action-test", {
      base: baseColor,
      hover: "red",
      active: "red",
      border: "red",
    });

    expect(root).toHaveStyle("--action-test-bg: #FF0000;");
    expect(root).toHaveStyle("--action-test-text: #FFFFFF;");
    expect(root).toHaveStyle("--action-test-bg-hover: red;");
    expect(root).toHaveStyle("--action-test-bg-active: red;");
    expect(root).toHaveStyle("--action-test-border: red;");
  });
});

describe("applyTheme", () => {
  it("applies theme on root", () => {
    const root = document.createElement(":root");
    applyTheme(root, "#696969");

    expect(root).toHaveStyle("--base-color: #696969;");
    expect(root).toHaveStyle("--body-bg: #BDBDBD;");
    expect(root).toHaveStyle("--body-text: #000000;");
    expect(root).toHaveStyle("--body-box-shadow: #979797;");
    expect(root).toHaveStyle("--card-bg: #939393;");
    expect(root).toHaveStyle("--card-text: #000000;");
    expect(root).toHaveStyle("--timer-progress-bg: #7E7E7E;");
    expect(root).toHaveStyle("--timer-progress-text: #FFFFFF;");
    expect(root).toHaveStyle("--timer-total-bg: #979797;");
    expect(root).toHaveStyle("--timer-total-text: #000000;");
    expect(root).toHaveStyle("--action-fancy-text: #FFFFFF;");
    expect(root).toHaveStyle("--action-fancy-bg: #3F3F3F;");
    expect(root).toHaveStyle("--action-fancy-bg-hover: #393939;");
    expect(root).toHaveStyle("--action-fancy-bg-active: #454545;");
    expect(root).toHaveStyle("--action-fancy-border: #191919;");
    expect(root).toHaveStyle("--action-primary-text: #FFFFFF;");
    expect(root).toHaveStyle("--action-primary-bg: #4A4A4A;");
    expect(root).toHaveStyle("--action-primary-bg-hover: #585858;");
    expect(root).toHaveStyle("--action-primary-bg-active: #515151;");
    expect(root).toHaveStyle("--action-secondary-text: #FFFFFF;");
    expect(root).toHaveStyle("--action-secondary-bg: #7E7E7E;");
    expect(root).toHaveStyle("--action-secondary-bg-hover: #656565;");
    expect(root).toHaveStyle("--action-secondary-bg-active: #717171;");
    expect(root).toHaveStyle("--action-disabled-bg: #A5A5A5;");
    expect(root).toHaveStyle("--action-disabled-text: #000000;");
  });
});
