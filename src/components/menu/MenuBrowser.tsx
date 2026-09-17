"use client";

import { Lock, Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { ProductCard } from "@/components/menu/ProductCard";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils/cn";
import { getIcon } from "@/lib/utils/icons";
import { isCategoryOrderable } from "@/services/catalog";
import type { Category, DietType, MenuFilters, Product, ProductTag } from "@/types";

interface MenuBrowserProps {
  products: Product[];
  categories: Category[];
}

const sortOptions: { value: NonNullable<MenuFilters["sort"]>; label: string }[] = [
  { value: "popular", label: "Most popular" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "new", label: "New arrivals" },
];

const quickTags: { value: ProductTag; label: string }[] = [
  { value: "bestseller", label: "Bestsellers" },
  { value: "new", label: "New" },
  { value: "spicy", label: "Spicy" },
  { value: "value", label: "Value" },
];

function sortList(list: Product[], sort: MenuFilters["sort"]): Product[] {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.basePrice - b.basePrice);
    case "price-desc":
      return copy.sort((a, b) => b.basePrice - a.basePrice);
    case "new":
      return copy.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    default:
      return copy;
  }
}

export function MenuBrowser({ products, categories }: MenuBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const category = params.get("category") ?? undefined;
  const dietParam = (params.get("diet") ?? "") as DietType | "";
  const tagParam = (params.get("tag") ?? "") as ProductTag | "";
  const sort = (params.get("sort") as MenuFilters["sort"]) ?? "popular";

  const [query, setQuery] = useState(params.get("q") ?? "");
  const deferredQuery = useDeferredValue(query);

  const setParam = useCallback(
    (key: string, value?: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const orderable = useMemo(() => categories.filter(isCategoryOrderable), [categories]);
  const hasNonVeg = useMemo(() => products.some((p) => p.diet !== "veg"), [products]);
  const locked = useMemo(() => categories.filter((c) => c.availability === "coming-soon"), [categories]);

  const filtered = useMemo(() => {
    let list = products;
    if (category) {
      const match = orderable.find((c) => c.slug === category);
      list = match ? list.filter((p) => p.categoryId === match.id) : [];
    }
    if (dietParam) list = list.filter((p) => p.diet === dietParam);
    if (tagParam) list = list.filter((p) => p.tags.includes(tagParam) || (tagParam === "bestseller" && p.bestseller) || (tagParam === "new" && p.isNew));
    if (deferredQuery.trim()) {
      const terms = deferredQuery.toLowerCase().split(/\s+/).filter(Boolean);
      list = list.filter((p) => {
        const hay = [p.name, p.description, ...p.ingredients].join(" ").toLowerCase();
        return terms.every((t) => hay.includes(t));
      });
    }
    return sortList(list, sort);
  }, [products, category, dietParam, tagParam, deferredQuery, sort, orderable]);

  const groups = useMemo(() => {
    const visible = category ? orderable.filter((c) => c.slug === category) : orderable;
    return visible
      .map((c) => ({ category: c, items: filtered.filter((p) => p.categoryId === c.id) }))
      .filter((g) => g.items.length > 0);
  }, [filtered, orderable, category]);

  const activeFilterCount = [dietParam, tagParam, deferredQuery.trim()].filter(Boolean).length + (sort !== "popular" ? 1 : 0);

  const clearAll = () => {
    setQuery("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div>
      {/* Sticky toolbar */}
      <div className="sticky top-[var(--header-h)] z-30 border-y border-border bg-background/90 backdrop-blur-xl">
        <div className="container-page flex flex-col gap-3 py-3">
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <label htmlFor="menu-search" className="sr-only">
                Search the menu
              </label>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                id="menu-search"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setParam("q", e.target.value || undefined);
                }}
                placeholder="Search pizzas, combos, ingredients…"
                enterKeyHint="search"
                className="h-11 w-full rounded-full border-[1.5px] border-border bg-surface pl-11 pr-10 text-[15px] text-text placeholder:text-muted/80 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setParam("q");
                  }}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface-2"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <label className="relative hidden sm:block">
              <span className="sr-only">Sort</span>
              <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value === "popular" ? undefined : e.target.value)}
                className="h-11 appearance-none rounded-full border-[1.5px] border-border bg-surface pl-10 pr-9 text-sm font-semibold text-text focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Category tabs */}
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:-mx-8 md:px-8 xl:-mx-10 xl:px-10" role="tablist" aria-label="Categories">
            <Chip selected={!category} onClick={() => setParam("category")} role="tab" aria-selected={!category}>
              All
            </Chip>
            {orderable.map((c) => {
              const Icon = getIcon(c.icon);
              const selected = category === c.slug;
              return (
                <Chip key={c.id} selected={selected} onClick={() => setParam("category", selected ? undefined : c.slug)} icon={<Icon className="size-4" />} role="tab" aria-selected={selected}>
                  {c.name}
                </Chip>
              );
            })}
            {locked.map((c) => (
              <span
                key={c.id}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-dashed border-border px-4 text-sm font-semibold text-muted"
                title={`${c.name} — coming soon`}
                aria-disabled
              >
                <Lock className="size-3.5" />
                {c.name}
              </span>
            ))}
          </div>

          {/* Filters */}
          <div className="no-scrollbar -mx-5 flex items-center gap-2 overflow-x-auto px-5 md:-mx-8 md:px-8 xl:-mx-10 xl:px-10" aria-label="Filters">
            {hasNonVeg ? (
              <>
                <FilterChip active={dietParam === "veg"} onClick={() => setParam("diet", dietParam === "veg" ? undefined : "veg")} dot="bg-veg">
                  Veg
                </FilterChip>
                <FilterChip active={dietParam === "non-veg"} onClick={() => setParam("diet", dietParam === "non-veg" ? undefined : "non-veg")} dot="bg-nonveg">
                  Non-veg
                </FilterChip>
                <span className="mx-1 h-5 w-px shrink-0 bg-border" aria-hidden />
              </>
            ) : (
              <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-veg/40 bg-veg/10 px-3 text-xs font-bold text-veg">
                <span className="size-2 rounded-full bg-veg" /> 100% veg menu
              </span>
            )}
            {quickTags.map((t) => (
              <FilterChip key={t.value} active={tagParam === t.value} onClick={() => setParam("tag", tagParam === t.value ? undefined : t.value)}>
                {t.label}
              </FilterChip>
            ))}
            {activeFilterCount > 0 && (
              <button type="button" onClick={clearAll} className="ml-auto shrink-0 text-xs font-bold text-primary-700 hover:underline">
                Clear ({activeFilterCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-page py-8 md:py-12">
        {groups.length === 0 ? (
          <div className="mx-auto max-w-md py-16 text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary-50 text-primary">
              <Search className="size-7" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-bold text-text">Nothing matches that</h2>
            <p className="mt-2 text-sm text-muted">Try a different spelling, remove a filter, or browse everything.</p>
            <Button variant="outline" className="mt-6" onClick={clearAll}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="space-y-14">
            {groups.map((group) => (
              <section key={group.category.id} id={group.category.slug} aria-labelledby={`cat-${group.category.slug}`} className="scroll-mt-48">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2 id={`cat-${group.category.slug}`} className="display-md text-text">
                      {group.category.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted">{group.category.tagline}</p>
                  </div>
                  <span className="text-xs font-semibold text-muted tabular">
                    {group.items.length} {group.items.length === 1 ? "item" : "items"}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.items.map((product, index) => (
                    <ProductCard key={product.id} product={product} priority={index < 4} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, dot, children }: { active: boolean; onClick: () => void; dot?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition-colors",
        active ? "border-secondary bg-secondary text-[#1a1024]" : "border-border bg-surface text-text-soft hover:border-secondary/60",
      )}
    >
      {dot && <span className={cn("size-2 rounded-full", dot)} />}
      {children}
    </button>
  );
}
