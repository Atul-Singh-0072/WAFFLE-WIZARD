"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface RailProps {
  children: ReactNode;
  className?: string;
  /** Extra classes on the scrolling track, e.g. gap-4. */
  trackClassName?: string;
  label: string;
}

/**
 * Horizontal snap-scroll track. Touch users swipe; pointer users get arrows
 * that appear only when there is somewhere to scroll.
 */
export function Rail({ children, className, trackClassName, label }: RailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setCanPrev(track.scrollLeft > 4);
      setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
    };
    track.addEventListener("scroll", update, { passive: true });
    // ResizeObserver fires once on observe, which seeds the initial arrow state.
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * Math.round(track.clientWidth * 0.85), behavior: "smooth" });
  };

  const arrow =
    "hidden lg:flex absolute top-1/2 z-10 size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-md transition-[opacity,transform] hover:bg-primary-50 hover:text-primary-800 disabled:pointer-events-none disabled:opacity-0";

  return (
    <div className={cn("relative", className)}>
      <button type="button" aria-label={`Scroll ${label} left`} onClick={() => scrollBy(-1)} disabled={!canPrev} className={cn(arrow, "-left-5")}>
        <ChevronLeft className="size-5" />
      </button>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={cn(
          "no-scrollbar bleed-rail flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pt-1",
          trackClassName,
        )}
      >
        {children}
      </div>
      <button type="button" aria-label={`Scroll ${label} right`} onClick={() => scrollBy(1)} disabled={!canNext} className={cn(arrow, "-right-5")}>
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
