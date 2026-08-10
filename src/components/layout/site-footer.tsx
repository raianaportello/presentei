import Link from "next/link";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[var(--brand-black)] py-14 text-white">
      <Container className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div><p className="font-display text-3xl font-black text-[var(--brand-orange)]">PRESENTEI!</p><p className="mt-3 max-w-sm text-sm leading-6 text-white/70">Ideias, memórias e marcas transformadas em presentes feitos para ficar.</p></div>
        <div><p className="text-sm font-extrabold">Explore</p><ul className="mt-4 space-y-3 text-sm text-white/70">{siteConfig.navigation.map((item) => <li key={item.href}><Link href={item.href} className="hover:text-white">{item.label}</Link></li>)}</ul></div>
        <div><p className="text-sm font-extrabold">Fale com a Presentei</p><ul className="mt-4 space-y-3 text-sm text-white/70"><li><a href={siteConfig.instagram}>Instagram</a></li><li><Link href="/privacidade">Privacidade</Link></li><li><Link href="/termos">Termos</Link></li></ul></div>
      </Container>
      <Container className="mt-12 border-t border-white/10 pt-6 text-xs text-white/50">© 2026 Presentei. Curitiba, PR.</Container>
    </footer>
  );
}
