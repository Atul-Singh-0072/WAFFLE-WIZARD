import { Heart } from "lucide-react";
import { GoogleRating } from "@/components/common/GoogleRating";
import { RateUs } from "@/components/layout/RateUs";
import { customerQuotes } from "@/data/content";
import { isPlaceholder, siteConfig } from "@/lib/config/site";

/**
 * Footer social proof: an optional customer count, a rating control, and a
 * live-stream style flow of short comments rising from the bottom.
 *
 * The flow is pure CSS on a staggered loop — each comment carries its own
 * delay, so six items on one 13s cycle read as a continuous stream with no
 * JavaScript timer and nothing to hydrate.
 */

const FLOW_DURATION = 13;

/** Hearts drifting up the right edge, like a live stream. */
const HEARTS = [
  { x: "0.6rem", size: "0.95rem", dur: "6.5s", delay: "0s", drift: "-0.9rem" },
  { x: "1.6rem", size: "0.75rem", dur: "7.5s", delay: "-1.6s", drift: "0.5rem" },
  { x: "0.9rem", size: "1.1rem", dur: "8s", delay: "-3.2s", drift: "-0.4rem" },
  { x: "2.1rem", size: "0.8rem", dur: "6.8s", delay: "-4.6s", drift: "0.8rem" },
  { x: "1.2rem", size: "0.9rem", dur: "7.2s", delay: "-5.9s", drift: "-1.1rem" },
];

export function FooterSocialProof() {
  const { customerCount } = siteConfig.socialProof;
  const showCount = !isPlaceholder(customerCount);
  const step = FLOW_DURATION / customerQuotes.length;

  return (
    <div>
      <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-secondary">Customers say</p>

      <div className="mt-4 space-y-4">
        <GoogleRating />

        {showCount && (
          <p className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary">
              <Heart className="size-4" fill="currentColor" />
            </span>
            <span className="text-sm text-white/75">
              Loved by <strong className="font-display text-base font-extrabold text-white">{customerCount}+</strong>{" "}
              customers
            </span>
          </p>
        )}

        <RateUs />
      </div>

      <div className="comment-flow mt-5">
        <ul className="comment-flow__list" aria-hidden>
          {customerQuotes.map((quote, index) => (
            <li
              key={quote}
              className="comment-flow__item"
              style={
                {
                  "--flow-duration": `${FLOW_DURATION}s`,
                  // Negative, so the stream is already full at t=0 instead of
                  // taking one 13s cycle to fill from the bottom.
                  "--flow-delay": `${-index * step}s`,
                } as React.CSSProperties
              }
            >
              <span className="comment-flow__avatar">WW</span>
              <span className="comment-flow__text">{quote}</span>
            </li>
          ))}
        </ul>

        <span className="comment-flow__hearts" aria-hidden>
          {HEARTS.map((heart, index) => (
            <i
              key={index}
              style={
                {
                  "--x": heart.x,
                  "--size": heart.size,
                  "--dur": heart.dur,
                  "--delay": heart.delay,
                  "--drift": heart.drift,
                } as React.CSSProperties
              }
            >
              ❤️
            </i>
          ))}
        </span>
      </div>

      {/* The flow is decorative; screen readers get the list in one place. */}
      <p className="sr-only">Customers say: {customerQuotes.join(" ")}</p>
    </div>
  );
}
