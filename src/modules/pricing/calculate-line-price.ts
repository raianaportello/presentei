import { BUSINESS_DISCOUNT_BPS, BUSINESS_MIN_QUANTITY, MUG_UNIT_PRICE_CENTS } from "./constants";

export type LinePrice = {
  unitPriceCents: number;
  discountCents: number;
  subtotalCents: number;
};

export function calculateLinePrice(input: { quantity: number; isBusiness: boolean }): LinePrice {
  if (!Number.isInteger(input.quantity) || input.quantity < 1) throw new Error("Quantidade inválida");
  const grossCents = MUG_UNIT_PRICE_CENTS * input.quantity;
  const eligible = input.isBusiness && input.quantity >= BUSINESS_MIN_QUANTITY;
  const discountCents = eligible ? Math.round((grossCents * BUSINESS_DISCOUNT_BPS) / 10_000) : 0;
  const subtotalCents = grossCents - discountCents;
  return { unitPriceCents: eligible ? 3_192 : MUG_UNIT_PRICE_CENTS, discountCents, subtotalCents };
}
