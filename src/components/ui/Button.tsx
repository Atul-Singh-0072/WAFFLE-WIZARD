import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "gold" | "outline" | "ghost" | "dark" | "light";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children?: ReactNode;
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { href?: undefined };

type ButtonAsLink = BaseProps & {
  href: string;
  target?: string;
  rel?: string;
  prefetch?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[transform,box-shadow,background-color,color,border-color] duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary-300/70 motion-safe:hover:-translate-y-px";

const variants: Record<ButtonVariant, string> = {
  // Poster CTA: yellow pill with near-black text.
  primary:
    "bg-secondary text-[#1a1024] shadow-gold hover:bg-secondary-300 hover:shadow-[0_16px_34px_-10px_rgba(255,207,31,0.6)]",
  secondary: "bg-primary text-white shadow-md hover:bg-primary-400",
  gold: "bg-secondary text-[#1a1024] shadow-gold hover:bg-secondary-300",
  outline:
    "border-[1.5px] border-secondary/50 bg-surface/60 text-text hover:border-secondary hover:bg-surface",
  ghost: "bg-transparent text-primary-800 hover:bg-primary-50",
  dark: "bg-ink text-white hover:bg-ink-2 shadow-md border border-border",
  light: "bg-white text-[#1a1024] shadow-md hover:bg-panel",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
  xl: "h-14 px-8 text-base",
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    fullWidth,
    loading,
    iconLeft,
    iconRight,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);

  const content = (
    <>
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        iconLeft && <span className="-ml-0.5 inline-flex shrink-0">{iconLeft}</span>
      )}
      <span>{children}</span>
      {iconRight && (
        <span className="-mr-0.5 inline-flex shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5">
          {iconRight}
        </span>
      )}
    </>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {content}
      </Link>
    );
  }

  const { type = "button", disabled, ...buttonRest } = rest as ButtonAsButton;
  return (
    <button type={type} className={classes} disabled={disabled || loading} {...buttonRest}>
      {content}
    </button>
  );
}
