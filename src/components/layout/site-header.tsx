import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--brand-border)] bg-white/95 backdrop-blur">
      <Container className="flex min-h-20 items-center justify-between gap-4">
        <Link href="/" aria-label="Presentei — início" className="shrink-0 rounded-full focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--brand-orange)]">
          <Image src="/brand/presentei-logo.jpeg" alt="" width={58} height={58} className="h-14 w-14 rounded-full object-cover" priority />
        </Link>
        <nav aria-label="Navegação principal" className="hidden items-center gap-7 md:flex">
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-bold text-[var(--brand-black)] underline-offset-6 hover:text-[var(--brand-orange-deep)] hover:underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--brand-orange)]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/carrinho" className="hidden min-h-11 items-center rounded-full px-4 text-sm font-bold hover:bg-[var(--brand-surface)] focus-visible:outline-3 focus-visible:outline-[var(--brand-orange)] sm:inline-flex">
            Carrinho
          </Link>
          <ButtonLink href="/personalizar" className="px-4 sm:px-6">Criar com IA</ButtonLink>
        </div>
      </Container>
    </header>
  );
}
