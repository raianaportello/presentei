"use client";
import Link from "next/link";
import { CartLine } from "@/components/cart/cart-line";
import { CartSummary } from "@/components/cart/cart-summary";
import { Container } from "@/components/ui/container";
import { products } from "@/modules/catalog/local-products";
import { useCart } from "@/components/cart/cart-provider";
export default function CarrinhoPage() {
  const { state, ready } = useCart();
  if (!ready) return <Container className="py-20"><p>Carregando seu carrinho…</p></Container>;
  if (!state.lines.length) return <Container className="py-20 sm:py-28"><div className="mx-auto max-w-xl rounded-[var(--radius-xl)] bg-white p-8 text-center"><p className="text-5xl">☕</p><h1 className="font-display mt-5 text-4xl font-black">Seu carrinho está esperando uma ideia</h1><p className="mt-4 text-[var(--brand-muted)]">Escolha uma caneca para começar. O preço é sempre R$ 39,90 e você calcula apenas o frete.</p><Link href="/produtos" className="mt-7 inline-flex min-h-12 items-center rounded-full bg-[var(--brand-orange)] px-6 font-extrabold text-white">Ver canecas</Link></div></Container>;
  return <Container className="py-12 sm:py-16"><p className="text-xs font-black uppercase tracking-[.2em] text-[var(--brand-orange-deep)]">Seu pedido</p><h1 className="font-display mt-3 text-5xl font-black tracking-[-.05em]">Carrinho</h1><div className="mt-8 grid gap-8 lg:grid-cols-[1fr_23rem]"><div className="grid gap-4">{state.lines.map((line) => { const product = products.find((item) => item.id === line.productId); return product ? <CartLine key={line.productId} line={line} product={product} /> : null; })}</div><CartSummary /></div></Container>;
}
