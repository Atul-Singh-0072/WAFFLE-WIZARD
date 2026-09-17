"use client";

import { Grid2x2, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

const DISMISS_KEY = "ww:waffle-zone-dismissed";
const FIRST_SHOW_MS = 5000;
const VISIBLE_MS = 9000;
const REPEAT_EVERY_MS = 120000;
/** Never interrupt someone who is paying. */
const HIDDEN_ON = ["/checkout", "/cart", "/track"];

/* Session-scoped "dismissed" flag as an external store (no setState in effects). */
let dismissedSnapshot: boolean | null = null;
const listeners = new Set<() => void>();

function getDismissed(): boolean {
  if (dismissedSnapshot === null) {
    try {
      dismissedSnapshot = sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      dismissedSnapshot = false;
    }
  }
  return dismissedSnapshot;
}

function dismiss() {
  dismissedSnapshot = true;
  try {
    sessionStorage.setItem(DISMISS_KEY, "1");
  } catch {
    // Ignore storage failures.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * "WAFFLE ZONE — COMING SOON" announcement. Non-modal (role=status), slides
 * in under the header, pulses, auto-hides, and returns every couple of
 * minutes until the visitor closes it — after which it stays away for the
 * session. Waits for the brand intro splash to finish before its first show.
 */
export function WaffleZonePopup() {
  const pathname = usePathname();
  const dismissed = useSyncExternalStore(subscribe, getDismissed, () => false);
  const [open, setOpen] = useState(false);
  const suppressed = dismissed || HIDDEN_ON.some((route) => pathname.startsWith(route));

  useEffect(() => {
    if (suppressed) return;
    let hideTimer: number | undefined;
    let retryTimer: number | undefined;

    const show = () => {
      if (document.documentElement.hasAttribute("data-intro")) {
        retryTimer = window.setTimeout(show, 1500);
        return;
      }
      setOpen(true);
      hideTimer = window.setTimeout(() => setOpen(false), VISIBLE_MS);
    };

    const first = window.setTimeout(show, FIRST_SHOW_MS);
    const repeat = window.setInterval(show, REPEAT_EVERY_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(repeat);
      if (hideTimer) window.clearTimeout(hideTimer);
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [suppressed]);

  if (suppressed) return null;

  const close = () => {
    setOpen(false);
    dismiss();
  };

  return (
    <div role="status" aria-live="polite" className={`waffle-zone${open ? " is-open" : ""}`}>
      <div className="waffle-zone__card">
        <span className="waffle-zone__ring" aria-hidden />
        <span className="waffle-zone__icon" aria-hidden>
          <Grid2x2 className="size-6" strokeWidth={2.4} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="waffle-zone__title">
            Waffle Zone
            <span className="waffle-zone__badge">
              <Sparkles className="size-3" /> Coming soon
            </span>
          </p>
          <p className="waffle-zone__text">Belgian-style waffles are on their way. Pizza is live — order now.</p>
        </div>
        <button type="button" onClick={close} aria-label="Close waffle zone announcement" className="waffle-zone__close">
          <X className="size-4" strokeWidth={2.6} />
        </button>
      </div>
    </div>
  );
}
