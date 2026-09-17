"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SocialIcon } from "@/components/common/SocialIcon";
import { siteConfig } from "@/lib/config/site";
import { whatsappNumbers } from "@/lib/utils/whatsapp";

/** Never cover the payment button. */
const HIDDEN_ON = ["/checkout"];

/**
 * Floating WhatsApp button. Tapping it opens a small chooser listing both
 * lines, each a wa.me deep link with the brand greeting prefilled. Sits above
 * the mobile bottom bar and clear of the map/zoom controls on desktop.
 */
export function WhatsAppFab() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (HIDDEN_ON.some((route) => pathname.startsWith(route))) return null;

  return (
    <div
      ref={rootRef}
      className="fixed right-4 z-40 flex flex-col items-end gap-3 bottom-[calc(var(--mobilebar-h)+1rem)] lg:bottom-6 lg:right-6"
    >
      {open && (
        <div
          role="dialog"
          aria-label="Chat with us on WhatsApp"
          className="w-[17rem] overflow-hidden rounded-2xl border border-[#25d366]/40 bg-surface shadow-xl animate-fade-up"
        >
          <div className="flex items-center gap-2.5 bg-[#075e54] px-4 py-3 text-white">
            <span className="flex size-8 items-center justify-center rounded-full bg-white/15">
              <SocialIcon name="Whatsapp" width={18} height={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight">{siteConfig.name}</p>
              <p className="text-[11px] text-white/75">Usually replies quickly</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="flex size-7 items-center justify-center rounded-full hover:bg-white/15">
              <X className="size-4" />
            </button>
          </div>
          <div className="p-3">
            <p className="px-1 text-xs font-semibold text-muted">Message us on either number</p>
            <ul className="mt-2 space-y-2">
              {whatsappNumbers.map((line) => (
                <li key={line.raw}>
                  <a
                    href={line.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 rounded-xl bg-[#25d366] px-3.5 py-2.5 text-sm font-bold text-[#062b16] transition-colors hover:bg-[#3ee27d]"
                  >
                    <span className="flex items-center gap-2">
                      <SocialIcon name="Whatsapp" width={16} height={16} />
                      {line.display}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide opacity-70">Chat</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-2.5 px-1 text-[11px] text-muted">{siteConfig.contact.hours}</p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close WhatsApp options" : "Chat on WhatsApp"}
        className="group relative flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25d366]/40"
      >
        <span className="absolute inset-0 rounded-full bg-[#25d366]/50 motion-safe:animate-ping [animation-duration:2.4s]" aria-hidden />
        <span className="relative">{open ? <X className="size-6" strokeWidth={2.5} /> : <SocialIcon name="Whatsapp" width={28} height={28} strokeWidth={2} />}</span>
      </button>
    </div>
  );
}
