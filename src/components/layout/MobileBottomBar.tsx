"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMounted } from "@/hooks/use-mounted";
import { mobileBottomNav } from "@/lib/config/nav";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import { getIcon } from "@/lib/utils/icons";
import { useCart } from "@/store/cart-store";

/** Routes where the bar would cover a primary action and must stay hidden. */
const HIDDEN_ON = ["/checkout", "/cart"];

export function MobileBottomBar() {
  const pathname = usePathname();
  const cart = useCart();
  const mounted = useMounted();

  if (HIDDEN_ON.some((route) => pathname.startsWith(route))) return null;

  const hasItems = mounted && cart.count > 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden" aria-label="Quick navigation">
      <AnimatePresence>
        {hasItems && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="px-3 pb-2"
          >
            <button
              type="button"
              onClick={cart.open}
              className="flex h-14 w-full items-center justify-between rounded-2xl bg-secondary pl-4 pr-3 text-[#1a1024] shadow-gold active:scale-[0.98]"
            >
              <span className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-[#1a1024]/15 text-sm font-bold tabular">
                  {cart.count}
                </span>
                <span className="text-left leading-tight">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#1a1024]/70">
                    {cart.count === 1 ? "1 item" : `${cart.count} items`}
                  </span>
                  <span className="block font-display text-base font-bold tabular">{formatPrice(cart.subtotal)}</span>
                </span>
              </span>
              <span className="on-dark inline-flex items-center gap-1.5 rounded-full bg-[#1a1024] px-4 py-2 text-sm font-bold text-secondary">
                View cart <ArrowRight className="size-4" />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="border-t border-border/80 bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <ul className="flex h-[var(--mobilebar-h)] items-stretch">
          {mobileBottomNav.map((item) => {
            const Icon = getIcon(item.icon);
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors",
                    active ? "text-primary-800" : "text-muted",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                      active && "bg-primary-50",
                    )}
                  >
                    <Icon className="size-[22px]" strokeWidth={active ? 2.4 : 2} />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="flex-1">
            <button
              type="button"
              onClick={cart.open}
              className="flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold text-muted"
              aria-label="Open cart"
            >
              <span className="relative flex h-7 w-12 items-center justify-center">
                <ShoppingBag className="size-[22px]" />
                {hasItems && (
                  <span className="absolute right-1.5 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white tabular">
                    {cart.count}
                  </span>
                )}
              </span>
              Cart
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
