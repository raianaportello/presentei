"use client";

import { useState } from "react";
import { calculateLinePrice } from "@/modules/pricing/calculate-line-price";
import { formatMoney } from "@/modules/pricing/format-money";

export function BusinessCalculator() {
  const [quantity, setQuantity] = useState(10);
  const safeQuantity = Math.max(1, Number.isFinite(quantity) ? Math.trunc(quantity) : 1);
  const price = calculateLinePrice({ quantity: safeQuantity, isBusiness: true });
  const eligible = safeQuantity >= 10;
  return <div className="rounded-[2rem] bg-white p-7 text-[var(--brand-black)] shadow-[0_28px_70px_rgba(83,24,0,.18)] sm:p-9"><p className="text-xs font-black uppercase tracking-[.16em] text-[var(--brand-orange-deep)]">Simule seu pedido</p><label htmlFor="business-quantity" className="mt-6 block text-sm font-extrabold">Quantidade de canecas</label><div className="mt-3 flex items-center gap-3"><button type="button" aria-label="Diminuir quantidade" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-12 w-12 place-items-center rounded-full border border-[var(--brand-border)] text-xl font-black">−</button><input id="business-quantity" type="number" min="1" value={safeQuantity} onChange={(event) => setQuantity(Number(event.target.value))} className="h-14 min-w-0 flex-1 rounded-2xl border border-[var(--brand-border)] px-4 text-center text-2xl font-black outline-none focus:border-[var(--brand-orange)]" /><button type="button" aria-label="Aumentar quantidade" onClick={() => setQuantity((value) => value + 1)} className="grid h-12 w-12 place-items-center rounded-full border border-[var(--brand-border)] text-xl font-black">+</button></div><div className="mt-7 border-t border-[var(--brand-border)] pt-6"><div className="flex justify-between gap-4 text-sm"><span>Valor por caneca</span><strong>{formatMoney(price.unitPriceCents)}</strong></div><div className="mt-3 flex items-end justify-between gap-4"><span className="font-extrabold">Total das canecas</span><strong className="font-display text-4xl font-black tracking-[-.05em]">{formatMoney(price.subtotalCents)}</strong></div><p className={`mt-5 rounded-xl p-4 text-sm font-bold ${eligible ? "bg-[var(--brand-orange-soft)] text-[var(--brand-orange-deep)]" : "bg-[var(--brand-surface)] text-[var(--brand-muted)]"}`}>{eligible ? `Você economiza ${formatMoney(price.discountCents)} com o desconto empresarial.` : `Adicione ${10 - safeQuantity} para liberar 20% de desconto.`}</p><p className="mt-4 text-xs text-[var(--brand-muted)]">Frete calculado separadamente pelo CEP.</p></div></div>;
}
