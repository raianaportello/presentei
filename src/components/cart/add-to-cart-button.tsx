"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-provider";
export function AddToCartButton({ productId }: { productId: string }) {
  const { dispatch } = useCart(); const [added, setAdded] = useState(false);
  if (added) return <Link href="/carrinho" className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--brand-black)] px-6 py-3 text-sm font-extrabold text-white">Adicionada! Ver carrinho</Link>;
  return <button type="button" onClick={() => { dispatch({ type: "add", line: { productId, quantity: 1 } }); setAdded(true); }} className="mt-3 min-h-12 w-full rounded-full bg-[var(--brand-black)] px-6 py-3 text-sm font-extrabold text-white hover:bg-black focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--brand-orange)]">Adicionar ao carrinho</button>;
}
