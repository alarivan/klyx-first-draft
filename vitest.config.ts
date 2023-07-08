/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
  test: {
    deps: {
      registerNodeLoader: true,
      inline: [/solid-js/],
    },
    environment: "jsdom",
    globals: true,
    transformMode: { web: [/\.[jt]sx?$/] },
    setupFiles: [
      "node_modules/@testing-library/jest-dom/extend-expect",
      "./setupVitest.js",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text"],
    },
  },
  resolve: {
    conditions: ["development", "browser"],
  },
});
