import { describe, expect, it } from "vitest";
import { calculateLinePrice } from "./calculate-line-price";

describe("calculateLinePrice", () => {
  it("cobra R$ 39,90 por uma caneca", () => {
    expect(calculateLinePrice({ quantity: 1, isBusiness: false })).toEqual({ unitPriceCents: 3990, discountCents: 0, subtotalCents: 3990 });
  });

  it("não desconta nove canecas empresariais", () => {
    expect(calculateLinePrice({ quantity: 9, isBusiness: true }).subtotalCents).toBe(35910);
  });

  it("desconta vinte por cento a partir de dez", () => {
    expect(calculateLinePrice({ quantity: 10, isBusiness: true })).toEqual({ unitPriceCents: 3192, discountCents: 7980, subtotalCents: 31920 });
  });

  it("não dá desconto a consumidor individual", () => {
    expect(calculateLinePrice({ quantity: 10, isBusiness: false }).subtotalCents).toBe(39900);
  });

  it("rejeita quantidade inválida", () => {
    expect(() => calculateLinePrice({ quantity: 0, isBusiness: false })).toThrow("Quantidade inválida");
  });
});
