import type { Accessor } from "solid-js";

import { onCleanup, createSignal } from "solid-js";

export function createWakeLock(): [
  isActive: Accessor<boolean>,
  isAvailable: boolean,
  request: () => Promise<void>,
  release: () => Promise<void>,
] {
  let wakeLock: WakeLockSentinel | undefined | null;
  console.log("TCL: [line 12][createWakeLock.ts] wakeLock: ", wakeLock);
  const isAvailable = "wakeLock" in navigator;

  const [isActive, setIsActive] = createSignal(false);

  const releaseEventListener = () => {
    setIsActive(false);
  };

  onCleanup(() => {
    if (wakeLock) {
      wakeLock.removeEventListener("release", releaseEventListener);
    }
  });

  const requestWakeLock = async () => {
    if (isAvailable) {
      try {
        wakeLock = await navigator.wakeLock.request("screen");
        setIsActive(true);
        wakeLock.addEventListener("release", releaseEventListener);
      } catch (err) {
        alert(
          "Unable to keep awake. Usually system related, such as low battery life.",
        );
      }
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLock && isActive()) {
      await wakeLock.release();
      wakeLock = null;
    }
  };

  return [isActive, isAvailable, requestWakeLock, releaseWakeLock];
}
