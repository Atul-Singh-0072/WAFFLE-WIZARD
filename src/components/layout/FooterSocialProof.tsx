"use client";

import { Heart, Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { customerQuotes } from "@/data/content";
import { isPlaceholder, siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

const HOLD_MS = 3200;
const SWAP_MS = 420;

/**
 * Footer social proof: count + rating rows, then a ticker that shows one short
 * review phrase at a time. Rotation pauses for reduced-motion users (they see
 * the first phrase only); the full list is also available to screen readers.
 */
export function FooterSocialProof() {
  const { customerCount, rating } = siteConfig.socialProof;
  const countReady = !isPlaceholder(customerCount);
  const ratingReady = !isPlaceholder(rating);
  const filledStars = ratingReady ? Math.round(Number(rating)) : 0;

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (customerQuotes.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let leaveTimer: number | undefined;
    const cycle = window.setInterval(() => {
      setLeaving(true);
      leaveTimer = window.setTimeout(() => {
        setIndex((i) => (i + 1) % customerQuotes.length);
        setLeaving(false);
      }, SWAP_MS);
    }, HOLD_MS + SWAP_MS);
    return () => {
      window.clearInterval(cycle);
      if (leaveTimer) window.clearTimeout(leaveTimer);
    };
  }, []);

  return (
    <div className="social-proof">
      <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-secondary">Customers say</p>

      <ul className="mt-4 space-y-3">
        <li className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary">
            <Heart className="size-4" fill="currentColor" />
          </span>
          <span className="text-sm text-white/75">
            Loved by{" "}
            <strong className={cn("font-display text-base font-extrabold text-white", !countReady && "text-white/45")}>
              {customerCount}+
            </strong>{" "}
            customers
          </span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex shrink-0 items-center gap-0.5" aria-hidden>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={cn("size-[15px]", i < filledStars ? "fill-secondary text-secondary" : "fill-transparent text-secondary/45")}
                strokeWidth={1.8}
              />
            ))}
          </span>
          <span className="text-sm text-white/75">
            <strong className={cn("font-display text-base font-extrabold text-white", !ratingReady && "text-white/45")}>{rating}/5</strong>{" "}
            customer rating
          </span>
        </li>
      </ul>

      <div className="review-ticker mt-5" aria-hidden>
        <Quote className="review-ticker__quote" strokeWidth={2.2} />
        <p key={index} className={cn("review-ticker__msg", leaving && "is-leaving")}>
          {customerQuotes[index]}
        </p>
        <ul className="review-ticker__dots">
          {customerQuotes.map((quote, i) => (
            <li key={quote} className={cn(i === index && "is-active")} />
          ))}
        </ul>
      </div>
      <p className="sr-only">Customers say: {customerQuotes.join(" ")}</p>
    </div>
  );
}
