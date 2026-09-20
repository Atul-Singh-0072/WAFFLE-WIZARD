import { media } from "@/data/media";
import type { AddonGroup, Option, Product, VariantGroup } from "@/types";

/**
 * MENU CATALOG.
 *
 * Pizza and burger names and prices are exactly as the business supplied them
 * on 2026-09-20. Do not edit a price here without them confirming it first.
 *
 * The whole menu is vegetarian. Photography is licensed stock standing in for
 * the outlet's own shoot (see src/data/media.ts); ratings and review counts are
 * indicative sample data, flagged by the footer disclaimer.
 */

/* ------------------------------------------------------------------ */
/* Option sets                                                         */
/* ------------------------------------------------------------------ */

function option(id: string, name: string, priceDelta: number, extra: Partial<Option> = {}): Option {
  return { id, name, priceDelta, available: true, ...extra };
}

/** Small / Medium / Large priced exactly as supplied. Base price = Small. */
function sizes(small: number, medium: number, large: number): VariantGroup {
  return {
    id: "size",
    name: "Choose size",
    hint: "Prices as on our menu card",
    required: true,
    type: "single",
    priceMode: "absolute",
    options: [
      option("small", 'Small (6")', 0, { isDefault: true, description: "Serves 1" }),
      option("medium", 'Medium (9")', medium - small, { description: "Serves 2", badge: "Most ordered" }),
      option("large", 'Large (12")', large - small, { description: "Serves 3-4" }),
    ],
  };
}

/** The one extra on the card. */
const addOns: AddonGroup = {
  id: "add-ons",
  name: "Add-ons",
  hint: "Make it extra delicious",
  required: false,
  type: "multi",
  options: [option("extra-cheese", "Extra Cheese", 25, { diet: "veg", badge: "Popular" })],
};

/* ------------------------------------------------------------------ */
/* Pizza builder                                                       */
/* ------------------------------------------------------------------ */

const slugOf = (name: string) =>
  name
    .toLowerCase()
    .replace(/[()&]/g, " ")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

interface PizzaSpec {
  name: string;
  /** [small, medium, large]; a single number means one size only. */
  prices: [number, number, number] | [number];
  image: string;
  altImage: string;
  description: string;
  ingredients: string[];
  tags?: Product["tags"];
  featured?: boolean;
  bestseller?: boolean;
  rating: number;
  ratingCount: number;
}

function pizza(spec: PizzaSpec): Product {
  const multiSize = spec.prices.length === 3;
  const [small, medium, large] = spec.prices as [number, number, number];
  return {
    id: `p-${slugOf(spec.name)}`,
    slug: slugOf(spec.name),
    name: spec.name,
    description: spec.description,
    ingredients: spec.ingredients,
    images: [spec.image, spec.altImage],
    categoryId: "cat-pizza",
    basePrice: small,
    diet: "veg",
    tags: spec.tags ?? [],
    variants: multiSize ? [sizes(small, medium, large)] : [],
    addons: [addOns],
    availability: "live",
    featured: spec.featured ?? false,
    bestseller: spec.bestseller ?? false,
    isNew: false,
    rating: spec.rating,
    ratingCount: spec.ratingCount,
    serves: multiSize ? "1-4 depending on size" : "1",
    prepTimeMins: 15,
  };
}

const BASE = ["Fresh hand-stretched dough", "Tomato sauce", "Mozzarella"];

/* ------------------------------------------------------------------ */
/* Catalog                                                             */
/* ------------------------------------------------------------------ */

