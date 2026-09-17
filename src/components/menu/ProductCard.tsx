"use client";

import { Check, Plus, SlidersHorizontal, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { DietBadge } from "@/components/ui/DietBadge";
import { BLUR_DATA_URL } from "@/data/media";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import type { Option, Product, SelectedOption } from "@/types";

interface ProductCardProps {
  product: Product;
  /** `rail` fixes the width for horizontal scrolling. */
  layout?: "grid" | "rail";
  priority?: boolean;
  className?: string;
}

function primaryTag(product: Product): { label: string; tone: "gold" | "ember" | "primary" } | null {
  if (product.tags.includes("signature")) return { label: "Signature", tone: "gold" };
  if (product.bestseller) return { label: "Bestseller", tone: "ember" };
  if (product.isNew) return { label: "New", tone: "primary" };
  if (product.tags.includes("chefs-pick")) return { label: "Chef's pick", tone: "primary" };
  return null;
}

/** Short size label for the chip row: 'Regular (6")' -> 'R 6"'. */
function shortSize(name: string): string {
  const inches = name.match(/\(([^)]+)\)/)?.[1] ?? "";
  return `${name.charAt(0)} ${inches}`.trim();
}

/**
 * Cream "menu card" panel, as on the poster: photo, name, rating, then the
 * size row and the price pill directly beneath it, then Add to cart.
 */
export function ProductCard({ product, layout = "grid", priority = false, className }: ProductCardProps) {
  const { add, justAdded } = useAddToCart(product);
  const tag = primaryTag(product);
  const sizeGroup = product.variants.find((group) => group.id === "size");
  const [sizeId, setSizeId] = useState<string>(
    () => sizeGroup?.options.find((o) => o.isDefault)?.id ?? sizeGroup?.options[0]?.id ?? "",
  );
  const size: Option | undefined = sizeGroup?.options.find((o) => o.id === sizeId);
  const price = product.basePrice + (size?.priceDelta ?? 0);
  const hasOptions = product.variants.length > 0 || product.addons.length > 0;

  const addSelected = () => {
    if (!sizeGroup || !size) return add();
    const chosen: SelectedOption = {
      groupId: sizeGroup.id,
      groupName: sizeGroup.name,
      optionId: size.id,
      optionName: size.name,
      priceDelta: size.priceDelta,
    };
    add({ variants: [chosen] });
  };

  return (
    <article
      className={cn(
        "panel-cream group relative flex flex-col overflow-hidden rounded-xl transition-[transform,box-shadow] duration-300 ease-out motion-safe:hover:-translate-y-1",
        layout === "rail" && "w-[272px] shrink-0 snap-start sm:w-[300px]",
        className,
      )}
    >
      <Link href={`/menu/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[#1a1024]" aria-label={`${product.name} details`}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 85vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" aria-hidden />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {tag && <Badge tone={tag.tone}>{tag.label}</Badge>}
          {product.tags.includes("spicy") && <Badge tone="glass">Spicy</Badge>}
        </div>
        {product.prepTimeMins && (
          <span className="absolute bottom-3 left-3 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-[#1a1024]">
            {product.prepTimeMins} min
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <DietBadge diet={product.diet} />
          <h3 className="truncate font-display text-[17px] font-bold leading-tight text-text">
            <Link href={`/menu/${product.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
              {product.name}
            </Link>
          </h3>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">{product.description}</p>

        {/* Rating first, price below — as requested. */}
        {product.rating && (
          <p className="mt-3 flex items-center gap-1.5" aria-label={`Rated ${product.rating} out of 5`}>
            <span className="inline-flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={cn("size-3.5", i < Math.round(product.rating ?? 0) ? "fill-secondary-500 text-secondary-500" : "fill-[#d9cdb0] text-[#d9cdb0]")} />
              ))}
            </span>
            <span className="text-xs font-bold tabular text-text">{product.rating.toFixed(1)}</span>
            {product.ratingCount && <span className="text-xs font-medium text-muted">({product.ratingCount})</span>}
          </p>
        )}

        {sizeGroup && (
          <div className="relative z-10 mt-3 grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Size">
            {sizeGroup.options.map((option) => {
              const selected = option.id === sizeId;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setSizeId(option.id)}
                  className={cn(
                    "flex flex-col items-center rounded-lg border px-1 py-1.5 text-[11px] font-bold leading-tight transition-colors",
                    selected
                      ? "on-dark border-[#1a1024] bg-[#1a1024] text-secondary"
                      : "border-[#1a1024]/15 bg-white/60 text-[#1a1024] hover:border-[#1a1024]/40",
                  )}
                >
                  <span>{shortSize(option.name)}</span>
                  <span className={cn("text-[12px] tabular", selected ? "text-white" : "text-[#3d3324]")}>{formatPrice(product.basePrice + option.priceDelta)}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-3 flex items-end justify-between gap-2">
          <span className="price-pill font-display text-lg font-extrabold tabular">
            {!sizeGroup && hasOptions && <span className="text-[10px] font-semibold opacity-70">from</span>}
            {formatPrice(price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > price && (
            <span className="pb-1 text-xs font-semibold text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>

        <div className="relative z-10 mt-3 flex gap-2">
          <button
            type="button"
            onClick={addSelected}
            aria-label={`Add ${product.name} to cart`}
            className={cn(
              "flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full text-sm font-extrabold transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary-300/70",
              justAdded ? "bg-success text-white" : "on-dark bg-[#1a1024] text-secondary hover:bg-[#2a1a47]",
            )}
          >
            {justAdded ? (
              <>
                <Check className="size-4" strokeWidth={3} /> Added
              </>
            ) : (
              <>
                <Plus className="size-4" strokeWidth={2.6} /> Add to cart
              </>
            )}
          </button>
          {hasOptions && (
            <Link
              href={`/menu/${product.slug}`}
              aria-label={`Customise ${product.name}`}
              className="flex h-11 items-center justify-center gap-1.5 rounded-full border-[1.5px] border-[#1a1024]/25 bg-white/50 px-3.5 text-sm font-bold text-[#1a1024] transition-colors hover:border-[#1a1024]/60"
            >
              <SlidersHorizontal className="size-4" />
              <span className="sr-only">Customise</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
