/**
 * Image registry.
 *
 * Brand-owned artwork is cropped from the official poster / PDF into /public.
 * Everything under `stock()` is licensed stock photography standing in for the
 * brand's own shoot. Every id below was eyeballed on a contact sheet before use
 * — HTTP 200 is not enough. Rejected in review: meat toppings, Coca-Cola
 * bottles in frame, and images that turned out to be donuts or apple pie.
 *
 * Replace these with real photographs of the outlet's own pizzas when available.
 */

const SOURCE = "https://images.unsplash.com/photo-";

function stock(id: string, width = 1400): string {
  return `${SOURCE}${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const media = {
  /** From the poster: hero pizza with the "Freshly Baked Always" badge. */
  poster: {
    // Rename (never re-save in place) when the artwork changes — next/image
    // caches optimized output by URL and would keep serving the old version.
    heroPizza: "/menu/hero-pizza-v4.webp",
    chocoPizza: "/menu/choco-pizza.jpg",
    cheeseSlice: "/menu/cheese-slice.jpg",
  },

  /** All vegetarian — no meat, no egg, no third-party branding in frame. */
  pizza: {
    margherita: stock("1604068549290-dea0e4a305ca"),
    loadedVeggie: stock("1552539618-7eec9b4d1796"),
    arugulaThin: stock("1528137871618-79d2761e3fd5"),
    pepperMargherita: stock("1589187151053-5ec8818e661b"),
    tomatoPepper: stock("1576458088443-04a19bb13da6"),
    mushroomTomato: stock("1590947132387-155cc02f3212"),
    cheeseSlices: stock("1513104890138-7c749659a591", 1800),
    whiteMushroom: stock("1555072956-7758afb20e8f"),
    basilClassic: stock("1595854341625-f33ee10dbf94"),
    cheesePull: stock("1520201163981-8cc95007dd2a", 1800),
    plainCheese: stock("1548369937-47519962c11a"),
    ovenFresh: stock("1579751626657-72bc17010498"),
    gardenVeg: stock("1573821663912-6df460f9c684"),
    basilStone: stock("1574071318508-1cdbab80d002"),
    arugulaRicotta: stock("1593560708920-61dd98c46a4e"),
    onionWhite: stock("1511689660979-10d2b1aada49"),
  },

  /** Vegetarian burgers — every meat-patty candidate was rejected. */
  burger: {
    garden: stock("1520072959219-c595dc870360"),
    crispy: stock("1551782450-a2132b4ba21d"),
    stacked: stock("1512152272829-e3139592d56f"),
  },

  sides: {
    fries: stock("1573080496219-bb080dd4f877"),
  },

  /** Brand's own waffle photography — used only on "coming soon" surfaces. */
  waffles: {
    classic: "/menu/waffle-classic.jpg",
    premium: "/menu/waffle-premium.jpg",
  },
} as const;

/** Tiny blurred placeholder so cards never flash empty while loading. */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiMxNzExMWQiLz48L3N2Zz4=";