export const products: Product[] = [
  /* ------------------------------- Pizza ---------------------------- */
  pizza({
    name: "Tomato Pizza",
    prices: [69, 119, 159],
    image: media.pizza.tomatoPepper,
    altImage: media.pizza.basilStone,
    description: "Fresh tomato over mozzarella. Simple, and it has to be right.",
    ingredients: [...BASE, "Fresh tomato", "Oregano"],
    tags: ["value", "bestseller"],
    featured: true,
    bestseller: true,
    rating: 4.6,
    ratingCount: 312,
  }),
  pizza({
    name: "Onion Pizza",
    prices: [69, 119, 159],
    image: media.pizza.onionWhite,
    altImage: media.pizza.plainCheese,
    description: "Sweet red onion, sliced thin and baked into the cheese.",
    ingredients: [...BASE, "Red onion", "Oregano"],
    tags: ["value"],
    rating: 4.5,
    ratingCount: 198,
  }),
  pizza({
    name: "Onion Capsicum Pizza",
    prices: [79, 129, 179],
    image: media.pizza.loadedVeggie,
    altImage: media.pizza.gardenVeg,
    description: "Onion and capsicum — the pairing most people come back for.",
    ingredients: [...BASE, "Red onion", "Capsicum"],
    tags: ["value", "bestseller"],
    featured: true,
    bestseller: true,
    rating: 4.7,
    ratingCount: 386,
  }),
  pizza({
    name: "Golden Corn Pizza",
    prices: [89, 149, 209],
    image: media.pizza.basilClassic,
    altImage: media.pizza.cheesePull,
    description: "Sweet corn kernels under a thick blanket of cheese.",
    ingredients: [...BASE, "Sweet corn"],
    tags: ["value"],
    rating: 4.6,
    ratingCount: 241,
  }),
  pizza({
    name: "Corn Paneer Pizza",
    prices: [99, 169, 239],
    image: media.pizza.pepperMargherita,
    altImage: media.pizza.loadedVeggie,
    description: "Sweet corn and soft paneer cubes together.",
    ingredients: [...BASE, "Sweet corn", "Paneer"],
    tags: ["bestseller"],
    bestseller: true,
    rating: 4.7,
    ratingCount: 274,
  }),
  pizza({
    name: "Margretta Pizza",
    prices: [79, 139, 189],
    image: media.pizza.margherita,
    altImage: media.pizza.basilStone,
    description: "Tomato, mozzarella, basil. The one that tests a kitchen.",
    ingredients: [...BASE, "Fresh basil"],
    tags: ["value", "bestseller"],
    featured: true,
    bestseller: true,
    rating: 4.7,
    ratingCount: 428,
  }),
  pizza({
    name: "Cheese Burst Pizza",
    prices: [109, 189, 269],
    image: media.pizza.cheesePull,
    altImage: media.pizza.plainCheese,
    description: "Molten cheese sealed into the crust. Pull it apart slowly.",
    ingredients: [...BASE, "Cheese-burst crust", "Extra mozzarella"],
    tags: ["signature", "bestseller"],
    featured: true,
    bestseller: true,
    rating: 4.9,
    ratingCount: 512,
  }),
  pizza({
    name: "Capsicum Paneer Pizza",
    prices: [109, 189, 269],
    image: media.pizza.gardenVeg,
    altImage: media.pizza.loadedVeggie,
    description: "Crisp capsicum with paneer cubes, baked till just golden.",
    ingredients: [...BASE, "Capsicum", "Paneer"],
    tags: ["chefs-pick"],
    rating: 4.6,
    ratingCount: 219,
  }),
  pizza({
    name: "Onion Capsicum Paneer Pizza",
    prices: [119, 209, 299],
    image: media.pizza.arugulaThin,
    altImage: media.pizza.gardenVeg,
    description: "Onion, capsicum and paneer — all three, properly loaded.",
    ingredients: [...BASE, "Red onion", "Capsicum", "Paneer"],
    tags: ["chefs-pick"],
    featured: true,
    rating: 4.8,
    ratingCount: 265,
  }),
  pizza({
    name: "Onion Capsicum Tomato Pizza",
    prices: [99, 179, 249],
    image: media.pizza.basilStone,
    altImage: media.pizza.tomatoPepper,
    description: "The classic three, layered edge to edge.",
    ingredients: [...BASE, "Red onion", "Capsicum", "Fresh tomato"],
    tags: ["value"],
    rating: 4.6,
    ratingCount: 187,
  }),
  pizza({
    name: "Peri Peri Pizza",
    prices: [119, 209, 299],
    image: media.pizza.mushroomTomato,
    altImage: media.pizza.tomatoPepper,
    description: "Peri peri seasoning through the sauce. Genuinely hot.",
    ingredients: [...BASE, "Peri peri seasoning", "Red onion", "Capsicum"],
    tags: ["spicy", "chefs-pick"],
    featured: true,
    rating: 4.7,
    ratingCount: 298,
  }),
  pizza({
    name: "Onion Paneer Pizza",
    prices: [109, 189, 269],
    image: media.pizza.arugulaRicotta,
    altImage: media.pizza.pepperMargherita,
    description: "Paneer and red onion, no distractions.",
    ingredients: [...BASE, "Paneer", "Red onion"],
    tags: [],
    rating: 4.6,
    ratingCount: 176,
  }),
  pizza({
    name: "Onion Capsicum Corn Pizza",
    prices: [89, 149, 209],
    image: media.pizza.ovenFresh,
    altImage: media.pizza.loadedVeggie,
    description: "Onion, capsicum and sweet corn — crunch and sweetness together.",
    ingredients: [...BASE, "Red onion", "Capsicum", "Sweet corn"],
    tags: ["value"],
    rating: 4.6,
    ratingCount: 203,
  }),
  pizza({
    name: "Paneer Tikka Pizza",
    prices: [139, 269, 389],
    image: media.pizza.pepperMargherita,
    altImage: media.pizza.arugulaThin,
    description: "Tandoori-marinated paneer with onion and capsicum.",
    ingredients: [...BASE, "Paneer tikka", "Red onion", "Capsicum", "Tikka masala"],
    tags: ["signature", "bestseller"],
    featured: true,
    bestseller: true,
    rating: 4.8,
    ratingCount: 391,
  }),
  pizza({
    name: "Mushroom Pizza",
    prices: [99, 179, 249],
    image: media.pizza.whiteMushroom,
    altImage: media.pizza.arugulaThin,
    description: "Button mushrooms with garlic butter and herbs.",
    ingredients: [...BASE, "Button mushroom", "Garlic butter", "Mixed herbs"],
    tags: ["chefs-pick"],
    rating: 4.6,
    ratingCount: 168,
  }),
  pizza({
    name: "Farm House Pizza",
    prices: [99, 179, 249],
    image: media.pizza.loadedVeggie,
    altImage: media.pizza.ovenFresh,
    description: "Mushroom, capsicum, onion and tomato — the whole garden.",
    ingredients: [...BASE, "Button mushroom", "Capsicum", "Red onion", "Fresh tomato"],
    tags: ["bestseller"],
    bestseller: true,
    rating: 4.7,
    ratingCount: 344,
  }),
  pizza({
    name: "Tandoori Pizza",
    prices: [149, 279, 399],
    image: media.pizza.tomatoPepper,
    altImage: media.pizza.mushroomTomato,
    description: "Tandoori masala base with paneer, onion and capsicum.",
    ingredients: [...BASE, "Tandoori masala", "Paneer", "Red onion", "Capsicum"],
    tags: ["spicy", "signature"],
    featured: true,
    rating: 4.8,
    ratingCount: 226,
  }),
  pizza({
    name: "Special Pizza",
    prices: [209, 399, 559],
    image: media.pizza.cheeseSlices,
    altImage: media.pizza.cheesePull,
    description: "Everything the kitchen has, on one base. Order it for the table.",
    ingredients: [
      ...BASE,
      "Paneer",
      "Button mushroom",
      "Capsicum",
      "Red onion",
      "Sweet corn",
      "Fresh tomato",
      "Extra cheese",
    ],
    tags: ["signature", "chefs-pick"],
    featured: true,
    rating: 4.9,
    ratingCount: 158,
  }),
  pizza({
    name: "Chez & Hur",
    prices: [59],
    image: media.pizza.plainCheese,
    altImage: media.pizza.cheeseSlices,
    description: "A quick single-size pizza — cheesy, hot, ready in minutes.",
    ingredients: [...BASE, "Herbs"],
    tags: ["value"],
    rating: 4.5,
    ratingCount: 96,
  }),

  /* ------------------------------ Burgers --------------------------- */
  {
    id: "b-pizza-burger",
    slug: "pizza-burger",
    name: "Pizza Burger",
    description: "Pizza filling in a soft bun — sauce, cheese and veg.",
    ingredients: ["Burger bun", "Pizza sauce", "Mozzarella", "Capsicum", "Red onion"],
    images: [media.burger.garden, media.burger.crispy],
    categoryId: "cat-burgers",
    basePrice: 59,
    diet: "veg",
    tags: ["value", "bestseller"],
    variants: [],
    addons: [addOns],
    availability: "live",
    featured: false,
    bestseller: true,
    isNew: true,
    rating: 4.6,
    ratingCount: 142,
    serves: "1",
    prepTimeMins: 8,
  },
  {
    id: "b-tandoori-burger",
    slug: "tandoori-burger",
    name: "Tandoori Burger",
    description: "Tandoori-spiced patty with onion and a cooling sauce.",
    ingredients: ["Burger bun", "Tandoori veg patty", "Red onion", "Mint sauce", "Lettuce"],
    images: [media.burger.crispy, media.burger.stacked],
    categoryId: "cat-burgers",
    basePrice: 69,
    diet: "veg",
    tags: ["spicy"],
    variants: [],
    addons: [addOns],
    availability: "live",
    featured: false,
    bestseller: false,
    isNew: true,
    rating: 4.6,
    ratingCount: 108,
    serves: "1",
    prepTimeMins: 9,
  },
  {
    id: "b-paneer-burger",
    slug: "paneer-burger",
    name: "Paneer Burger",
    description: "A thick paneer slab, crumbed and fried, with fresh salad.",
    ingredients: ["Burger bun", "Crumbed paneer", "Lettuce", "Tomato", "Mayo"],
    images: [media.burger.stacked, media.burger.garden],
    categoryId: "cat-burgers",
    basePrice: 79,
    diet: "veg",
    tags: ["chefs-pick"],
    variants: [],
    addons: [addOns],
    availability: "live",
    featured: true,
    bestseller: false,
    isNew: true,
    rating: 4.7,
    ratingCount: 131,
    serves: "1",
    prepTimeMins: 10,
  },

  /* --------------------------- Magical Combos ----------------------- */
  {
    id: "c-classic-combo",
    slug: "classic-combo",
    name: "Classic Combo",
    description: "Any everyday pizza + a chilled drink.",
    longDescription: "Pick any pizza from the everyday range and we add a chilled drink — cheaper than the two ordered apart.",
    ingredients: ["Any everyday pizza", "Chilled drink"],
    images: [media.pizza.gardenVeg, media.pizza.margherita],
    categoryId: "cat-combos",
    basePrice: 129,
    compareAtPrice: 179,
    diet: "veg",
    tags: ["value", "bestseller"],
    variants: [],
    addons: [addOns],
    availability: "live",
    featured: true,
    bestseller: true,
    isNew: false,
    rating: 4.6,
    ratingCount: 219,
    serves: "1",
    prepTimeMins: 15,
  },
  {
    id: "c-premium-combo",
    slug: "premium-combo",
    name: "Premium Combo",
    description: "Any premium pizza + a chilled drink.",
    longDescription: "Any of the paneer, peri peri or tandoori pizzas with a chilled drink.",
    ingredients: ["Any premium pizza", "Chilled drink"],
    images: [media.pizza.mushroomTomato, media.pizza.arugulaThin],
    categoryId: "cat-combos",
    basePrice: 169,
    compareAtPrice: 249,
    diet: "veg",
    tags: ["value"],
    variants: [],
    addons: [addOns],
    availability: "live",
    featured: false,
    bestseller: false,
    isNew: false,
    rating: 4.6,
    ratingCount: 148,
    serves: "1",
    prepTimeMins: 15,
  },
  {
    id: "c-family-combo",
    slug: "family-combo",
    name: "Family Combo",
    description: "2 Medium Pizzas + 2 Drinks + Fries.",
    longDescription: "Two medium pizzas of your choice, two chilled drinks and a portion of fries.",
    ingredients: ["2 medium pizzas", "2 chilled drinks", "Fries"],
    images: [media.pizza.basilStone, media.sides.fries],
    categoryId: "cat-combos",
    basePrice: 299,
    compareAtPrice: 449,
    diet: "veg",
    tags: ["value", "chefs-pick"],
    variants: [],
    addons: [addOns],
    availability: "live",
    featured: true,
    bestseller: false,
    isNew: false,
    rating: 4.7,
    ratingCount: 173,
    serves: "2-3",
    prepTimeMins: 22,
  },
  {
    id: "c-pizza-party-combo",
    slug: "pizza-party-combo",
    name: "Pizza Party Combo",
    description: "3 Large Pizzas + 3 Drinks + Fries.",
    longDescription: "Three large pizzas of your choice, three chilled drinks and fries — share the joy, double the happiness.",
    ingredients: ["3 large pizzas", "3 chilled drinks", "Fries"],
    images: [media.pizza.cheeseSlices, media.sides.fries],
    categoryId: "cat-combos",
    basePrice: 459,
    compareAtPrice: 699,
    diet: "veg",
    tags: ["value"],
    variants: [],
    addons: [addOns],
    availability: "live",
    featured: false,
    bestseller: false,
    isNew: false,
    rating: 4.8,
    ratingCount: 96,
    serves: "4-6",
    prepTimeMins: 28,
  },

  /* ----------------------------- Choco Pizza ------------------------ */
  {
    id: "d-choco-pizza",
    slug: "choco-pizza",
    name: "Choco Pizza",
    description: "Sweet endings are the best — chocolate, drizzle and toppings on a warm base.",
    ingredients: ["Fresh dough", "Chocolate spread", "Chocolate drizzle", "Sweet toppings"],
    images: [media.poster.chocoPizza],
    categoryId: "cat-choco",
    basePrice: 69,
    diet: "veg",
    tags: ["bestseller"],
    variants: [sizes(69, 99, 149)],
    addons: [],
    availability: "live",
    featured: true,
    bestseller: true,
    isNew: false,
    rating: 4.7,
    ratingCount: 205,
    serves: "1-4 depending on size",
    prepTimeMins: 12,
  },
];
