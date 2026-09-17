"use client";

import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { BLUR_DATA_URL } from "@/data/media";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types";

export function ProductGallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const images = product.images;

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-2 shadow-md sm:aspect-square lg:aspect-[4/3]">
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${product.name}${index > 0 ? ` — view ${index + 1}` : ""}`}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover animate-fade-up"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        <div className="absolute left-4 top-4 flex gap-1.5">
          {product.tags.includes("signature") && <Badge tone="gold" size="md">Signature</Badge>}
          {product.bestseller && <Badge tone="ember" size="md">Bestseller</Badge>}
          {product.isNew && <Badge tone="primary" size="md">New</Badge>}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2" role="tablist" aria-label="Product photos">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Photo ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "relative size-16 overflow-hidden rounded-xl border-2 transition-[border-color,transform]",
                i === index ? "border-primary" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
