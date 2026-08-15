import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
  primary: [
    "bg-[var(--brand-orange)] text-white",
    "shadow-[var(--shadow-orange)]",
    "hover:bg-[var(--brand-orange-deep)] hover:shadow-[var(--shadow-orange-lg)] hover:-translate-y-px",
    "active:translate-y-0 active:shadow-[var(--shadow-orange)]",
  ].join(" "),
  secondary: [
    "border-2 border-[var(--brand-black)] bg-transparent text-[var(--brand-black)]",
    "hover:bg-[var(--brand-black)] hover:text-white",
  ].join(" "),
  ghost: [
    "text-[var(--brand-orange-deep)] underline decoration-2 underline-offset-6",
    "hover:text-[var(--brand-black)]",
  ].join(" "),
  dark: [
    "bg-[var(--brand-black)] text-white",
    "shadow-[var(--shadow-md)]",
    "hover:bg-[var(--brand-black-rich)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-px",
    "active:translate-y-0",
  ].join(" "),
  white: [
    "bg-white text-[var(--brand-black)]",
    "shadow-[var(--shadow-sm)]",
    "hover:bg-[var(--brand-surface)] hover:-translate-y-px hover:shadow-[var(--shadow-md)]",
    "active:translate-y-0",
  ].join(" "),
} as const;

const sizes = {
  sm: "min-h-9 px-4 py-2 text-xs",
  md: "min-h-12 px-6 py-3 text-sm",
  lg: "min-h-14 px-8 py-4 text-[0.95rem]",
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-extrabold " +
  "transition-all duration-[var(--dur-base)] ease-[var(--ease-spring)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--brand-orange)] " +
  "select-none";

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <Link
      className={`${BASE} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
