"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  INTRO_ATTR,
  INTRO_FAILSAFE_GLOBAL,
  INTRO_HOLD_MS,
  INTRO_IMAGE,
  INTRO_LEAVE_MS,
  INTRO_SESSION_KEY,
} from "@/components/common/brand-intro-boot";
import { siteConfig } from "@/lib/config/site";

/* ------------------------------------------------------------------ */
/* Tiny external store: "is the intro active?"                         */
/* Read from the <html> attribute the boot script set; false on server.*/
/* ------------------------------------------------------------------ */

let activeSnapshot: boolean | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): boolean {
  if (activeSnapshot === null) activeSnapshot = document.documentElement.getAttribute(INTRO_ATTR) === "1";
  return activeSnapshot;
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function deactivate() {
  activeSnapshot = false;
  document.documentElement.removeAttribute(INTRO_ATTR);
  listeners.forEach((listener) => listener());
}

/** Eight sparkles thrown outward from the logo centre. */
const burst = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2 + 0.35;
  const radius = 150 + (i % 3) * 38;
  return {
    dx: `${Math.round(Math.cos(angle) * radius)}px`,
    dy: `${Math.round(Math.sin(angle) * radius)}px`,
    delay: `${0.3 + (i % 4) * 0.06}s`,
  };
});

/**
 * One-time-per-session animated splash with the full logo. The shell is
 * server-rendered (hidden via CSS unless <html data-intro="1">); the image and
 * timeline mount after hydration, and the animation only starts once the
 * preloaded logo has actually decoded so it never plays on an empty box.
 */
export function BrandIntro() {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const finished = useRef(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const previousFocus = useRef<Element | null>(null);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    setLeaving(true);
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      // Private mode: the splash simply plays again next load.
    }
    window.setTimeout(() => {
      deactivate();
      const target = previousFocus.current;
      if (target instanceof HTMLElement && document.contains(target)) target.focus({ preventScroll: true });
    }, INTRO_LEAVE_MS);
  };

  // A cached image can be complete before React attaches onLoad.
  useEffect(() => {
    if (active && imageRef.current?.complete) setReady(true);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    // React owns the overlay from here; the boot failsafe must not cut a running intro short.
    const failsafe = (window as unknown as Record<string, number | undefined>)[INTRO_FAILSAFE_GLOBAL];
    if (failsafe) window.clearTimeout(failsafe);
    previousFocus.current = document.activeElement;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // finish is stable for the component's lifetime; the ref guards re-entry.
  }, [active]);

  // The hold clock starts when the logo is on screen, not when the shell mounts.
  useEffect(() => {
    if (!active || !ready) return;
    const timer = window.setTimeout(finish, INTRO_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [active, ready]);

  const className = ["brand-intro", ready && "is-ready", leaving && "is-leaving"].filter(Boolean).join(" ");

  return (
    <div id="brand-intro" className={className} aria-hidden={!active} onClick={finish}>
      {active && (
        <>
          <span className="brand-intro__glow" aria-hidden />
          <span className="brand-intro__burst" aria-hidden>
            {burst.map((b, i) => (
              <i key={i} style={{ "--dx": b.dx, "--dy": b.dy, animationDelay: b.delay } as React.CSSProperties} />
            ))}
          </span>
          <Image
            ref={imageRef}
            src={INTRO_IMAGE}
            alt={`${siteConfig.name} — ${siteConfig.tagline}`}
            width={640}
            height={760}
            unoptimized
            priority
            onLoad={() => setReady(true)}
            onError={() => setReady(true)}
            className="brand-intro__logo"
          />
          <p className="brand-intro__tagline">{siteConfig.tagline}</p>
          <button type="button" className="brand-intro__skip" onClick={finish} autoFocus>
            Tap anywhere to skip
          </button>
        </>
      )}
    </div>
  );
}
