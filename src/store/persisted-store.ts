import { useSyncExternalStore } from "react";

/**
 * Minimal localStorage-backed external store for `useSyncExternalStore`.
 *
 * Server and hydration renders see `initial`; the first post-hydration render
 * sees the persisted value. No effects, no setState-after-mount, no flash of
 * empty state — React reconciles the two snapshots itself.
 */
export interface PersistedStore<T> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (next: T | ((previous: T) => T)) => void;
}

export function createPersistedStore<T extends object>(key: string, initial: T): PersistedStore<T> {
  let state: T = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = { ...initial, ...(JSON.parse(raw) as Partial<T>) };
    } catch {
      // Corrupt or unavailable storage: keep the initial value.
    }
  };

  const persist = () => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Quota / private mode: state still lives in memory for this session.
    }
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot() {
      load();
      return state;
    },
    getServerSnapshot() {
      return initial;
    },
    set(next) {
      load();
      state = typeof next === "function" ? (next as (previous: T) => T)(state) : next;
      persist();
      listeners.forEach((listener) => listener());
    },
  };
}

export function usePersistedStore<T extends object>(store: PersistedStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}
