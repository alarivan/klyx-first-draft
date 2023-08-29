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
  describe("when color is light", () => {
    it("applies theme on root", () => {
      const root = document.createElement(":root");

      applyTheme(root, "#466D6C");

      expect("--body-bg: #466D6C;");
      expect("-body-text: #FFFFFF;");
      expect("--body-box-shadow: #548382;");
      expect("--card-bg: #6CA19F;");
      expect("--card-text: #000000;");
      expect("--timer-progress-bg: #8DB6B5;");
      expect("--timer-progress-text: #000000;");
      expect("--timer-total-bg: #C8DBDB;");
      expect("--timer-total-text: #000000;");
      expect("--action-fancy-text: #000000;");
      expect("--action-fancy-bg: #8DB6B5;");
      expect("--action-fancy-bg-hover: #A0C2C1;");
      expect("--action-fancy-bg-active: #B4CFCE;");
      expect("--action-fancy-border: #FFFFFF;");
      expect("--action-primary-text: #000000;");
      expect("--action-primary-bg: #82AFAD;");
      expect("--action-primary-bg-hover: #A7C6C6;");
      expect("--action-primary-bg-active: #B9D2D2;");
      expect("--action-secondary-text: #000000;");
      expect("--action-secondary-bg: #77A8A6;");
      expect("--action-secondary-bg-hover: #88B3B2;");
      expect("--action-secondary-bg-active: #9ABEBD;");
      expect("--action-disabled-bg: #616161;");
      expect("--action-disabled-text: #FFFFFF;");
    });
  });

  describe("when color is dark", () => {
    it("applies theme on root", () => {
      const root = document.createElement(":root");

      applyTheme(root, "#AFE29C");

      expect("--body-bg: #AFE29C;");
      expect("--body-text: #000000;");
      expect("--body-box-shadow: #7FD161;");
      expect("--card-bg: #48942B;");
      expect("--card-text: #FFFFFF;");
      expect("--timer-progress-bg: #56B134;");
      expect("--timer-progress-text: #000000;");
      expect("--timer-total-bg: #6CCA49;");
      expect("--timer-total-text: #000000;");
      expect("--action-fancy-text: #000000;");
      expect("--action-fancy-bg: #56B134;");
      expect("--action-fancy-bg-hover: #4DA02F;");
      expect("--action-fancy-bg-active: #458E2A;");
      expect("--action-fancy-border: #224715;");
      expect("--action-primary-text: #000000;");
      expect("--action-primary-bg: #67C843;");
      expect("--action-primary-bg-hover: #50A530;");
      expect("--action-primary-bg-active: #46912A;");
      expect("--action-secondary-text: #000000;");
      expect("--action-secondary-bg: #7FD161;");
      expect("--action-secondary-bg-hover: #6CCA49;");
      expect("--action-secondary-bg-active: #5CBD37;");
      expect("--action-disabled-bg: #CBCBCB;");
      expect("--action-disabled-text: #000000;");
    });
  });
});
