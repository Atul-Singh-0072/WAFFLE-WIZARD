/**
 * Shared constants for the brand intro. Kept in a plain module (no "use client")
 * so the server layout can inline the boot script without pulling a client
 * reference, and so Fast Refresh can hot-swap BrandIntro without a full reload.
 */

export const INTRO_SESSION_KEY = "ww:intro";
export const INTRO_ATTR = "data-intro";
/** Dedicated small WebP so the preload URL is exact and the file is light. */
export const INTRO_IMAGE = "/brand/logo-intro-ww.webp";
export const INTRO_HOLD_MS = 1700;
export const INTRO_LEAVE_MS = 420;
/**
 * If hydration never happens (JS error, blocked script), the boot script clears
 * the overlay itself. Generous on purpose: a slow phone on 3G can take several
 * seconds to hydrate and the splash should still play for it.
 */
export const INTRO_FAILSAFE_MS = 10000;
/** Window property holding the failsafe timer id, so React can cancel it. */
export const INTRO_FAILSAFE_GLOBAL = "__wwIntroFailsafe";

/**
 * Inline boot script, streamed at the top of <body> inside a hidden div (see
 * layout.tsx): decides before first paint whether the splash should show, starts
 * the logo download immediately, and arms a failsafe. Keep it tiny.
 */
export const BRAND_INTRO_BOOT =
  `try{if(!sessionStorage.getItem("${INTRO_SESSION_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){` +
  `var d=document.documentElement;d.setAttribute("${INTRO_ATTR}","1");` +
  `var l=document.createElement("link");l.rel="preload";l.as="image";l.href="${INTRO_IMAGE}";document.head.appendChild(l);` +
  // React clears this timer once it owns the overlay, so a slow-but-successful hydration is never cut short.
  `window.${INTRO_FAILSAFE_GLOBAL}=setTimeout(function(){d.removeAttribute("${INTRO_ATTR}")},${INTRO_FAILSAFE_MS})}}catch(e){}`;
