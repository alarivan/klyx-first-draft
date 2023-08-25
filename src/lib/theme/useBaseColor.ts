import Color from "color";
import { createRoot, createEffect, createSignal, onMount } from "solid-js";

import { BASE_COLOR_LOCAL_STORAGE_KEY, DEFAULT_BASE_COLOR } from "./constants";
import { applyTheme } from "./utils";

export const createBaseColor = () => {
  const [baseColor, setBaseColor] = createSignal(DEFAULT_BASE_COLOR);

  onMount(() => {
    const savedColor = localStorage.getItem(BASE_COLOR_LOCAL_STORAGE_KEY);
    if (savedColor) {
      try {
        const color = Color(savedColor);
        setBaseColor(color.hex());
      } catch (e) {
        console.error("Invalid saved color:", `"${savedColor}"`);
        localStorage.removeItem(BASE_COLOR_LOCAL_STORAGE_KEY);
        console.warn(
          "Invalid saved color",
          `"${savedColor}"`,
          "was removed from local storage",
        );
      }
    }
  });

  createEffect(() => {
    localStorage.setItem(BASE_COLOR_LOCAL_STORAGE_KEY, baseColor());
    const root: HTMLElement | null = document.querySelector(":root");
    if (root) {
      applyTheme(root, baseColor());
    }
  });

  return {
    baseColor,
    setBaseColor,
  };
};

let signalInstance: ReturnType<typeof createBaseColor>;
export const useBaseColor = () => {
  if (!signalInstance) {
    signalInstance = createRoot(() => createBaseColor());
  }
  return signalInstance;
};
