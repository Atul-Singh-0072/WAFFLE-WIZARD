import { Bike, Check, ChefHat, Flame, PackageCheck, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatDateTime } from "@/lib/utils/format";
import type { OrderStatus, OrderTimelineEntry } from "@/types";

const icons: Record<OrderStatus, typeof Check> = {
  placed: ShoppingBag,
  preparing: ChefHat,
  baking: Flame,
  "out-for-delivery": Bike,
  "ready-for-pickup": PackageCheck,
  delivered: Check,
  cancelled: Check,
};

interface OrderProgressProps {
  timeline: OrderTimelineEntry[];
  current: OrderStatus;
}

export function OrderProgress({ timeline, current }: OrderProgressProps) {
  const currentIndex = Math.max(
    timeline.findIndex((entry) => entry.status === current),
    0,
  );
  const percent = timeline.length > 1 ? (currentIndex / (timeline.length - 1)) * 100 : 0;

  return (
    <div>
      {/* Horizontal track on desktop */}
      <div className="relative hidden md:block">
        <div className="absolute left-6 right-6 top-6 h-1 rounded-full bg-border" aria-hidden />
        <div className="absolute left-6 top-6 h-1 rounded-full bg-primary transition-[width] duration-700" style={{ width: `calc((100% - 3rem) * ${percent / 100})` }} aria-hidden />
        <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${timeline.length}, minmax(0, 1fr))` }}>
          {timeline.map((entry, index) => {
            const Icon = icons[entry.status];
            const done = index < currentIndex;
            const active = index === currentIndex;
            return (
              <li key={entry.status} className={cn("flex flex-col items-center text-center", index === 0 && "items-start text-left", index === timeline.length - 1 && "items-end text-right")}>
                <span
                  className={cn(
                    "flex size-12 items-center justify-center rounded-full border-2 bg-surface transition-colors",
                    done && "border-primary bg-primary text-white",
                    active && "border-primary text-primary ring-6 ring-primary-100",
                    !done && !active && "border-border text-muted",
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? <Check className="size-5" strokeWidth={3} /> : <Icon className={cn("size-5", active && "motion-safe:animate-pulse")} />}
                </span>
                <span className={cn("mt-3 text-sm font-bold", active ? "text-text" : done ? "text-primary-800" : "text-muted")}>{entry.label}</span>
                <span className="mt-0.5 text-xs text-muted">{entry.at && (done || active) ? formatDateTime(entry.at) : "—"}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Vertical list on mobile */}
      <ol className="relative space-y-1 border-l-2 border-border pl-8 md:hidden">
        {timeline.map((entry, index) => {
          const Icon = icons[entry.status];
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li key={entry.status} className="relative py-3">
              <span
                className={cn(
                  "absolute -left-[2.55rem] top-2.5 flex size-10 items-center justify-center rounded-full border-2 bg-surface",
                  done && "border-primary bg-primary text-white",
                  active && "border-primary text-primary ring-4 ring-primary-100",
                  !done && !active && "border-border text-muted",
                )}
              >
                {done ? <Check className="size-4" strokeWidth={3} /> : <Icon className="size-4" />}
              </span>
              <p className={cn("text-sm font-bold", active ? "text-text" : done ? "text-primary-800" : "text-muted")}>{entry.label}</p>
              <p className="text-xs text-muted">{active || done ? entry.description : "Pending"}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
