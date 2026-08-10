import { BUSINESS_DISCOUNT_BPS, BUSINESS_MIN_QUANTITY, MUG_UNIT_PRICE_CENTS } from "@/modules/pricing/constants";
import type { CartLine } from "./types";

export function calculateCart(lines: CartLine[], isBusiness: boolean) {
  const quantity = lines.reduce((sum, line) => {
    if (!Number.isInteger(line.quantity) || line.quantity < 1) throw new Error("Quantidade inválida");
    return sum + line.quantity;
  }, 0);
  const grossCents = quantity * MUG_UNIT_PRICE_CENTS;
  const eligible = isBusiness && quantity >= BUSINESS_MIN_QUANTITY;
  const discountCents = eligible ? Math.round((grossCents * BUSINESS_DISCOUNT_BPS) / 10_000) : 0;
  return { quantity, grossCents, discountCents, subtotalCents: grossCents - discountCents, unitPriceCents: eligible ? 3_192 : MUG_UNIT_PRICE_CENTS, eligible };
}
