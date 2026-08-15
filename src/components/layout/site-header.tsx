import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--brand-border-soft)] bg-white/90 backdrop-blur-md backdrop-saturate-150">
      <Container className="flex h-[4.5rem] items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href="/"
          aria-label="Presentei — início"
          className="shrink-0 rounded-full transition-opacity duration-[var(--dur-fast)] hover:opacity-85"
        >
          <Image
            src="/brand/presentei-logo.jpeg"
            alt=""
            width={52}
            height={52}
            className="h-12 w-12 rounded-full object-cover shadow-[var(--shadow-sm)]"
            priority
          />
        </Link>

        {/* Nav */}
        <nav aria-label="Navegação principal" className="hidden items-center gap-1 md:flex">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group relative px-4 py-2 text-[0.84rem] font-bold text-[var(--brand-muted)]",
                "rounded-full transition-colors duration-[var(--dur-fast)]",
                "hover:bg-[var(--brand-surface)] hover:text-[var(--brand-black)]",
              ].join(" ")}
            >
              {item.label}
              <span
                aria-hidden
                className="absolute bottom-1.5 left-4 right-4 h-px scale-x-0 rounded-full bg-[var(--brand-orange)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-spring)] group-hover:scale-x-100"
              />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <Link
            href="/carrinho"
            className={[
              "hidden items-center gap-2 rounded-full px-4 py-2 text-[0.84rem] font-bold",
              "text-[var(--brand-muted)] transition-colors duration-[var(--dur-fast)]",
              "hover:bg-[var(--brand-surface)] hover:text-[var(--brand-black)] sm:inline-flex",
            ].join(" ")}
          >
            {/* Cart icon */}
            <svg
              aria-hidden
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Carrinho
          </Link>

          <ButtonLink href="/personalizar" size="sm" className="px-5">
            Criar com IA
          </ButtonLink>
        </div>

      </Container>
    </header>
  );
}
