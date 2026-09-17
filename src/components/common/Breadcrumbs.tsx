import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, tone = "light", className }: { items: Crumb[]; tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={cn("flex flex-wrap items-center gap-1 text-xs font-semibold", dark ? "text-white/60" : "text-muted")}>
        <li>
          <Link href="/" className={cn("hover:underline", dark ? "hover:text-white" : "hover:text-primary-800")}>
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1">
              <ChevronRight className="size-3.5 opacity-60" aria-hidden />
              {item.href && !last ? (
                <Link href={item.href} className={cn("hover:underline", dark ? "hover:text-white" : "hover:text-primary-800")}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && (dark ? "text-white" : "text-text"))}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
