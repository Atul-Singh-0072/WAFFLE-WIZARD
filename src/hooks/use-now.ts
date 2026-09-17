"use client";

import { useSyncExternalStore } from "react";

/**
 * A shared 30-second clock. Components that depend on the current time
 * (open/closed pills, "today" highlights) read it here so server and hydration
 * renders agree (0 = unknown) and every subscriber ticks together.
 */

const TICK_MS = 30_000;

let now = 0;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((fn) => fn());
    }, TICK_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

function getSnapshot() {
  if (now === 0) now = Date.now();
  return now;
}

function getServerSnapshot() {
  return 0;
}

/** Epoch ms, refreshed every 30s. Returns 0 until the client has mounted. */
export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
