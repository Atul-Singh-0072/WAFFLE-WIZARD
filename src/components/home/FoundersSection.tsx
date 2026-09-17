"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Maximize2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { foundersCard } from "@/data/content";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { siteConfig } from "@/lib/config/site";

/** "Shivam Srivastava & Ram Lakhan Verma" with a gold ampersand. */
function FounderNames({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      {foundersCard.names.map((name, index) => (
        <span key={name}>
          {index > 0 && <span className="mx-[0.3em] text-secondary">&amp;</span>}
          {name}
        </span>
      ))}
    </span>
  );
}

/**
 * "About the founders": a single feature card — the founders' photograph on
 * one side, both names beside it — and a modal that shows the photo larger.
 * The photograph is used as supplied; no cropping or retouching.
 */
export function FoundersSection() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const alt = `${foundersCard.names.join(" and ")}, ${foundersCard.role} of ${siteConfig.name}`;

  const show = (trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  };

  return (
    <section className="section-y relative overflow-hidden bg-surface" aria-labelledby="founders-heading">
      <div className="bg-starfield pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="container-page relative">
        <Reveal>
          <SectionHeading
            eyebrow="About the founders"
            title={<span id="founders-heading">The people behind the Wizard</span>}
            description={`${siteConfig.name} is built and run by its two founders in ${siteConfig.headOffice.line1}, ${siteConfig.headOffice.city}.`}
          />
        </Reveal>

        <Reveal>
          <article className="founder-card mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-ink md:grid-cols-12">
            {/* Photo — click to enlarge */}
            <button
              type="button"
              onClick={(event) => show(event.currentTarget)}
              aria-haspopup="dialog"
              aria-label="View the founders' photo larger"
              className="group relative block aspect-[4/5] w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-secondary/60 sm:aspect-[3/4] md:col-span-6 md:aspect-auto md:min-h-[30rem]"
            >
              <Image
                src={foundersCard.photo}
                alt={alt}
                fill
                sizes="(min-width: 768px) 520px, 100vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-gradient-to-r from-transparent to-ink/0 md:to-ink/30" aria-hidden />
              <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold text-white/90 backdrop-blur transition-colors group-hover:bg-secondary group-hover:text-[#1a1024]">
                <Maximize2 className="size-3.5" /> View photo
              </span>
            </button>

            {/* Names beside the photo */}
            <div className="flex flex-col justify-center p-6 md:col-span-6 md:p-10 lg:p-14">
              <p className="eyebrow text-secondary">Founders</p>
              <h3 className="mt-3 font-display text-3xl font-extrabold leading-[1.08] text-white md:text-4xl lg:text-[2.6rem]">
                <FounderNames />
              </h3>
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-white/70">
                {foundersCard.role} · {siteConfig.name}
              </p>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
                The two founders behind {siteConfig.name} — the 100% vegetarian pizza brand founded in {siteConfig.foundedYear}, baking fresh every day in{" "}
                {siteConfig.headOffice.line1}.
              </p>
              <p className="mt-5 flex items-center gap-2 text-sm text-white/80">
                <MapPin className="size-4 text-secondary" />
                {siteConfig.headOffice.line1}, {siteConfig.headOffice.city}, {siteConfig.headOffice.state}
              </p>
            </div>
          </article>
        </Reveal>
      </div>

      <FoundersModal open={open} onClose={close} alt={alt} />
    </section>
  );
}

function FoundersModal({ open, onClose, alt }: { open: boolean; onClose: () => void; alt: string }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="founders-modal"
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="founders-modal-title"
            className="gold-border relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto overflow-x-hidden rounded-t-3xl bg-surface shadow-xl sm:rounded-3xl md:grid-cols-12 md:overflow-hidden"
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97, transition: { duration: 0.22, ease: "easeIn" } }}
            transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.9 }}
          >
            <div className="relative aspect-[3/4] shrink-0 bg-ink md:col-span-7 md:aspect-auto md:h-[36rem]">
              <Image src={foundersCard.photo} alt={alt} fill priority sizes="(min-width: 768px) 700px, 100vw" className="object-cover object-top" />
            </div>

            <div className="flex flex-col justify-center p-6 md:col-span-5 md:p-10">
              <p className="eyebrow text-secondary">Founders</p>
              <h3 id="founders-modal-title" className="mt-2 font-display text-3xl font-extrabold leading-tight text-text md:text-[2.2rem]">
                <FounderNames />
              </h3>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                {foundersCard.role} · {siteConfig.name}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                The 100% vegetarian pizza brand founded in {siteConfig.foundedYear}.
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm text-text-soft">
                <MapPin className="size-4 text-secondary" />
                {siteConfig.headOffice.line1}, {siteConfig.headOffice.city}
              </p>
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-secondary hover:text-[#1a1024] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/60"
            >
              <X className="size-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
