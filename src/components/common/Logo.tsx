import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * Official artwork lives in /public/brand (exported from the brand PDF with
 * the outer background knocked out). Intrinsic sizes below match those files
 * so next/image can reserve layout space and avoid shift.
 */
const MARK = { src: "/brand/logo-mark.png", width: 1170, height: 800 };
/** Official lockup from the brand PDF (character + wordmark), background knocked out. */
// Bump the filename (not a query string — Next forbids those on local images) whenever the artwork is retouched.
const FULL = { src: "/brand/logo-lockup-v3.png", width: 1179, height: 1400 };

type LogoVariant = "lockup" | "full" | "mark";

interface LogoProps {
  /** `dark` for use on ink backgrounds (affects the text wordmark only). */
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  /** lockup = character mark + text wordmark; full = complete artwork; mark = character only. */
  variant?: LogoVariant;
  asLink?: boolean;
  /** Preload — set on the header instance so the mark never pops in late. */
  priority?: boolean;
  /** Float + sparkle animation on the character mark. */
  animated?: boolean;
  className?: string;
}

/**
 * Responsive heights: the mark scales up from phone to desktop. Below `md`
 * the wordmark stacks on two lines so the header row never overflows a
 * 360-390px phone with hamburger, location and cart controls beside it.
 */
const lockupSizes = {
  sm: { mark: "h-11", text: "text-[16px] md:text-[20px]" },
  md: { mark: "h-[52px] lg:h-[60px]", text: "text-[17px] md:text-[21px] lg:text-[25px]" },
  lg: { mark: "h-16 lg:h-[72px]", text: "text-[20px] md:text-[26px] lg:text-[30px]" },
};

const fullHeights = {
  sm: "h-28",
  md: "h-40 md:h-[200px]",
  lg: "h-56 md:h-[260px]",
};

export function Logo({
  tone = "light",
  size = "md",
  variant = "lockup",
  asLink = true,
  priority = false,
  animated = true,
  className,
}: LogoProps) {
  const dark = tone === "dark";

  let content: React.ReactNode;

  if (variant === "full") {
    content = (
      <Image
        src={FULL.src}
        alt={`${siteConfig.name} logo`}
        width={FULL.width}
        height={FULL.height}
        priority={priority}
        sizes="(min-width: 768px) 220px, 160px"
        className={cn("w-auto select-none", fullHeights[size], className)}
      />
    );
  } else {
    const s = lockupSizes[size];
    content = (
      <span className={cn("logo-lockup select-none gap-2.5", className)}>
        <LogoMark heightClass={s.mark} priority={priority} animated={animated} />
        {variant === "lockup" && (
          <span
            className={cn(
              "logo-wordmark font-display font-extrabold leading-none tracking-[-0.035em]",
              s.text,
              dark ? "text-white" : "text-primary-900",
            )}
          >
            <span className="text-secondary">Waffle</span>
            <span className="text-white">Wizard</span>
          </span>
        )}
      </span>
    );
  }

  if (!asLink) return content;

  return (
    <Link href="/" aria-label={`${siteConfig.name} — home`} className="inline-flex shrink-0 rounded-md">
      {content}
    </Link>
  );
}

interface LogoMarkProps {
  /** Tailwind height class(es); width follows the intrinsic ratio. */
  heightClass?: string;
  /** Rendered widths for srcset selection; pass real values when the box differs from the header's. */
  sizes?: string;
  priority?: boolean;
  animated?: boolean;
  className?: string;
}

/** The character mark on its own. */
export function LogoMark({
  heightClass = "h-[60px]",
  sizes = "(min-width: 1024px) 110px, 80px",
  priority = false,
  animated = true,
  className,
}: LogoMarkProps) {
  return (
    <span className={cn("logo-mark-wrap", heightClass, className)}>
      <Image
        src={MARK.src}
        alt=""
        aria-hidden
        width={MARK.width}
        height={MARK.height}
        priority={priority}
        sizes={sizes}
        className={cn("h-full w-auto select-none", animated && "logo-mark")}
      />
      {animated && (
        <span className="logo-sparkles" aria-hidden>
          <i />
          <i />
          <i />
        </span>
      )}
    </span>
  );
}
