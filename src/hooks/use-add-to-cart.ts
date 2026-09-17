"use client";

import { useCallback, useState } from "react";
import { unitPrice } from "@/services/pricing";
import { useCart } from "@/store/cart-store";
import type { Product, SelectedOption } from "@/types";

/** The cheapest valid configuration — first default option of each variant group. */
export function defaultSelections(product: Product): SelectedOption[] {
  return product.variants.map((group) => {
    const chosen = group.options.find((o) => o.isDefault && o.available) ?? group.options.find((o) => o.available) ?? group.options[0];
    return {
      groupId: group.id,
      groupName: group.name,
      optionId: chosen.id,
      optionName: chosen.name,
      priceDelta: chosen.priceDelta,
    };
  });
}

interface AddOptions {
  variants?: SelectedOption[];
  addons?: SelectedOption[];
  quantity?: number;
  note?: string;
  openDrawer?: boolean;
}

/**
 * Bridges the catalog and the cart. Also exposes a short-lived "added" flag so
 * buttons can flash confirmation without each card owning a timer.
 */
export function useAddToCart(product: Product) {
  const cart = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const add = useCallback(
    ({ variants, addons = [], quantity = 1, note, openDrawer = false }: AddOptions = {}) => {
      const chosenVariants = variants ?? defaultSelections(product);
      cart.addItem(
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0],
          diet: product.diet,
          quantity,
          unitPrice: unitPrice(product, chosenVariants, addons),
          variants: chosenVariants,
          addons,
          note,
        },
        { openDrawer },
      );
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 1400);
    },
    [cart, product],
  );

  return { add, justAdded };
}
