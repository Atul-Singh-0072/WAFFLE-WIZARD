"use client";

import { Check, Clock, ShoppingBag, Users, Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { OptionGroup } from "@/components/product/OptionGroup";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Button } from "@/components/ui/Button";
import { DietBadge } from "@/components/ui/DietBadge";
import { Textarea } from "@/components/ui/Field";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Rating } from "@/components/ui/Rating";
import { Skeleton } from "@/components/ui/Skeleton";
import { defaultSelections } from "@/hooks/use-add-to-cart";
import { formatPrice } from "@/lib/utils/format";
import { unitPrice } from "@/services/pricing";
import { useCart } from "@/store/cart-store";
import type { CartItem, Category, Product, SelectedOption } from "@/types";

interface ProductCustomizerProps {
  product: Product;
  category?: Category;
}

/**
 * Resolves the optional `?edit=<lineId>` param against the hydrated cart, then
 * mounts the form with that line as its initial state. Keying on the line id
 * means switching lines remounts the form instead of patching state in effects.
 */
export function ProductCustomizer({ product, category }: ProductCustomizerProps) {
  const cart = useCart();
  const params = useSearchParams();
  const editLineId = params.get("edit") ?? undefined;

  if (editLineId && !cart.hydrated) {
    return (
      <div className="container-page grid gap-8 pt-6 lg:grid-cols-12">
        <Skeleton className="aspect-[4/3] lg:col-span-6" />
        <div className="space-y-4 lg:col-span-6">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  const editLine = editLineId
    ? cart.items.find((line) => line.id === editLineId && line.productId === product.id)
    : undefined;

  return <CustomizerForm key={editLine?.id ?? "new"} product={product} category={category} editLine={editLine} />;
}

interface CustomizerFormProps extends ProductCustomizerProps {
  editLine?: CartItem;
}

function CustomizerForm({ product, category, editLine }: CustomizerFormProps) {
  const cart = useCart();
  const router = useRouter();

  const [variantChoice, setVariantChoice] = useState<Record<string, string>>(() =>
    editLine
      ? Object.fromEntries(editLine.variants.map((v) => [v.groupId, v.optionId]))
      : Object.fromEntries(defaultSelections(product).map((s) => [s.groupId, s.optionId])),
  );
  const [addonChoice, setAddonChoice] = useState<Record<string, string[]>>(() => {
    const grouped: Record<string, string[]> = {};
    for (const addon of editLine?.addons ?? []) (grouped[addon.groupId] ??= []).push(addon.optionId);
    return grouped;
  });
  const [quantity, setQuantity] = useState(editLine?.quantity ?? 1);
  const [note, setNote] = useState(editLine?.note ?? "");
  const [justAdded, setJustAdded] = useState(false);

  const variants = useMemo<SelectedOption[]>(
    () =>
      product.variants.map((group) => {
        const option = group.options.find((o) => o.id === variantChoice[group.id]) ?? group.options[0];
        return { groupId: group.id, groupName: group.name, optionId: option.id, optionName: option.name, priceDelta: option.priceDelta };
      }),
    [product.variants, variantChoice],
  );

  const addons = useMemo<SelectedOption[]>(
    () =>
      product.addons.flatMap((group) =>
        (addonChoice[group.id] ?? [])
          .map((id) => group.options.find((o) => o.id === id))
          .filter((o): o is NonNullable<typeof o> => !!o)
          .map((o) => ({ groupId: group.id, groupName: group.name, optionId: o.id, optionName: o.name, priceDelta: o.priceDelta })),
      ),
    [product.addons, addonChoice],
  );

  const unit = unitPrice(product, variants, addons);
  const total = unit * quantity;

  const commit = (openDrawer: boolean) => {
    if (editLine) cart.removeItem(editLine.id);
    cart.addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        diet: product.diet,
        quantity,
        unitPrice: unit,
        variants,
        addons,
        note: note.trim() || undefined,
      },
      { openDrawer },
    );
  };

  const addToCart = () => {
    commit(true);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  const buyNow = () => {
    commit(false);
    router.push("/checkout");
  };

  const summary = [...variants.map((v) => v.optionName), ...addons.map((a) => `+${a.optionName}`)].join(" · ");
  const ctaLabel = justAdded ? "Added to cart" : editLine ? "Update cart" : "Add to cart";

  return (
    <div className="container-page grid gap-8 pb-28 pt-6 lg:grid-cols-12 lg:gap-12 lg:pb-16">
      {/* Gallery */}
      <div className="lg:col-span-6">
        <ProductGallery product={product} />
        <div className="mt-8 hidden lg:block">
          <IngredientsAndFacts product={product} />
        </div>
      </div>

      {/* Configurator */}
      <div className="lg:col-span-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-accent">
          {category?.name}
          {editLine && <span className="rounded-full bg-primary-50 px-2 py-0.5 normal-case tracking-normal text-primary-800">Editing cart item</span>}
        </div>
        <h1 className="display-lg mt-2 flex items-start gap-3 text-text">
          <DietBadge diet={product.diet} size="md" className="mt-3" />
          <span>{product.name}</span>
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          {product.rating && <Rating value={product.rating} count={product.ratingCount} />}
          {product.serves && (
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4" /> Serves {product.serves}
            </span>
          )}
          {product.prepTimeMins && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" /> {product.prepTimeMins} min
            </span>
          )}
        </div>
        <p className="mt-4 text-base leading-relaxed text-text-soft">{product.longDescription ?? product.description}</p>

        <div className="mt-8 space-y-8">
          {product.variants.map((group) => (
            <OptionGroup key={group.id} group={group} basePrice={product.basePrice} value={variantChoice[group.id]} onChange={(id: string) => setVariantChoice((c) => ({ ...c, [group.id]: id }))} />
          ))}
          {product.addons.map((group) => (
            <OptionGroup key={group.id} group={group} value={addonChoice[group.id] ?? []} onChange={(ids: string[]) => setAddonChoice((c) => ({ ...c, [group.id]: ids }))} />
          ))}

          <Textarea
            label="Note for the kitchen"
            hint="Allergies, spice level, cut into extra slices — anything useful."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={160}
            rows={2}
            className="min-h-20"
          />
        </div>

        <div className="mt-6 lg:hidden">
          <IngredientsAndFacts product={product} />
        </div>

        {/* Desktop summary */}
        <div className="mt-8 hidden rounded-2xl border border-border bg-surface p-5 shadow-md lg:block">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Your build</p>
              <p className="mt-1 line-clamp-2 text-sm font-medium text-text-soft">{summary || product.name}</p>
              <p className="mt-1 text-xs text-muted">{formatPrice(unit)} each</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <Price amount={total} compareAt={product.compareAtPrice ? product.compareAtPrice * quantity : undefined} size="xl" />
              <QuantityStepper value={quantity} onChange={setQuantity} size="sm" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="lg" className="flex-1" onClick={addToCart} iconLeft={justAdded ? <Check className="size-5" strokeWidth={3} /> : <ShoppingBag className="size-5" />}>
              {ctaLabel}
            </Button>
            <Button size="lg" variant="dark" onClick={buyNow} iconLeft={<Zap className="size-5" />}>
              Buy now
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-[calc(var(--mobilebar-h)+env(safe-area-inset-bottom))] z-40 border-t border-border bg-surface/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(38,14,74,0.25)] backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} size="sm" />
          <Button size="lg" className="flex-1" onClick={addToCart}>
            <span className="flex w-full items-center justify-between gap-3">
              <span>{justAdded ? "Added" : editLine ? "Update" : "Add to cart"}</span>
              <span className="tabular">{formatPrice(total)}</span>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function IngredientsAndFacts({ product }: { product: Product }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-base font-bold text-text">Ingredients</h2>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {product.ingredients.map((ingredient) => (
            <li key={ingredient} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-text-soft">
              {ingredient}
            </li>
          ))}
        </ul>
      </div>
      {product.nutrition ? (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-base font-bold text-text">Nutrition</h2>
          <p className="text-xs text-muted">Per {product.nutrition.servingSize}</p>
          <dl className="mt-3 grid grid-cols-4 gap-2 text-center">
            {[
              ["kcal", product.nutrition.calories],
              ["Protein", `${product.nutrition.protein}g`],
              ["Carbs", `${product.nutrition.carbs}g`],
              ["Fat", `${product.nutrition.fat}g`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-surface-2 py-2">
                <dd className="font-display text-base font-bold tabular text-text">{value}</dd>
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-base font-bold text-text">Good to know</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Made to order in the outlet nearest you. For allergen questions, contact the outlet before ordering.
          </p>
        </div>
      )}
    </div>
  );
}
