import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { FiSettings } from "solid-icons/fi";

import styles from "./PageHeader.module.css";

export const PageHeader: Component = () => {
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
      <A title="Settings" class={`a-reset ${styles.settings}`} href="/settings">
        <FiSettings size={30} />
      </A>
    </div>
  );
};
