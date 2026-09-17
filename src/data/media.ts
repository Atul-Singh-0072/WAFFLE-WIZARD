/**
 * Image registry.
 *
 * Brand-owned artwork is cropped from the official menu poster / PDF into
 * /public. Everything under `stock()` is licensed vegetarian-only stock
 * photography standing in for the brand's own pizza shoot — every ID was
 * visually audited (no meat, no egg, no third-party branding). Replace values
 * here and the whole site updates.
 */

const SOURCE = "https://images.unsplash.com/photo-";

function stock(id: string, width = 1400): string {
  return `${SOURCE}${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const media = {
  /** From the poster: hero pizza with the "Freshly Baked Always" badge, feathered edges. */
  poster: {
    heroPizza: "/menu/poster-hero-pizza-2.png",
    chocoPizza: "/menu/choco-pizza.jpg",
    cheeseSlice: "/menu/cheese-slice.jpg",
  },

  pizza: {
    margherita: stock("1604068549290-dea0e4a305ca"),
    veggieDelight: stock("1552539618-7eec9b4d1796"),
    farmHouse: stock("1528137871618-79d2761e3fd5"),
    paneerTikka: stock("1589187151053-5ec8818e661b"),
    spicyVeg: stock("1576458088443-04a19bb13da6"),
    mexicanHot: stock("1590947132387-155cc02f3212"),
    loadedVeg: stock("1513104890138-7c749659a591", 1800),
    mushroomSupreme: stock("1555072956-7758afb20e8f"),
    periPeriPaneer: stock("1595854341625-f33ee10dbf94"),
    cheesyBlast: stock("1520201163981-8cc95007dd2a", 1800),
    doubleCheese: stock("1548369937-47519962c11a"),
    ovenFresh: stock("1579751626657-72bc17010498"),
    pizzeria: stock("1573821663912-6df460f9c684"),
    tomatoBasil: stock("1598023696416-0193a0bcd302"),
    classic: stock("1574071318508-1cdbab80d002"),
  },

  sides: {
    fries: stock("1573080496219-bb080dd4f877"),
  },

  /** Brand's own waffle photography (menu PDF page 2) — used only on "coming soon" surfaces. */
  waffles: {
    classic: "/menu/waffle-classic.jpg",
    premium: "/menu/waffle-premium.jpg",
  },
} as const;

/** Tiny blurred placeholder so cards never flash empty while loading. */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiMxNzExMWQiLz48L3N2Zz4=";
