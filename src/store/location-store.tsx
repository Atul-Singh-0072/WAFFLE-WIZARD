"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { findNearestStore, geocodeQuery, getStoreById } from "@/services/stores";
import { createPersistedStore, usePersistedStore } from "@/store/persisted-store";
import type { Coordinates, ServiceMode, Store } from "@/types";

type LocateStatus = "idle" | "locating" | "ready" | "denied" | "error";

interface PersistedLocation {
  serviceMode: ServiceMode;
  coords?: Coordinates;
  label?: string;
  storeId?: string;
}

const locationStore = createPersistedStore<PersistedLocation>("ww:location", { serviceMode: "delivery" });

interface LocationContextValue extends PersistedLocation {
  hydrated: boolean;
  status: LocateStatus;
  error?: string;
  /** Resolved outlet for the current selection, when one is chosen. */
  store?: Store;
  /** Whether the nearest outlet delivers to the current coordinates. */
  delivers?: boolean;
  distanceKm?: number;
  setServiceMode: (mode: ServiceMode) => void;
  /** Sets a manual location, resolving the nearest outlet. */
  setLocation: (input: { coords: Coordinates; label: string }) => Promise<void>;
  /** Geocodes a free-text locality / pincode. Returns false if unmatched. */
  searchLocation: (query: string) => Promise<boolean>;
  /** Uses the browser Geolocation API. */
  locate: () => Promise<void>;
  selectStore: (storeId: string) => Promise<void>;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const persisted = usePersistedStore(locationStore);
  const hydrated = useMounted();
  const [status, setStatus] = useState<LocateStatus>("idle");
  const [error, setError] = useState<string>();
  const [store, setStore] = useState<Store>();
  const [delivers, setDelivers] = useState<boolean>();
  const [distanceKm, setDistanceKm] = useState<number>();

  // Resolve the outlet object whenever the persisted id changes (including on load).
  useEffect(() => {
    let alive = true;
    if (!persisted.storeId) {
      return;
    }
    getStoreById(persisted.storeId).then((found) => {
      if (!alive) return;
      setStore(found);
      if (found) setStatus((current) => (current === "idle" ? "ready" : current));
    });
    return () => {
      alive = false;
    };
  }, [persisted.storeId]);

  const resolveNearest = useCallback(async (coords: Coordinates, label: string) => {
    const nearest = await findNearestStore(coords);
    locationStore.set((current) => ({ ...current, coords, label, storeId: nearest?.store.id }));
    setStore(nearest?.store);
    setDelivers(nearest?.delivers);
    setDistanceKm(nearest?.distanceKm);
    setStatus("ready");
    setError(undefined);
  }, []);

  const setLocation = useCallback<LocationContextValue["setLocation"]>(
    async ({ coords, label }) => {
      setStatus("locating");
      await resolveNearest(coords, label);
    },
    [resolveNearest],
  );

  const searchLocation = useCallback<LocationContextValue["searchLocation"]>(
    async (query) => {
      const trimmed = query.trim();
      if (!trimmed) return false;
      setStatus("locating");
      const coords = await geocodeQuery(trimmed);
      if (!coords) {
        setStatus("error");
        setError("We could not match that area yet. Try a locality or pincode near an outlet.");
        return false;
      }
      await resolveNearest(coords, trimmed);
      return true;
    },
    [resolveNearest],
  );

  const locate = useCallback<LocationContextValue["locate"]>(async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("error");
      setError("Location is not available in this browser.");
      return;
    }
    setStatus("locating");
    setError(undefined);

    await new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await resolveNearest(
            { latitude: position.coords.latitude, longitude: position.coords.longitude },
            "Current location",
          );
          resolve();
        },
        (geoError) => {
          const denied = geoError.code === geoError.PERMISSION_DENIED;
          setStatus(denied ? "denied" : "error");
          setError(
            denied
              ? "Location access was blocked. Type your area instead."
              : "We could not read your location. Type your area instead.",
          );
          resolve();
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
      );
    });
  }, [resolveNearest]);

  const selectStore = useCallback<LocationContextValue["selectStore"]>(async (storeId) => {
    const found = await getStoreById(storeId);
    setStore(found);
    locationStore.set((current) => ({
      ...current,
      storeId,
      label: found ? `${found.locality}, ${found.city}` : current.label,
      coords: found ? { latitude: found.latitude, longitude: found.longitude } : current.coords,
    }));
    setDelivers(true);
    setDistanceKm(undefined);
    setStatus("ready");
    setError(undefined);
  }, []);

  const clearLocation = useCallback(() => {
    locationStore.set((current) => ({ serviceMode: current.serviceMode }));
    setStore(undefined);
    setDelivers(undefined);
    setDistanceKm(undefined);
    setStatus("idle");
    setError(undefined);
  }, []);

  const value = useMemo<LocationContextValue>(
    () => ({
      ...persisted,
      hydrated,
      status,
      error,
      store,
      delivers,
      distanceKm,
      setServiceMode: (serviceMode) => locationStore.set((current) => ({ ...current, serviceMode })),
      setLocation,
      searchLocation,
      locate,
      selectStore,
      clearLocation,
    }),
    [persisted, hydrated, status, error, store, delivers, distanceKm, setLocation, searchLocation, locate, selectStore, clearLocation],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation(): LocationContextValue {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocation must be used inside <LocationProvider>");
  return context;
}
