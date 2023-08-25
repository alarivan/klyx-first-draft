import { createRoot } from "solid-js";
import { describe, it } from "vitest";

import { BASE_COLOR_LOCAL_STORAGE_KEY, DEFAULT_BASE_COLOR } from "./constants";
import { createBaseColor, useBaseColor } from "./useBaseColor";

describe("useBaseColor", () => {
  it("returns same instance twice", () => {
    const { dispose, instance } = createRoot((dispose) => {
      const instance = useBaseColor();
      return { dispose, instance };
    });
    const { dispose: dispose2, instance: instance2 } = createRoot((dispose) => {
      const instance = useBaseColor();
      return { dispose, instance };
    });

    expect(instance).toEqual(instance2);

    dispose();
    dispose2();
  });
});

describe("createBaseColor", () => {
  beforeEach(() => {
    global.localStorage.clear();
  });

  it("returns signal", () => {
    const { dispose, baseColor } = createRoot((dispose) => {
      const { baseColor } = createBaseColor();
      return { dispose, baseColor };
    });

    expect(baseColor()).toEqual(DEFAULT_BASE_COLOR);
    dispose();
  });

  describe("localStorage", () => {
    it("uses local sotrage value", () => {
      global.localStorage.setItem(BASE_COLOR_LOCAL_STORAGE_KEY, "#000000");
      const { dispose, baseColor } = createRoot((dispose) => {
        const { baseColor } = createBaseColor();

        return { dispose, baseColor };
      });

      expect(baseColor()).toEqual("#000000");
      expect(global.localStorage.getItem(BASE_COLOR_LOCAL_STORAGE_KEY)).toEqual(
        "#000000",
      );

      dispose();
    });

    it("returns default color when local storage value is invalid", () => {
      global.localStorage.setItem(BASE_COLOR_LOCAL_STORAGE_KEY, "not a color");
      const { dispose, baseColor } = createRoot((dispose) => {
        const { baseColor } = createBaseColor();

        return { dispose, baseColor };
      });

      expect(baseColor()).toEqual(DEFAULT_BASE_COLOR);
      dispose();
    });

    it("updates local storage value", () => {
      const { dispose, baseColor, setBaseColor } = createRoot((dispose) => {
        const { baseColor, setBaseColor } = createBaseColor();

        return { dispose, baseColor, setBaseColor };
      });

      setBaseColor("#111111");

      expect(baseColor()).toEqual("#111111");
      expect(global.localStorage.getItem(BASE_COLOR_LOCAL_STORAGE_KEY)).toEqual(
        "#111111",
      );

      dispose();
    });
  });
});
