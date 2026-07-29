type SiteLogoProps = {
  /** Pixel width/height (square viewBox). */
  size?: number;
  className?: string;
};

/**
 * Minimal “A” mark aligned with site teal accents (--accent-color / Kelly palette).
 * Decorative when nested inside a link with aria-label.
 */
export function SiteLogo({ size = 34, className }: SiteLogoProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      <path
        d="M9 26L16 6l7 20M11.5 18.5h9"
        stroke="currentColor"
        strokeWidth={2.65}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
