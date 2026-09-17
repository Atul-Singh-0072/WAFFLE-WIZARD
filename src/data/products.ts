import { media } from "@/data/media";
import type { AddonGroup, Option, Product, VariantGroup } from "@/types";

/**
 * MENU CATALOG — names, categories, sizes and prices are copied EXACTLY from
 * the official Waffle Wizard menu card (the poster). Do not edit a price
 * here without the business confirming it on the card first.
 *
 * Deliberately omitted per the brand's 100% vegetarian rule: Chicken Tikka,
 * BBQ Chicken, Tandoori Chicken, Indi BBQ Chicken and the "Chicken" add-on.
 *
 * Ratings and review counts are indicative sample data (see footer disclaimer).
 */

/* ------------------------------------------------------------------ */
/* Option sets                                                         */
/* ------------------------------------------------------------------ */

function option(id: string, name: string, priceDelta: number, extra: Partial<Option> = {}): Option {
  return { id, name, priceDelta, available: true, ...extra };
}

/** Regular 6" / Medium 9" / Large 12" priced exactly as printed. Base price = Regular. */
function sizes(regular: number, medium: number, large: number): VariantGroup {
  return {
    id: "size",
    name: "Choose size",
    hint: "Prices as printed on the menu card",
    required: true,
    type: "single",
    priceMode: "absolute",
    options: [
      option("regular", 'Regular (6")', 0, { isDefault: true, description: "Serves 1" }),
      option("medium", 'Medium (9")', medium - regular, { description: "Serves 2", badge: "Popular" }),
      option("large", 'Large (12")', large - regular, { description: "Serves 3-4" }),
    ],
  };
}

/** "Make It Extra Delicious!" — add-ons exactly as printed (chicken omitted). */
const addOns: AddonGroup = {
  id: "add-ons",
  name: "Add-ons",
  hint: "Make it extra delicious",
  required: false,
  type: "multi",
  options: [
    option("extra-cheese", "Extra Cheese", 30, { diet: "veg", badge: "Popular" }),
    option("extra-toppings", "Extra Toppings", 20, { diet: "veg" }),
    option("jalapenos", "Jalapeños", 20, { diet: "veg" }),
    option("olives", "Olives", 15, { diet: "veg" }),
    option("mushroom", "Mushroom", 20, { diet: "veg" }),
    option("paneer", "Paneer", 25, { diet: "veg" }),
  ],
};

const classicNames = ["Margherita (Cheese Burst)", "Veggie Delight", "Farm House", "Paneer Tikka", "Spicy Veg"];
const premiumNames = ["Mexican Hot", "Loaded Veg", "Mushroom Supreme"];
const signatureNames = ["Peri Peri Paneer", "Cheesy Blast", "Double Cheese"];
const allPizzaNames = [...classicNames, ...premiumNames, ...signatureNames];

