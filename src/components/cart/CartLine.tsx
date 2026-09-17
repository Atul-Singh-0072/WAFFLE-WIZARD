"use client";

import Image from "next/image";
import Link from "next/link";
import { DietBadge } from "@/components/ui/DietBadge";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { BLUR_DATA_URL } from "@/data/media";
import { formatPrice } from "@/lib/utils/format";
import { useCart } from "@/store/cart-store";
import type { CartItem } from "@/types";

export function CartLine({ item }: { item: CartItem }) {
  const cart = useCart();
  const summary = [...item.variants.map((v) => v.optionName), ...item.addons.map((a) => `+ ${a.optionName}`)].join(
    " · ",
  );

  return (
    <li className="flex gap-3.5 py-4">
      <Link href={`/menu/${item.slug}`} onClick={cart.close} className="relative size-[74px] shrink-0 overflow-hidden rounded-xl bg-surface-2">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="80px"
          className="object-cover"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <DietBadge diet={item.diet} />
              <Link href={`/menu/${item.slug}`} onClick={cart.close} className="truncate font-semibold text-text hover:text-primary-800">
                {item.name}
              </Link>
            </div>
            {summary && <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted">{summary}</p>}
            {item.note && <p className="mt-0.5 text-xs italic text-muted">“{item.note}”</p>}
          </div>
          <span className="shrink-0 font-display font-bold tabular text-text">{formatPrice(item.unitPrice * item.quantity)}</span>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-3">
          <QuantityStepper
            size="sm"
            value={item.quantity}
            min={1}
            removeAtMin
            onChange={(next) => (next < 1 ? cart.removeItem(item.id) : cart.setQuantity(item.id, next))}
            label={`Quantity for ${item.name}`}
          />
          <div className="flex items-center gap-3 text-xs font-semibold">
            <Link href={`/menu/${item.slug}?edit=${item.id}`} onClick={cart.close} className="text-primary-700 hover:underline">
              Edit
            </Link>
            <button type="button" onClick={() => cart.removeItem(item.id)} className="text-muted hover:text-danger">
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
