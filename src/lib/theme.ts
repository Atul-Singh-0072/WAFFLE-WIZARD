/**
 * Theme switching.
 *
 * Dark is the brand default and lives in `:root`, so the site renders dark with
 * no attribute at all. Choosing light stamps `data-theme="light"` on <html>;
 * THEME_BOOT re-applies that choice from the streamed HTML, before first paint,
 * so a returning light-mode visitor never sees a flash of dark.
 */

export const THEME_KEY = "ww:theme";
export const THEME_ATTR = "data-theme";

export type Theme = "dark" | "light";

/** Browser-chrome colour (address bar, form controls) per theme. */
const THEME_COLOR: Record<Theme, string> = { dark: "#0d0810", light: "#fffaf0" };

export const THEME_BOOT =
  `try{if(localStorage.getItem("${THEME_KEY}")==="light"){` +
  `document.documentElement.setAttribute("${THEME_ATTR}","light")}}catch(e){}`;

/* ------------------------------------------------------------------ */
/* External store, so components read the theme without an effect.     */
/* ------------------------------------------------------------------ */

let snapshot: Theme | null = null;
const listeners = new Set<() => void>();

export function getTheme(): Theme {
  if (snapshot === null) {
    snapshot = document.documentElement.getAttribute(THEME_ATTR) === "light" ? "light" : "dark";
  }
  return snapshot;
}

/** The server always renders the dark default. */
export function getServerTheme(): Theme {
  return "dark";
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setTheme(theme: Theme) {
  snapshot = theme;

  const root = document.documentElement;
  if (theme === "light") root.setAttribute(THEME_ATTR, "light");
  else root.removeAttribute(THEME_ATTR);

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Private mode: the choice simply lasts for this page view.
  }

  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  listeners.forEach((listener) => listener());
}