const slugOf = (name: string) =>
  name
    .toLowerCase()
    .replace(/[()]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-");

function pickOne(id: string, name: string, names: string[]): VariantGroup {
  return {
    id,
    name,
    required: true,
    type: "single",
    options: names.map((n, i) => option(slugOf(n), n, 0, { diet: "veg", isDefault: i === 0 })),
  };
}

function pickMany(id: string, name: string, hint: string, names: string[], max: number): AddonGroup {
  return {
    id,
    name,
    hint,
    required: false,
    type: "multi",
    max,
    options: names.map((n) => option(slugOf(n), n, 0, { diet: "veg" })),
  };
}

/* ------------------------------------------------------------------ */
/* Pizza builder                                                       */
/* ------------------------------------------------------------------ */

interface PizzaSpec {
  id: string;
  name: string;
  categoryId: string;
  prices: [number, number, number];
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
  const [regular, medium, large] = spec.prices;
  return {
    id: spec.id,
    slug: slugOf(spec.name),
    name: spec.name,
    description: spec.description,
    ingredients: spec.ingredients,
    images: [spec.image, spec.altImage],
    categoryId: spec.categoryId,
    basePrice: regular,
    diet: "veg",
    tags: spec.tags ?? [],
    variants: [sizes(regular, medium, large)],
    addons: [addOns],
    availability: "live",
    featured: spec.featured ?? false,
    bestseller: spec.bestseller ?? false,
    isNew: false,
    rating: spec.rating,
    ratingCount: spec.ratingCount,
    serves: "1-4 depending on size",
    prepTimeMins: 15,
  };
}

/* ------------------------------------------------------------------ */
/* Catalog                                                             */
/* ------------------------------------------------------------------ */

export const products: Product[] = [
  /* --------------------------- Classic Pizzas --------------------------- */
  pizza({
    id: "p-margherita",
    name: "Margherita (Cheese Burst)",
    categoryId: "cat-classic",
    prices: [69, 109, 169],
    image: media.pizza.margherita,
    altImage: media.pizza.classic,
    description: "Tomato sauce, a thick blanket of mozzarella and a cheese-burst crust.",
    ingredients: ["Fresh dough", "Tomato sauce", "Mozzarella", "Cheese-burst crust", "Oregano"],
    tags: ["bestseller", "value"],
    featured: true,
    bestseller: true,
    rating: 4.7,
    ratingCount: 512,
  }),
  pizza({
    id: "p-veggie-delight",
    name: "Veggie Delight",
    categoryId: "cat-classic",
    prices: [79, 129, 189],
    image: media.pizza.veggieDelight,
    altImage: media.pizza.tomatoBasil,
    description: "Capsicum, onion, tomato and sweet corn over mozzarella.",
    ingredients: ["Fresh dough", "Tomato sauce", "Mozzarella", "Capsicum", "Onion", "Tomato", "Sweet corn"],
    tags: ["value"],
    featured: true,
    rating: 4.6,
    ratingCount: 388,
  }),
  pizza({
    id: "p-farm-house",
    name: "Farm House",
    categoryId: "cat-classic",
    prices: [89, 149, 219],
    image: media.pizza.farmHouse,
    altImage: media.pizza.ovenFresh,
    description: "Mushroom, capsicum, onion and tomato — the garden on a base.",
    ingredients: ["Fresh dough", "Tomato sauce", "Mozzarella", "Mushroom", "Capsicum", "Onion", "Tomato"],
    tags: ["bestseller"],
    bestseller: true,
    rating: 4.6,
    ratingCount: 341,
  }),
  pizza({
    id: "p-paneer-tikka",
    name: "Paneer Tikka",
    categoryId: "cat-classic",
    prices: [89, 149, 219],
    image: media.pizza.paneerTikka,
    altImage: media.pizza.loadedVeg,
    description: "Tandoori-marinated paneer, onion and capsicum with a tikka drizzle.",
    ingredients: ["Fresh dough", "Tomato sauce", "Mozzarella", "Paneer tikka", "Onion", "Capsicum", "Tikka sauce"],
    tags: ["bestseller", "chefs-pick"],
    featured: true,
    bestseller: true,
    rating: 4.8,
    ratingCount: 467,
  }),
  pizza({
    id: "p-spicy-veg",
    name: "Spicy Veg",
    categoryId: "cat-classic",
    prices: [79, 129, 189],
    image: media.pizza.spicyVeg,
    altImage: media.pizza.veggieDelight,
    description: "Jalapeños, red paprika and onion with a chilli-flake finish.",
    ingredients: ["Fresh dough", "Spicy tomato sauce", "Mozzarella", "Jalapeños", "Red paprika", "Onion", "Chilli flakes"],
    tags: ["spicy"],
    rating: 4.5,
    ratingCount: 276,
  }),

  /* --------------------------- Premium Pizzas --------------------------- */
  pizza({
    id: "p-mexican-hot",
    name: "Mexican Hot",
    categoryId: "cat-premium",
    prices: [109, 179, 269],
    image: media.pizza.mexicanHot,
    altImage: media.pizza.spicyVeg,
    description: "Jalapeños, sweet corn, olives and capsicum on a peri-spiced sauce.",
    ingredients: ["Fresh dough", "Peri-spiced sauce", "Mozzarella", "Jalapeños", "Sweet corn", "Black olives", "Capsicum"],
    tags: ["spicy", "chefs-pick"],
    featured: true,
    rating: 4.6,
    ratingCount: 298,
  }),
  pizza({
    id: "p-loaded-veg",
    name: "Loaded Veg",
    categoryId: "cat-premium",
    prices: [99, 159, 239],
    image: media.pizza.loadedVeg,
    altImage: media.pizza.veggieDelight,
    description: "Everything on it — mushroom, corn, capsicum, onion, tomato and olives.",
    ingredients: ["Fresh dough", "Tomato sauce", "Mozzarella", "Mushroom", "Sweet corn", "Capsicum", "Onion", "Tomato", "Black olives"],
    tags: ["bestseller", "value"],
    bestseller: true,
    rating: 4.7,
    ratingCount: 354,
  }),
  pizza({
    id: "p-mushroom-supreme",
    name: "Mushroom Supreme",
    categoryId: "cat-premium",
    prices: [109, 179, 269],
    image: media.pizza.mushroomSupreme,
    altImage: media.pizza.farmHouse,
    description: "A double load of button mushrooms with garlic butter and herbs.",
    ingredients: ["Fresh dough", "Garlic-butter base", "Mozzarella", "Button mushrooms", "Mixed herbs"],
    tags: ["chefs-pick"],
    rating: 4.6,
    ratingCount: 221,
  }),

  /* -------------------------- Signature Pizzas -------------------------- */
  pizza({
    id: "p-peri-peri-paneer",
    name: "Peri Peri Paneer",
    categoryId: "cat-signature",
    prices: [109, 179, 269],
    image: media.pizza.periPeriPaneer,
    altImage: media.pizza.paneerTikka,
    description: "Peri peri paneer cubes, onion and capsicum. Genuinely hot.",
    ingredients: ["Fresh dough", "Peri peri sauce", "Mozzarella", "Peri peri paneer", "Onion", "Capsicum"],
    tags: ["spicy", "bestseller"],
    featured: true,
    bestseller: true,
    rating: 4.7,
    ratingCount: 302,
  }),
  pizza({
    id: "p-cheesy-blast",
    name: "Cheesy Blast",
    categoryId: "cat-signature",
    prices: [129, 209, 309],
    image: media.pizza.cheesyBlast,
    altImage: media.pizza.doubleCheese,
    description: "Extra cheese, extra happiness — a molten pull in every slice.",
    ingredients: ["Fresh dough", "Tomato sauce", "Mozzarella", "Cheddar", "Cheese-burst crust", "Capsicum", "Olives"],
    tags: ["signature", "bestseller"],
    featured: true,
    bestseller: true,
    rating: 4.9,
    ratingCount: 486,
  }),
  pizza({
    id: "p-double-cheese",
    name: "Double Cheese",
    categoryId: "cat-signature",
    prices: [139, 229, 339],
    image: media.pizza.doubleCheese,
    altImage: media.pizza.cheesyBlast,
    description: "Two cheeses, twice the amount, nothing in the way.",
    ingredients: ["Fresh dough", "Tomato sauce", "Double mozzarella", "Cheddar"],
    tags: ["chefs-pick"],
    rating: 4.8,
    ratingCount: 264,
  }),

  /* --------------------------- Magical Combos --------------------------- */
  {
    id: "c-classic-combo",
    slug: "classic-combo",
    name: "Classic Combo",
    description: "Any Classic Pizza + Drink.",
    longDescription: "Pick any classic pizza from the card and we add a chilled drink — priced below the two ordered apart.",
    ingredients: ["Any classic pizza", "Chilled drink"],
    images: [media.pizza.pizzeria, media.pizza.margherita],
    categoryId: "cat-combos",
    basePrice: 129,
    compareAtPrice: 179,
    diet: "veg",
    tags: ["value", "bestseller"],
    variants: [pickOne("pizza", "Choose your classic pizza", classicNames)],
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
    description: "Any Premium Pizza + Drink.",
    longDescription: "Any premium pizza with a chilled drink.",
    ingredients: ["Any premium pizza", "Chilled drink"],
    images: [media.pizza.veggieDelight, media.pizza.mexicanHot],
    categoryId: "cat-combos",
    basePrice: 169,
    compareAtPrice: 249,
    diet: "veg",
    tags: ["value"],
    variants: [pickOne("pizza", "Choose your premium pizza", premiumNames)],
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
    images: [media.pizza.classic, media.sides.fries],
    categoryId: "cat-combos",
    basePrice: 299,
    compareAtPrice: 449,
    diet: "veg",
    tags: ["value", "chefs-pick"],
    variants: [],
    addons: [pickMany("pizzas", "Pick your 2 medium pizzas", "Choose exactly two", allPizzaNames, 2), addOns],
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
    images: [media.pizza.tomatoBasil, media.sides.fries],
    categoryId: "cat-combos",
    basePrice: 459,
    compareAtPrice: 699,
    diet: "veg",
    tags: ["value"],
    variants: [],
    addons: [pickMany("pizzas", "Pick your 3 large pizzas", "Choose exactly three", allPizzaNames, 3), addOns],
    availability: "live",
    featured: false,
    bestseller: false,
    isNew: false,
    rating: 4.8,
    ratingCount: 96,
    serves: "4-6",
    prepTimeMins: 28,
  },

  /* ----------------------------- Choco Pizza ---------------------------- */
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
