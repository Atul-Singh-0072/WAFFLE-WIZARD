"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useIsDesktop } from "@/hooks/use-media-query";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils/cn";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  /** Right on desktop, bottom sheet on mobile by default. */
  side?: "right" | "bottom" | "responsive";
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  labelledBy?: string;
}

const spring = { type: "spring", stiffness: 380, damping: 38, mass: 0.9 } as const;

export function Drawer({ open, onClose, title, side = "responsive", children, footer, className }: DrawerProps) {
  const mounted = useMounted();
  const isDesktop = useIsDesktop();
  const panelRef = useRef<HTMLDivElement>(null);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const isBottom = side === "bottom";
  const isRight = side === "right";
  const fromRight = isRight || (side === "responsive" && isDesktop);

  const panelClass = cn(
    "fixed z-[70] flex flex-col bg-surface shadow-xl outline-none",
    isRight && "inset-y-0 right-0 w-full max-w-md",
    isBottom && "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-2xl",
    side === "responsive" &&
      "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-2xl lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:max-h-none lg:w-full lg:max-w-md lg:rounded-none",
    className,
  );

  const hidden = fromRight ? { x: "100%", y: 0 } : { x: 0, y: "100%" };
  const shown = { x: 0, y: 0 };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-[65] bg-ink/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === "string" ? title : undefined}
            tabIndex={-1}
            className={panelClass}
            initial={hidden}
            animate={shown}
            exit={hidden}
            transition={spring}
          >
            {side !== "right" && (
              <div className="mx-auto mt-2.5 h-1.5 w-11 shrink-0 rounded-full bg-border lg:hidden" aria-hidden />
            )}
            <div className="flex shrink-0 items-center justify-between gap-4 px-5 pb-3 pt-4 lg:pt-5">
              <div className="min-w-0 text-lg font-display font-bold text-text">{title}</div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-text-soft transition-colors hover:bg-surface-3 hover:text-text"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5">{children}</div>
            {footer && (
              <div className="shrink-0 border-t border-border bg-surface px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
