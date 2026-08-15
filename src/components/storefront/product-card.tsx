import Image from "next/image";
import Link from "next/link";
import type { ProductCardData } from "@/modules/catalog/types";
import { formatMoney } from "@/modules/pricing/format-money";

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <article className="group flex flex-col">

      {/* Image wrapper */}
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--brand-surface)]">
        <Link
          href={`/produtos/${product.slug}`}
          tabIndex={-1}
          aria-hidden
          className="block"
        >
          <Image
            src={product.imageUrl}
            alt={product.imageAlt}
            width={640}
            height={640}
            className="aspect-square w-full object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-smooth)] group-hover:scale-[1.05]"
          />
        </Link>

        {/* Hover overlay CTA */}
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

      {/* Info */}
      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h2 className="font-display text-[1.5rem] font-black tracking-[-.04em]">
              <Link
                href={`/produtos/${product.slug}`}
                className="transition-colors hover:text-[var(--brand-orange-deep)]"
              >
                {product.name}
              </Link>
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-[var(--brand-muted)]">
              {product.description}
            </p>
          </div>
          <p className="shrink-0 font-display text-lg font-black tracking-[-.03em]">
            {formatMoney(product.priceCents)}
          </p>
        </div>

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
  );
}
