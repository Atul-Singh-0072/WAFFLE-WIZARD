"use client";

import { ExternalLink, Star } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { isPlaceholder, siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";
import { whatsappLink, whatsappNumbers } from "@/lib/utils/whatsapp";

/**
 * Star rating.
 *
 * The tap itself never leaves the page — it lights the stars and thanks the
 * customer immediately. Posting the score publicly is a second step they
 * choose, because a hijacked tap costs more goodwill than the rating is worth.
 *
 * Both onward options are offered on every score. Google's review policy
 * forbids routing only happy customers to Google, so there is deliberately no
 * branch on `score` here — do not add one.
 */

const RATED_KEY = "ww:rated";

let snapshot: string | null | undefined;
const listeners = new Set<() => void>();

function getRated(): string | null {
  if (snapshot === undefined) {
    try {
      snapshot = localStorage.getItem(RATED_KEY);
    } catch {
      snapshot = null;
    }
  }
  return snapshot;
}

function getServerRated(): string | null {
  return null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function saveRated(score: number) {
  snapshot = String(score);
  try {
    localStorage.setItem(RATED_KEY, snapshot);
  } catch {
    // Private mode: the thank-you just won't survive a reload.
  }
  listeners.forEach((listener) => listener());
}

const STARS = [1, 2, 3, 4, 5];

export function RateUs() {
  const rated = useSyncExternalStore(subscribe, getRated, getServerRated);
  const [hovered, setHovered] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const score = rated ? Number(rated) : 0;
  const shown = hovered || score;
  const googleUrl = siteConfig.social.googleReview;
  const hasGoogle = !isPlaceholder(googleUrl);

  const choose = (value: number) => {
    saveRated(value);
    setHovered(0);
    setCelebrating(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCelebrating(false), 1100);
  };

  const note = `Hi! I rated ${siteConfig.name} ${score}/5 — `;

  return (
    <div>
      <p className="text-sm text-white/75">
        {score ? (
          <>
            Thanks! <strong className="font-semibold text-white">{score} star{score === 1 ? "" : "s"}</strong> noted.
          </>
        ) : (
          "Rate your last order"
        )}
      </p>

      {/* Stars and the Google button share a row when there is width for it,
          and stack on the narrowest phones. */}
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <div
          className="rate-stars"
          role="radiogroup"
          aria-label="Rate your last order out of 5"
          onMouseLeave={() => setHovered(0)}
        >
          {STARS.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={score === value}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              className={cn("rate-star", value <= shown && "is-on", celebrating && value <= score && "is-pop")}
              style={celebrating ? ({ "--pop-delay": `${(value - 1) * 60}ms` } as React.CSSProperties) : undefined}
              onMouseEnter={() => setHovered(value)}
              onFocus={() => setHovered(value)}
              onBlur={() => setHovered(0)}
              onClick={() => choose(value)}
            >
              <Star className="size-[19px]" strokeWidth={1.8} />
            </button>
          ))}
        </div>

        {score > 0 && hasGoogle && (
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rate-google inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-secondary px-4 text-sm font-bold text-[#1a1024] transition-transform hover:scale-[1.03]"
          >
            Post it on Google
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        )}
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-white/45">
        {score ? (
          <>
            Tap again to change it
            {hasGoogle && " · a Google review helps new customers find us"}
            {" · or "}
            <a
              href={whatsappLink(whatsappNumbers[0].raw, note)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-secondary underline underline-offset-2"
            >
              tell us on WhatsApp
            </a>
          </>
        ) : (
          "One tap — that's it."
        )}
      </p>

      <p aria-live="polite" className="sr-only">
        {score ? `You rated ${score} out of 5.` : ""}
      </p>
    </div>
  );
}
