import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import type { ProductCardData } from "@/modules/catalog/types";
import { formatMoney } from "@/modules/pricing/format-money";

export function FeaturedProducts({ products }: { products: ProductCardData[] }) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>

        {/* Section header */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[var(--brand-orange-deep)]">
              Escolha seu começo
            </p>
            <h2 className="font-display mt-4 max-w-2xl text-[clamp(2.6rem,5vw,3.75rem)] font-black leading-[.95] tracking-[-.06em]">
              Canecas que pedem uma ideia.
            </h2>
          </div>
          <Link
            href="/produtos"
            className="hidden shrink-0 text-sm font-black text-[var(--brand-muted)] underline underline-offset-4 transition-colors hover:text-[var(--brand-black)] sm:block"
          >
            Ver catálogo →
          </Link>
        </div>

        {/* Product grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <article key={product.id} className="group flex flex-col">

              {/* Image card */}
              <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--brand-surface)]">
                <Link
                  href={`/produtos/${product.slug}`}
                  className="block"
                  tabIndex={-1}
                  aria-hidden
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.imageAlt}
                    width={640}
                    height={640}
                    className="aspect-square w-full object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-smooth)] group-hover:scale-[1.04]"
                  />
                </Link>

                {/* Hover CTA overlay */}
                <div
                  className={[
                    "absolute inset-x-4 bottom-4 flex justify-center",
                    "translate-y-3 opacity-0 transition-all duration-[var(--dur-base)] ease-[var(--ease-spring)]",
                    "group-hover:translate-y-0 group-hover:opacity-100",
                  ].join(" ")}
                >
                  <Link
                    href={`/personalizar?produto=${product.slug}`}
                    className={[
                      "inline-flex items-center gap-2 rounded-full px-5 py-2.5",
                      "bg-[var(--brand-black)] text-xs font-black text-white",
                      "shadow-[var(--shadow-lg)]",
                      "transition-shadow duration-[var(--dur-fast)] hover:shadow-[var(--shadow-xl)]",
                    ].join(" ")}
                  >
                    Personalizar →
                  </Link>
                </div>
              </div>

              {/* Product info */}
              <div className="mt-5 flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-display text-[1.5rem] font-black tracking-[-.04em]">
                      <Link
                        href={`/produtos/${product.slug}`}
                        className="transition-colors hover:text-[var(--brand-orange-deep)]"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--brand-muted)]">
                      {product.description}
                    </p>
                  </div>
                  <p className="shrink-0 font-display text-lg font-black tracking-[-.03em]">
                    {formatMoney(product.priceCents)}
                  </p>
                </div>

                {/* CTA link (always visible) */}
                <Link
                  href={`/personalizar?produto=${product.slug}`}
                  aria-label={`Personalizar ${product.name}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-black text-[var(--brand-orange-deep)] transition-colors hover:text-[var(--brand-black)]"
                >
                  Personalizar
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-[var(--dur-base)] ease-[var(--ease-spring)] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>

            </article>
          ))}
        </div>

      </Container>
    </section>
  );
}
