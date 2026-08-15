import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

const links = {
  explore: [
    { label: "Presentes", href: "/produtos" },
    { label: "Como funciona", href: "/#como-funciona" },
    { label: "Para empresas", href: "/empresas" },
    { label: "Personalizar", href: "/personalizar" },
  ],
  legal: [
    { label: "Instagram", href: siteConfig.instagram, external: true },
    { label: "WhatsApp", href: siteConfig.whatsapp, external: true },
    { label: "Privacidade", href: "/privacidade" },
    { label: "Termos", href: "/termos" },
  ],
};

export function SiteFooter() {
  return (
    <footer
      className="border-t border-white/8 py-16 text-white"
      style={{ background: "var(--gradient-dark)" }}
    >
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">

          {/* Brand column */}
          <div>
            <Link href="/" aria-label="Presentei — início" className="inline-block">
              <Image
                src="/brand/presentei-logo.jpeg"
                alt="Presentei"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover opacity-90 transition-opacity hover:opacity-100"
              />
            </Link>
            <p className="font-display mt-4 text-[1.6rem] font-black tracking-[-.04em] text-[var(--brand-orange)]">
              PRESENTEI!
            </p>
            <p className="mt-3 max-w-xs text-[0.9rem] leading-6 text-white/50">
              Ideias, memórias e marcas transformadas em presentes feitos para ficar.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex gap-3">
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Presentei"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/8 text-white/60 transition-colors hover:bg-[var(--brand-orange)] hover:text-white"
              >
                {/* Instagram icon */}
                <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp da Presentei"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/8 text-white/60 transition-colors hover:bg-[#25D366] hover:text-white"
              >
                {/* WhatsApp icon */}
                <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore column */}
          <div>
            <p className="text-[0.75rem] font-black uppercase tracking-[0.18em] text-white/40">
              Explore
            </p>
            <ul className="mt-5 space-y-3">
              {links.explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.9rem] text-white/55 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + legal column */}
          <div>
            <p className="text-[0.75rem] font-black uppercase tracking-[0.18em] text-white/40">
              Fale com a Presentei
            </p>
            <ul className="mt-5 space-y-3">
              {links.legal.map((item) => (
                <li key={item.href}>
                  {"external" in item && item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.9rem] text-white/55 transition-colors hover:text-white"
                    >
                      {item.label} ↗
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-[0.9rem] text-white/55 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-8">
          <p className="text-[0.78rem] text-white/35">
            © 2026 Presentei. Curitiba, PR.
          </p>
          <p className="text-[0.78rem] text-white/25">
            Feito com carinho para quem presente.
          </p>
        </div>

      </Container>
    </footer>
  );
}
