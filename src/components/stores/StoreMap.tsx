"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { boundsFor } from "@/lib/utils/geo";
import { serviceModeLabels } from "@/lib/utils/format";
import type { Coordinates, Store } from "@/types";

interface StoreMapProps {
  stores: Store[];
  activeId?: string;
  onSelect?: (store: Store) => void;
  /** Customer position, when known. */
  userPosition?: Coordinates;
  className?: string;
  interactive?: boolean;
}

/** Brand pin drawn as an inline SVG so no marker sprite request is needed. */
function pinIcon(active: boolean, live: boolean) {
  const fill = !live ? "#9b6cee" : active ? "#e0452c" : "#4b1d8f";
  const size = active ? 44 : 36;
  return L.divIcon({
    className: "ww-pin",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 6],
    html: `<svg width="${size}" height="${size}" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 6px 10px rgba(20,9,31,.35))">
      <path d="M18 34c6-8.4 12-14.2 12-20A12 12 0 1 0 6 14c0 5.8 6 11.6 12 20Z" fill="${fill}"/>
      <circle cx="18" cy="14" r="5" fill="#f5b21a"/>
    </svg>`,
  });
}

const userIcon = L.divIcon({
  className: "ww-user",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  html: `<span style="display:block;width:18px;height:18px;border-radius:50%;background:#e0452c;border:3px solid #fff;box-shadow:0 0 0 6px rgba(224,69,44,.22)"></span>`,
});

/** Close enough to read the streets around a single outlet. */
const STREET_ZOOM = 17;

/** Pans to the active store whenever it changes. */
function FlyTo({ store }: { store?: Store }) {
  const map = useMap();
  useEffect(() => {
    if (!store) return;
    map.flyTo([store.latitude, store.longitude], Math.max(map.getZoom(), STREET_ZOOM), { duration: 0.6 });
  }, [store, map]);
  return null;
}

/** Re-fits bounds when the store list changes (e.g. after a search). */
function FitBounds({ stores }: { stores: Store[] }) {
  const map = useMap();
  useEffect(() => {
    if (stores.length === 0) return;
    if (stores.length === 1) {
      map.setView([stores[0].latitude, stores[0].longitude], STREET_ZOOM);
      return;
    }
    map.fitBounds(
      stores.map((s) => [s.latitude, s.longitude] as [number, number]),
      { padding: [40, 40], maxZoom: 15 },
    );
  }, [stores, map]);
  return null;
}

export default function StoreMap({ stores, activeId, onSelect, userPosition, className, interactive = true }: StoreMapProps) {
  const { center, zoom } = boundsFor(stores);
  const active = stores.find((s) => s.id === activeId);

  return (
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={zoom}
      scrollWheelZoom={interactive}
      dragging={interactive}
      zoomControl={interactive}
      className={className}
      style={{ height: "100%", width: "100%" }}
      attributionControl
    >
      {/*
        Hybrid satellite view: aerial imagery underneath, a transparent
        roads-and-labels layer on top. Esri's public tiles need no API key,
        so this works on any host without billing set up.
      */}
      <TileLayer
        attribution='Imagery &copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxZoom={19}
      />
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
        maxZoom={19}
      />
      <FitBounds stores={stores} />
      <FlyTo store={active} />

      {userPosition && <Marker position={[userPosition.latitude, userPosition.longitude]} icon={userIcon} />}

      {stores.map((store) => (
        <Marker
          key={store.id}
          position={[store.latitude, store.longitude]}
          icon={pinIcon(store.id === activeId, store.status === "live")}
          eventHandlers={{ click: () => onSelect?.(store) }}
        >
          <Popup>
            <div className="min-w-[180px] p-3">
              <p className="font-display text-sm font-bold text-[#1a1024]">{store.locality}</p>
              <p className="mt-0.5 text-[11px] text-[#6b5f4a]">
                {store.status === "live" ? store.services.map((s) => serviceModeLabels[s]).join(" · ") : "Opening soon"}
              </p>
              <a
                href={`/stores/${store.slug}`}
                className="mt-2 inline-flex h-8 items-center rounded-full bg-primary px-3 text-xs font-bold text-white"
              >
                View store
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
