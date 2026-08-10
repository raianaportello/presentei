import { describe, expect, it } from "vitest";
import { calculateCart } from "./calculate-cart";

describe("calculateCart", () => {
  it("agrega modelos diferentes para o desconto empresarial", () => {
    expect(calculateCart([{ productId: "mug-white", quantity: 6 }, { productId: "mug-black", quantity: 4 }], true)).toMatchObject({ quantity: 10, discountCents: 7980, subtotalCents: 31920, eligible: true });
  });
  it("não desconta o pedido de pessoa física", () => {
    expect(calculateCart([{ productId: "mug-white", quantity: 10 }], false).subtotalCents).toBe(39900);
  });
});
