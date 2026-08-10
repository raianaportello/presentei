import Image from "next/image";
import Link from "next/link";
import type { ProductCardData } from "@/modules/catalog/types";
import { formatMoney } from "@/modules/pricing/format-money";

export function ProductCard({ product }: { product: ProductCardData }) {
  return <article className="group"><Link href={`/produtos/${product.slug}`} className="block overflow-hidden rounded-[var(--radius-md)] bg-white focus-visible:outline-3 focus-visible:outline-[var(--brand-orange)]"><Image src={product.imageUrl} alt={product.imageAlt} width={640} height={640} className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.03]" /></Link><div className="mt-5 flex items-start justify-between gap-4"><div><h2 className="font-display text-2xl font-black tracking-[-.04em]"><Link href={`/produtos/${product.slug}`}>{product.name}</Link></h2><p className="mt-2 max-w-xs text-sm leading-6 text-[var(--brand-muted)]">{product.description}</p></div><p className="shrink-0 font-black">{formatMoney(product.priceCents)}</p></div><Link href={`/personalizar?produto=${product.slug}`} aria-label={`Personalizar ${product.name}`} className="mt-4 inline-flex text-sm font-black text-[var(--brand-orange-deep)] underline decoration-2 underline-offset-5">Personalizar →</Link></article>;
}
