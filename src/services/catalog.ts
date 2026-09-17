import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { siteConfig } from "@/lib/config/site";
import type { Category, ID, MenuFilters, Product } from "@/types";

/**
 * Catalog read API.
 *
 * Every function is async and returns plain data, so each body can be replaced
 * with `fetch("/api/...")` without a single call site changing. Nothing else in
 * the app imports `src/data/*` directly.
 */

/* ------------------------------------------------------------------ */
/* Launch gating                                                       */
/* ------------------------------------------------------------------ */

/**
 * A category is orderable only when it is marked live AND its launch phase has
 * been reached. This single predicate is why announcing Buffalo cannot
 * accidentally put it in the cart.
 */
export function isCategoryOrderable(category: Category): boolean {
  return category.availability === "live" && category.launchPhase <= siteConfig.launchPhase;
}

export function isProductOrderable(product: Product, category?: Category): boolean {
  if (product.availability !== "live") return false;
  if (!category) return false;
  return isCategoryOrderable(category);
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

export async function getCategories(): Promise<Category[]> {
  return [...categories].sort((a, b) => a.order - b.order);
}

/** Categories a customer can actually order from today. */
export async function getLiveCategories(): Promise<Category[]> {
  const all = await getCategories();
  return all.filter(isCategoryOrderable);
}

/** Announced but not yet orderable — drives the "coming soon" section. */
export async function getUpcomingCategories(): Promise<Category[]> {
  const all = await getCategories();
  return all.filter((c) => c.availability === "coming-soon");
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return categories.find((category) => category.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

function matchesQuery(product: Product, query: string): boolean {
  const haystack = [product.name, product.description, ...product.ingredients]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function sortProducts(list: Product[], sort: MenuFilters["sort"]): Product[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.basePrice - b.basePrice);
    case "price-desc":
      return sorted.sort((a, b) => b.basePrice - a.basePrice);
    case "new":
      return sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case "popular":
    default:
      // Bestsellers first, then by rating, then by review volume.
      return sorted.sort(
        (a, b) =>
          Number(b.bestseller) - Number(a.bestseller) ||
          (b.rating ?? 0) - (a.rating ?? 0) ||
          (b.ratingCount ?? 0) - (a.ratingCount ?? 0),
      );
  }
}

/** All products whose category has actually launched. */
export async function getProducts(filters: MenuFilters = {}): Promise<Product[]> {
  const liveCategoryIds = new Set((await getLiveCategories()).map((c) => c.id));

  let result = products.filter(
    (product) => product.availability !== "hidden" && liveCategoryIds.has(product.categoryId),
  );

  if (filters.categoryId) {
    result = result.filter((product) => product.categoryId === filters.categoryId);
  }
  if (filters.query?.trim()) {
    result = result.filter((product) => matchesQuery(product, filters.query!));
  }
  if (filters.diet?.length) {
    result = result.filter((product) => filters.diet!.includes(product.diet));
  }
  if (filters.tags?.length) {
    result = result.filter((product) => filters.tags!.some((tag) => product.tags.includes(tag)));
  }
  if (typeof filters.maxPrice === "number") {
    result = result.filter((product) => product.basePrice <= filters.maxPrice!);
  }

  return sortProducts(result, filters.sort);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((product) => product.slug === slug);
}

export async function getProductById(id: ID): Promise<Product | undefined> {
  return products.find((product) => product.id === id);
}

/** Homepage showcase — signature item first. */
export async function getFeaturedProducts(limit = 5): Promise<Product[]> {
  const live = await getProducts({ sort: "popular" });
  return live
    .filter((product) => product.featured)
    .sort((a, b) => Number(b.tags.includes("signature")) - Number(a.tags.includes("signature")))
    .slice(0, limit);
}

/** The one item the brand leads with in the editorial section. */
export async function getSignatureProduct(): Promise<Product | undefined> {
  const live = await getProducts();
  return live.find((product) => product.tags.includes("signature")) ?? live[0];
}

export async function getBestsellers(limit = 6): Promise<Product[]> {
  const live = await getProducts({ sort: "popular" });
  return live.filter((product) => product.bestseller).slice(0, limit);
}

/** Same category first, then anything else popular. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const live = await getProducts({ sort: "popular" });
  const pool = live.filter((candidate) => candidate.id !== product.id);
  const sameCategory = pool.filter((candidate) => candidate.categoryId === product.categoryId);
  const rest = pool.filter((candidate) => candidate.categoryId !== product.categoryId);
  return [...sameCategory, ...rest].slice(0, limit);
}

/** Every orderable slug — used by generateStaticParams and the sitemap. */
export async function getProductSlugs(): Promise<string[]> {
  const live = await getProducts();
  return live.map((product) => product.slug);
}

/** Cheapest configuration of a product, for "from ₹X" labels. */
export function startingPrice(product: Product): number {
  const cheapestVariantTotal = product.variants.reduce((total, group) => {
    const cheapest = Math.min(...group.options.filter((o) => o.available).map((o) => o.priceDelta));
    return total + (Number.isFinite(cheapest) ? cheapest : 0);
  }, 0);
  return product.basePrice + cheapestVariantTotal;
}
