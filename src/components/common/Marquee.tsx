import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface MarqueeProps {
  items: string[];
  tone?: "light" | "dark" | "gold";
  className?: string;
}

/** Slow ticker strip. Duplicated once so the loop is seamless. */
export function Marquee({ items, tone = "gold", className }: MarqueeProps) {
  const row = [...items, ...items];

  return (
    <div
      className={cn(
        "relative overflow-hidden border-y",
        tone === "gold" && "border-secondary-500/40 bg-secondary text-ink",
        tone === "dark" && "on-dark border-white/10 bg-ink text-white",
        tone === "light" && "border-border bg-surface text-text",
        className,
      )}
      aria-hidden
    >
      <div className="flex w-max motion-safe:animate-marquee motion-reduce:flex-wrap">
        {row.map((item, index) => (
          <span key={index} className="flex items-center gap-4 whitespace-nowrap px-4 py-3 font-display text-sm font-bold uppercase tracking-[0.14em] md:text-[15px]">
            {item}
            <Sparkles className="size-3.5 opacity-60" />
          </span>
        ))}
      </div>
    </div>
  );
}
