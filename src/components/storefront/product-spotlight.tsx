import Link from "next/link";
import { Container } from "@/components/ui/container";
import { MugShowcase } from "@/components/mug3d/mug-showcase";
import type { ProductCardData } from "@/modules/catalog/types";
import { formatMoney } from "@/modules/pricing/format-money";

const SPECS: [string, string][] = [
  ["Capacidade", "325 ml · 11oz"],
  ["Material", "Cerâmica vitrificada"],
  ["Impressão", "Sublimação HD, 360°"],
  ["Cuidados", "Lava-louças e micro-ondas"],
];

export function ProductSpotlight({ products }: { products: ProductCardData[] }) {
  const hero = products.find((p) => p.slug === "caneca-branca") ?? products[0];
  const others = products.filter((p) => p.id !== hero?.id).slice(0, 2);

  if (!hero) return null;

  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>

        {/* ── Section header ── */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[var(--brand-orange-deep)]">
              O nosso clássico
            </p>
            <h2 className="font-display mt-4 max-w-2xl text-[clamp(2.6rem,5vw,3.75rem)] font-black leading-[.95] tracking-[-.06em]">
              Uma caneca. Infinitas histórias.
            </h2>
          </div>
          <Link
            href="/produtos"
            className="shrink-0 text-sm font-black text-[var(--brand-muted)] underline underline-offset-4 transition-colors hover:text-[var(--brand-black)]"
          >
            Ver catálogo completo →
          </Link>
        </div>

        {/* ── Spotlight ── */}
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Stage */}
          <div
            className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--brand-border-soft)]"
            style={{
              background:
                "radial-gradient(120% 100% at 50% 10%, #ffffff 0%, #fdf6f0 48%, #f5e7db 100%)",
            }}
          >
            <MugShowcase className="h-[420px] w-full sm:h-[520px]" />

            <span className="absolute left-5 top-5 rounded-full bg-[var(--brand-black)] px-3.5 py-1.5 text-[0.62rem] font-black uppercase tracking-[.16em] text-white">
              Mais vendida
            </span>
          </div>

          {/* Detail */}
          <div>
            <h3 className="font-display text-[clamp(2rem,3.5vw,2.75rem)] font-black leading-[1.02] tracking-[-.05em]">
              {hero.name}
            </h3>
            <p className="mt-4 max-w-md text-[1.02rem] leading-8 text-[var(--brand-muted)]">
              A base perfeita: branco puro, superfície lisa e brilho de vidrado.
              Qualquer arte fica nítida — do traço delicado ao bloco de cor.
            </p>

            {/* Specs */}
            <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {SPECS.map(([term, value]) => (
                <div key={term} className="border-t border-[var(--brand-border-soft)] pt-3">
                  <dt className="text-[0.62rem] font-black uppercase tracking-[.16em] text-[var(--brand-muted-light)]">
                    {term}
                  </dt>
                  <dd className="mt-1 text-[0.92rem] font-bold text-[var(--brand-black)]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Price + CTA */}
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <p className="font-display text-[2.5rem] font-black leading-none tracking-[-.05em]">
                {formatMoney(hero.priceCents)}
              </p>
              <Link
                href="/personalizar"
                className={[
                  "inline-flex items-center gap-2.5 rounded-[var(--radius-md)] px-7 py-4",
                  "bg-[var(--brand-orange)] text-[0.86rem] font-black uppercase tracking-[.12em] text-white",
                  "shadow-[var(--shadow-orange)] transition-all duration-[var(--dur-base)]",
                  "hover:bg-[var(--brand-orange-deep)] hover:shadow-[var(--shadow-orange-lg)] hover:-translate-y-0.5",
                ].join(" ")}
              >
                Criar minha arte
                <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Variants */}
            {others.length > 0 && (
              <div className="mt-10 border-t border-[var(--brand-border-soft)] pt-6">
                <p className="text-[0.62rem] font-black uppercase tracking-[.16em] text-[var(--brand-muted-light)]">
                  Também disponível
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {others.map((p) => (
                    <Link
                      key={p.id}
                      href={`/produtos/${p.slug}`}
                      className={[
                        "group inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5",
                        "border-[var(--brand-border)] transition-all duration-[var(--dur-fast)]",
                        "hover:border-[var(--brand-black)] hover:-translate-y-px",
                      ].join(" ")}
                    >
                      <span
                        aria-hidden
                        className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
                        style={{
                          background:
                            p.slug === "caneca-preta"
                              ? "#1c1a18"
                              : "linear-gradient(120deg,#1c1a18 45%,#ff620f 55%)",
                        }}
                      />
                      <span className="text-[0.82rem] font-bold text-[var(--brand-black)]">
                        {p.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
