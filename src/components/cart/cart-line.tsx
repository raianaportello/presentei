"use client";
import Image from "next/image";
import type { ProductDetail } from "@/modules/catalog/types";
import type { CartLine as CartLineData } from "@/modules/cart/types";
import { formatMoney } from "@/modules/pricing/format-money";
import { useCart } from "./cart-provider";
export function CartLine({ line, product }: { line: CartLineData; product: ProductDetail }) {
  const { dispatch } = useCart();
  return <article className="flex gap-4 rounded-[var(--radius-lg)] border border-[var(--brand-border)] bg-white p-4 sm:items-center"><Image src={product.imageUrl} alt={product.imageAlt} width={112} height={112} className="h-24 w-24 rounded-[var(--radius-md)] bg-[var(--brand-surface)] object-contain" /><div className="min-w-0 flex-1"><h2 className="font-display text-xl font-black">{product.name}</h2><p className="mt-1 text-sm text-[var(--brand-muted)]">{formatMoney(product.priceCents)} por unidade</p><div className="mt-3 flex flex-wrap items-center gap-3"><label className="text-sm font-bold">Quantidade <input aria-label={`Quantidade de ${product.name}`} type="number" min="1" value={line.quantity} onChange={(event) => dispatch({ type: "quantity", productId: line.productId, quantity: Number(event.target.value) || 1 })} className="ml-2 h-10 w-20 rounded-full border border-[var(--brand-border)] px-3" /></label><button type="button" onClick={() => dispatch({ type: "remove", productId: line.productId })} className="min-h-10 text-sm font-bold text-[var(--brand-orange-deep)] underline">Remover</button></div></div></article>;
}
