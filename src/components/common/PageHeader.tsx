import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/common/Breadcrumbs";
import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  /** Right-hand slot for a search box or CTA. */
  aside?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}

/** Consistent inner-page opener so every route feels like one product. */
export function PageHeader({ eyebrow, title, description, crumbs, aside, tone = "light", className }: PageHeaderProps) {
  const dark = tone === "dark";

  return (
    <header
      className={cn(
        "relative overflow-hidden",
        dark ? "on-dark bg-ink text-white" : "bg-surface",
        className,
      )}
    >
      {dark && <div className="bg-starfield pointer-events-none absolute inset-0" aria-hidden />}
      <div className="container-page relative flex flex-col gap-6 pb-10 pt-6 md:pb-14 md:pt-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {crumbs && <Breadcrumbs items={crumbs} tone={tone} className="mb-5" />}
          {eyebrow && <p className={cn("eyebrow mb-3", dark ? "text-secondary" : "text-accent")}>{eyebrow}</p>}
          <h1 className={cn("display-lg", dark ? "text-white" : "text-text")}>{title}</h1>
          {description && (
            <p className={cn("mt-4 text-base leading-relaxed md:text-lg", dark ? "text-white/70" : "text-muted")}>{description}</p>
          )}
        </div>
        {aside && <div className="shrink-0 lg:w-[26rem]">{aside}</div>}
      </div>
    </header>
  );
}
