import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { name: string };

/** Brand glyphs lucide no longer ships. Currentcolor so they inherit text color. */
export function SocialIcon({ name, ...props }: Props) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };

  switch (name) {
    case "Instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="3.6" />
          <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "Facebook":
      return (
        <svg {...common}>
          <path d="M14.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.5-1.5h1.4V5c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H9v3h2.7v7" />
        </svg>
      );
    case "Youtube":
      return (
        <svg {...common}>
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8Z" />
          <path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "Whatsapp":
      return (
        <svg {...common}>
          <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.5-4.3A8.5 8.5 0 1 1 20.5 11.7Z" />
          <path
            d="M9.3 8.4c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2.1.4 0 .5l-.5.7c-.1.2-.2.3 0 .5a6.5 6.5 0 0 0 3 2.7c.2.1.3.1.5-.1l.7-.8c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.2.4.4a2 2 0 0 1-1.5 1.9c-.9.3-3.5-.5-5.3-2.3-1.8-1.8-2.4-3.4-2.3-4.3.1-.8.4-1.4.3-1.6Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    default:
      return null;
  }
}
