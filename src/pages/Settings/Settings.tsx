import type { Component, JSX } from "solid-js";

import { useBaseColor } from "../../lib/theme";

import styles from "./Settings.module.css";

export const Settings: Component = () => {
  const { baseColor, setBaseColor } = useBaseColor();

  const handleChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (
    e,
  ) => {
    setBaseColor(e.target.value);
  };

  return (
    <div class={styles.container}>
      <div class={`inputGroup ${styles.colorPicker}`}>
        <label for="baseThemeColor">Choose theme color</label>
        <input
          class={styles.colorInput}
          id="baseThemeColor"
          onChange={handleChange}
          type="color"
          name="baseThemeColor"
          value={baseColor()}
        />
      </div>
    </div>
  );
};
