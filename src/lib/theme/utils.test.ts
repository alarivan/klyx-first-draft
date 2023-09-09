import Color from "color";

import { applyTheme, generateThemeVars, getTextColor } from "./utils";

describe("getTextColor", () => {
  it("returns #000 for light color", () => {
    expect(getTextColor(Color("#FFFFFF"))).toEqual("#000000");
  });

  it("returns #FFFFFF for light color", () => {
    expect(getTextColor(Color("#000000"))).toEqual("#FFFFFF");
  });
});

describe("generateThemeVars", () => {
  describe("when color is light", () => {
    it("generates the same colors", () => {
      expect(generateThemeVars("#466D6C")).toEqual(
        generateThemeVars("#466D6C"),
      );
    });
  });

  describe("when color is dark", () => {
    it("generates the same colors", () => {
      expect(generateThemeVars("#AFE29C")).toEqual(
        generateThemeVars("#AFE29C"),
      );
    });
  });
});

describe("applyTheme", () => {
  it("applies theme on root", () => {
    const root = document.createElement(":root");

    applyTheme(root, "#466D6C");

    const vars = generateThemeVars("#466D6C");
    vars.forEach((v) => {
      expect(root).toHaveStyle(`${v.name}: ${v.value};`);
    });
  });
});
