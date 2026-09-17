import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  /** Right-aligned slot for a "View all" link or filter control. */
  action?: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  action,
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        {eyebrow && (
          <p className={cn("eyebrow mb-3", dark ? "text-secondary" : "text-accent")}>{eyebrow}</p>
        )}
        <Tag className={cn("display-lg", dark ? "text-white" : "text-text")}>{title}</Tag>
        {description && (
          <p className={cn("mt-4 text-base leading-relaxed md:text-lg", dark ? "text-white/70" : "text-muted")}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
