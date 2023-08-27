import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { FiSettings } from "solid-icons/fi";
import { Show } from "solid-js";

import { createWakeLock } from "../../lib/wakeLock";

import styles from "./PageHeader.module.css";

export const PageHeader: Component = () => {
  const [isActive, isAvailable, requestWakeLock, releaseWakeLock] =
    createWakeLock();

  const toggleWakeLock = () => {
    if (isActive()) {
      releaseWakeLock();
    } else {
      requestWakeLock();
    }
  };

  return (
    <div class={styles.container}>
      <A title="Home" class={`a-reset`} href="/">
        <img
          alt="KLYX logo"
          src="/android-chrome-192x192.png"
          width={30}
          height={30}
        />
      </A>
      <div class={styles.actions}>
        <Show when={isAvailable}>
          <div class={`inputGroup__checkbox ${styles.wakeLockInput}`}>
            <input
              checked={isActive()}
              onChange={toggleWakeLock}
              id="wakeLock"
              type="checkbox"
            />
            <label for="wakeLock">Keep screen awake</label>
          </div>
        </Show>
        <A
          title="Settings"
          class={`a-reset action action__secondary ${styles.action}`}
          href="/settings"
        >
          <FiSettings size={22} />
        </A>
      </div>
    </div>
  );
};
