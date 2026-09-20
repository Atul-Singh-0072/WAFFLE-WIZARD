"use client";

import { Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/common/Logo";
import { LocationPill } from "@/components/layout/LocationPill";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { useMounted } from "@/hooks/use-mounted";
import { useScrolled } from "@/hooks/use-scrolled";
import { primaryNav } from "@/lib/config/nav";
import { cn } from "@/lib/utils/cn";
import { useCart } from "@/store/cart-store";

export function Header() {
  const pathname = usePathname();
  const scrolled = useScrolled(12);
  const [menuOpen, setMenuOpen] = useState(false);
  const cart = useCart();
  const mounted = useMounted();

  const count = mounted ? cart.count : 0;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "sticky top-0 z-50 h-[var(--header-h)] transition-[background-color,box-shadow,border-color] duration-300",
          scrolled
            ? "border-b border-border/80 bg-background/85 shadow-[0_6px_24px_-12px_rgba(38,14,74,0.18)] backdrop-blur-xl"
            : "border-b border-transparent bg-background/0",
        )}
      >
        <div className="container-page flex h-full items-center gap-2 min-[360px]:gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-text transition-colors hover:bg-primary-50 lg:hidden"
          >
            <Menu className="size-6" />
          </button>

          <Logo size="md" priority />

          <nav aria-label="Primary" className="ml-6 hidden lg:block">
            <ul className="flex items-center gap-1">
              {primaryNav
                .filter((item) => item.href !== "/")
                .map((item) => {
                  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative inline-flex h-10 items-center rounded-full px-3.5 text-[14.5px] font-semibold transition-colors",
                          active ? "text-primary-800" : "text-text-soft hover:text-primary-800",
                        )}
                      >
                        {item.label}
                        <span
                          className={cn(
                            "absolute inset-x-3.5 -bottom-0.5 h-[3px] rounded-full bg-secondary transition-transform duration-300 origin-left",
                            active ? "scale-x-100" : "scale-x-0",
                          )}
                          aria-hidden
                        />
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <LocationPill />

            {/* Below sm the drawer carries it — three 44px buttons overflow a 360px header. */}
            <ThemeToggle className="hidden sm:flex" />

            <button
              type="button"
              onClick={cart.open}
              aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
              className="relative flex size-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-border bg-surface text-text transition-colors hover:border-primary-300 hover:bg-primary-50"
            >
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span
                  key={cart.lastAddedAt}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-white motion-safe:animate-pop tabular"
                >
                  {count}
                </span>
              )}
            </button>

            <Button href="/menu" size="md" className="hidden sm:inline-flex">
              Order now
            </Button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
