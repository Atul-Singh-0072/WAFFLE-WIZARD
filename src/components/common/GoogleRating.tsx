import { Star } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";
import { getGoogleRating } from "@/services/google-place";

/**
 * The outlet's score on Google, read live from the Places API once a day and
 * linked back to the listing so anyone can check it. Falls back to the
 * snapshot in siteConfig when there is no API key or Google does not answer.
 *
 * Styled from theme tokens, so the same badge reads correctly on the light
 * page body and inside the footer's dark island.
 *
 * Deliberately display-only: republishing a Google score as your own
 * schema.org aggregateRating breaks Google's structured-data policy.
 */
export async function GoogleRating({ className }: { className?: string }) {
  const { rating, reviewCount, isSnapshot } = await getGoogleRating();

  if (!Number.isFinite(rating) || rating <= 0) return null;

  const pct = `${Math.min(100, Math.max(0, (rating / 5) * 100))}%`;
  const stars = Array.from({ length: 5 }, (_, i) => <Star key={i} className="size-[15px]" strokeWidth={1.8} />);

  return (
    <div className={cn("inline-block", className)}>
      <a
        href={siteConfig.social.googleMaps}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-2.5 transition-colors hover:border-secondary/60"
      >
        <span className="font-display text-2xl font-extrabold leading-none text-text tabular">{rating.toFixed(1)}</span>

        <span className="min-w-0">
          <span className="gstars" style={{ "--pct": pct } as React.CSSProperties} aria-hidden>
            <span className="gstars__row gstars__base">{stars}</span>
            <span className="gstars__fill">
              <span className="gstars__row">{stars}</span>
            </span>
          </span>
          <span className="mt-0.5 block text-[11.5px] leading-tight text-muted">
            on Google
            {Number.isFinite(reviewCount) && reviewCount > 0 && <> · {reviewCount} reviews</>}
          </span>
        </span>

        <span className="sr-only">
          Rated {rating.toFixed(1)} out of 5 on Google from {reviewCount} reviews. Opens the listing in a new tab.
        </span>
      </a>

      {/* Places API data shown away from a Google Map must carry attribution. */}
      {!isSnapshot && <p className="mt-1 text-[10px] leading-none text-muted/70">Powered by Google · updated daily</p>}
    </div>
  );
}
