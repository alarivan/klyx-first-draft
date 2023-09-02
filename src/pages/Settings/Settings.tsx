import type { Component, JSX } from "solid-js";

import { createSignal } from "solid-js";

import {
  saveAsFile,
  validateStore,
  restoreFromBackup,
  swapCurrentStoreWithBackup,
} from "../../lib/backup";
import { useBaseColor } from "../../lib/theme";
import { LOCAL_STORAGE_STORE_KEY } from "../../store";

import styles from "./Settings.module.css";

export const Settings: Component = () => {
  const { baseColor, setBaseColor } = useBaseColor();
  const [restoreText, setRestoreText] = createSignal("");

  const handleChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (
    e,
  ) => {
    setBaseColor(e.target.value);
  };

  const downloadBackup = () => {
    const store = localStorage.getItem(LOCAL_STORAGE_STORE_KEY);
    if (store) {
      saveAsFile(store);
    }
  };

  const onRestoreClick = () => {
    const [error, store] = validateStore(restoreText());
    if (error) {
      alert(error);
    } else if (store) {
      restoreFromBackup(store);
      window.location.reload();
    }
  };

  const onSwapClick = () => {
    const success = swapCurrentStoreWithBackup();
    if (success) {
      window.location.reload();
    }
  };

  return (
    <div class={styles.container}>
      <section>
        <h2>Theme</h2>
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
      </section>
      <section>
        <h2>Backup</h2>
        <button
          type="button"
          onClick={downloadBackup}
          class="action action__primary"
        >
          Download backup of your data
        </button>
      </section>
      <section>
        <h2>Restore</h2>
        <div class="inputGroup">
          <label for="restore">Paste backup file contents</label>
          <textarea
            name="restore"
            id="restore"
            rows="4"
            value={restoreText()}
            onChange={(e) => setRestoreText(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={onRestoreClick}
          class="action action__primary"
        >
          Restore
        </button>
      </section>
      <section>
        <h2>Swap back to previous data</h2>
        <p>
          The Swap Back feature allows you to restore data to a previous state
          and offers the added flexibility of reverting to the version just
          before the restoration, ensuring control and data accuracy. It
          provides peace of mind by enabling you to easily backtrack if you are
          unsatisfied with the restored data or need to compare different
          versions.
        </p>
        <button
          type="button"
          onClick={onSwapClick}
          class="action action__primary"
        >
          Swap back
        </button>
      </section>
    </div>
  );
};
