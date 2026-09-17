import { BadgeCheck, Info, Quote } from "lucide-react";
import { Rail } from "@/components/common/Rail";
import { Reveal } from "@/components/common/Reveal";
import { Rating } from "@/components/ui/Rating";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatDate } from "@/lib/utils/format";
import type { RatingSummary } from "@/services/reviews";
import type { Review } from "@/types";

interface ReviewsProps {
  reviews: Review[];
  summary: RatingSummary;
}

export function Reviews({ reviews, summary }: ReviewsProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="section-y" aria-labelledby="reviews-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Customers"
            title={<span id="reviews-heading">What people say after the first slice</span>}
            action={
              <div className="flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2">
                <span className="font-display text-2xl font-extrabold tabular text-text">{summary.average.toFixed(1)}</span>
                <div className="leading-tight">
                  <Rating value={summary.average} />
                  <p className="text-[11px] text-muted">{summary.count} reviews</p>
                </div>
              </div>
            }
          />
        </Reveal>

        {summary.isPlaceholder && (
          <p className="mb-6 flex items-start gap-2 rounded-xl border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-900" role="note">
            <Info className="mt-0.5 size-4 shrink-0" />
            Sample reviews shown for layout only. Real customer reviews will appear here once a reviews source is connected.
          </p>
        )}

        <Rail label="Customer reviews">
          {reviews.map((review) => (
            <article key={review.id} className="flex w-[300px] shrink-0 snap-start flex-col rounded-xl border border-border bg-surface p-5 sm:w-[340px]">
              <Quote className="size-6 text-secondary" aria-hidden />
              <Rating value={review.rating} className="mt-3" />
              {review.title && <h3 className="mt-3 font-display text-lg font-bold text-text">{review.title}</h3>}
              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-soft">{review.body}</p>
              <footer className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-secondary">
                  {review.initials}
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-text">
                    {review.author}
                    {review.verifiedOrder && <BadgeCheck className="size-4 text-success" aria-label="Verified order" />}
                  </p>
                  <p className="text-xs text-muted">
                    {review.city} · {formatDate(review.date)}
                  </p>
                </div>
              </footer>
            </article>
          ))}
        </Rail>
      </div>
    </section>
  );
}
