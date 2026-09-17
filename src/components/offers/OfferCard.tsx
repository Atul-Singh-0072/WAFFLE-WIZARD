"use client";

import { ArrowRight, Check, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { BLUR_DATA_URL } from "@/data/media";
import { cn } from "@/lib/utils/cn";
import type { Offer } from "@/types";

interface OfferCardProps {
  offer: Offer;
  layout?: "grid" | "rail";
  className?: string;
}

export function OfferCard({ offer, layout = "grid", className }: OfferCardProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!offer.couponCode) return;
    try {
      await navigator.clipboard.writeText(offer.couponCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable; the code is still visible to type.
    }
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl bg-ink text-white shadow-md transition-[transform,box-shadow] duration-300 hover:shadow-xl motion-safe:hover:-translate-y-1",
        layout === "rail" && "w-[300px] shrink-0 snap-start sm:w-[340px]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={offer.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 90vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/5" aria-hidden />
        {offer.subtitle && (
          <Badge tone="glass" className="absolute left-3 top-3">
            {offer.subtitle}
          </Badge>
        )}
        <p className="absolute bottom-3 left-4 font-display text-3xl font-extrabold tracking-tight text-foil drop-shadow-sm">
          {offer.discountLabel}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-4 pt-3">
        <h3 className="font-display text-lg font-bold leading-tight">{offer.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-white/65">{offer.description}</p>

        <div className="mt-4 flex items-center gap-2">
          {offer.couponCode ? (
            <button
              type="button"
              onClick={copy}
              className="flex h-10 flex-1 items-center justify-between rounded-full border border-dashed border-secondary/70 bg-secondary/10 pl-4 pr-1.5 text-left transition-colors hover:bg-secondary/20"
              aria-label={`Copy code ${offer.couponCode}`}
            >
              <span className="text-sm font-extrabold tracking-[0.12em] text-secondary">{offer.couponCode}</span>
              <span className="flex h-7 items-center gap-1 rounded-full bg-secondary px-2.5 text-[11px] font-bold text-ink">
                {copied ? <Check className="size-3.5" strokeWidth={3} /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
          ) : (
            <span className="flex h-10 flex-1 items-center gap-2 rounded-full bg-white/8 px-3 text-xs font-semibold text-white/80">
              {offer.badge && <span className="rounded-full bg-secondary px-2.5 py-1 font-display text-sm font-extrabold text-[#1a1024]">{offer.badge}</span>}
              No code needed
            </span>
          )}
          <Link
            href={offer.href ?? "/menu"}
            aria-label={`Order with ${offer.title}`}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-600"
          >
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
