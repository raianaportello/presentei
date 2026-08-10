import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
  primary: "bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange-deep)]",
  secondary: "border border-[var(--brand-black)] bg-white text-[var(--brand-black)] hover:bg-[var(--brand-surface)]",
  dark: "bg-[var(--brand-black)] text-white hover:bg-black",
} as const;

export function ButtonLink({ variant = "primary", className = "", ...props }: ComponentProps<typeof Link> & { variant?: keyof typeof variants }) {
  return (
    <Link
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-extrabold transition-colors focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--brand-black)] ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
